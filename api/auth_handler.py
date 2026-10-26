import json
import urllib.request
import hmac
import hashlib
import secrets
import time
import base64
import os

SECRET_KEY = os.environ.get("SESSION_SECRET", "ece_erp_auth_secret_antigravity_2026_campus_portal")

# In-memory rate limiting: max 5 failed attempts in 5 minutes per identifier/IP
_FAILED_ATTEMPTS = {}
_CACHE = {
    "hod": None,
    "faculty": None,
    "students": None,
    "last_fetch": 0
}

def hash_password(password: str) -> str:
    """Hash password using PBKDF2-HMAC-SHA256 with 260,000 iterations and 16-byte random salt."""
    salt = secrets.token_hex(16)
    iterations = 260000
    derived = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), iterations)
    return "pbkdf2_sha256$" + str(iterations) + "$" + salt + "$" + derived.hex()

def verify_password(password: str, stored_hash: str) -> bool:
    """Verify password against stored hash with legacy plaintext support."""
    if not stored_hash:
        return False
    clean_stored = str(stored_hash).strip()
    clean_pass = str(password).strip()
    if clean_stored.startswith("pbkdf2_sha256$"):
        parts = clean_stored.split("$")
        if len(parts) == 4:
            try:
                iterations = int(parts[1])
                salt = parts[2]
                expected_hex = parts[3]
                derived = hashlib.pbkdf2_hmac('sha256', clean_pass.encode('utf-8'), salt.encode('utf-8'), iterations)
                return hmac.compare_digest(derived.hex(), expected_hex)
            except Exception:
                return False
    return hmac.compare_digest(clean_stored, clean_pass)

def generate_session_token(user_id, role: str) -> str:
    """Create a signed, tamper-proof session token valid for 7 days."""
    payload = {
        "uid": str(user_id),
        "role": role,
        "iat": int(time.time()),
        "exp": int(time.time()) + (7 * 24 * 3600)
    }
    encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    sig = hmac.new(SECRET_KEY.encode(), encoded.encode(), hashlib.sha256).hexdigest()
    return encoded + "." + sig

def verify_session_token(token: str):
    """Verify cryptographic signature and expiration of session token."""
    if not token:
        return None
    try:
        parts = token.strip().split(".")
        if len(parts) != 2:
            return None
        encoded, sig = parts
        expected_sig = hmac.new(SECRET_KEY.encode(), encoded.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        padded = encoded + "=" * (-len(encoded) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded.encode()).decode())
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None

def check_rate_limit(key: str) -> bool:
    now = time.time()
    history = _FAILED_ATTEMPTS.get(key, [])
    history = [t for t in history if now - t < 300]
    _FAILED_ATTEMPTS[key] = history
    return len(history) < 5

def record_failed_attempt(key: str):
    now = time.time()
    if key not in _FAILED_ATTEMPTS:
        _FAILED_ATTEMPTS[key] = []
    _FAILED_ATTEMPTS[key].append(now)

def clear_failed_attempts(key: str):
    if key in _FAILED_ATTEMPTS:
        del _FAILED_ATTEMPTS[key]

def get_live_credentials():
    """Fetch credentials server-side with 60-second in-memory caching to minimize Firebase RTDB operations."""
    now = time.time()
    if _CACHE["last_fetch"] and (now - _CACHE["last_fetch"] < 60) and _CACHE["hod"] is not None:
        return _CACHE["hod"], _CACHE["faculty"], _CACHE["students"]
    
    hod_data = None
    fac_data = None
    act_data = None

    try:
        with urllib.request.urlopen("https://ece-campus-erp-default-rtdb.firebaseio.com/hod_credentials.json", timeout=4) as r:
            hod_data = json.loads(r.read().decode())
    except Exception:
        pass

    try:
        with urllib.request.urlopen("https://ece-campus-erp-default-rtdb.firebaseio.com/faculty_credentials.json", timeout=4) as r:
            fac_data = json.loads(r.read().decode())
    except Exception:
        pass

    try:
        with urllib.request.urlopen("https://ece-campus-erp-default-rtdb.firebaseio.com/activated_students.json", timeout=4) as r:
            act_data = json.loads(r.read().decode())
    except Exception:
        pass

    _CACHE["hod"] = hod_data or {}
    _CACHE["faculty"] = fac_data or {}
    _CACHE["students"] = act_data or {}
    _CACHE["last_fetch"] = now
    return _CACHE["hod"], _CACHE["faculty"], _CACHE["students"]

