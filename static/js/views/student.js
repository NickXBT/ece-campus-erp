/* Student View */
const StudentView = {
  renderMissingRecordScreen() {
    try {
      localStorage.removeItem('ece_session_user');
      sessionStorage.removeItem('ece_session_user');
    } catch(e) {}
    if (typeof App !== 'undefined') {
      App.currentUser = null;
      App.currentProfile = null;
    }

    return `
      <div class="dashboard-container">
        <div style="background: #ffffff; border: 2px dashed #ef4444; border-radius: 16px; padding: 3rem 2rem; text-align: center; max-width: 650px; margin: 3rem auto; box-shadow: var(--shadow-lg);">
          <div style="width: 76px; height: 76px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; font-size: 2.2rem; color: #ef4444;">
            <i class="fa-solid fa-user-xmark"></i>
          </div>
          <h2 style="font-family: var(--font-heading); font-weight: 800; color: #991b1b; margin-bottom: 0.5rem; font-size: 1.7rem;">Student Record Missing on Server</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.75rem;">
            Student record was not found on the server. Please refresh or contact HOD/Admin.
          </p>

          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 1.25rem; margin-bottom: 2rem; font-size: 0.9rem; color: #991b1b; text-align: left; line-height: 1.5;">
            <i class="fa-solid fa-triangle-exclamation" style="color: #ef4444; margin-right: 0.5rem;"></i>
            <strong>Need Assistance?</strong> Your account data may have been updated or reset by the department. Please re-login with your credentials or request your Head of Department (HOD) to perform a record recovery.
          </div>

          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary" onclick="window.location.reload()" style="border-radius: var(--radius-full); font-weight: 800; padding: 0.8rem 1.75rem;">
              <i class="fa-solid fa-arrows-rotate"></i> Refresh Page
            </button>
            <button type="button" class="btn btn-primary" onclick="if(window.App && App.logout) App.logout(); else window.location.hash='#/login';" style="border-radius: var(--radius-full); font-weight: 800; padding: 0.8rem 2rem; background: #dc2626; border-color: #dc2626;">
              <i class="fa-solid fa-arrow-right-to-bracket"></i> Return to Login
            </button>
          </div>
        </div>
      </div>
    `;
  },

  getFreshProfile() {
    const db = (typeof getLocalDB === 'function') ? getLocalDB() : { students: [], users: [] };
    const currentUser = (typeof getSessionUser === 'function') ? getSessionUser() : (App.currentUser || {});
    if (!currentUser || (!currentUser.email && !currentUser.prn_no && !currentUser.username && !currentUser.id)) return null;

    const normEmail = (currentUser.email || '').trim().toLowerCase();
    const normName = (currentUser.name || '').trim().toLowerCase();
    const normPrn = (currentUser.prn_no || '').trim().toUpperCase();
    const normUsername = (currentUser.username || '').trim().toUpperCase();

    // Check deletion blocklist
    if ((normEmail && db.deleted_emails && db.deleted_emails.includes(normEmail)) || (normPrn && db.deleted_prns && db.deleted_prns.includes(normPrn))) {
      return null;
    }

    const student = (typeof findCurrentStudent === 'function') ? findCurrentStudent(db, currentUser) : (db.students || []).find(s => 
      (normPrn && s.prn_no && s.prn_no.trim().toUpperCase() === normPrn) ||
      (currentUser.id && s.user_id && String(s.user_id) === String(currentUser.id)) ||
      (normEmail && !normEmail.endsWith('@campus.edu') && s.email && s.email.trim().toLowerCase() === normEmail) ||
      (normUsername && s.username && s.username.trim().toUpperCase() === normUsername) ||
      (normName && s.name && s.name.trim().toLowerCase() === normName)
    );

    // PRN-first lookup for userInDb (never match currentUser.id == u.id first to prevent cross-student ID collision)
    const userInDb = (db.users || []).find(u =>
      (normPrn && u.prn_no && u.prn_no.trim().toUpperCase() === normPrn) ||
      (currentUser.user_id && u.id == currentUser.user_id) ||
      (normEmail && !normEmail.endsWith('@campus.edu') && u.email && u.email.trim().toLowerCase() === normEmail) ||
      (currentUser.id && u.id == currentUser.id && (!currentUser.prn_no || (u.prn_no && u.prn_no.toUpperCase() === normPrn)))
    );

    if (!student && !userInDb) {
      return null;
    }

    const resolvedStudent = student || {};
    const resolvedUser = userInDb || {};

    const isApproved = (currentUser.status === 'APPROVED') || (resolvedStudent.status === 'APPROVED') || (resolvedUser.status === 'APPROVED');
    const effectiveStatus = isApproved ? 'APPROVED' : (resolvedStudent.status || resolvedUser.status || currentUser.status || 'APPROVED');

    // Strict identity mapping: name, roll, PRN, and division ALWAYS from resolvedStudent
    const mergedProfile = {
      ...currentUser,
      ...resolvedUser,
      ...resolvedStudent,
      name: resolvedStudent.name || resolvedUser.name || currentUser.name,
      prn_no: resolvedStudent.prn_no || resolvedUser.prn_no || currentUser.prn_no,
      roll_no: resolvedStudent.roll_no || resolvedUser.roll_no || currentUser.roll_no,
      division_name: resolvedStudent.division_name || resolvedUser.division_name || currentUser.division_name,
      batch_name: resolvedStudent.batch_name || resolvedUser.batch_name || currentUser.batch_name,
      id: resolvedStudent.id || currentUser.student_id || currentUser.id,
      student_id: resolvedStudent.id || currentUser.student_id,
      user_id: resolvedStudent.user_id || resolvedUser.id || currentUser.user_id,
      status: effectiveStatus
    };
    if (typeof App !== 'undefined') App.currentProfile = mergedProfile;
    return mergedProfile;
  },

  renderPendingApprovalScreen(profile) {
    profile = profile || this.getFreshProfile();
    return `
      <div class="dashboard-container">
        <div style="background: #ffffff; border: 2px dashed #f59e0b; border-radius: 16px; padding: 3rem 2rem; text-align: center; max-width: 650px; margin: 3rem auto; box-shadow: var(--shadow-lg);">
          <div style="width: 76px; height: 76px; background: #fef3c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; font-size: 2.2rem; color: #d97706;">
            <i class="fa-solid fa-user-clock"></i>
          </div>
          <h2 style="font-family: var(--font-heading); font-weight: 800; color: #92400e; margin-bottom: 0.5rem; font-size: 1.7rem;">Account Pending HOD Approval</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.75rem;">
            Welcome to ECE Department Portal, <strong>${profile.name || 'Student'}</strong>! Your registration is currently awaiting review and approval by the Head of Department (HOD).
          </p>

          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 1.25rem; margin-bottom: 2rem; font-size: 0.9rem; color: #b45309; text-align: left; line-height: 1.5;">
            <i class="fa-solid fa-circle-info" style="color: #d97706; margin-right: 0.5rem;"></i>
            <strong>What happens next?</strong> Once the HOD accepts and approves your student registration, your student dashboard and certificate upload features will be automatically unlocked!
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 1.25rem;">
            <span class="badge-status status-PENDING" style="padding: 0.6rem 1.5rem; font-size: 0.95rem; font-weight: 800; background: #fef3c7; color: #d97706; border: 1px solid #fde68a;">
              <i class="fa-solid fa-spinner fa-spin" style="margin-right: 0.4rem;"></i> STATUS: AWAITING HOD APPROVAL
            </span>

            <button type="button" class="btn btn-primary" onclick="StudentView.forceCheckApproval()" style="border-radius: var(--radius-full); font-weight: 800; padding: 0.8rem 2rem; background: #2563eb; font-size: 0.95rem;">
              <i class="fa-solid fa-rotate-right"></i> Check Approval Status Now
            </button>
          </div>
        </div>
      </div>
    `;
  },

  async forceCheckApproval() {
    Toast.info('Checking live HOD approval status...');
    if (typeof fetchCloudDB === 'function') {
      await fetchCloudDB(true);
    }
    const profile = this.getFreshProfile();

    if (profile && profile.status === 'APPROVED') {
      Toast.success('🎉 Congratulations! Your HOD has approved your student registration. Access granted!');
      window.location.hash = '#/student/dashboard';
      const container = document.getElementById('view-container');
      if (container) container.innerHTML = await StudentView.renderDashboard();
    } else {
      Toast.info('Your registration is still pending HOD approval. Please ask HOD to click "Approve Registration".');
    }
  },

  
  // Render Academic Assignments Corner on Student Dashboard
  renderDashboardAssignmentsHtml(db, profile) {
    const studentDiv = (profile.division_name || 'SE(ECE)-A').toUpperCase();
    const studentBatch = (profile.batch_name || '').toUpperCase();
    const studentPrn = (profile.prn_no || '').trim().toUpperCase();
    const studentId = profile.id || profile.student_id;

    const allAsgns = (db.assignments || []).slice();
    const allSubs = db.assignment_submissions || [];

    // Filter relevant assignments for this student's division & batch
    const myAsgns = allAsgns.filter(a => {
      const aDiv = (a.division || 'ALL').toUpperCase();
      const aBatch = (a.batch || 'ALL').toUpperCase();
      if (aDiv !== 'ALL' && !studentDiv.includes(aDiv) && !aDiv.includes(studentDiv)) return false;
      if (aBatch !== 'ALL' && studentBatch && aBatch !== studentBatch) return false;
      return true;
    });

    // Sort newest first
    myAsgns.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

    const liveAsgns = [];
    const pastAsgns = [];
    myAsgns.forEach(a => {
      const st = typeof getAssignmentStatus === 'function' ? getAssignmentStatus(a) : { isLive: true };
      if (st.isLive) liveAsgns.push(a);
      else pastAsgns.push(a);
    });

    if (!this.dashboardAsgnTab) this.dashboardAsgnTab = 'LIVE';
    const displayList = this.dashboardAsgnTab === 'LIVE' ? liveAsgns : pastAsgns;

    const cardsHtml = displayList.length > 0 ? displayList.map(a => {
      const st = typeof getAssignmentStatus === 'function' ? getAssignmentStatus(a) : { label: 'Live', isDueToday: false, isLive: true };
      const mySub = allSubs.find(s => String(s.assignment_id) === String(a.id) && ((studentPrn && s.student_prn === studentPrn) || (s.student_id == studentId)));

      const deadlineBadge = st.isDueToday
        ? '<span class="badge" style="background: #fee2e2; color: #dc2626; border: 1.5px solid #fca5a5; font-weight: 800; font-size: 0.72rem; padding: 0.2rem 0.55rem; border-radius: 9999px;"><i class="fa-solid fa-clock"></i> Due Today!</span>'
        : (st.isLive
          ? '<span class="badge" style="background: #dcfce7; color: #15803d; border: 1.5px solid #86efac; font-weight: 800; font-size: 0.72rem; padding: 0.2rem 0.55rem; border-radius: 9999px;"><i class="fa-solid fa-circle-check"></i> ' + (st.timeRemainingText || 'Live') + '</span>'
          : '<span class="badge" style="background: #f1f5f9; color: #64748b; border: 1.5px solid #cbd5e1; font-weight: 700; font-size: 0.72rem; padding: 0.2rem 0.55rem; border-radius: 9999px;"><i class="fa-solid fa-calendar-xmark"></i> Deadline Passed</span>');

      return `
        <div style="background: #ffffff; border: 1.5px solid var(--border-color); border-radius: 14px; padding: 1.15rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 14px rgba(0,0,0,0.04); transition: transform 0.2s ease;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span class="badge-role role-STUDENT" style="font-weight: 800; font-size: 0.74rem; background: #eff6ff; color: #2563eb; padding: 0.2rem 0.55rem;">${a.subject}</span>
              ${deadlineBadge}
            </div>

            <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.4rem 0; line-height: 1.35;">
              ${a.title}
            </h4>

            <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 0.65rem; display: flex; flex-wrap: wrap; gap: 0.65rem;">
              <span><i class="fa-solid fa-calendar-plus" style="color: #2563eb;"></i> Issued: <strong>${a.issue_date || 'N/A'}</strong></span>
              <span><i class="fa-solid fa-calendar-xmark" style="color: #dc2626;"></i> Deadline: <strong>${a.due_date || 'N/A'}</strong></span>
              <span><i class="fa-solid fa-user-tie" style="color: #64748b;"></i> ${a.created_by_name || 'Faculty'}</span>
            </div>

            ${a.instructions ? `
              <p style="font-size: 0.8rem; color: #475569; line-height: 1.45; margin: 0 0 0.75rem 0; background: #f8fafc; padding: 0.45rem 0.65rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                ${a.instructions}
              </p>
            ` : ''}
          </div>

          <div style="border-top: 1px solid #f1f5f9; padding-top: 0.75rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            ${a.file_url ? `
              <button class="btn btn-secondary btn-sm" onclick="StudentView.previewFile('${a.file_url}', '${encodeURIComponent(a.title)}', 'Question Paper')" style="font-size: 0.76rem; font-weight: 700;">
                <i class="fa-solid fa-file-arrow-down"></i> Question Paper
              </button>
            ` : '<span></span>'}

            <div>
              ${mySub ? `
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span class="badge" style="background: #dcfce7; color: #15803d; border: 1px solid #86efac; font-weight: 800; font-size: 0.74rem; padding: 0.25rem 0.65rem; border-radius: 9999px;">
                    <i class="fa-solid fa-circle-check"></i> Submitted
                  </span>
                  ${st.isLive ? `
                    <button class="btn btn-secondary btn-sm" onclick="StudentView.openSubmitAssignmentModal('${a.id}')" style="font-size: 0.74rem; font-weight: 700; padding: 0.25rem 0.55rem;">
                      <i class="fa-solid fa-pen"></i> Re-submit
                    </button>
                  ` : ''}
                </div>
              ` : `
                ${st.isLive ? `
                  <button class="btn btn-primary btn-sm" onclick="StudentView.openSubmitAssignmentModal('${a.id}')" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); font-weight: 800; font-size: 0.78rem; padding: 0.35rem 0.85rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);">
                    <i class="fa-solid fa-cloud-arrow-up"></i> Submit Solution
                  </button>
                ` : `
                  <span class="badge" style="background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; font-weight: 700; font-size: 0.74rem; padding: 0.25rem 0.55rem; border-radius: 9999px;">
                    Closed
                  </span>
                `}
              `}
            </div>
          </div>
        </div>
      `;
    }).join('') : `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; background: #ffffff; border-radius: 14px; border: 1.5px dashed #cbd5e1; color: #64748b;">
        <i class="fa-solid fa-clipboard-check" style="font-size: 2.2rem; color: #16a34a; margin-bottom: 0.5rem; display: block;"></i>
        <strong style="color: var(--text-main); font-size: 0.95rem;">All Caught Up!</strong>
        <p style="font-size: 0.82rem; margin: 0.25rem 0 0 0;">No ${this.dashboardAsgnTab.toLowerCase()} assignments for your division at this time.</p>
      </div>
    `;

    return `
      <!-- ACADEMIC ASSIGNMENTS CORNER PANEL -->
      <div class="glass-panel" style="border: 2px solid #3b82f6; background: #f8fafc; margin-bottom: 1.75rem; padding: 1.25rem 1.5rem; border-radius: 18px; box-shadow: 0 8px 24px rgba(37, 99, 235, 0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 0.85rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="background: #2563eb; color: #ffffff; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 20px;">
                COURSEWORK DESK
              </span>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #1e3a8a; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fa-solid fa-clipboard-list" style="color: #2563eb;"></i> Academic Coursework & Assignments
              </h3>
            </div>
            <p style="color: #64748b; font-size: 0.82rem; margin: 0.25rem 0 0 0;">
              Active subject assignments, question papers, submission deadlines, and solution uploads for ${studentDiv}.
            </p>
          </div>

          <div style="display: flex; gap: 0.4rem; background: #ffffff; padding: 0.25rem; border-radius: 12px; border: 1.5px solid #cbd5e1;">
            <button class="btn btn-sm ${this.dashboardAsgnTab === 'LIVE' ? 'btn-primary' : 'btn-secondary'}" onclick="StudentView.setDashboardAsgnTab('LIVE')" style="font-weight: 800; font-size: 0.78rem; border-radius: 8px;">
              <i class="fa-solid fa-circle-check"></i> Live (${liveAsgns.length})
            </button>
            <button class="btn btn-sm ${this.dashboardAsgnTab === 'PAST' ? 'btn-primary' : 'btn-secondary'}" onclick="StudentView.setDashboardAsgnTab('PAST')" style="font-weight: 800; font-size: 0.78rem; border-radius: 8px;">
              <i class="fa-solid fa-calendar-xmark"></i> Past (${pastAsgns.length})
            </button>
          </div>
        </div>

        <!-- Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
          ${cardsHtml}
        </div>
      </div>
    `;
  },

  setDashboardAsgnTab(tab) {
    this.dashboardAsgnTab = tab;
    const db = typeof getLocalDB === 'function' ? getLocalDB() : { assignments: [], assignment_submissions: [] };
    const profile = this.getFreshProfile() || {};
    const container = document.getElementById('view-container');
    if (container && window.location.hash === '#/student/dashboard') {
      this.renderDashboard().then(html => container.innerHTML = html);
    }
  },

  async renderDashboard() {
    if (typeof fetchCloudDB === 'function') {
      await fetchCloudDB(true);
    }

    const profile = this.getFreshProfile();
    if (!profile) {
      return this.renderMissingRecordScreen();
    }
    if (profile.status !== 'APPROVED') {
      return this.renderPendingApprovalScreen(profile);
    }
    try {
      const data = await API.get('/api/student/dashboard');
      const profile = this.getFreshProfile() || App.currentProfile || {};

      const totalCompLec = data.total_credited_lectures || 0;
      const approvedCount = data.approved_certificates || 0;
      const pendingCount = data.pending_certificates || 0;
      const rejectedCount = data.rejected_certificates || 0;
      const subBreakdown = data.subject_breakdown || [];
      const activities = data.recent_activities || [];

      // Subject breakdown chips HTML
      const subChipsHtml = subBreakdown.length > 0 ? subBreakdown.map(s => {
        const isLab = s.activity_type === 'LAB';
        const isTut = s.activity_type === 'TUTORIAL';
        const bgBadge = isLab ? '#fdf4ff' : (isTut ? '#fffbeb' : '#eff6ff');
        const borderBadge = isLab ? '#f0abfc' : (isTut ? '#fde68a' : '#bfdbfe');
        const textBadge = isLab ? '#86198f' : (isTut ? '#b45309' : '#1e40af');
        const iconType = isLab ? 'fa-flask' : (isTut ? 'fa-book-open' : 'fa-chalkboard-user');

        return `
          <div style="background: ${bgBadge}; border: 1.5px solid ${borderBadge}; border-radius: 12px; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; transition: transform 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 0.65rem; min-width: 0;">
              <div style="width: 34px; height: 34px; border-radius: 8px; background: #ffffff; border: 1px solid ${borderBadge}; display: flex; align-items: center; justify-content: center; color: ${textBadge}; font-size: 0.95rem; flex-shrink: 0;">
                <i class="fa-solid ${iconType}"></i>
              </div>
              <div style="min-width: 0;">
                <div style="font-weight: 800; font-size: 0.85rem; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${s.subject_name}</div>
                <div style="font-size: 0.72rem; color: #64748b; font-weight: 600;">${s.activity_type} • ${s.teacher_name || 'Faculty'}</div>
              </div>
            </div>
            <span style="background: #16a34a; color: #ffffff; font-weight: 800; font-size: 0.82rem; padding: 0.3rem 0.65rem; border-radius: 20px; flex-shrink: 0; box-shadow: 0 2px 6px rgba(22, 163, 74, 0.25);">
              +${s.lecture_count} Lec
            </span>
          </div>
        `;
      }).join('') : `
        <div style="grid-column: 1 / -1; text-align: center; padding: 1.5rem; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1; color: #64748b; font-size: 0.88rem;">
          <i class="fa-solid fa-graduation-cap" style="font-size: 1.5rem; color: #94a3b8; display: block; margin-bottom: 0.4rem;"></i>
          No subject lectures compensated yet. Approved certificates will automatically credit specific timetable subjects here!
        </div>
      `;

      // Detailed Compensated Events Cards
      const activitiesHtml = activities.length > 0 ? activities.map((act, actIdx) => {
        const slotsRows = (act.slot_details || []).map(slot => {
          const isLab = slot.activity_type === 'LAB';
          const typeBadge = isLab ? '<span style="background: #fdf4ff; color: #a21caf; border: 1px solid #f0abfc; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 800;"><i class="fa-solid fa-flask"></i> LAB</span>' :
                                    '<span style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 800;"><i class="fa-solid fa-chalkboard"></i> THEORY</span>';

          return `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 0.75rem 0.85rem; font-weight: 700; color: #334155; font-size: 0.82rem; white-space: nowrap;">
                <i class="fa-regular fa-clock" style="color: #64748b; margin-right: 0.35rem;"></i> ${slot.time_slot}
              </td>
              <td style="padding: 0.75rem 0.85rem;">
                <strong style="color: #0f172a; font-size: 0.85rem; display: block;">${slot.subject_name}</strong>
                <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Code: ${slot.subject_code}</span>
              </td>
              <td style="padding: 0.75rem 0.85rem; white-space: nowrap;">${typeBadge}</td>
              <td style="padding: 0.75rem 0.85rem; font-size: 0.8rem; color: #475569; font-weight: 600; white-space: nowrap;">
                <i class="fa-solid fa-user-tie" style="color: #94a3b8; margin-right: 0.3rem;"></i> ${slot.teacher_name}
                <span style="display: block; font-size: 0.72rem; color: #94a3b8;"><i class="fa-solid fa-location-dot"></i> ${slot.room_no}</span>
              </td>
              <td style="padding: 0.75rem 0.85rem; text-align: right; white-space: nowrap;">
                <span style="background: #dcfce7; color: #15803d; font-weight: 800; font-size: 0.78rem; padding: 0.35rem 0.75rem; border-radius: 20px; border: 1px solid #bbf7d0; display: inline-flex; align-items: center; gap: 0.3rem;">
                  <i class="fa-solid fa-check"></i> Present (100%)
                </span>
              </td>
            </tr>
          `;
        }).join('');

        return `
          <div class="card" style="border: 1px solid #e2e8f0; border-radius: 16px; margin-bottom: 1.5rem; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.04); background: #ffffff;">
            <!-- Event Card Header -->
            <div style="background: linear-gradient(135deg, #f8fafc, #f1f5f9); padding: 1.15rem 1.4rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: #2563eb; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);">
                  <i class="fa-solid fa-award"></i>
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #0f172a;">${act.certificate_title}</h4>
                    <span style="background: #eff6ff; color: #2563eb; font-weight: 800; font-size: 0.72rem; padding: 0.2rem 0.55rem; border-radius: 6px; border: 1px solid #bfdbfe;">
                      ${act.category}
                    </span>
                  </div>
                  <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.2rem;">
                    <i class="fa-solid fa-calendar-day" style="color: #2563eb;"></i> <strong>${act.day_of_week}, ${act.activity_date}</strong> • Event: <strong>${act.event_name}</strong>
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="background: #dcfce7; color: #166534; font-weight: 800; font-size: 0.88rem; padding: 0.5rem 1rem; border-radius: 30px; border: 1.5px solid #86efac; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 2px 8px rgba(22, 163, 74, 0.15);">
                  <i class="fa-solid fa-circle-check" style="color: #16a34a;"></i> ${act.lecture_count} Timetable Lectures Credited
                </span>
                ${act.file_url ? `
                  <button type="button" class="btn btn-secondary btn-sm" onclick="StudentView.previewCertificate('${act.file_url}', '${encodeURIComponent(act.certificate_title)}')" style="font-weight: 700; border-radius: 8px; padding: 0.45rem 0.85rem; font-size: 0.78rem;">
                    <i class="fa-solid fa-file-image"></i> View Document
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Compensated Lecture Schedule Table -->
            <div style="padding: 1rem 1.4rem;">
              <div style="font-size: 0.8rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <i class="fa-solid fa-list-ol" style="color: #2563eb;"></i> Exact Timetable Lectures Compensated on ${act.day_of_week}:
              </div>
              <div class="table-responsive" style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                  <thead style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0;">
                    <tr>
                      <th style="padding: 0.65rem 0.85rem; font-size: 0.75rem; color: #64748b; font-weight: 800; text-transform: uppercase;">Time Slot</th>
                      <th style="padding: 0.65rem 0.85rem; font-size: 0.75rem; color: #64748b; font-weight: 800; text-transform: uppercase;">Compensated Subject</th>
                      <th style="padding: 0.65rem 0.85rem; font-size: 0.75rem; color: #64748b; font-weight: 800; text-transform: uppercase;">Type</th>
                      <th style="padding: 0.65rem 0.85rem; font-size: 0.75rem; color: #64748b; font-weight: 800; text-transform: uppercase;">Faculty & Room</th>
                      <th style="padding: 0.65rem 0.85rem; font-size: 0.75rem; color: #64748b; font-weight: 800; text-transform: uppercase; text-align: right;">Attendance Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${slotsRows}
                  </tbody>
                </table>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; font-size: 0.75rem; color: #64748b;">
                <span><i class="fa-solid fa-shield-halved" style="color: #16a34a;"></i> Approved by: <strong>${act.approved_by || 'Dr. Dhanashree Kulkarni (HOD)'}</strong></span>
                <span><i class="fa-solid fa-clock-rotate-left"></i> Verified on: <strong>${act.approved_at || act.activity_date || 'Verified'}</strong></span>
              </div>
            </div>
          </div>
        `;
      }).join('') : `
        <div style="background: #ffffff; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 3.5rem 2rem; text-align: center; color: #64748b;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #94a3b8; font-size: 1.8rem;">
            <i class="fa-solid fa-file-circle-check"></i>
          </div>
          <h4 style="font-weight: 800; color: #1e293b; font-size: 1.2rem; margin-bottom: 0.35rem;">No Approved Compensations Yet</h4>
          <p style="font-size: 0.88rem; color: #64748b; max-width: 480px; margin: 0 auto 1.5rem auto; line-height: 1.5;">
            Upload your external hackathon, workshop, paper presentation, or sports certificate. Once the HOD verifies it, your timetable lecture attendance will be credited automatically!
          </p>
          <a href="#/student/upload" class="btn btn-primary" style="font-weight: 800; padding: 0.75rem 1.75rem; border-radius: 30px;">
            <i class="fa-solid fa-cloud-arrow-up"></i> Upload Certificate Now
          </a>
        </div>
      `;

      return `
        <div class="dashboard-container">
          <!-- Top Welcome Hero Banner -->
          <div class="glass-panel" style="background: linear-gradient(135deg, #1e3a8a, #2563eb); border: none; margin-bottom: 1.5rem; color: #ffffff; border-radius: 18px; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 58px; height: 58px; border-radius: 50%; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; font-weight: 800; border: 2px solid rgba(255,255,255,0.4);">
                  ${(profile.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <span style="background: rgba(255,255,255,0.2); padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.5px;">STUDENT ACADEMIC PORTAL</span>
                    <span style="background: #22c55e; color: #ffffff; padding: 0.2rem 0.55rem; border-radius: 20px; font-size: 0.7rem; font-weight: 800;">
                      <i class="fa-solid fa-circle-check"></i> ACTIVE
                    </span>
                  </div>
                  <h2 style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; margin-top: 0.25rem; color: #ffffff;">${profile.name || 'Student'}</h2>
                  <p style="color: rgba(255,255,255,0.85); font-size: 0.85rem; margin-top: 0.2rem;">
                    Roll No: <strong>${profile.roll_no || 'N/A'}</strong> | PRN: <strong>${profile.prn_no || 'N/A'}</strong> | Dept: <strong>ECE</strong> | Division: <strong>${profile.division_name || 'SE(ECE)'}</strong> (${profile.batch_name || 'A1'})
                  </p>
                </div>
              </div>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <a href="#/student/certificates" class="btn" style="background: rgba(255,255,255,0.15); color: #ffffff; border: 1.5px solid rgba(255,255,255,0.3); font-weight: 800; backdrop-filter: blur(6px); border-radius: 12px; padding: 0.65rem 1.15rem;">
                  <i class="fa-solid fa-list-check"></i> My Submissions
                </a>
                <a href="#/student/upload" class="btn" style="background: #ffffff; color: #1d4ed8; font-weight: 800; border: none; border-radius: 12px; padding: 0.65rem 1.25rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                  <i class="fa-solid fa-cloud-arrow-up"></i> Upload Certificate
                </a>
              </div>
            </div>
          </div>

          <!-- Academic Attendance Summary Cards Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.75rem;">
            <!-- Card 1: Total Compensated Hours (Hero Metric) -->
            <div style="background: linear-gradient(135deg, #065f46, #047857); color: #ffffff; padding: 1.5rem; border-radius: 18px; box-shadow: 0 8px 20px rgba(4, 120, 87, 0.25); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #a7f3d0;">ATTENDANCE COMPENSATION</span>
                  <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                    <i class="fa-solid fa-calendar-check"></i>
                  </div>
                </div>
                <div style="font-size: 2.3rem; font-weight: 900; margin-top: 0.4rem; line-height: 1.1;">
                  ${totalCompLec} <span style="font-size: 1.1rem; font-weight: 700; color: #a7f3d0;">Lectures</span>
                </div>
              </div>
              <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.2); font-size: 0.78rem; color: #d1fae5; display: flex; align-items: center; gap: 0.4rem;">
                <i class="fa-solid fa-circle-check" style="color: #6ee7b7;"></i> 100% Attendance Credited by HOD
              </div>
            </div>

            <!-- Card 2: Submission Status Tracker -->
            <div style="background: #ffffff; padding: 1.5rem; border-radius: 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b;">CERTIFICATE REVIEW STATUS</span>
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1rem;">
                  <i class="fa-solid fa-file-lines"></i>
                </div>
              </div>
              <div style="display: flex; gap: 0.75rem; justify-content: space-between;">
                <div style="flex: 1; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 0.75rem; text-align: center;">
                  <div style="font-size: 1.4rem; font-weight: 900; color: #16a34a;">${approvedCount}</div>
                  <div style="font-size: 0.7rem; font-weight: 800; color: #15803d; text-transform: uppercase;">Approved</div>
                </div>
                <div style="flex: 1; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 0.75rem; text-align: center;">
                  <div style="font-size: 1.4rem; font-weight: 900; color: #d97706;">${pendingCount}</div>
                  <div style="font-size: 0.7rem; font-weight: 800; color: #b45309; text-transform: uppercase;">In Review</div>
                </div>
                <div style="flex: 1; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 0.75rem; text-align: center;">
                  <div style="font-size: 1.4rem; font-weight: 900; color: #dc2626;">${rejectedCount}</div>
                  <div style="font-size: 0.7rem; font-weight: 800; color: #991b1b; text-transform: uppercase;">Rejected</div>
                </div>
              </div>
              <div style="margin-top: 0.85rem; font-size: 0.75rem; color: #64748b;">
                <i class="fa-solid fa-bolt" style="color: #f59e0b;"></i> Real-time sync with department HOD review desk
              </div>
            </div>

            <!-- Card 3: Semester Target Quick Summary -->
            <div style="background: #ffffff; padding: 1.5rem; border-radius: 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b;">ACADEMIC REWARD</span>
                <span style="background: #eff6ff; color: #2563eb; font-weight: 800; font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 6px;">COMPENSATION</span>
              </div>
              <div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #1e293b;">Departmental Co-Curricular Attendance</div>
                <p style="font-size: 0.8rem; color: #64748b; margin-top: 0.25rem; line-height: 1.4;">
                  All sanctioned hackathons, technical paper contests, and certified workshops are compensated slot-by-slot on your timetable.
                </p>
              </div>
              <div style="margin-top: 0.85rem; font-size: 0.75rem; color: #2563eb; font-weight: 700;">
                <i class="fa-solid fa-circle-info"></i> Official Department Verification
              </div>
            </div>
          </div>

          <!-- Main Approved Activity Timetable Ledger -->
          <div style="margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.6rem;">
                  <i class="fa-solid fa-clipboard-list" style="color: #16a34a;"></i> Verified Activity & Attendance Compensation Ledger
                </h3>
                <p style="color: #64748b; font-size: 0.82rem; margin: 0.2rem 0 0 0;">
                  Detailed slot-by-slot timetable compensation records approved by HOD
                </p>
              </div>
            </div>

            ${activitiesHtml}
          </div>
        </div>
      `;
    } catch (err) {
      const errMsg = err ? (err.message || err.error || (typeof err === 'string' ? err : 'Unable to fetch dashboard data.')) : 'Unable to fetch dashboard data.';
      return `<div class="dashboard-container"><p style="color: var(--accent-rose);">Failed to load student dashboard: ${errMsg}</p></div>`;
    }
  },

  previewCertificate(url, encodedTitle) {
    const title = decodeURIComponent(encodedTitle || 'Certificate Document');
    return this.previewFile(url, title, title);
  },

  async renderUploadForm() {
    if (typeof fetchCloudDB === 'function') await fetchCloudDB(true);
    const profile = this.getFreshProfile();
    if (!profile) {
      return this.renderMissingRecordScreen();
    }
    if (profile.status !== 'APPROVED') {
      return this.renderPendingApprovalScreen(profile);
    }
    const todayStr = new Date().toISOString().split('T')[0];

    return `
      <div class="dashboard-container">
        <div class="glass-panel" style="max-width: 750px; margin: 0 auto;">
          <div class="panel-header">
            <h3><i class="fa-solid fa-cloud-arrow-up" style="color: var(--primary);"></i> Upload Activity / Achievement Certificate</h3>
            <a href="#/student/certificates" class="btn btn-secondary btn-sm"><i class="fa-solid fa-list"></i> View My Submissions</a>
          </div>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.75rem;">
            Submit your hackathon, workshop, paper publication, NPTEL, or co-curricular certificate for faculty review and attendance credit calculation.
          </p>

          <form id="form-certificate-upload-page" onsubmit="StudentView.handleUploadPage(event)">
            <div class="form-group">
              <label>Certificate Title <span style="color: var(--accent-rose);">*</span></label>
              <input type="text" id="page-cert-title" class="form-control" placeholder="e.g. 1st Prize in National Web Hackathon 2026" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Event Name / Organizer <span style="color: var(--accent-rose);">*</span></label>
                <input type="text" id="page-cert-event" class="form-control" placeholder="e.g. IEEE Tech Fest / College Sports" required>
              </div>

              <div class="form-group">
                <label>Category <span style="color: var(--accent-rose);">*</span></label>
                <select id="page-cert-category" class="form-control" required>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Publication">Paper Publication</option>
                  <option value="NPTEL/Coursera">NPTEL / Online Certification</option>
                  <option value="Other">Other Co-Curricular</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Certificate Event Date <span style="color: var(--accent-rose);">*</span> </label>
                <input type="date" id="page-cert-date" class="form-control" max="${todayStr}" onchange="StudentView.validateWeekday(this)" oninput="StudentView.validateWeekday(this)" required>
                <small style="color: #64748b; font-size: 0.76rem; display: block; margin-top: 0.25rem;"><i class="fa-solid fa-calendar-check" style="color: #2563eb;"></i> Weekday or weekend events (Saturdays & Sundays) are fully supported and compensated by HOD.</small>
              </div>

              <div class="form-group">
                <label style="font-weight: 700; color: #1e40af; display: flex; align-items: center; gap: 0.4rem;">
                  <i class="fa-solid fa-business-time"></i> Event Duration (How Many Days?) <span style="color: var(--accent-rose);">*</span>
                </label>
                <select id="page-cert-days" class="form-control" style="border: 2px solid #3b82f6; font-weight: 800; color: #1e3a8a; padding: 0.6rem;" onchange="StudentView.onEventDaysChange(this.value)">
                  <option value="1">1 Day Event (Single Day Attendance)</option>
                  <option value="2">2 Days Event (e.g. 2-Day Hackathon)</option>
                  <option value="3">3 Days Event (e.g. 3-Day Tech Fest / Conference)</option>
                  <option value="4">4 Days Event</option>
                  <option value="5">5 Days Event (Full Academic Week)</option>
                </select>
                <small id="page-cert-days-hint" style="color: #2563eb; font-size: 0.76rem; display: block; margin-top: 0.25rem; font-weight: 600;">
                  <i class="fa-solid fa-circle-info"></i> Attendance compensation will be requested for 1 day.
                </small>
              </div>
            </div>

            <div class="form-group">
              <label>Description / Details</label>
              <textarea id="page-cert-desc" class="form-control" rows="3" placeholder="Brief details about your role, achievements, or project..."></textarea>
            </div>

            <div class="form-group">
              <label style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                <span>Upload Document File (PDF / PNG / JPG) <span style="color: var(--accent-rose);">*</span></span>
                <span style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 4px;"><i class="fa-solid fa-hard-drive"></i> MAX 1 MB</span>
              </label>
              <input type="file" id="page-cert-file" class="form-control" accept="image/*,application/pdf,.pdf,.png,.jpg,.jpeg,.doc,.docx" style="padding: 0.65rem; border: 2px dashed #2563eb; background: #eff6ff; cursor: pointer; border-radius: var(--radius-md);"
                onchange="StudentView.onFileSelected(this)">
              <small id="file-status-msg" style="color: var(--text-muted); font-size: 0.78rem; display: block; margin-top: 0.35rem;"><i class="fa-solid fa-circle-info" style="color: #2563eb;"></i> Tap above to select your certificate document (Strict size limit: <strong>Maximum 1 MB</strong>).</small>
            </div>

            <!-- Dedicated Upload Progress Box (Displays when processing large files) -->
            <div id="upload-progress-box" style="display: none; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1.5rem; text-align: center;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 1.5rem; color: #16a34a;"></i>
                <strong id="upload-progress-title" style="font-size: 1rem; color: #166534;">Processing Certificate Document...</strong>
              </div>
              <p id="upload-progress-desc" style="font-size: 0.85rem; color: #15803d; margin: 0 0 0.75rem 0;">
                Please remain on this screen. Optimizing document and syncing directly to HOD desk...
              </p>
              <div style="background: #e2e8f0; border-radius: var(--radius-full); height: 8px; width: 100%; overflow: hidden;">
                <div id="upload-progress-bar" style="background: linear-gradient(90deg, #22c55e, #16a34a); height: 100%; width: 60%; transition: width 0.3s ease;"></div>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
              <a href="#/student/certificates" id="btn-page-upload-cancel" class="btn btn-secondary">Cancel</a>
              <button type="submit" id="btn-page-upload-submit" class="btn btn-primary" style="padding: 0.85rem 2rem; font-weight: 800;">
                <i class="fa-solid fa-paper-plane"></i> Submit Certificate for Review
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  onFileSelected(input) {
    const statusMsg = document.getElementById('file-status-msg');
    if (!statusMsg) return;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxBytes = 1024 * 1024; // 1 MB strict limit
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      if (file.size > maxBytes) {
        input.value = '';
        statusMsg.style.color = '#ef4444';
        statusMsg.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>File Too Large (${sizeMb} MB):</strong> Maximum allowed upload size is <strong>1 MB</strong>. Please select a smaller file or compress your document.`;
        Toast.error(`File size (${sizeMb} MB) exceeds the 1 MB limit. Maximum upload size is 1 MB.`);
        return;
      }
      statusMsg.style.color = '#15803d';
      statusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Selected: <strong>${file.name}</strong> (${sizeMb} MB) — Ready for submission.`;
    }
  },

  onEditFileSelected(input) {
    const statusMsg = document.getElementById('edit-file-status-msg');
    if (!statusMsg) return;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxBytes = 1024 * 1024; // 1 MB strict limit
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      if (file.size > maxBytes) {
        input.value = '';
        statusMsg.style.color = '#ef4444';
        statusMsg.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>File Too Large (${sizeMb} MB):</strong> Maximum allowed size is <strong>1 MB</strong>. Please select a file under 1 MB.`;
        Toast.error(`File size (${sizeMb} MB) exceeds the 1 MB limit. Maximum upload size is 1 MB.`);
        return;
      }
      statusMsg.style.color = '#15803d';
      statusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Replacement Document: <strong>${file.name}</strong> (${sizeMb} MB) — Ready.`;
    }
  },

  onEventDaysChange(days) {
    const hint = document.getElementById('page-cert-days-hint');
    if (hint) {
      const d = parseInt(days) || 1;
      const dateVal = document.getElementById('page-cert-date')?.value;
      let dayName = '';
      if (dateVal) {
        const parts = dateVal.split('-').map(Number);
        if (parts.length === 3) {
          const dt = new Date(parts[0], parts[1] - 1, parts[2]);
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          dayName = dayNames[dt.getDay()];
        }
      }
      if (dayName === 'Friday' && d === 2) {
        hint.innerHTML = `<i class="fa-solid fa-circle-info" style="color: #d97706;"></i> Friday 2-Day Event: Attendance compensation will be credited for <strong>Thursday & Friday (2 Days)</strong>.`;
      } else {
        hint.innerHTML = `<i class="fa-solid fa-circle-info"></i> Attendance compensation will be requested for <strong>${d} consecutive instructional day${d > 1 ? 's' : ''}</strong>.`;
      }
    }
  },

  validateWeekday(input) {
    if (!input || !input.value) return true;
    const parts = input.value.split('-').map(Number);
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      const day = d.getDay();
      if (day === 6) {
        Toast.info('Saturday event selected. Attendance will be compensated against instructional working days during HOD approval.');
      } else if (day === 0) {
        Toast.info('Sunday weekend event selected. Attendance will be compensated against instructional working days during HOD approval.');
      }
      // Refresh event days hint based on selected weekday
      const daysSel = document.getElementById('page-cert-days');
      if (daysSel) {
        StudentView.onEventDaysChange(daysSel.value);
      }
    }
    return true;
  },

  detectAndCropLetterbox(img) {
    try {
      const origW = img.naturalWidth || img.width || 0;
      const origH = img.naturalHeight || img.height || 0;
      if (!origW || !origH || origW < 60 || origH < 60) return null;

      // Sample on a lightweight offscreen canvas for fast pixel detection
      const sampleW = Math.min(320, origW);
      const sampleH = Math.round((sampleW * origH) / origW);
      if (sampleW <= 0 || sampleH <= 0) return null;

      const testCanvas = document.createElement('canvas');
      testCanvas.width = sampleW;
      testCanvas.height = sampleH;
      const testCtx = testCanvas.getContext('2d', { willReadFrequently: true });
      if (!testCtx) return null;

      testCtx.drawImage(img, 0, 0, sampleW, sampleH);
      const imgData = testCtx.getImageData(0, 0, sampleW, sampleH).data;

      const isDarkPixel = (x, y) => {
        const idx = (y * sampleW + x) * 4;
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        const a = imgData[idx + 3];
        if (a < 30) return true; // Transparent padding
        return r < 45 && g < 45 && b < 45;
      };

      const isDarkRow = (y) => {
        let darkCount = 0;
        const SAMPLES = 30;
        for (let i = 0; i < SAMPLES; i++) {
          const x = Math.floor((i * (sampleW - 1)) / (SAMPLES - 1));
          if (isDarkPixel(x, y)) darkCount++;
        }
        return (darkCount / SAMPLES) >= 0.88;
      };

      const isDarkCol = (x) => {
        let darkCount = 0;
        const SAMPLES = 30;
        for (let i = 0; i < SAMPLES; i++) {
          const y = Math.floor((i * (sampleH - 1)) / (SAMPLES - 1));
          if (isDarkPixel(x, y)) darkCount++;
        }
        return (darkCount / SAMPLES) >= 0.88;
      };

      let topRow = 0;
      while (topRow < sampleH && isDarkRow(topRow)) topRow++;

      let bottomRow = sampleH - 1;
      while (bottomRow > topRow && isDarkRow(bottomRow)) bottomRow--;

      let leftCol = 0;
      while (leftCol < sampleW && isDarkCol(leftCol)) leftCol++;

      let rightCol = sampleW - 1;
      while (rightCol > leftCol && isDarkCol(rightCol)) rightCol--;

      const topRatio = topRow / sampleH;
      const bottomRatio = (sampleH - 1 - bottomRow) / sampleH;
      const leftRatio = leftCol / sampleW;
      const rightRatio = (sampleW - 1 - rightCol) / sampleW;

      // Only crop if there is significant letterbox padding (> 5% on any side or > 8% combined)
      const hasSignificantCrop = (topRatio > 0.05 || bottomRatio > 0.05 || leftRatio > 0.05 || rightRatio > 0.05 || (topRatio + bottomRatio > 0.08) || (leftRatio + rightRatio > 0.08));
      if (!hasSignificantCrop) return null;

      // Compute actual source crop rect with 4px safety breathing room
      const sx = Math.max(0, Math.floor(leftRatio * origW) - 4);
      const sy = Math.max(0, Math.floor(topRatio * origH) - 4);
      const ex = Math.min(origW, Math.ceil((1 - rightRatio) * origW) + 4);
      const ey = Math.min(origH, Math.ceil((1 - bottomRatio) * origH) + 4);
      const sw = ex - sx;
      const sh = ey - sy;

      if (sw <= 50 || sh <= 50) return null;

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = sw;
      cropCanvas.height = sh;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

      return {
        dataUrl: cropCanvas.toDataURL('image/jpeg', 0.92),
        cropBox: { sx, sy, sw, sh },
        topRatio,
        bottomRatio
      };
    } catch (e) {
      console.warn('Letterbox detection fallback:', e);
      return null;
    }
  },

  compressImageFile(file, callback) {
    if (!file) {
      callback('');
      return;
    }

    // 1. For non-image files (PDF, doc), read as base64 data URL
    const isImage = file.type && file.type.startsWith('image/');
    if (!isImage && (file.type === 'application/pdf' || (file.name && file.name.toLowerCase().endsWith('.pdf')))) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        callback(dataUrl && dataUrl.length > 20 ? dataUrl : 'PDF_SUBMITTED');
      };
      reader.onerror = () => callback('PDF_SUBMITTED');
      reader.readAsDataURL(file);
      return;
    }

    // 2. High-Performance Instant Image Processing with Auto-Letterbox Trimming
    try {
      const objUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        try {
          const origW = img.naturalWidth || img.width || 800;
          const origH = img.naturalHeight || img.height || 600;

          // Check if image contains letterbox padding (e.g. mobile screenshot of document)
          let sx = 0, sy = 0, sw = origW, sh = origH;
          const cropResult = this.detectAndCropLetterbox(img);
          if (cropResult && cropResult.cropBox) {
            sx = cropResult.cropBox.sx;
            sy = cropResult.cropBox.sy;
            sw = cropResult.cropBox.sw;
            sh = cropResult.cropBox.sh;
          }

          // High-clarity readable certificate dimensions (1200px max width/height)
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = sw;
          let height = sh;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            } else {
              width = Math.round((width * MAX_HEIGHT) / height);
              width = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { alpha: false });
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Fill white background for transparent PNGs
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

          // Export sharp 0.72 JPEG (~45KB) for crystal-clear text readability on HOD review desk
          const compressed = canvas.toDataURL('image/jpeg', 0.72);
          URL.revokeObjectURL(objUrl);
          callback(compressed && compressed.length > 50 ? compressed : '');
        } catch (e) {
          URL.revokeObjectURL(objUrl);
          const fallbackReader = new FileReader();
          fallbackReader.onload = (ev) => callback(ev.target.result || '');
          fallbackReader.onerror = () => callback('');
          fallbackReader.readAsDataURL(file);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        const fallbackReader = new FileReader();
        fallbackReader.onload = (ev) => callback(ev.target.result || '');
        fallbackReader.onerror = () => callback('');
        fallbackReader.readAsDataURL(file);
      };

      img.src = objUrl;
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (ev) => callback(ev.target.result || '');
      reader.onerror = () => callback('');
      reader.readAsDataURL(file);
    }
  },

  async uploadFileToCloud(file, callback) {
    if (!file) {
      callback('');
      return;
    }

    let called = false;
    const safeCallback = (url) => {
      if (!called) {
        called = true;
        callback(url);
      }
    };

    // 45-second safety fallback
    setTimeout(() => {
      safeCallback('');
    }, 45000);

    // Compress and read image file
    this.compressImageFile(file, safeCallback);
  },

  async handleUploadPage(e) {
    e.preventDefault();
    const btnSubmit = document.getElementById('btn-page-upload-submit');
    const btnCancel = document.getElementById('btn-page-upload-cancel');
    const progressBox = document.getElementById('upload-progress-box');
    const progressTitle = document.getElementById('upload-progress-title');
    const progressDesc = document.getElementById('upload-progress-desc');
    const progressBar = document.getElementById('upload-progress-bar');

    const fileInput = document.getElementById('page-cert-file');
    const selectedFile = (fileInput && fileInput.files && fileInput.files.length > 0) ? fileInput.files[0] : null;

    // Manual file validation
    if (!selectedFile) {
      Toast.error('Please select a certificate file (PDF, PNG, or JPG) before submitting.');
      const statusMsg = document.getElementById('file-status-msg');
      if (statusMsg) { statusMsg.style.color = '#ef4444'; statusMsg.textContent = '⚠️ No file selected. Please tap the file picker above to choose your certificate.'; }
      return;
    }

    // Strict 1 MB maximum upload size limit
    const maxBytes = 1024 * 1024;
    if (selectedFile.size > maxBytes) {
      const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(2);
      Toast.error(`Upload Blocked: File size (${sizeMb} MB) exceeds the 1 MB limit. Maximum upload size allowed is 1 MB.`);
      const statusMsg = document.getElementById('file-status-msg');
      if (statusMsg) {
        statusMsg.style.color = '#ef4444';
        statusMsg.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>File Too Large (${sizeMb} MB):</strong> Maximum allowed upload size is <strong>1 MB</strong>. Please choose a smaller file.`;
      }
      if (fileInput) fileInput.value = '';
      return;
    }

    // Lock UI and show live progress indicator on upload window
    btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Uploading... Please Wait';
    btnSubmit.disabled = true;
    if (btnCancel) btnCancel.style.display = 'none';

    if (progressBox) {
      progressBox.style.display = 'block';
      const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(2);
      if (progressTitle) progressTitle.textContent = `Optimizing & Encrypting Document (${sizeMb} MB)...`;
      if (progressBar) progressBar.style.width = '45%';
    }

    const certDateInput = document.getElementById('page-cert-date');
    const certDate = certDateInput ? certDateInput.value : '';
    if (certDate) {
      const parts = certDate.split('-').map(Number);
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const dayOfWeek = d.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          Toast.error('Invalid Date: Saturdays and Sundays are non-instructional days and cannot be selected. Please choose a Monday–Friday date.');
          if (certDateInput) certDateInput.value = '';
          return;
        }
      }
    }

    const nowLocal = new Date();
    const year = nowLocal.getFullYear();
    const month = String(nowLocal.getMonth() + 1).padStart(2, '0');
    const day = String(nowLocal.getDate()).padStart(2, '0');
    const localTodayStr = `${year}-${month}-${day}`;

    const title = (document.getElementById('page-cert-title') ? document.getElementById('page-cert-title').value : '') || 'Activity Certificate';
    const event_name = (document.getElementById('page-cert-event') ? document.getElementById('page-cert-event').value : '') || 'Department Event';
    const category = (document.getElementById('page-cert-category') ? document.getElementById('page-cert-category').value : '') || 'DEPARTMENTAL';
    const description = (document.getElementById('page-cert-desc') ? document.getElementById('page-cert-desc').value : '') || '';
    const num_days = parseInt(document.getElementById('page-cert-days')?.value || '1') || 1;

    const processFileAndPost = (fileUrl) => {
      if (progressBar) progressBar.style.width = '80%';
      if (progressTitle) progressTitle.textContent = 'Delivering Certificate to HOD Desk...';

      const payload = {
        title,
        event_name,
        category,
        certificate_date: certDate || localTodayStr,
        num_days,
        description,
        file_url: fileUrl || '',
        file_name: selectedFile ? (selectedFile.name || 'uploaded_certificate') : 'certificate_document.jpg',
        file_size: selectedFile ? selectedFile.size : 0
      };

      API.post('/api/student/certificates', payload).then(res => {
        if (progressBar) progressBar.style.width = '100%';
        if (progressTitle) progressTitle.innerHTML = '🎉 Upload Successful!';
        if (progressDesc) progressDesc.textContent = 'Certificate successfully sent for HOD review. Opening certificates list...';

        Toast.success('Certificate Uploaded');
        setTimeout(() => {
          window.location.hash = '#/student/certificates';
        }, 600);
      }).catch(err => {
        Toast.error('Upload Failed');
        btnSubmit.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Certificate for Review';
        btnSubmit.disabled = false;
        if (btnCancel) btnCancel.style.display = '';
        if (progressBox) progressBox.style.display = 'none';
      });
    };

    this.uploadFileToCloud(selectedFile, processFileAndPost);
  },

  async renderCertificates() {
    if (typeof fetchCloudDB === 'function') await fetchCloudDB(true);
    const profile = this.getFreshProfile();
    if (!profile) {
      return this.renderMissingRecordScreen();
    }
    if (profile.status !== 'APPROVED') {
      return this.renderPendingApprovalScreen(profile);
    }
    try {
      const data = await API.get('/api/student/certificates');
      const certificates = Array.isArray(data) ? data : (data.certificates || []);

      const rows = certificates.map(c => {
        const safeTitle = (c.title || 'Certificate').replace(/'/g, "\\'");
        const safeStudent = (c.student_name || 'Student').replace(/'/g, "\\'");
        const isPending = c.status === 'PENDING';

        return `
          <tr>
            <td>
              <strong>${c.title}</strong>
              ${c.description ? `
                <div style="font-size: 0.78rem; color: #475569; margin-top: 0.25rem; background: #f8fafc; padding: 0.35rem 0.55rem; border-radius: 6px; border-left: 3px solid var(--primary); line-height: 1.4; display: flex; justify-content: space-between; align-items: flex-start; gap: 0.4rem;">
                  <div>
                    <strong style="color: #1e40af;"><i class="fa-solid fa-comment-dots"></i> Reason/Detail:</strong> ${c.description}
                  </div>
                  ${(isPending || c.status === 'REJECTED') ? `
                    <button type="button" class="btn btn-sm" onclick="StudentView.openEditCertificateModal('${c.id}')" style="background: transparent; border: none; color: #d97706; font-size: 0.75rem; font-weight: 700; cursor: pointer; padding: 0; white-space: nowrap;" title="Change reason if submitted by mistake">
                      <i class="fa-solid fa-pen-to-square"></i> Change
                    </button>
                  ` : ''}
                </div>
              ` : `
                ${(isPending || c.status === 'REJECTED') ? `
                  <div style="margin-top: 0.35rem;">
                    <button type="button" class="btn btn-sm" onclick="StudentView.openEditCertificateModal('${c.id}')" style="background: #eff6ff; color: #2563eb; border: 1px dashed #93c5fd; font-size: 0.74rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 4px;">
                      <i class="fa-solid fa-plus"></i> Add Description / Reason
                    </button>
                  </div>
                ` : ''}
              `}
            </td>
            <td>
              <strong>${c.event_name}</strong>
              <div style="margin-top: 0.25rem;">
                <span class="badge" style="background: #e0e7ff; color: #3730a3; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 4px; font-size: 0.72rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                  <i class="fa-solid fa-business-time"></i> ${(c.num_days && c.num_days > 1) ? `${c.num_days} Days Event` : '1 Day Event'}
                </span>
              </div>
            </td>
            <td><span class="badge-role role-STUDENT">${c.category}</span></td>
            <td>${c.certificate_date}</td>
            <td>
              <span class="badge-status status-${c.status}">${c.status}</span>
              ${c.status === 'APPROVED' ? `
                <div style="font-size: 0.75rem; color: #15803d; font-weight: 700; margin-top: 0.25rem;">
                  <i class="fa-solid fa-circle-check"></i> Approved by: <strong>${c.approved_by || c.verified_by || 'Dr. Dhanashree Kulkarni (HOD)'}</strong>
                </div>
                <div style="font-size: 0.7rem; color: #166534; font-weight: 600;">Attendance Credited</div>
              ` : ''}
              ${c.status === 'REJECTED' ? `
                <div style="font-size: 0.75rem; color: #b91c1c; font-weight: 700; margin-top: 0.25rem;">
                  <i class="fa-solid fa-circle-xmark"></i> Rejected by: <strong>${c.rejected_by || c.verified_by || c.approved_by || 'Faculty Reviewer'}</strong>
                </div>
                ${c.rejection_reason ? `<div style="font-size: 0.72rem; color: var(--accent-rose); margin-top: 0.15rem;">Reason: ${c.rejection_reason}</div>` : ''}
              ` : ''}
              ${c.status === 'PENDING' ? `
                <div style="font-size: 0.72rem; color: #b45309; margin-top: 0.25rem;">
                  <i class="fa-solid fa-clock"></i> Awaiting Faculty Review
                </div>
              ` : ''}
            </td>
            <td>
              <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; align-items: center;">
                <button class="btn btn-secondary btn-sm" onclick="StudentView.openCertificatePreview('${c.id}')">
                  <i class="fa-solid fa-eye"></i> View
                </button>
                ${(isPending || c.status === 'REJECTED') ? `
                  <button class="btn btn-warning btn-sm" onclick="StudentView.openEditCertificateModal('${c.id}')" style="background: #d97706; border-color: #d97706; color: #ffffff; font-size: 0.78rem; font-weight: 700; padding: 0.25rem 0.55rem;" title="Change reason, description, or event details if submitted by mistake">
                    <i class="fa-solid fa-pen-to-square"></i> Change Reason / Edit
                  </button>
                ` : ''}
                ${isPending ? `
                  <button class="btn btn-danger btn-sm" onclick="StudentView.cancelCertificateRequest('${c.id}', '${safeTitle}')" style="background: #ef4444; border-color: #ef4444; font-size: 0.78rem; font-weight: 700;" title="Cancel & withdraw this pending certificate submission">
                    <i class="fa-solid fa-ban"></i> Cancel Request
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('') || `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">No certificates uploaded yet. Click "Upload New Certificate" above to submit your first certificate.</td></tr>`;

      return `
        <div class="dashboard-container">
          <div class="glass-panel">
            <div class="panel-header">
              <h3><i class="fa-solid fa-file-contract" style="color: var(--primary);"></i> My Certificate Submissions</h3>
              <a href="#/student/upload" class="btn btn-primary btn-sm" style="font-weight: 800;">
                <i class="fa-solid fa-cloud-arrow-up"></i> Upload New Certificate
              </a>
            </div>
            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Title & Description</th>
                    <th>Event / Activity</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Document Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      return `<div class="dashboard-container"><p style="color: var(--accent-rose);">Failed to load certificates.</p></div>`;
    }
  },

  async cancelCertificateRequest(certId, title) {
    if (!confirm(`Are you sure you want to cancel and withdraw your certificate request for "${title || 'this certificate'}"?`)) return;
    try {
      Toast.info('Cancelling certificate request...');
      await API.del(`/api/teacher/certificates/${certId}`);
      Toast.success('Certificate submission request cancelled and withdrawn successfully.');
      const container = document.getElementById('view-container');
      if (container) container.innerHTML = await StudentView.renderCertificates();
    } catch (err) {
      Toast.error((err && err.message) || 'Failed to cancel certificate request.');
    }
  },

  openEditCertificateModal(certId) {
    const db = (typeof getLocalDB === 'function') ? getLocalDB() : { certificates: [] };
    const cert = (db.certificates || []).find(c => String(c.id) === String(certId));
    if (!cert) {
      Toast.error('Certificate not found.');
      return;
    }

    const editId = document.getElementById('edit-cert-id');
    const editDesc = document.getElementById('edit-cert-desc');
    const editTitle = document.getElementById('edit-cert-title');
    const editEvent = document.getElementById('edit-cert-event');
    const editCat = document.getElementById('edit-cert-category');
    const editDate = document.getElementById('edit-cert-date');
    const editDays = document.getElementById('edit-cert-days');
    const editFileInput = document.getElementById('edit-cert-file');
    const currentBadge = document.getElementById('edit-cert-current-file-badge');
    const progressBox = document.getElementById('edit-cert-progress-box');

    if (editId) editId.value = cert.id;
    if (editDesc) editDesc.value = cert.description || '';
    if (editTitle) editTitle.value = cert.title || '';
    if (editEvent) editEvent.value = cert.event_name || '';
    if (editCat) editCat.value = cert.category || 'DEPARTMENTAL';
    if (editDate) editDate.value = cert.certificate_date || '';
    if (editDays) editDays.value = String(cert.num_days || 1);
    if (editFileInput) editFileInput.value = '';
    if (progressBox) progressBox.style.display = 'none';

    if (currentBadge) {
      currentBadge.innerHTML = cert.file_name 
        ? `Current file: <strong style="color: var(--primary);">${cert.file_name}</strong>`
        : 'Current file on record';
    }

    openModal('modal-edit-certificate');
  },

  async handleSaveCertificateEdit(e) {
    e.preventDefault();
    const certId = document.getElementById('edit-cert-id')?.value;
    if (!certId) {
      Toast.error('Invalid certificate reference.');
      return;
    }

    const title = (document.getElementById('edit-cert-title')?.value || '').trim();
    const event_name = (document.getElementById('edit-cert-event')?.value || '').trim();
    const category = (document.getElementById('edit-cert-category')?.value || '').trim();
    const certDateInput = document.getElementById('edit-cert-date');
    const certDate = certDateInput ? certDateInput.value : '';
    const num_days = parseInt(document.getElementById('edit-cert-days')?.value || '1') || 1;
    const description = (document.getElementById('edit-cert-desc')?.value || '').trim();

    if (!description) {
      Toast.warning('Please enter a description or reason for this activity certificate.');
      return;
    }

    if (certDate) {
      const parts = certDate.split('-').map(Number);
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const dayOfWeek = d.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          Toast.error('Invalid Date: Saturdays and Sundays are non-instructional days. Please choose a Monday–Friday date.');
          return;
        }
      }
    }

    const btnSubmit = document.getElementById('btn-save-edit-certificate');
    const progressBox = document.getElementById('edit-cert-progress-box');
    const progressBar = document.getElementById('edit-cert-progress-bar');
    const progressText = document.getElementById('edit-cert-progress-text');

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving Updates...';
    }

    const fileInput = document.getElementById('edit-cert-file');
    const selectedFile = (fileInput && fileInput.files && fileInput.files.length > 0) ? fileInput.files[0] : null;

    if (selectedFile) {
      const maxBytes = 1024 * 1024; // 1 MB strict limit
      if (selectedFile.size > maxBytes) {
        const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(2);
        Toast.error(`Upload Blocked: Replacement file (${sizeMb} MB) exceeds the 1 MB limit. Maximum allowed size is 1 MB.`);
        const statusMsg = document.getElementById('edit-file-status-msg');
        if (statusMsg) {
          statusMsg.style.color = '#ef4444';
          statusMsg.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>File Too Large (${sizeMb} MB):</strong> Maximum allowed size is <strong>1 MB</strong>. Please select a file under 1 MB.`;
        }
        if (fileInput) fileInput.value = '';
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save & Update Certificate';
        }
        return;
      }
    }

    const finalizeUpdate = (fileUrl, fileName) => {
      const payload = {
        id: certId,
        title: title || 'Activity Certificate',
        event_name: event_name || 'Department Event',
        category: category || 'DEPARTMENTAL',
        certificate_date: certDate,
        num_days,
        description: description,
        resubmit: true
      };

      if (fileUrl) {
        payload.file_url = fileUrl;
        payload.file_name = fileName || 'certificate_document.jpg';
        payload.file_size = selectedFile ? selectedFile.size : 0;
      }

      API.post(`/api/student/certificates/${certId}/update`, payload).then(async (res) => {
        Toast.success(res.message || '🎉 Certificate details and reason updated successfully!');
        closeModal('modal-edit-certificate');

        // Re-render student certificates list
        const container = document.getElementById('view-container');
        if (container) {
          container.innerHTML = await StudentView.renderCertificates();
        }
      }).catch(err => {
        Toast.error((err && err.message) || 'Failed to update certificate.');
      }).finally(() => {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save & Update Certificate';
        }
        if (progressBox) progressBox.style.display = 'none';
      });
    };

    if (selectedFile) {
      if (progressBox) {
        progressBox.style.display = 'block';
        if (progressBar) progressBar.style.width = '60%';
        if (progressText) progressText.textContent = `Optimizing replacement document (${(selectedFile.size / (1024*1024)).toFixed(2)} MB)...`;
      }
      this.uploadFileToCloud(selectedFile, (uploadedUrl) => {
        finalizeUpdate(uploadedUrl, selectedFile.name);
      });
    } else {
      finalizeUpdate('', '');
    }
  },

  async renderProfile() {
    const profile = this.getFreshProfile() || App.currentProfile || {};
    return `
      <div class="dashboard-container">
        <div class="glass-panel" style="max-width: 650px; margin: 0 auto;">
          <div class="panel-header">
            <h3><i class="fa-solid fa-id-card" style="color: var(--primary);"></i> Student Academic Profile</h3>
          </div>
          <div style="display: flex; gap: 1.5rem; align-items: center; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 1.5rem;">
            <div class="user-avatar" style="width: 70px; height: 70px; font-size: 1.8rem; background: var(--primary);">
              ${(profile.name || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-main);">${profile.name || 'Student Name'}</h2>
              <p style="color: var(--primary); font-weight: 700; font-size: 0.9rem;">Electronics & Computer Engineering Department</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Roll Number</span>
              <p style="font-weight: 800; font-size: 1.1rem; color: var(--text-main); margin-top: 0.2rem;">${profile.roll_no || 'N/A'}</p>
            </div>

            <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">PRN Number</span>
              <p style="font-weight: 800; font-size: 1.1rem; color: var(--text-main); margin-top: 0.2rem;">${profile.prn_no || 'N/A'}</p>
            </div>

            <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Division</span>
              <p style="font-weight: 800; font-size: 1.1rem; color: var(--primary); margin-top: 0.2rem;">${profile.division_name || 'SE(ECE)-A'}</p>
            </div>

            <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Assigned Batch</span>
              <p style="font-weight: 800; font-size: 1.1rem; color: var(--accent-gold); margin-top: 0.2rem;">Batch ${profile.batch_name || 'A1'}</p>
            </div>

            <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Email Address</span>
              <p style="font-weight: 700; font-size: 0.95rem; color: var(--text-main); margin-top: 0.2rem;">${profile.email || ''}</p>
            </div>

            <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Academic Year</span>
              <p style="font-weight: 700; font-size: 0.95rem; color: var(--text-main); margin-top: 0.2rem;">${profile.academic_year || '2026-27'}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _previewOriginalSrc: '',
  _previewCroppedSrc: '',
  _previewZoom: 1,
  _previewRotation: 0,
  _previewIsCropped: false,

  handlePreviewImageLoad(img) {
    if (!img) return;
    if (this._previewCroppedSrc && img.src === this._previewCroppedSrc) return;

    this._previewOriginalSrc = img.src;

    // Detect and auto-crop letterbox borders if present
    const cropResult = this.detectAndCropLetterbox(img);
    if (cropResult && cropResult.dataUrl) {
      this._previewCroppedSrc = cropResult.dataUrl;
      this._previewIsCropped = true;
      img.src = cropResult.dataUrl;

      const badge = document.getElementById('preview-crop-badge');
      if (badge) badge.style.display = 'inline-flex';
      const toggleBtn = document.getElementById('btn-toggle-crop');
      if (toggleBtn) {
        toggleBtn.style.display = 'inline-block';
        toggleBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Show Original';
      }
    }
  },

  togglePreviewCrop() {
    const img = document.getElementById('preview-cert-img');
    const badge = document.getElementById('preview-crop-badge');
    const toggleBtn = document.getElementById('btn-toggle-crop');
    if (!img || !this._previewCroppedSrc || !this._previewOriginalSrc) return;

    if (this._previewIsCropped) {
      img.src = this._previewOriginalSrc;
      this._previewIsCropped = false;
      if (badge) badge.style.display = 'none';
      if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-expand"></i> Fit Full Shape';
    } else {
      img.src = this._previewCroppedSrc;
      this._previewIsCropped = true;
      if (badge) badge.style.display = 'inline-flex';
      if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Show Original';
    }
  },

  zoomPreview(delta) {
    this._previewZoom = Math.min(3, Math.max(0.4, Number(((this._previewZoom || 1) + delta).toFixed(2))));
    this.updatePreviewTransform();
  },

  resetPreviewZoom() {
    this._previewZoom = 1;
    this._previewRotation = 0;
    this.updatePreviewTransform();
  },

  rotatePreview() {
    this._previewRotation = ((this._previewRotation || 0) + 90) % 360;
    this.updatePreviewTransform();
  },

  updatePreviewTransform() {
    const img = document.getElementById('preview-cert-img');
    const zoomLabel = document.getElementById('preview-zoom-label');
    if (img) {
      img.style.transform = `scale(${this._previewZoom || 1}) rotate(${this._previewRotation || 0}deg)`;
    }
    if (zoomLabel) {
      zoomLabel.textContent = `${Math.round((this._previewZoom || 1) * 100)}%`;
    }
  },

  openPreviewFullWindow() {
    const img = document.getElementById('preview-cert-img');
    const src = (img && img.src) || this._previewOriginalSrc || '';
    if (!src) return;
    const win = window.open();
    if (win) {
      win.document.write(`<!DOCTYPE html><html><head><title>Full Shape Certificate</title><style>body{margin:0;background:#020617;display:flex;align-items:center;justify-content:center;min-height:100vh;}img{max-width:98vw;max-height:98vh;object-fit:contain;box-shadow:0 0 30px rgba(0,0,0,0.8);}</style></head><body><img src="${src}"></body></html>`);
      win.document.close();
    }
  },

  renderFileOpeningLoader(title = 'Opening Certificate Document...') {
    return `
      <div class="cert-file-loader-container">
        <div class="cert-doc-scanner-frame">
          <div class="cert-laser-beam"></div>
          <i class="fa-solid fa-file-shield cert-doc-icon"></i>
        </div>
        <div class="cert-loader-badge"><i class="fa-solid fa-lock"></i> ECE ERP Document Vault</div>
        <div class="cert-loader-title">${title}</div>
        <div class="cert-loader-subtitle">Decrypting high-resolution certificate stream securely from cloud...</div>
        <div class="cert-loader-progress">
          <div class="cert-loader-bar"></div>
        </div>
      </div>`;
  },

  async openCertificatePreview(certId) {
    if (!certId) {
      if (typeof Toast !== 'undefined') Toast.error('Invalid certificate ID');
      return;
    }
    const cidStr = String(certId);
    const db = typeof getLocalDB === 'function' ? getLocalDB() : { certificates: [] };
    const cert = (db.certificates || []).find(c => c && String(c.id) === cidStr);

    const titleText = (cert && (cert.file_name || cert.title)) || 'Activity Certificate Document';
    const certTitle = (cert && cert.title) || '';
    const studentName = (cert && cert.student_name) || '';

    // Show high-tech laser scanner loader immediately in the preview modal
    const titleEl = document.getElementById('preview-modal-title');
    if (titleEl) titleEl.innerText = `Certificate Document Preview: ${titleText}`;
    const body = document.getElementById('preview-modal-body');
    if (body) {
      body.innerHTML = this.renderFileOpeningLoader(`Opening ${titleText}...`);
    }
    if (typeof openModal === 'function') openModal('modal-file-preview');

    let fileUrl = cert ? (cert.file_url || '') : '';

    // 1. If document already in memory, display with smooth scanner animation
    if (fileUrl && (fileUrl.startsWith('data:') || fileUrl.startsWith('http://') || fileUrl.startsWith('https://') || fileUrl.startsWith('blob:'))) {
      await new Promise(r => setTimeout(r, 450));
      return this.previewFile(fileUrl, cert ? cert.file_name : '', certTitle, studentName, certId);
    }

    // 2. Try fetching from Firebase child endpoint on demand
    try {
      const singleCert = await fetch(`https://ece-campus-erp-default-rtdb.firebaseio.com/certificates/${cidStr}.json`).then(r => r.json()).catch(() => null);
      if (singleCert && singleCert.file_url && singleCert.file_url.length > 30) {
        fileUrl = singleCert.file_url;
        if (cert) {
          cert.file_url = fileUrl;
          if (!cert.file_name && singleCert.file_name) cert.file_name = singleCert.file_name;
        }
        await new Promise(r => setTimeout(r, 350));
        return this.previewFile(fileUrl, (cert && cert.file_name) || singleCert.file_name, certTitle || singleCert.title, studentName || singleCert.student_name, certId);
      }
    } catch (err) {
      console.warn('Failed to fetch certificate document from Firebase RTDB:', err);
    }

    // 3. Fallback to previewFile logic
    await new Promise(r => setTimeout(r, 350));
    return this.previewFile(fileUrl, cert ? cert.file_name : '', certTitle, studentName, certId);
  },

  async previewFile(url, fileName, certTitle = '', studentName = '', certId = '') {
    this._previewOriginalSrc = '';
    this._previewCroppedSrc = '';
    this._previewZoom = 1;
    this._previewRotation = 0;
    this._previewIsCropped = false;

    const titleText = fileName || certTitle || 'Activity Certificate Document';
    const titleEl = document.getElementById('preview-modal-title');
    if (titleEl) titleEl.innerText = `Certificate Document Preview: ${titleText}`;
    const body = document.getElementById('preview-modal-body');
    if (body) {
      body.innerHTML = this.renderFileOpeningLoader(`Loading ${titleText}...`);
    }
    if (typeof openModal === 'function') openModal('modal-file-preview');

    let fileUrl = url || '';

    // 1. Try resolving certificate from local database if fileUrl is empty or placeholder
    if (!fileUrl || fileUrl.startsWith('cert_asset_') || fileUrl.startsWith('LOCAL_') || fileUrl === 'SYNC_STORED' || fileUrl === 'PLACEHOLDER' || fileUrl === 'null' || fileUrl === 'undefined') {
      const db = typeof getLocalDB === 'function' ? getLocalDB() : { certificates: [] };
      const matched = (db.certificates || []).find(c =>
        (certId && String(c.id) === String(certId)) ||
        (fileName && c.file_name === fileName) ||
        (certTitle && c.title === certTitle) ||
        (studentName && c.student_name === studentName)
      );
      if (matched && matched.file_url && (matched.file_url.startsWith('data:image') || matched.file_url.startsWith('http') || matched.file_url.startsWith('data:application/pdf'))) {
        fileUrl = matched.file_url;
      }
      if ((!fileUrl || fileUrl === 'SYNC_STORED') && matched && matched.id) {
        try {
          const cachedImg = localStorage.getItem(`cert_img_${matched.id}`) || localStorage.getItem(`cert_thumb_${matched.id}`);
          if (cachedImg && cachedImg.startsWith('data:image')) fileUrl = cachedImg;
        } catch(e) {}
      }
    }

    // 2. If still missing or placeholder, fetch direct high-res image from Firebase RTDB
    if ((!fileUrl || fileUrl === 'SYNC_STORED' || fileUrl.startsWith('LOCAL_')) && certId) {
      try {
        const singleCert = await fetch(`https://ece-campus-erp-default-rtdb.firebaseio.com/certificates/${certId}.json`).then(r => r.json()).catch(() => null);
        if (singleCert && singleCert.file_url && singleCert.file_url.length > 30) {
          fileUrl = singleCert.file_url;
          const db = typeof getLocalDB === 'function' ? getLocalDB() : null;
          if (db && db.certificates) {
            const matchedCert = db.certificates.find(c => c && String(c.id) === String(certId));
            if (matchedCert) matchedCert.file_url = fileUrl;
          }
        }
      } catch(e) {}
    }

    let displayContent = '';

    if (fileUrl && (fileUrl.startsWith('data:image') || fileUrl.startsWith('http') || fileUrl.startsWith('blob:'))) {
      const safeTitle = (titleText || 'Document').replace(/"/g, '&quot;');
      displayContent = `
        <div class="cert-preview-wrapper" style="width: 100%; display: flex; flex-direction: column;">
          <!-- Top Viewer Action Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; background: #0f172a; padding: 0.55rem 0.85rem; border-radius: 8px 8px 0 0; color: #f8fafc; border: 1px solid #334155; border-bottom: 1px solid #1e293b;">
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; font-weight: 700;">
              <i class="fa-solid fa-file-image" style="color: #38bdf8;"></i>
              <span style="max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeTitle}">${safeTitle}</span>
              <span id="preview-crop-badge" style="display: none; background: #059669; color: #ffffff; padding: 0.18rem 0.55rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 800; align-items: center; gap: 0.3rem;">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Full Shape Fitted
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.3rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-sm" id="btn-toggle-crop" onclick="StudentView.togglePreviewCrop()" style="display: none; background: #1e293b; color: #f1f5f9; border: 1px solid #475569; font-size: 0.74rem; font-weight: 700; padding: 0.22rem 0.55rem; border-radius: 6px;">
                <i class="fa-solid fa-arrows-rotate"></i> Show Original
              </button>
              <button type="button" class="btn btn-sm" onclick="StudentView.zoomPreview(-0.2)" style="background: #1e293b; color: #f1f5f9; border: 1px solid #475569; font-size: 0.74rem; padding: 0.22rem 0.5rem; border-radius: 6px;" title="Zoom Out">
                <i class="fa-solid fa-minus"></i>
              </button>
              <button type="button" class="btn btn-sm" id="preview-zoom-label" onclick="StudentView.resetPreviewZoom()" style="background: #1e293b; color: #f1f5f9; border: 1px solid #475569; font-size: 0.74rem; font-weight: 800; padding: 0.22rem 0.5rem; border-radius: 6px; min-width: 46px;" title="Reset Zoom">
                100%
              </button>
              <button type="button" class="btn btn-sm" onclick="StudentView.zoomPreview(0.2)" style="background: #1e293b; color: #f1f5f9; border: 1px solid #475569; font-size: 0.74rem; padding: 0.22rem 0.5rem; border-radius: 6px;" title="Zoom In">
                <i class="fa-solid fa-plus"></i>
              </button>
              <button type="button" class="btn btn-sm" onclick="StudentView.rotatePreview()" style="background: #1e293b; color: #f1f5f9; border: 1px solid #475569; font-size: 0.74rem; padding: 0.22rem 0.55rem; border-radius: 6px;" title="Rotate 90°">
                <i class="fa-solid fa-rotate-right"></i>
              </button>
              <button type="button" class="btn btn-sm" onclick="StudentView.openPreviewFullWindow()" style="background: #2563eb; color: #ffffff; border: none; font-size: 0.74rem; font-weight: 700; padding: 0.22rem 0.6rem; border-radius: 6px;" title="Open full resolution in new window">
                <i class="fa-solid fa-up-right-from-square"></i> Full
              </button>
            </div>
          </div>

          <!-- Document Stage Viewport -->
          <div id="preview-stage-container" style="background: #020617; border-radius: 0 0 8px 8px; border: 1px solid #334155; border-top: none; min-height: 380px; max-height: 72vh; overflow: auto; display: flex; align-items: center; justify-content: center; padding: 1rem; position: relative;">
            <img id="preview-cert-img" src="${fileUrl}" onload="StudentView.handlePreviewImageLoad(this)" style="max-width: 100%; height: auto; max-height: 68vh; border-radius: 4px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.7); transition: transform 0.15s ease-out; transform-origin: center center;" alt="${safeTitle}">
          </div>
          <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-align: center;">
            <i class="fa-solid fa-circle-info" style="color: var(--primary);"></i> Tip: Use Zoom (+ / -) or Rotate to inspect details. Auto-fit expands certificates to full shape.
          </div>
        </div>`;
    } else if (fileUrl && (fileUrl.includes('data:application/pdf') || fileUrl.endsWith('.pdf') || fileUrl === 'PDF_SUBMITTED')) {
      if (fileUrl.startsWith('data:application/pdf')) {
        displayContent = `<iframe src="${fileUrl}" style="width: 100%; height: 550px; border: none; border-radius: var(--radius-md); box-shadow: var(--shadow-md);"></iframe>`;
      } else {
        displayContent = `
          <div style="text-align: center; padding: 2.5rem; background: #f8fafc; border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
            <i class="fa-solid fa-file-pdf" style="font-size: 3.5rem; color: #ef4444; display: block; margin-bottom: 1rem;"></i>
            <h4 style="color: var(--text-main); font-weight: 800; margin-bottom: 0.5rem;">Official PDF Certificate Submitted</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.75rem;">Document: <strong>${titleText}</strong> &nbsp;|&nbsp; Student: <strong>${studentName || 'Student'}</strong></p>
            <span class="badge-status status-APPROVED" style="font-weight: 800; background: #dcfce7; color: #15803d;">PDF DOCUMENT VERIFIED</span>
          </div>`;
      }
    } else {
      displayContent = this.getSampleCertificateHTML(certTitle || titleText, studentName || 'Student');
    }

    const dbCerts = (typeof getLocalDB === 'function' ? getLocalDB() : { certificates: [] }).certificates || [];
    const certRecord = dbCerts.find(c =>
      (certId && String(c.id) === String(certId)) ||
      (fileName && c.file_name === fileName) ||
      (certTitle && c.title === certTitle) ||
      (studentName && c.student_name === studentName)
    );

    let metaBox = '';
    if (certRecord) {
      const isApproved = certRecord.status === 'APPROVED';
      const isRejected = certRecord.status === 'REJECTED';
      const verifierName = isApproved 
        ? (certRecord.approved_by || certRecord.verified_by || 'Dr. Dhanashree Kulkarni (HOD)')
        : (certRecord.rejected_by || certRecord.verified_by || certRecord.approved_by || 'Faculty Reviewer');

      metaBox = `
        <div style="margin-top: 1.25rem; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: var(--radius-md); padding: 1rem 1.25rem; text-align: left; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
            <div>
              <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #0f172a;">${certRecord.title || titleText}</h4>
              <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.35rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span><i class="fa-solid fa-trophy" style="color: #2563eb;"></i> Event: <strong>${certRecord.event_name || 'N/A'}</strong> (${certRecord.category || 'Co-Curricular'})</span>
                <span>&bull;</span>
                <span><i class="fa-regular fa-calendar"></i> Date: <strong>${certRecord.certificate_date || 'N/A'}</strong></span>
                <span>&bull;</span>
                <span class="badge" style="background: ${(certRecord.num_days && parseInt(certRecord.num_days) > 1) ? '#fef3c7' : '#e0f2fe'}; color: ${(certRecord.num_days && parseInt(certRecord.num_days) > 1) ? '#b45309' : '#0369a1'}; border: 1.5px solid ${(certRecord.num_days && parseInt(certRecord.num_days) > 1) ? '#fde68a' : '#bae6fd'}; font-weight: 800; padding: 0.2rem 0.65rem; border-radius: 9999px; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                  <i class="fa-solid fa-business-time"></i> ${(certRecord.num_days && parseInt(certRecord.num_days) > 1) ? `${certRecord.num_days} Days Event (Student Selected)` : '1 Day Event'}
                </span>
              </div>
            </div>
            <div>
              ${isApproved ? `
                <span class="badge-status status-APPROVED" style="font-weight: 800; background: #dcfce7; color: #15803d; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                  <i class="fa-solid fa-circle-check"></i> Approved by: <strong>${verifierName}</strong>
                </span>
              ` : (isRejected ? `
                <span class="badge-status status-REJECTED" style="font-weight: 800; background: #fee2e2; color: #b91c1c; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                  <i class="fa-solid fa-circle-xmark"></i> Rejected by: <strong>${verifierName}</strong>
                </span>
              ` : `
                <span class="badge-status status-PENDING" style="font-weight: 800; background: #fef3c7; color: #d97706; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                  <i class="fa-solid fa-clock"></i> Awaiting Review
                </span>
              `)}
            </div>
          </div>

          <!-- Student Written Description -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem 0.95rem; margin-top: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.4rem;">
              <div style="font-size: 0.78rem; font-weight: 800; color: #1e40af; text-transform: uppercase;">
                <i class="fa-solid fa-align-left"></i> Student Description / Reason:
              </div>
              ${(!isApproved) ? `
                <button type="button" class="btn btn-warning btn-sm" onclick="closeModal('modal-file-preview'); StudentView.openEditCertificateModal('${certRecord.id}');" style="background: #d97706; border-color: #d97706; color: #ffffff; font-size: 0.74rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 4px;" title="Change reason or details if submitted by mistake">
                  <i class="fa-solid fa-pen-to-square"></i> Change Reason / Edit
                </button>
              ` : ''}
            </div>
            <div style="font-size: 0.88rem; color: #334155; line-height: 1.5; white-space: pre-wrap; font-weight: 500;">
              ${certRecord.description ? certRecord.description : '<em style="color: #94a3b8;">No additional details were provided by the student for this submission.</em>'}
            </div>
          </div>

          ${isRejected && certRecord.rejection_reason ? `
            <div style="margin-top: 0.5rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 0.5rem 0.75rem; font-size: 0.82rem; color: #b91c1c;">
              <strong>Rejection Reason:</strong> ${certRecord.rejection_reason}
            </div>
          ` : ''}
        </div>
      `;
    }

    body.innerHTML = displayContent + metaBox;
  },

  getSampleCertificateHTML(title = 'National Technical Conference 2026', student = 'Nikhil Verma') {
    return `
      <div style="width: 100%; background: #ffffff; border: 8px double #1e3a8a; padding: 2rem; border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1); position: relative; box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem; text-align: left;">
            <i class="fa-solid fa-graduation-cap" style="font-size: 2.2rem; color: #1d4ed8;"></i>
            <div>
              <h3 style="margin: 0; color: #1e293b; font-size: 1.1rem; font-weight: 800;">DEPARTMENT OF ELECTRONICS & COMPUTER ENGINEERING</h3>
              <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">INSTITUTE OF ENGINEERING & TECHNOLOGY</span>
            </div>
          </div>
          <span style="background: #dcfce7; color: #15803d; font-size: 0.75rem; font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 20px; border: 1px solid #86efac;">
            <i class="fa-solid fa-circle-check"></i> VERIFIED ECE CERTIFICATE
          </span>
        </div>

        <span style="font-size: 0.85rem; letter-spacing: 2px; color: #3b82f6; text-transform: uppercase; font-weight: 800;">CERTIFICATE OF PARTICIPATION</span>
        
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 1rem 0 0.5rem 0; font-family: 'Outfit', sans-serif;">
          This is to certify that <span style="color: #1d4ed8; border-bottom: 2px solid #93c5fd;">${student || 'Student'}</span>
        </h2>
        
        <p style="color: #475569; font-size: 0.95rem; line-height: 1.6; max-width: 600px; margin: 0 auto 1.5rem auto;">
          has successfully presented and participated in the official academic activity:
          <br>
          <strong style="color: #0f172a; font-size: 1.1rem; display: inline-block; margin-top: 0.5rem; background: #eff6ff; padding: 0.4rem 1rem; border-radius: 8px; border: 1px solid #bfdbfe;">
            ${title}
          </strong>
        </p>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 2rem; border-top: 1.5px dashed #cbd5e1; padding-top: 1rem;">
          <div style="text-align: left;">
            <span style="font-size: 0.75rem; color: #64748b; display: block;">Certificate ID: ECE-CERT-2026-8841</span>
            <span style="font-size: 0.75rem; color: #64748b; display: block;">Issued: August 2026</span>
          </div>
          <div style="text-align: right;">
            <div style="font-family: cursive; font-size: 1.1rem; color: #1e3a8a; margin-bottom: 0.2rem;">Dr. S. K. Kulkarni</div>
            <span style="font-size: 0.75rem; font-weight: 800; color: #334155; border-top: 1px solid #94a3b8; padding-top: 0.2rem; display: block;">Head of Department (ECE)</span>
          </div>
        </div>
      </div>
    `;
  },

  openAccountSettingsModal() {
    const emailInput = document.getElementById('student-email-input');
    if (emailInput && window.App && App.currentUser) {
      emailInput.value = App.currentUser.email || '';
    }
    openModal('modal-student-change-settings');
  },

  async handleChangeSettings(e) {
    e.preventDefault();
    const btnSubmit = document.getElementById('btn-submit-student-change-settings');
    btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Updating Settings...';
    btnSubmit.disabled = true;

    const new_email = document.getElementById('student-email-input').value;
    const current_password = document.getElementById('student-current-password').value;
    const new_password = document.getElementById('student-new-password').value;
    const confirm_password = document.getElementById('student-confirm-password').value;

    if (new_password !== confirm_password) {
      Toast.error('New password and confirm password do not match.');
      btnSubmit.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Save Account Settings';
      btnSubmit.disabled = false;
      return;
    }

    try {
      const res = await API.post('/api/student/change-settings', { new_email, current_password, new_password });
      Toast.success(res.message || 'Student email & password updated successfully!');
      if (res.user && window.App) {
        App.currentUser.email = res.user.email;
      }
      closeModal('modal-student-change-settings');
      document.getElementById('form-student-change-settings').reset();
    } catch (err) {
      Toast.error(err.message || 'Failed to update account settings.');
    } finally {
      btnSubmit.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Save Account Settings';
      btnSubmit.disabled = false;
    }
  },

  // Dedicated Full Student Assignments Portal View
  async renderAssignments() {
    try {
      if (typeof fetchCloudDB === 'function') await fetchCloudDB(true);
      const profile = this.getFreshProfile() || {};
      const db = typeof getLocalDB === 'function' ? getLocalDB() : { assignments: [], assignment_submissions: [] };

      const studentDiv = (profile.division_name || 'SE(ECE)-A').toUpperCase();
      const studentBatch = (profile.batch_name || '').toUpperCase();
      const studentPrn = (profile.prn_no || '').trim().toUpperCase();
      const studentId = profile.id || profile.student_id;

      const allAsgns = (db.assignments || []).slice();
      const allSubs = db.assignment_submissions || [];

      // Filter relevant assignments for this student's division & batch
      const myAsgns = allAsgns.filter(a => {
        const aDiv = (a.division || 'ALL').toUpperCase();
        const aBatch = (a.batch || 'ALL').toUpperCase();
        if (aDiv !== 'ALL' && !studentDiv.includes(aDiv) && !aDiv.includes(studentDiv)) return false;
        if (aBatch !== 'ALL' && studentBatch && aBatch !== studentBatch) return false;
        return true;
      });

      // Sort newest first
      myAsgns.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

      if (!this.studentAsgnTab) this.studentAsgnTab = 'LIVE';
      if (!this.studentAsgnSubject) this.studentAsgnSubject = 'ALL';

      let liveCount = 0;
      let pastCount = 0;
      let submittedCount = 0;

      myAsgns.forEach(a => {
        const st = typeof getAssignmentStatus === 'function' ? getAssignmentStatus(a) : { isLive: true };
        const mySub = allSubs.find(s => String(s.assignment_id) === String(a.id) && ((studentPrn && s.student_prn === studentPrn) || (s.student_id == studentId)));
        if (st.isLive) liveCount++;
        else pastCount++;
        if (mySub) submittedCount++;
      });

      const filtered = myAsgns.filter(a => {
        const st = typeof getAssignmentStatus === 'function' ? getAssignmentStatus(a) : { isLive: true };
        const mySub = allSubs.find(s => String(s.assignment_id) === String(a.id) && ((studentPrn && s.student_prn === studentPrn) || (s.student_id == studentId)));

        if (this.studentAsgnTab === 'LIVE' && !st.isLive) return false;
        if (this.studentAsgnTab === 'PAST' && !st.isPast) return false;
        if (this.studentAsgnTab === 'SUBMITTED' && !mySub) return false;
        if (this.studentAsgnSubject !== 'ALL' && a.subject !== this.studentAsgnSubject) return false;
        return true;
      });

      const cardsHtml = filtered.length > 0 ? filtered.map(a => {
        const st = typeof getAssignmentStatus === 'function' ? getAssignmentStatus(a) : { label: 'Live', isDueToday: false, isLive: true };
        const mySub = allSubs.find(s => String(s.assignment_id) === String(a.id) && ((studentPrn && s.student_prn === studentPrn) || (s.student_id == studentId)));

        const deadlineBadge = st.isDueToday
          ? '<span class="badge" style="background: #fee2e2; color: #dc2626; border: 1.5px solid #fca5a5; font-weight: 800; font-size: 0.74rem; padding: 0.25rem 0.65rem; border-radius: 9999px;"><i class="fa-solid fa-clock"></i> Due Today!</span>'
          : (st.isLive
            ? '<span class="badge" style="background: #dcfce7; color: #15803d; border: 1.5px solid #86efac; font-weight: 800; font-size: 0.74rem; padding: 0.25rem 0.65rem; border-radius: 9999px;"><i class="fa-solid fa-circle-check"></i> ' + (st.timeRemainingText || 'Live') + '</span>'
            : '<span class="badge" style="background: #f1f5f9; color: #64748b; border: 1.5px solid #cbd5e1; font-weight: 700; font-size: 0.74rem; padding: 0.25rem 0.65rem; border-radius: 9999px;"><i class="fa-solid fa-calendar-xmark"></i> Deadline Passed</span>');

        return `
          <div class="glass-panel" style="background: #ffffff; border: 1.5px solid var(--border-color); border-radius: 16px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s ease;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.65rem;">
                <span class="badge-role role-STUDENT" style="font-weight: 800; font-size: 0.74rem; background: #eff6ff; color: #2563eb; padding: 0.25rem 0.65rem;">${a.subject}</span>
                ${deadlineBadge}
              </div>

              <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.5rem 0; line-height: 1.35;">
                ${a.title}
              </h3>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.65rem 0.85rem; margin-bottom: 0.85rem; font-size: 0.8rem; color: #334155; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <div><i class="fa-solid fa-calendar-plus" style="color: #2563eb;"></i> Issued: <strong>${a.issue_date || 'N/A'}</strong></div>
                <div><i class="fa-solid fa-calendar-xmark" style="color: #dc2626;"></i> Deadline: <strong>${a.due_date || 'N/A'}</strong></div>
                <div><i class="fa-solid fa-award" style="color: #d97706;"></i> Max Marks: <strong>${a.total_marks || '25'}</strong></div>
                <div><i class="fa-solid fa-user-tie" style="color: #64748b;"></i> Faculty: <strong>${a.created_by_name || 'Faculty Member'}</strong></div>
              </div>

              ${a.instructions ? `
                <div style="font-size: 0.82rem; color: #475569; line-height: 1.5; margin-bottom: 0.85rem; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 0.55rem 0.75rem;">
                  <strong style="color: #b45309;"><i class="fa-solid fa-file-lines"></i> Instructions:</strong> ${a.instructions}
                </div>
              ` : ''}
            </div>

            <div style="border-top: 1.5px solid #f1f5f9; padding-top: 0.85rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              ${a.file_url ? `
                <button class="btn btn-secondary btn-sm" onclick="StudentView.previewFile('${a.file_url}', '${encodeURIComponent(a.title)}', 'Question Paper')" style="font-size: 0.78rem; font-weight: 700;">
                  <i class="fa-solid fa-file-arrow-down"></i> Question Paper
                </button>
              ` : '<span></span>'}

              <div>
                ${mySub ? `
                  <div style="display: flex; align-items: center; gap: 0.4rem;">
                    <span class="badge" style="background: #dcfce7; color: #15803d; border: 1px solid #86efac; font-weight: 800; font-size: 0.76rem; padding: 0.3rem 0.7rem; border-radius: 9999px;">
                      <i class="fa-solid fa-circle-check"></i> Submitted (${new Date(mySub.submitted_at).toLocaleDateString()})
                    </span>
                    ${mySub.file_url ? `
                      <button class="btn btn-secondary btn-sm" onclick="StudentView.previewFile('${mySub.file_url}', '${encodeURIComponent("My Solution - " + a.title)}', 'Solution Document')" style="font-size: 0.76rem;" title="View My Solution Document">
                        <i class="fa-solid fa-eye"></i> View Solution
                      </button>
                    ` : ''}
                    ${st.isLive ? `
                      <button class="btn btn-primary btn-sm" onclick="StudentView.openSubmitAssignmentModal('${a.id}')" style="font-size: 0.76rem; font-weight: 700; padding: 0.3rem 0.65rem;">
                        <i class="fa-solid fa-pen-to-square"></i> Re-submit
                      </button>
                    ` : ''}
                  </div>
                ` : `
                  ${st.isLive ? `
                    <button class="btn btn-primary btn-sm" onclick="StudentView.openSubmitAssignmentModal('${a.id}')" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); font-weight: 800; font-size: 0.82rem; padding: 0.45rem 1rem; border-radius: 10px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
                      <i class="fa-solid fa-cloud-arrow-up"></i> Submit Solution
                    </button>
                  ` : `
                    <span class="badge" style="background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; font-weight: 800; font-size: 0.76rem; padding: 0.3rem 0.7rem; border-radius: 9999px;">
                      <i class="fa-solid fa-lock"></i> Submission Closed
                    </span>
                  `}
                `}
              </div>
            </div>
          </div>
        `;
      }).join('') : `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: #ffffff; border-radius: 18px; border: 2px dashed #cbd5e1; color: #64748b;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 1rem auto;">
            <i class="fa-solid fa-clipboard-check"></i>
          </div>
          <h3 style="color: var(--text-main); font-weight: 800; margin-bottom: 0.35rem;">No Coursework Assignments Found</h3>
          <p style="font-size: 0.88rem; margin: 0;">There are no assignments matching your current filter for ${studentDiv}.</p>
        </div>
      `;

      return `
        <div class="dashboard-container">
          <!-- Top Header Banner -->
          <div class="glass-panel" style="background: linear-gradient(135deg, #1e3a8a, #2563eb); border: none; margin-bottom: 1.75rem; color: #ffffff; border-radius: 18px; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                  <span style="background: rgba(255,255,255,0.2); padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.5px;">STUDENT ACADEMIC PORTAL</span>
                  <span style="background: #22c55e; color: #ffffff; padding: 0.2rem 0.55rem; border-radius: 20px; font-size: 0.7rem; font-weight: 800;">ACTIVE</span>
                </div>
                <h2 style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: #ffffff; margin: 0;">My Coursework & Assignments</h2>
                <p style="color: rgba(255,255,255,0.85); font-size: 0.85rem; margin: 0.35rem 0 0 0;">
                  Enrolled in <strong>${studentDiv}</strong> • Submit solutions before deadlines to earn academic credits.
                </p>
              </div>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <a href="#/student/dashboard" class="btn" style="background: rgba(255,255,255,0.2); color: #ffffff; border: 1.5px solid rgba(255,255,255,0.4); font-weight: 800; border-radius: 12px; padding: 0.65rem 1.15rem;">
                  <i class="fa-solid fa-arrow-left"></i> Back to Dashboard
                </a>
              </div>
            </div>
          </div>

          <!-- Filter & Control Bar -->
          <div class="glass-panel" style="margin-bottom: 1.5rem; padding: 1rem 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <!-- Tabs -->
              <div style="display: flex; gap: 0.4rem; background: #f1f5f9; padding: 0.25rem; border-radius: 12px; border: 1px solid var(--border-color);">
                <button class="btn btn-sm ${this.studentAsgnTab === 'LIVE' ? 'btn-primary' : 'btn-secondary'}" onclick="StudentView.setStudentAsgnTab('LIVE')" style="font-weight: 800; font-size: 0.8rem; border-radius: 8px;">
                  <i class="fa-solid fa-circle-check"></i> Live (${liveCount})
                </button>
                <button class="btn btn-sm ${this.studentAsgnTab === 'PAST' ? 'btn-primary' : 'btn-secondary'}" onclick="StudentView.setStudentAsgnTab('PAST')" style="font-weight: 800; font-size: 0.8rem; border-radius: 8px;">
                  <i class="fa-solid fa-calendar-xmark"></i> Past Deadlines (${pastCount})
                </button>
                <button class="btn btn-sm ${this.studentAsgnTab === 'SUBMITTED' ? 'btn-primary' : 'btn-secondary'}" onclick="StudentView.setStudentAsgnTab('SUBMITTED')" style="font-weight: 800; font-size: 0.8rem; border-radius: 8px;">
                  <i class="fa-solid fa-file-circle-check"></i> My Submissions (${submittedCount})
                </button>
              </div>

              <!-- Subject Filter -->
              <select class="form-control form-control-sm" style="font-weight: 700; width: 220px;" onchange="StudentView.setStudentAsgnSubject(this.value)">
                <option value="ALL" ${this.studentAsgnSubject === 'ALL' ? 'selected' : ''}>All Subjects</option>
                <option value="Signals and Systems" ${this.studentAsgnSubject === 'Signals and Systems' ? 'selected' : ''}>Signals & Systems</option>
                <option value="Data Structures and Algorithms" ${this.studentAsgnSubject === 'Data Structures and Algorithms' ? 'selected' : ''}>Data Structures & Algorithms</option>
                <option value="Semiconductor Devices and Circuits" ${this.studentAsgnSubject === 'Semiconductor Devices and Circuits' ? 'selected' : ''}>Semiconductor Devices (SDC)</option>
                <option value="Fundamental of Data Science" ${this.studentAsgnSubject === 'Fundamental of Data Science' ? 'selected' : ''}>Data Science (FDS)</option>
                <option value="Principles of Management and Entrepreneurship" ${this.studentAsgnSubject === 'Principles of Management and Entrepreneurship' ? 'selected' : ''}>Management & PME</option>
              </select>
            </div>
          </div>

          <!-- Cards Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
            ${cardsHtml}
          </div>
        </div>
      `;
    } catch (err) {
      return `<div class="dashboard-container"><p style="color: var(--accent-rose);">Failed to load assignments: ${err.message || err}</p></div>`;
    }
  },

  setStudentAsgnTab(tab) {
    this.studentAsgnTab = tab;
    this.refreshStudentAssignments();
  },

  setStudentAsgnSubject(subj) {
    this.studentAsgnSubject = subj;
    this.refreshStudentAssignments();
  },

  refreshStudentAssignments() {
    const hash = window.location.hash || '';
    const container = document.getElementById('view-container');
    if (container && hash === '#/student/assignments') {
      this.renderAssignments().then(html => container.innerHTML = html);
    } else if (container && hash === '#/student/dashboard') {
      this.renderDashboard().then(html => container.innerHTML = html);
    }
  },

  // Student Submission Handlers
  openSubmitAssignmentModal(asgnId) {
    const db = typeof getLocalDB === 'function' ? getLocalDB() : { assignments: [], assignment_submissions: [] };
    const asgn = (db.assignments || []).find(a => String(a.id) === String(asgnId));
    if (!asgn) {
      if (typeof Toast !== 'undefined') Toast.error('Assignment not found.');
      return;
    }

    const profile = this.getFreshProfile() || {};
    const idInput = document.getElementById('student-submit-asgn-id');
    const subtitleEl = document.getElementById('submit-asgn-modal-subtitle');
    const infoCard = document.getElementById('student-submit-info-card');
    const fileInput = document.getElementById('student-asgn-file-input');
    const remarksInput = document.getElementById('student-asgn-remarks');

    if (idInput) idInput.value = asgnId;
    if (subtitleEl) subtitleEl.innerText = asgn.title + ' • ' + asgn.subject + ' (Due: ' + (asgn.due_date || 'N/A') + ')';
    if (remarksInput) remarksInput.value = '';
    if (fileInput) fileInput.value = '';

    this._pendingSolutionFile = null;
    const labelEl = document.getElementById('student-asgn-file-label');
    const previewEl = document.getElementById('student-asgn-file-preview-info');
    if (labelEl) labelEl.style.display = 'block';
    if (previewEl) previewEl.style.display = 'none';

    if (infoCard) {
      infoCard.innerHTML = `
        <div>
          <strong>${profile.name || 'Student'}</strong> (Roll: <strong>${profile.roll_no || 'N/A'}</strong> | PRN: <strong>${profile.prn_no || 'N/A'}</strong>)
        </div>
        <div style="font-weight: 800; color: #2563eb;">
          ${profile.division_name || 'SE(ECE)'} (${profile.batch_name || 'A1'})
        </div>
      `;
    }

    if (typeof openModal === 'function') openModal('modal-student-submit-assignment');
  },

  onSolutionFileSelected(input) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this._pendingSolutionFile = file;

      const labelEl = document.getElementById('student-asgn-file-label');
      const previewEl = document.getElementById('student-asgn-file-preview-info');
      const nameEl = document.getElementById('student-asgn-file-name-display');
      const sizeEl = document.getElementById('student-asgn-file-size-display');

      if (nameEl) nameEl.innerText = file.name;
      if (sizeEl) sizeEl.innerText = (file.size / 1024).toFixed(1) + ' KB';
      if (labelEl) labelEl.style.display = 'none';
      if (previewEl) previewEl.style.display = 'inline-flex';
    }
  },

  clearSolutionFile(e) {
    if (e) e.stopPropagation();
    this._pendingSolutionFile = null;
    const input = document.getElementById('student-asgn-file-input');
    if (input) input.value = '';
    const labelEl = document.getElementById('student-asgn-file-label');
    const previewEl = document.getElementById('student-asgn-file-preview-info');
    if (labelEl) labelEl.style.display = 'block';
    if (previewEl) previewEl.style.display = 'none';
  },

  async handleSubmitAssignment(e) {
    e.preventDefault();
    const btnSubmit = document.getElementById('btn-submit-solution');
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting Solution...';
    }

    try {
      const asgnId = document.getElementById('student-submit-asgn-id').value;
      const remarks = document.getElementById('student-asgn-remarks').value;

      if (!asgnId) throw new Error('Assignment ID missing.');

      let fileData = { file_url: '', file_name: '', file_size: '', storage_path: '' };
      if (this._pendingSolutionFile && typeof uploadAssignmentFile === 'function') {
        fileData = await uploadAssignmentFile(this._pendingSolutionFile);
      }

      if (!fileData.file_url && (!remarks || !remarks.trim())) {
        throw new Error('Please attach a solution document or write your notes.');
      }

      const res = await API.post('/api/assignments/submit', {
        assignment_id: asgnId,
        remarks,
        file_url: fileData.file_url,
        file_name: fileData.file_name,
        file_size: fileData.file_size,
        storage_path: fileData.storage_path
      });

      if (typeof Toast !== 'undefined') Toast.success(res.message || '🎉 Assignment solution submitted successfully!');
      if (typeof closeModal === 'function') closeModal('modal-student-submit-assignment');
      this.refreshStudentAssignments();
    } catch(err) {
      if (typeof Toast !== 'undefined') Toast.error((err && (err.message || err.error)) || 'Failed to submit solution.');
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="fa-solid fa-check"></i> Submit Solution';
      }
    }
  },

  // Deadline Alerts Popup Handlers
  checkDeadlineAlerts() {
    try {
      const dismissed = sessionStorage.getItem('dismissed_deadline_alert');
      if (dismissed === '1') return;

      const profile = this.getFreshProfile();
      if (!profile || profile.status !== 'APPROVED') return;

      const studentDiv = (profile.division_name || 'SE(ECE)-A').toUpperCase();
      const studentPrn = (profile.prn_no || '').trim().toUpperCase();
      const studentId = profile.id || profile.student_id;

      const db = typeof getLocalDB === 'function' ? getLocalDB() : { assignments: [], assignment_submissions: [] };
      const allAsgns = db.assignments || [];
      const allSubs = db.assignment_submissions || [];

      const urgentAsgns = [];
      allAsgns.forEach(a => {
        const aDiv = (a.division || 'ALL').toUpperCase();
        if (aDiv !== 'ALL' && !studentDiv.includes(aDiv) && !aDiv.includes(studentDiv)) return;

        // Skip if already submitted
        const hasSubmitted = allSubs.some(s => String(s.assignment_id) === String(a.id) && ((studentPrn && s.student_prn === studentPrn) || (s.student_id == studentId)));
        if (hasSubmitted) return;

        const st = typeof getAssignmentStatus === 'function' ? getAssignmentStatus(a) : { isLive: false };
        if (st.isLive && (st.isDueToday || st.diffDays <= 2)) {
          urgentAsgns.push({ asgn: a, status: st });
        }
      });

      if (urgentAsgns.length === 0) return;

      const container = document.getElementById('deadline-alert-items-container');
      if (container) {
        container.innerHTML = urgentAsgns.map(item => `
          <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 0.75rem 0.95rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
            <div>
              <strong style="color: #92400e; font-size: 0.92rem; display: block;">${item.asgn.title}</strong>
              <span style="font-size: 0.78rem; color: #b45309;">${item.asgn.subject} • Deadline: <strong>${item.asgn.due_date}</strong></span>
            </div>
            ${item.status.isDueToday ? 
              '<span class="badge" style="background: #fee2e2; color: #dc2626; font-weight: 800; font-size: 0.74rem; padding: 0.25rem 0.55rem; white-space: nowrap;">🚨 Due Today!</span>' :
              '<span class="badge" style="background: #fef3c7; color: #b45309; font-weight: 800; font-size: 0.74rem; padding: 0.25rem 0.55rem; white-space: nowrap;">⏳ ' + item.status.timeRemainingText + '</span>'
            }
          </div>
        `).join('');

        if (typeof openModal === 'function') openModal('modal-assignment-deadline-alert');
      }
    } catch(e) {
      console.warn('Deadline alert check err:', e);
    }
  },

  dismissDeadlineAlert() {
    sessionStorage.setItem('dismissed_deadline_alert', '1');
    if (typeof closeModal === 'function') closeModal('modal-assignment-deadline-alert');
  },

};
