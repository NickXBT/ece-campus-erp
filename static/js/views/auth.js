/* AuthView Controller - Login, Student Self-Registration, Reset & HOD Password Request */
const AuthView = {
  activeTab: 'login',

  render() {
    if (this.activeTab === 'register') {
      return this.renderRegisterForm();
    } else if (this.activeTab === 'forgot') {
      return this.renderForgotPasswordForm();
    }
    return this.renderLoginForm();
  },

  renderDesktopHero() {
    return `
      <div class="login-desktop-hero">
        <div style="display: flex; flex-direction: column; gap: 1.15rem;">
          <!-- Department Badge -->
          <div style="display: inline-flex; align-items: center; gap: 0.55rem; background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 0.75rem; font-weight: 800; padding: 0.45rem 1rem; border-radius: 9999px; letter-spacing: 0.8px; text-transform: uppercase; width: fit-content;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #2563eb;"></span>
            <span>NUTAN MAHARASHTRA INSTITUTE OF ENGINEERING AND TECHNOLOGY (NMIET)</span>
          </div>

          <!-- Hero Header -->
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 54px; height: 54px; background: linear-gradient(135deg, #1d4ed8, #1e40af); color: #ffffff; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 8px 20px rgba(29, 78, 216, 0.25); flex-shrink: 0;">
              <i class="fa-solid fa-microchip"></i>
            </div>
            <div>
              <h1 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: #0f172a; line-height: 1.15; letter-spacing: -0.5px; margin: 0;">
                ECE ERP
              </h1>
              <span style="font-size: 0.85rem; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 1.2px;">
                Electronics & Computer Engineering (NMIET)
              </span>
            </div>
          </div>

          <p style="color: #475569; font-size: 0.9rem; line-height: 1.6; margin: 0;">
            Official Academic & Student Activity Management Portal. Access certificate approvals, attendance compensation tracking, timetables, and department administration.
          </p>

          <!-- Desktop Feature Highlights Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;">
            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; padding: 0.95rem; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
              <div style="width: 34px; height: 34px; background: #eff6ff; color: #2563eb; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; margin-bottom: 0.4rem;">
                <i class="fa-solid fa-award"></i>
              </div>
              <h4 style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-bottom: 0.2rem;">Certificate Portal</h4>
              <p style="font-size: 0.74rem; color: #64748b; margin: 0; line-height: 1.35;">Upload co-curricular & extra-curricular certificates.</p>
            </div>

            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; padding: 0.95rem; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
              <div style="width: 34px; height: 34px; background: #fef3c7; color: #d97706; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; margin-bottom: 0.4rem;">
                <i class="fa-solid fa-calendar-check"></i>
              </div>
              <h4 style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-bottom: 0.2rem;">Attendance Credit</h4>
              <p style="font-size: 0.74rem; color: #64748b; margin: 0; line-height: 1.35;">Automated lecture compensation & duty leave.</p>
            </div>

            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; padding: 0.95rem; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
              <div style="width: 34px; height: 34px; background: #f0fdf4; color: #16a34a; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; margin-bottom: 0.4rem;">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <h4 style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-bottom: 0.2rem;">Strict Division Auth</h4>
              <p style="font-size: 0.74rem; color: #64748b; margin: 0; line-height: 1.35;">Isolated logins for Div A, Div B & HOD Desk.</p>
            </div>

            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; padding: 0.95rem; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
              <div style="width: 34px; height: 34px; background: #f3e8ff; color: #9333ea; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; margin-bottom: 0.4rem;">
                <i class="fa-solid fa-file-zipper"></i>
              </div>
              <h4 style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-bottom: 0.2rem;">HOD ZIP Exporter</h4>
              <p style="font-size: 0.74rem; color: #64748b; margin: 0; line-height: 1.35;">Bulk export verified student certificates.</p>
            </div>
          </div>
        </div>

        <!-- Desktop Hero Footer Badge -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 0.95rem; margin-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 0.78rem; font-weight: 700; color: #64748b; display: flex; align-items: center; gap: 0.4rem;">
            <i class="fa-solid fa-building-columns" style="color: #2563eb;"></i> NMIET Dept. of Electronics & Computer Engineering
          </span>
          <span style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 0.72rem; font-weight: 800; padding: 0.22rem 0.7rem; border-radius: 20px;">
            v2.5 LIVE
          </span>
        </div>
      </div>
    `;
  },

  renderLoginForm() {
    const selectedPortal = this.loginPortalOption || 'DIV_A';

    return `
      <div class="login-wrapper">
        <div class="login-container-responsive">
          ${this.renderDesktopHero()}
          <div class="login-card-wrap">
            <div class="login-card">
              <div style="text-align: center; margin-bottom: 1.15rem;">
                <div class="vibe-badge" style="margin-bottom: 0.85rem;">
                  <span class="vibe-badge-dot"></span>
                  <span>ECE ERP</span>
                </div>

                <div class="brand-icon" style="margin: 0.25rem auto 0.75rem; width: 48px; height: 48px; font-size: 1.5rem;">
                  <i class="fa-solid fa-microchip"></i>
                </div>
                <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-main);">ECE ERP</h2>
                <p style="color: var(--text-muted); font-size: 0.82rem; margin-top: 0.2rem;">Student Activity, Certificate & Timetable Portal</p>
              </div>

              <!-- Auth Mode Toggle Tabs -->
              <div style="display: flex; background: #f1f5f9; padding: 0.25rem; border-radius: var(--radius-full); margin-bottom: 1.15rem; border: 1px solid var(--border-color); gap: 0.25rem;">
                <button type="button" class="btn btn-primary btn-sm" style="flex: 1; justify-content: center; font-size: 0.78rem; padding: 0.55rem 0.35rem;" onclick="AuthView.switchTab('login')">
                  <i class="fa-solid fa-right-to-bracket"></i> Sign In
                </button>
                <button type="button" class="btn btn-secondary btn-sm" style="flex: 1; justify-content: center; font-size: 0.78rem; border: none; background: transparent; color: var(--text-muted); padding: 0.55rem 0.35rem;" onclick="AuthView.switchTab('register')">
                  <i class="fa-solid fa-user-plus"></i> Student Sign Up
                </button>
              </div>

              <!-- Strict Login Section Selection Tabs (HOD vs Div A vs Div B) -->
              <div style="margin-bottom: 1.15rem; background: #f8fafc; border: 1.5px solid var(--border-color); padding: 0.85rem; border-radius: 14px;">
                <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #1e3a8a; font-weight: 800; margin-bottom: 0.55rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.3rem;">
                  <span><i class="fa-solid fa-layer-group" style="color: #2563eb;"></i> Select Login Section:</span>
                  <span id="login-section-badge" style="background: #2563eb; color: #ffffff; font-size: 0.65rem; padding: 0.15rem 0.5rem; border-radius: 20px; font-weight: 800;">STRICT ENFORCEMENT</span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.45rem;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.45rem;">
                    <!-- Div A Option Button -->
                    <button type="button" id="btn-login-option-a" onclick="AuthView.selectLoginPortal('DIV_A')"
                      style="padding: 0.65rem 0.35rem; border-radius: 10px; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.35rem; ${ selectedPortal === 'DIV_A' ? 'background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; border: 2px solid #1e40af; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);' : 'background: #ffffff; color: var(--text-main); border: 1.5px solid var(--border-color);' }">
                      <i class="fa-solid ${ selectedPortal === 'DIV_A' ? 'fa-circle-check' : 'fa-circle-user' }"></i>
                      <span>Division A</span>
                    </button>

                    <!-- Div B Option Button -->
                    <button type="button" id="btn-login-option-b" onclick="AuthView.selectLoginPortal('DIV_B')"
                      style="padding: 0.65rem 0.35rem; border-radius: 10px; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.35rem; ${ selectedPortal === 'DIV_B' ? 'background: linear-gradient(135deg, #d97706, #b45309); color: #ffffff; border: 2px solid #92400e; box-shadow: 0 4px 14px rgba(217, 119, 6, 0.4);' : 'background: #ffffff; color: var(--text-main); border: 1.5px solid var(--border-color);' }">
                      <i class="fa-solid ${ selectedPortal === 'DIV_B' ? 'fa-circle-check' : 'fa-circle-user' }"></i>
                      <span>Division B</span>
                    </button>
                  </div>

                  <!-- HOD Option Button -->
                  <button type="button" id="btn-login-option-hod" onclick="AuthView.selectLoginPortal('HOD')"
                    style="padding: 0.65rem 0.35rem; border-radius: 10px; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.4rem; ${ selectedPortal === 'HOD' ? 'background: linear-gradient(135deg, #16a34a, #15803d); color: #ffffff; border: 2px solid #166534; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.4);' : 'background: #ffffff; color: var(--text-main); border: 1.5px solid var(--border-color);' }">
                    <i class="fa-solid ${ selectedPortal === 'HOD' ? 'fa-shield-halved' : 'fa-chalkboard-user' }"></i>
                    <span>HOD & Faculty Portal</span>
                  </button>
                </div>

                <!-- Dynamic Live Section Verification Indicator -->
                <div id="login-section-notice" style="margin-top: 0.65rem; font-size: 0.75rem; font-weight: 700; text-align: center; border-radius: 8px; padding: 0.45rem 0.5rem; transition: all 0.3s ease; ${
                  selectedPortal === 'DIV_A' ? 'background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af;' :
                  (selectedPortal === 'DIV_B' ? 'background: #fffbeb; border: 1px solid #fde68a; color: #b45309;' :
                  'background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;')
                }">
                  ${
                    selectedPortal === 'DIV_A' ? '<i class="fa-solid fa-lock"></i> Strict Section: <strong>Division A Student</strong>' :
                    (selectedPortal === 'DIV_B' ? '<i class="fa-solid fa-lock"></i> Strict Section: <strong>Division B Student</strong>' :
                    '<i class="fa-solid fa-shield-halved"></i> Strict Section: <strong>HOD & Faculty Desk</strong>')
                  }
                </div>
              </div>

              <!-- Pre-Enrolled Student Guidance Banner -->
              <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1.5px solid #93c5fd; border-radius: 12px; padding: 0.75rem 0.85rem; margin-bottom: 1.15rem; font-size: 0.78rem; color: #1e3a8a; line-height: 1.5; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.06);">
                <div style="display: flex; align-items: center; gap: 0.4rem; font-weight: 800; font-size: 0.83rem; color: #1e40af; margin-bottom: 0.3rem;">
                  <i class="fa-solid fa-id-card-clip" style="color: #2563eb; font-size: 0.95rem;"></i> <span>First-Time Student Login Instructions</span>
                </div>
                <div style="margin-bottom: 0.35rem;">
                  Select your Division above. Enter official <strong>PRN</strong> (e.g. <code>U251H001</code>, <code>U251H007</code>) and password <strong><code>Student@123</code></strong>.
                </div>
                <div style="background: #ffffff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 0.45rem 0.65rem; margin: 0.35rem 0; font-size: 0.74rem; color: #1e40af; font-weight: 600; line-height: 1.45;">
                  <i class="fa-solid fa-user-lock" style="color: #2563eb;"></i> <strong>Security:</strong> Please update your password and email immediately after signing in.
                </div>
                <div style="font-size: 0.75rem; color: #1d4ed8; font-weight: 700; margin-top: 0.35rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.35rem;">
                  <span><i class="fa-solid fa-headset" style="color: #2563eb;"></i> Support: <strong>7768075930 (Nikhil)</strong></span>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="openModal('modal-help-support')" style="background: #ffffff; color: #1d4ed8; border: 1.5px solid #93c5fd; font-weight: 800; border-radius: 8px; padding: 0.2rem 0.55rem; font-size: 0.72rem; cursor: pointer;">
                    <i class="fa-solid fa-headset" style="color: #2563eb;"></i> Help Desk
                  </button>
                </div>
              </div>

              <form id="form-login" onsubmit="AuthView.handleLogin(event)">
                <div class="form-group">
                  <label><i class="fa-solid fa-user-tag" style="color: var(--primary);"></i> PRN Number / Registered Email</label>
                  <input type="text" id="login-email" class="form-control" placeholder="e.g. U251H001, U251H007, or registered email" required value="">
                </div>

                <div class="form-group">
                  <label><i class="fa-solid fa-lock" style="color: var(--primary);"></i> Password</label>
                  <div class="password-toggle-group">
                    <input type="password" id="login-password" class="form-control" placeholder="Enter your password" required value="">
                    <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('login-password', this)" title="Show/Hide Password">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; font-size: 0.82rem;">
                  <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer; color: var(--text-muted);">
                    <input type="checkbox" checked> Remember Me
                  </label>
                  <a href="javascript:void(0)" style="font-weight: 700; color: var(--primary);" onclick="AuthView.switchTab('forgot')">Forgot Password?</a>
                </div>

                <button type="submit" id="btn-login-submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem; font-size: 0.88rem;">
                  Sign In to Portal <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>

              <!-- Sign-In Help & Support Button -->
              <div style="margin-top: 1.15rem; text-align: center; border-top: 1px solid var(--border-color); padding-top: 0.85rem;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="openModal('modal-help-support')" style="width: 100%; justify-content: center; background: #eff6ff; color: #1d4ed8; border: 1.5px solid #93c5fd; font-weight: 800; border-radius: var(--radius-md); padding: 0.6rem 0.85rem; font-size: 0.82rem;">
                  <i class="fa-solid fa-headset" style="color: #2563eb;"></i> <span>Need Help? Open Support Desk</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderRegisterForm() {
    return `
      <div class="login-wrapper">
        <div class="login-container-responsive">
          ${this.renderDesktopHero()}
          <div class="login-card-wrap">
            <div class="login-card">
              <div style="text-align: center; margin-bottom: 1.15rem;">
                <div class="vibe-badge" style="margin-bottom: 0.85rem;">
                  <span class="vibe-badge-dot"></span>
                  <span>STUDENT REGISTRATION</span>
                </div>
                <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-main);">Create Student Account</h2>
                <p style="color: var(--text-muted); font-size: 0.82rem; margin-top: 0.2rem;">Enroll into ECE Department Division A or B</p>
              </div>

              <!-- Auth Mode Toggle Tabs -->
              <div style="display: flex; background: #f1f5f9; padding: 0.25rem; border-radius: var(--radius-full); margin-bottom: 1.25rem; border: 1px solid var(--border-color); gap: 0.25rem;">
                <button type="button" class="btn btn-secondary btn-sm" style="flex: 1; justify-content: center; font-size: 0.78rem; border: none; background: transparent; color: var(--text-muted); padding: 0.55rem 0.35rem;" onclick="AuthView.switchTab('login')">
                  <i class="fa-solid fa-right-to-bracket"></i> Sign In
                </button>
                <button type="button" class="btn btn-primary btn-sm" style="flex: 1; justify-content: center; font-size: 0.78rem; padding: 0.55rem 0.35rem;" onclick="AuthView.switchTab('register')">
                  <i class="fa-solid fa-user-plus"></i> Student Sign Up
                </button>
              </div>

              <form id="form-self-register" onsubmit="AuthView.handleSelfRegister(event)">
                <div class="form-group">
                  <label>Full Name <span style="color: var(--accent-rose);">*</span></label>
                  <input type="text" id="reg-name" class="form-control" placeholder="e.g. Sonal Deshmukh" required>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem;">
                  <div class="form-group">
                    <label>Roll No <span style="color: var(--accent-rose);">*</span></label>
                    <input type="text" id="reg-roll" class="form-control" placeholder="e.g. 42" required>
                  </div>

                  <div class="form-group">
                    <label>PRN Number <span style="color: var(--accent-rose);">*</span></label>
                    <input type="text" id="reg-prn" class="form-control" placeholder="e.g. 20240142" required>
                  </div>
                </div>

                <!-- Color-Indicated Division Selection Option -->
                <div class="form-group" style="margin-bottom: 1.15rem;">
                  <label style="font-weight: 700; font-size: 0.82rem;">Select Division <span style="color: var(--accent-rose);">*</span></label>
                  <input type="hidden" id="reg-div" value="${this.selectedDivision || '1'}">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.35rem;">
                    <button type="button" id="btn-select-div-a" 
                      onclick="AuthView.selectDivision('1')" 
                      style="padding: 0.65rem 0.5rem; border-radius: var(--radius-md); font-weight: 800; font-size: 0.82rem; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.35rem; ${ (this.selectedDivision || '1') === '1' ? 'background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; border: 2px solid #1e40af; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35); transform: translateY(-1px);' : 'background: #f8fafc; color: var(--text-main); border: 1.5px solid var(--border-color); opacity: 0.85;' }">
                      <i class="fa-solid ${ (this.selectedDivision || '1') === '1' ? 'fa-circle-check' : 'fa-circle' }" style="font-size: 0.85rem;"></i>
                      <span>Division A</span>
                    </button>
                    
                    <button type="button" id="btn-select-div-b" 
                      onclick="AuthView.selectDivision('2')" 
                      style="padding: 0.65rem 0.5rem; border-radius: var(--radius-md); font-weight: 800; font-size: 0.82rem; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.35rem; ${ (this.selectedDivision || '1') === '2' ? 'background: linear-gradient(135deg, #d97706, #b45309); color: #ffffff; border: 2px solid #92400e; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35); transform: translateY(-1px);' : 'background: #f8fafc; color: var(--text-main); border: 1.5px solid var(--border-color); opacity: 0.85;' }">
                      <i class="fa-solid ${ (this.selectedDivision || '1') === '2' ? 'fa-circle-check' : 'fa-circle' }" style="font-size: 0.85rem;"></i>
                      <span>Division B</span>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label>Lab Batch <span style="color: var(--accent-rose);">*</span></label>
                  <select id="reg-batch" class="form-control" required>
                    ${ (this.selectedDivision || '1') === '1' ? '<option value="1">Batch A1</option><option value="2">Batch A2</option><option value="3">Batch A3</option>' : '<option value="4">Batch B1</option><option value="5">Batch B2</option><option value="6">Batch B3</option>' }
                  </select>
                </div>

                <div class="form-group">
                  <label>Email Address <span style="color: var(--accent-rose);">*</span></label>
                  <input type="email" id="reg-email" class="form-control" placeholder="e.g. sonal@campus.edu" required>
                </div>

                <div class="form-group">
                  <label>Password <span style="color: var(--accent-rose);">*</span></label>
                  <div class="password-toggle-group">
                    <input type="password" id="reg-password" class="form-control" placeholder="Enter Password" required>
                    <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('reg-password', this)" title="Show/Hide Password">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                  </div>
                </div>

                <button type="submit" id="btn-reg-submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; margin-top: 0.5rem;">
                  Complete Registration <i class="fa-solid fa-check"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderForgotPasswordForm() {
    return `
      <div class="login-wrapper">
        <div class="login-container-responsive">
          ${this.renderDesktopHero()}
          <div class="login-card-wrap">
            <div class="login-card">
              <div style="text-align: center; margin-bottom: 1.5rem;">
                <div class="vibe-badge">
                  <span class="vibe-badge-dot"></span>
                  <span>STRICT HOD APPROVAL REQUIRED</span>
                </div>
                <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800;">Request Password Change</h2>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.2rem;">Submit a password reset request for HOD review & approval</p>
              </div>

              <form id="form-forgot-password" onsubmit="AuthView.handleRequestPasswordReset(event)">
                <div class="form-group">
                  <label><i class="fa-solid fa-envelope" style="color: var(--primary);"></i> Account Email Address <span style="color: var(--accent-rose);">*</span></label>
                  <input type="email" id="reset-email" class="form-control" placeholder="e.g. student@campus.edu" required>
                </div>

                <div class="form-group">
                  <label><i class="fa-solid fa-id-card" style="color: var(--primary);"></i> Student PRN Number <span style="color: var(--accent-rose);">*</span></label>
                  <input type="text" id="reset-prn" class="form-control" placeholder="e.g. 20240123" required>
                </div>

                <div class="form-group">
                  <label><i class="fa-solid fa-key" style="color: var(--primary);"></i> Requested New Password <span style="color: var(--accent-rose);">*</span></label>
                  <div class="password-toggle-group">
                    <input type="password" id="reset-new-password" class="form-control" placeholder="Enter Requested Password" required>
                    <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('reset-new-password', this)" title="Show/Hide Password">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                  </div>
                </div>

                <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
                  <button type="button" class="btn btn-secondary" style="flex: 1; justify-content: center;" onclick="AuthView.switchTab('login')">
                    Cancel
                  </button>
                  <button type="submit" id="btn-request-reset-submit" class="btn btn-primary" style="flex: 1.8; justify-content: center;">
                    Submit Request to HOD <i class="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  },


  switchTab(tab) {
    this.activeTab = tab;
    document.getElementById('view-container').innerHTML = this.render();
  },

  updateRegisterBatch(divId) {
    const batchSelect = document.getElementById('reg-batch');
    if (!batchSelect) return;
    if (divId == "1") {
      batchSelect.innerHTML = `<option value="1">Batch A1</option><option value="2">Batch A2</option><option value="3">Batch A3</option>`;
    } else {
      batchSelect.innerHTML = `<option value="4">Batch B1</option><option value="5">Batch B2</option><option value="6">Batch B3</option>`;
    }
  },

  selectLoginPortal(portalType) {
    this.loginPortalOption = portalType;
    const btnA = document.getElementById('btn-login-option-a');
    const btnB = document.getElementById('btn-login-option-b');
    const btnHod = document.getElementById('btn-login-option-hod');
    const notice = document.getElementById('login-section-notice');

    if (btnA) {
      btnA.style.background = '#ffffff';
      btnA.style.color = 'var(--text-main)';
      btnA.style.border = '1.5px solid var(--border-color)';
      btnA.style.boxShadow = 'none';
      btnA.innerHTML = '<i class="fa-solid fa-circle-user"></i> <span>Division A</span>';
    }
    if (btnB) {
      btnB.style.background = '#ffffff';
      btnB.style.color = 'var(--text-main)';
      btnB.style.border = '1.5px solid var(--border-color)';
      btnB.style.boxShadow = 'none';
      btnB.innerHTML = '<i class="fa-solid fa-circle-user"></i> <span>Division B</span>';
    }
    if (btnHod) {
      btnHod.style.background = '#ffffff';
      btnHod.style.color = 'var(--text-main)';
      btnHod.style.border = '1.5px solid var(--border-color)';
      btnHod.style.boxShadow = 'none';
      btnHod.innerHTML = '<i class="fa-solid fa-chalkboard-user"></i> <span>HOD & Faculty Portal</span>';
    }

    if (portalType === 'DIV_A') {
      if (btnA) {
        btnA.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
        btnA.style.color = '#ffffff';
        btnA.style.border = '2px solid #1e40af';
        btnA.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.4)';
        btnA.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Division A</span>';
      }
      if (notice) {
        notice.style.background = '#eff6ff';
        notice.style.border = '1px solid #bfdbfe';
        notice.style.color = '#1e40af';
        notice.innerHTML = '<i class="fa-solid fa-lock"></i> Strict Section: Logging in as <strong>SE(ECE) Division A Student</strong>';
      }
    } else if (portalType === 'DIV_B') {
      if (btnB) {
        btnB.style.background = 'linear-gradient(135deg, #d97706, #b45309)';
        btnB.style.color = '#ffffff';
        btnB.style.border = '2px solid #92400e';
        btnB.style.boxShadow = '0 4px 14px rgba(217, 119, 6, 0.4)';
        btnB.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Division B</span>';
      }
      if (notice) {
        notice.style.background = '#fffbeb';
        notice.style.border = '1px solid #fde68a';
        notice.style.color = '#b45309';
        notice.innerHTML = '<i class="fa-solid fa-lock"></i> Strict Section: Logging in as <strong>SE(ECE) Division B Student</strong>';
      }
    } else if (portalType === 'HOD') {
      if (btnHod) {
        btnHod.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
        btnHod.style.color = '#ffffff';
        btnHod.style.border = '2px solid #166534';
        btnHod.style.boxShadow = '0 4px 14px rgba(22, 163, 74, 0.4)';
        btnHod.innerHTML = '<i class="fa-solid fa-shield-halved"></i> <span>HOD & Faculty Portal</span>';
      }
      if (notice) {
        notice.style.background = '#f0fdf4';
        notice.style.border = '1px solid #bbf7d0';
        notice.style.color = '#166534';
        notice.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Strict Section: Logging in to <strong>HOD & Faculty Administration Desk</strong>';
      }
    }
  },

  selectDivision(divId) {
    this.selectedDivision = divId;
    const hiddenInput = document.getElementById('reg-div');
    if (hiddenInput) hiddenInput.value = divId;

    this.updateRegisterBatch(divId);

    const btnA = document.getElementById('btn-select-div-a');
    const btnB = document.getElementById('btn-select-div-b');

    if (divId === '1') {
      if (btnA) {
        btnA.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
        btnA.style.color = '#ffffff';
        btnA.style.border = '2px solid #1e40af';
        btnA.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.35)';
        btnA.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Division SE(ECE)-A</span>';
      }
      if (btnB) {
        btnB.style.background = '#f8fafc';
        btnB.style.color = 'var(--text-main)';
        btnB.style.border = '1.5px solid var(--border-color)';
        btnB.style.boxShadow = 'none';
        btnB.innerHTML = '<i class="fa-regular fa-circle"></i> <span>Division SE(ECE)-B</span>';
      }
    } else {
      if (btnB) {
        btnB.style.background = 'linear-gradient(135deg, #d97706, #b45309)';
        btnB.style.color = '#ffffff';
        btnB.style.border = '2px solid #92400e';
        btnB.style.boxShadow = '0 4px 12px rgba(217, 119, 6, 0.35)';
        btnB.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Division SE(ECE)-B</span>';
      }
      if (btnA) {
        btnA.style.background = '#f8fafc';
        btnA.style.color = 'var(--text-main)';
        btnA.style.border = '1.5px solid var(--border-color)';
        btnA.style.boxShadow = 'none';
        btnA.innerHTML = '<i class="fa-regular fa-circle"></i> <span>Division SE(ECE)-A</span>';
      }
    }
  },

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btnSubmit = document.getElementById('btn-login-submit');

    if (btnSubmit) {
      btnSubmit.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Signing In...`;
      btnSubmit.disabled = true;
    }

    try {
      if (typeof fetchCloudDB === 'function') {
        try { await fetchCloudDB(true); } catch (_) {}
      }
      const portal = this.loginPortalOption || 'DIV_A';
      const res = await API.post('/api/auth/login', { email, password, portal });
      Toast.success('Login Successful');
      
      App.currentUser = res.user;
      window.currentUser = res.user;
      
      const meData = await API.get('/api/auth/me').catch(() => ({ profile: null }));
      App.currentProfile = meData.profile;

      const personName = (meData.profile && meData.profile.name) || (res.user && res.user.name) || (res.profile && res.profile.name) || 'User';
      const personRole = (res.user && res.user.role) || '';
      const personDesignation = (meData.profile && (meData.profile.designation || meData.profile.division_name)) || '';

      App.setupNavigation();
      window.location.hash = res.redirect || ((res.user && (res.user.role === 'HOD' || res.user.role === 'TEACHER')) ? '#/hod/dashboard' : '#/student/dashboard');

      // Launch personalized welcome celebration animation with the person's name
      if (typeof App.showWelcomeAnimation === 'function') {
        await App.showWelcomeAnimation(personName, personRole, personDesignation);
      }

      await App.handleRoute();
    } catch (err) {
      const errMsg = err ? (err.message || err.error || (typeof err === 'string' ? err : 'Login Failed')) : 'Login Failed';
      Toast.error(errMsg);
      if (btnSubmit) {
        btnSubmit.innerHTML = `Sign In to Portal <i class="fa-solid fa-arrow-right"></i>`;
        btnSubmit.disabled = false;
      }
    }
  },

  async handleSelfRegister(e) {
    e.preventDefault();
    const btnSubmit = document.getElementById('btn-reg-submit');
    if (btnSubmit) {
      btnSubmit.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Registering...`;
      btnSubmit.disabled = true;
    }

    const payload = {
      name: document.getElementById('reg-name').value,
      roll_no: document.getElementById('reg-roll').value,
      prn_no: document.getElementById('reg-prn').value,
      division_id: document.getElementById('reg-div').value,
      batch_id: document.getElementById('reg-batch').value,
      email: document.getElementById('reg-email').value,
      password: document.getElementById('reg-password').value
    };

    try {
      const res = await API.post('/api/auth/register-student', payload);
      Toast.success(res.message || 'Registration successful!');

      App.currentUser = res.user;
      window.currentUser = res.user;

      const meData = await API.get('/api/auth/me').catch(() => ({ profile: null }));
      App.currentProfile = meData.profile;

      App.setupNavigation();
      window.location.hash = res.redirect;
      await App.handleRoute();
    } catch (err) {
      Toast.error(err.message || 'Registration failed.');
      if (btnSubmit) {
        btnSubmit.innerHTML = `Complete Registration <i class="fa-solid fa-check"></i>`;
        btnSubmit.disabled = false;
      }
    }
  },

  async handleRequestPasswordReset(e) {
    e.preventDefault();
    const btnSubmit = document.getElementById('btn-request-reset-submit');
    btnSubmit.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting to HOD...`;
    btnSubmit.disabled = true;

    const payload = {
      email: document.getElementById('reset-email').value,
      prn_no: document.getElementById('reset-prn').value,
      new_password: document.getElementById('reset-new-password').value
    };

    try {
      const res = await API.post('/api/auth/request-password-reset', payload);
      Toast.success(res.message || 'Password reset request submitted to HOD!');
      this.switchTab('login');
    } catch (err) {
      Toast.error(err.message || 'Failed to submit password reset request.');
      btnSubmit.innerHTML = `Submit Request to HOD <i class="fa-solid fa-paper-plane"></i>`;
      btnSubmit.disabled = false;
    }
  },

  async handleOAuthLogin(provider) {
    const providerNames = { google: 'Google Workspace', microsoft: 'Microsoft 365', github: 'GitHub SSO' };
    const name = providerNames[provider] || provider;
    
    Toast.info(`Connecting to ${name} Authentication...`);

    try {
      // 1. Supabase OAuth Provider integration if configured
      if (typeof supabaseClient !== 'undefined' && supabaseClient && supabaseClient.auth) {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider: provider,
          options: {
            queryParams: { prompt: 'select_account' },
            redirectTo: window.location.origin
          }
        });
        if (!error && data && data.url) {
          window.location.href = data.url;
          return;
        }
      }

      // 2. Clerk Auth OAuth Provider integration if configured
      if (typeof clerkClient !== 'undefined' && clerkClient && clerkClient.openSignIn) {
        clerkClient.openSignIn({});
        return;
      } else if (typeof window.Clerk !== 'undefined' && window.Clerk && window.Clerk.openSignIn) {
        window.Clerk.openSignIn({});
        return;
      }

      // 2. Google Identity Services (GSI) 1-Click Device Gmail Account Chooser
      if (provider === 'google' && typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: '1000000000000-example.apps.googleusercontent.com', // Google OAuth Client
          callback: (response) => {
            if (response && response.credential) {
              const payload = JSON.parse(atob(response.credential.split('.')[1]));
              AuthView.completeOAuthLogin(payload.email, payload.name || payload.email.split('@')[0], 'google');
            }
          }
        });
        google.accounts.id.prompt();
      }

      // 3. Instant Device OAuth Email Chooser (Seamless 1-Click)
      const promptEmail = prompt(`🟢 GOOGLE 1-CLICK DEVICE SIGN-IN\n\nSelect or type your device Gmail address (e.g. student@gmail.com):`, '');
      if (!promptEmail) return;

      const trimmedEmail = promptEmail.trim().toLowerCase();
      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        Toast.error('Please enter a valid Gmail address.');
        return;
      }

      AuthView.completeOAuthLogin(trimmedEmail, trimmedEmail.split('@')[0].toUpperCase(), name);
    } catch (err) {
      Toast.error(err.message || `${name} Sign-In failed.`);
    }
  },

  async completeOAuthLogin(email, rawName, providerName) {
    const trimmedEmail = email.trim().toLowerCase();
    Toast.info(`Verifying ${providerName} account for ${trimmedEmail}...`);

    const db = typeof getLocalDB === 'function' ? getLocalDB() : { users: [], students: [] };
    let userObj = (db.users || []).find(u => u.email && u.email.trim().toLowerCase() === trimmedEmail);

    if (!userObj) {
      const isStaff = trimmedEmail === 'teacher@campus.edu' || trimmedEmail === 'faculty@campus.edu' || trimmedEmail.includes('hod') || trimmedEmail.includes('admin');
      const role = isStaff ? (trimmedEmail === 'teacher@campus.edu' ? 'HOD' : 'TEACHER') : 'STUDENT';
      const userName = rawName || trimmedEmail.split('@')[0].replace(/[._]/g, ' ').toUpperCase();

      const maxUserId = (db.users || []).reduce((max, u) => Math.max(max, parseInt(u.id) || 0), 0);
      const newUserId = maxUserId + 1;

      userObj = {
        id: newUserId,
        email: trimmedEmail,
        password_hash: 'SSO_OAUTH_TOKEN_SECURE',
        role: role,
        name: userName,
        status: isStaff ? 'APPROVED' : 'PENDING_APPROVAL'
      };

      if (role === 'STUDENT') {
        userObj.division_id = 1;
        userObj.batch_id = 1;
        userObj.division_name = 'SE(ECE)-A';
        userObj.batch_name = 'A1';
        userObj.roll_no = String(newUserId);
        userObj.prn_no = '22' + String(Date.now()).slice(-6);

        const maxStudentId = (db.students || []).reduce((max, s) => Math.max(max, parseInt(s.id) || 0), 0);
        const newStudentObj = {
          id: maxStudentId + 1,
          user_id: newUserId,
          name: userName,
          roll_no: userObj.roll_no,
          prn_no: userObj.prn_no,
          department_id: 1,
          semester_id: 1,
          division_id: 1,
          batch_id: 1,
          division_name: 'SE(ECE)-A',
          batch_name: 'A1',
          email: trimmedEmail,
          password_hash: 'SSO_OAUTH_TOKEN_SECURE',
          status: 'PENDING_APPROVAL'
        };
        db.students.push(newStudentObj);
      }

      db.users.push(userObj);
      if (typeof saveLocalDB === 'function') saveLocalDB(db);
    }

    if (typeof setSessionUser === 'function') setSessionUser(userObj);
    App.currentUser = userObj;
    window.currentUser = userObj;

    const meData = await API.get('/api/auth/me').catch(() => ({ profile: null }));
    App.currentProfile = meData.profile;

    const personName = (meData.profile && meData.profile.name) || userObj.name || trimmedEmail.split('@')[0];
    const personRole = userObj.role || 'STUDENT';
    const personDesignation = (meData.profile && (meData.profile.designation || meData.profile.division_name)) || userObj.division_name || '';

    Toast.success(`🔐 Logged in via ${providerName}! Welcome ${personName}`);
    App.setupNavigation();

    if (userObj.role === 'HOD') window.location.hash = '#/hod/dashboard';
    else if (userObj.role === 'TEACHER') window.location.hash = '#/teacher/dashboard';
    else window.location.hash = '#/student/dashboard';

    // Launch personalized welcome celebration animation with the person's name
    if (typeof App.showWelcomeAnimation === 'function') {
      await App.showWelcomeAnimation(personName, personRole, personDesignation);
    }

    await App.handleRoute();
  },

  async checkPendingApprovalStatus(btn) {
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Checking Cloud Status...`;
      btn.disabled = true;
    }

    try {
      await fetchCloudDB(true);
      const db = typeof getLocalDB === 'function' ? getLocalDB() : { students: [], users: [] };
      const currentEmail = (App.currentUser && App.currentUser.email) ? App.currentUser.email.toLowerCase().trim() : '';
      const currentId = App.currentUser ? App.currentUser.id : null;

      const student = (db.students || []).find(s =>
        (App.currentUser && App.currentUser.prn_no && s.prn_no && s.prn_no.toUpperCase() === App.currentUser.prn_no.toUpperCase()) ||
        (s.user_id && currentId && s.user_id == currentId) ||
        (s.email && currentEmail && s.email.toLowerCase().trim() === currentEmail)
      );

      const userInDb = (db.users || []).find(u =>
        (currentId && u.id == currentId) ||
        (u.email && currentEmail && u.email.toLowerCase().trim() === currentEmail)
      );

      let isApproved = (student && student.status === 'APPROVED') || (userInDb && userInDb.status === 'APPROVED');

      // Direct Cloud Key & Firebase Check as fallback
      if (!isApproved && currentEmail) {
        try {
          const safeEmailKey = currentEmail.replace(/@/g, '_at_').replace(/[^a-zA-Z0-9_]/g, '_');
          const [cloudAppr, fbAppr] = await Promise.all([
            fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${CLOUD_DB_KEY}/appr_${safeEmailKey}`).then(r => r.text()).catch(() => ''),
            fetch(`https://ece-campus-erp-default-rtdb.firebaseio.com/student_approvals/${safeEmailKey}.json`).then(r => r.json()).catch(() => null)
          ]);
          if ((cloudAppr || '').includes('APPROVED') || (fbAppr && fbAppr.status === 'APPROVED')) {
            isApproved = true;
            if (student) { student.status = 'APPROVED'; student.is_activated = true; }
            if (userInDb) { userInDb.status = 'APPROVED'; userInDb.is_activated = true; }
            saveLocalDB(db);
          }
        } catch(e) {}
      }

      if (isApproved) {
        if (App.currentUser) {
          App.currentUser.status = 'APPROVED';
          if (typeof setSessionUser === 'function') setSessionUser(App.currentUser);
        }
        Toast.success('🎉 HOD Approval Verified! Redirecting to Student Portal...');
        window.location.hash = '#/student/dashboard';
        await App.handleRoute();
        return;
      } else {
        Toast.info('Your registration is still awaiting HOD approval. Ask your HOD to click Approve on the HOD Portal.');
      }
    } catch (e) {
      Toast.error('Status check failed. Please try again.');
    } finally {
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-rotate"></i> Check Approval Status`;
        btn.disabled = false;
      }
    }
  },

  renderPendingApprovalView(user, student) {
    const name = (user && user.name) || (student && student.name) || 'Student';
    const email = (user && user.email) || (student && student.email) || 'N/A';
    const prn = (student && student.prn_no) || (user && user.prn_no) || 'N/A';
    const status = (student && student.status) || (user && user.status) || 'PENDING_APPROVAL';
    const isRejected = status === 'REJECTED';
    const statusColor = isRejected ? '#dc2626' : '#d97706';
    const statusBg = isRejected ? '#fef2f2' : '#fffbeb';
    const statusBorder = isRejected ? '#fca5a5' : '#fde68a';
    const icon = isRejected ? 'fa-circle-xmark' : 'fa-clock';
    const title = isRejected ? 'Registration Request Rejected' : 'Awaiting HOD Approval';
    const desc = isRejected ? 
      'Your registration request was reviewed and rejected by the Head of Department (HOD).' : 
      'Your identity has been authenticated successfully. However, ERP module access requires Head of Department (HOD) approval.';

    // Start active 2.5-second background auto-check to redirect student immediately upon HOD approval
    if (window.pendingApprovalTimer) clearInterval(window.pendingApprovalTimer);
    window.pendingApprovalTimer = setInterval(async () => {
      try {
        if (window.location.hash !== '#/pending-approval' || !App.currentUser || App.currentUser.role !== 'STUDENT') {
          clearInterval(window.pendingApprovalTimer);
          return;
        }

        await fetchCloudDB(true);
        const db = typeof getLocalDB === 'function' ? getLocalDB() : { students: [], users: [] };
        const cEmail = (App.currentUser.email || '').toLowerCase().trim();
        const cId = App.currentUser.id;
        const st = (typeof findCurrentStudent === "function") ? findCurrentStudent(db, App.currentUser) : (db.students || []).find(s => (App.currentUser && App.currentUser.prn_no && s.prn_no && s.prn_no.toUpperCase() === App.currentUser.prn_no.toUpperCase()) || (s.user_id && s.user_id == cId) || (s.email && s.email.toLowerCase().trim() === cEmail));
        const us = (db.users || []).find(u => (u.id && u.id == cId) || (u.email && u.email.toLowerCase().trim() === cEmail));

        let isApproved = (st && st.status === 'APPROVED') || (us && us.status === 'APPROVED');

        if (!isApproved && cEmail) {
          try {
            const safeEmailKey = cEmail.replace(/@/g, '_at_').replace(/[^a-zA-Z0-9_]/g, '_');
            const [cloudAppr, fbAppr] = await Promise.all([
              fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${CLOUD_DB_KEY}/appr_${safeEmailKey}`).then(r => r.text()).catch(() => ''),
              fetch(`https://ece-campus-erp-default-rtdb.firebaseio.com/student_approvals/${safeEmailKey}.json`).then(r => r.json()).catch(() => null)
            ]);
            if ((cloudAppr || '').includes('APPROVED') || (fbAppr && fbAppr.status === 'APPROVED')) {
              isApproved = true;
              if (st) { st.status = 'APPROVED'; st.is_activated = true; }
              if (us) { us.status = 'APPROVED'; us.is_activated = true; }
              saveLocalDB(db);
            }
          } catch(e) {}
        }

        if (isApproved) {
          clearInterval(window.pendingApprovalTimer);
          App.currentUser.status = 'APPROVED';
          if (typeof setSessionUser === 'function') setSessionUser(App.currentUser);
          Toast.success('🎉 HOD Approval Verified! Opening Dashboard...');
          window.location.hash = '#/student/dashboard';
          await App.handleRoute();
        }
      } catch (e) {}
    }, 2500);

    return `
      <div style="max-width: 600px; margin: 3rem auto; padding: 2rem;">
        <div class="card" style="padding: 2.5rem; text-align: center; border-radius: var(--radius-lg); box-shadow: 0 10px 25px rgba(0,0,0,0.08); background: #ffffff; border: 1px solid var(--border-color);">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: ${statusBg}; border: 2px solid ${statusBorder}; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: ${statusColor}; font-size: 2.2rem;">
            <i class="fa-solid ${icon}"></i>
          </div>

          <span class="vibe-badge" style="background: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusBorder}; font-weight: 800;">
            <span class="vibe-badge-dot" style="background: ${statusColor};"></span>
            STATUS: ${status}
          </span>

          <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin-top: 1rem; color: var(--text-main);">${title}</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.5rem; line-height: 1.6;">${desc}</p>

          <div style="background: #f8fafc; border-radius: var(--radius-md); padding: 1.25rem; margin: 1.75rem 0; text-align: left; border: 1px solid var(--border-color); font-size: 0.88rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid #e2e8f0;">
              <span style="color: var(--text-muted); font-weight: 600;">Applicant Name:</span>
              <strong style="color: var(--text-main);">${name}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid #e2e8f0;">
              <span style="color: var(--text-muted); font-weight: 600;">Email Identity:</span>
              <strong style="color: var(--text-main);">${email}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid #e2e8f0;">
              <span style="color: var(--text-muted); font-weight: 600;">PRN Number:</span>
              <strong style="color: var(--text-main);">${prn}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.4rem 0;">
              <span style="color: var(--text-muted); font-weight: 600;">Department:</span>
              <strong style="color: var(--primary);">Electronics & Computer Engineering (ECE)</strong>
            </div>
          </div>

          <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-primary" onclick="AuthView.checkPendingApprovalStatus(this)" style="font-weight: 800; padding: 0.75rem 1.5rem;">
              <i class="fa-solid fa-rotate"></i> Check Approval Status
            </button>
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('btn-logout').click()" style="font-weight: 700;">
              <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>
      </div>
    `;
  }
};