def sanitize_user(user: dict) -> dict:
    """Ensure passwords and pins are NEVER returned to the client browser."""
    if not isinstance(user, dict):
        return {}
    return {k: v for k, v in user.items() if k not in ("password", "password_hash", "hod_pin")}

def authenticate(email_or_id: str, password: str, portal: str, client_ip: str = "127.0.0.1") -> dict:
    email = (email_or_id or "").strip().lower()
    password = (password or "").strip()
    portal = (portal or "DIV_A").upper()

    rate_key = f"{client_ip}_{email}"
    if not check_rate_limit(rate_key):
        return {
            "success": False,
            "error": "RATE_LIMIT_EXCEEDED",
            "message": "Too many failed attempts. Please wait 5 minutes before trying again."
        }

    if not email or not password:
        return {
            "success": False,
            "error": "MISSING_FIELDS",
            "message": "Please enter both your identifier and password."
        }

    hod_creds, fac_creds, act_students = get_live_credentials()

    # 1. HOD Account Login
    is_hod_id = (
        email in ("hod", "admin", "teacher", "teacher@campus.edu", "hod@campus.edu", "dhanashree.kulkarni@nmiet.edu.in", "hod101")
        or "dhanashree.kulkarni" in email
    )
    if is_hod_id:
        if portal != "HOD":
            record_failed_attempt(rate_key)
            return {
                "success": False,
                "error": "PORTAL_RESTRICTION",
                "message": 'Access Denied: HOD and Faculty accounts can only log in through the "HOD & Faculty Portal" option.'
            }

        hod_pass = (hod_creds.get("password_hash") if isinstance(hod_creds, dict) else None) or "HOD@2026"
        if not verify_password(password, hod_pass):
            record_failed_attempt(rate_key)
            return {
                "success": False,
                "error": "INVALID_PASSWORD",
                "message": "Invalid password. Please check your credentials."
            }

        clear_failed_attempts(rate_key)
        user = {
            "id": 1001,
            "name": hod_creds.get("name", "Dr. Dhanashree Kulkarni") if isinstance(hod_creds, dict) else "Dr. Dhanashree Kulkarni",
            "email": hod_creds.get("email", "dhanashree.kulkarni@nmiet.edu.in") if isinstance(hod_creds, dict) else "dhanashree.kulkarni@nmiet.edu.in",
            "role": "HOD",
            "status": "APPROVED",
            "is_activated": True
        }
        profile = {
            "id": 1001,
            "user_id": 1001,
            "name": user["name"],
            "email": user["email"],
            "designation": "Head of Department (ECE)",
            "department_id": 1,
            "role": "HOD"
        }
        token = generate_session_token(user["id"], user["role"])
        return {
            "success": True,
            "token": token,
            "user": sanitize_user(user),
            "profile": profile,
            "redirect": "#/hod/dashboard"
        }

    # 2. Faculty Account Login
    matched_teacher = None
    fac_list = list(fac_creds.values()) if isinstance(fac_creds, dict) else (fac_creds if isinstance(fac_creds, list) else [])
    for t in fac_list:
        if not isinstance(t, dict):
            continue
        t_email = (t.get("email") or "").strip().lower()
        t_code = (t.get("teacher_id_code") or "").strip().lower()
        t_name = (t.get("name") or "").strip().lower()
        clean_t_name = t_name.replace("dr.", "").replace("mr.", "").replace("ms.", "").replace("mrs.", "").replace("prof.", "").strip()
        clean_email = email.replace("dr.", "").replace("mr.", "").replace("ms.", "").replace("mrs.", "").replace("prof.", "").strip()

        if t_email == email or t_code == email or t_name == email:
            matched_teacher = t
            break
        if clean_t_name and clean_email and (clean_t_name == clean_email or clean_t_name in clean_email or clean_email in clean_t_name):
            matched_teacher = t
            break
        if email in ("faculty", "faculty@campus.edu") and t_code == "t102":
            matched_teacher = t
            break

    if matched_teacher:
        if portal != "HOD":
            record_failed_attempt(rate_key)
            return {
                "success": False,
                "error": "PORTAL_RESTRICTION",
                "message": 'Access Denied: HOD and Faculty accounts can only log in through the "HOD & Faculty Portal" option.'
            }

        teacher_pass = matched_teacher.get("password_hash") or "1234"
        if not verify_password(password, teacher_pass):
            record_failed_attempt(rate_key)
            return {
                "success": False,
                "error": "INVALID_PASSWORD",
                "message": "Invalid password. Please check your credentials."
            }

        clear_failed_attempts(rate_key)
        user = {
            "id": matched_teacher.get("user_id") or matched_teacher.get("id", 1002),
            "name": matched_teacher.get("name", "Faculty Member"),
            "email": matched_teacher.get("email", ""),
            "role": "HOD" if "head" in (matched_teacher.get("designation") or "").lower() else "TEACHER",
            "status": "APPROVED",
            "is_activated": True
        }
        profile = {
            "id": matched_teacher.get("id") or user["id"],
            "user_id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "designation": matched_teacher.get("designation", "Faculty Member"),
            "teacher_id_code": matched_teacher.get("teacher_id_code", ""),
            "role": user["role"]
        }
        token = generate_session_token(user["id"], user["role"])
        return {
            "success": True,
            "token": token,
            "user": sanitize_user(user),
            "profile": profile,
            "redirect": "#/hod/dashboard"
        }

    # 3. Student Account Login
    if portal == "HOD":
        record_failed_attempt(rate_key)
        return {
            "success": False,
            "error": "PORTAL_RESTRICTION",
            "message": "Access Denied: The HOD & Faculty section is strictly reserved for faculty and administration. Students must select Division A or Division B."
        }

    student_list = list(act_students.values()) if isinstance(act_students, dict) else (act_students if isinstance(act_students, list) else [])
    matched_student = None
    for s in student_list:
        if not isinstance(s, dict):
            continue
        s_prn = (s.get("prn_no") or "").strip().lower()
        s_email = (s.get("email") or "").strip().lower()
        s_username = (s.get("username") or "").strip().lower()
        s_roll = str(s.get("roll_no") or "").strip()
        s_name = (s.get("name") or "").strip().lower()

        is_match = False
        if s_prn and s_prn != "n/a" and s_prn == email:
            is_match = True
        elif s_email and len(s_email) > 3 and s_email == email:
            is_match = True
        elif s_username and s_username == email:
            is_match = True
        elif s_name and len(s_name) > 3 and s_name == email:
            is_match = True
        elif email.isdigit() and s_roll and (email == s_roll or email == s_roll.zfill(2) or email == str(int(s_roll))):
            is_match = True

        if is_match:
            div_name = (s.get("division_name") or "SE(ECE)-A").upper()
            is_div_b = "B" in div_name or str(s.get("division_id")) == "2"
            if portal == "DIV_A" and is_div_b:
                record_failed_attempt(rate_key)
                return {
                    "success": False,
                    "error": "DIVISION_RESTRICTION",
                    "message": "Access Denied: You are enrolled in Division B. Please select the Division B login option."
                }
            if portal == "DIV_B" and not is_div_b:
                record_failed_attempt(rate_key)
                return {
                    "success": False,
                    "error": "DIVISION_RESTRICTION",
                    "message": "Access Denied: You are enrolled in Division A. Please select the Division A login option."
                }
            matched_student = s
            break

    if not matched_student:
        record_failed_attempt(rate_key)
        return {
            "success": False,
            "error": "ACCOUNT_NOT_FOUND",
            "message": "Account not found. Please enter your PRN Number or registered Email."
        }

    st_pass = matched_student.get("password_hash") or "Student@123"
    if not verify_password(password, st_pass):
        record_failed_attempt(rate_key)
        return {
            "success": False,
            "error": "INVALID_PASSWORD",
            "message": "Invalid password. Please check your credentials."
        }

    clear_failed_attempts(rate_key)
    user = {
        "id": matched_student.get("user_id") or matched_student.get("id"),
        "name": matched_student.get("name", "Student"),
        "email": matched_student.get("email", ""),
        "prn_no": matched_student.get("prn_no", ""),
        "roll_no": matched_student.get("roll_no", ""),
        "division_name": matched_student.get("division_name", "SE(ECE)-A"),
        "batch_name": matched_student.get("batch_name", "A1"),
        "role": "STUDENT",
        "status": matched_student.get("status", "APPROVED"),
        "is_activated": matched_student.get("is_activated", True)
    }
    profile = {
        "id": matched_student.get("id") or user["id"],
        "user_id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "prn_no": user["prn_no"],
        "roll_no": user["roll_no"],
        "division_name": user["division_name"],
        "batch_name": user["batch_name"],
        "role": "STUDENT"
    }
    token = generate_session_token(user["id"], "STUDENT")
    return {
        "success": True,
        "token": token,
        "user": sanitize_user(user),
        "profile": profile,
        "redirect": "#/student/dashboard"
    }
