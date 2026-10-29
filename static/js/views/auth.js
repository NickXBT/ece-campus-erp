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
        <!-- Top Institutional Brand Header -->
        <div style="display: flex; flex-direction: column; gap: 0.65rem; z-index: 2;">
          <!-- Institution Pill -->
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: #eff6ff; border: 1.2px solid #bfdbfe; color: #1d4ed8; font-size: 0.72rem; font-weight: 800; padding: 0.35rem 0.9rem; border-radius: 9999px; letter-spacing: 0.6px; text-transform: uppercase; width: fit-content; box-shadow: 0 2px 6px rgba(37, 99, 235, 0.08);">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #2563eb; box-shadow: 0 0 6px #2563eb;"></span>
            <span>Nutan Maharashtra Institute of Engineering &amp; Technology (NMIET)</span>
          </div>

          <!-- Hero Brand Title -->
          <div style="display: flex; align-items: center; gap: 0.85rem; margin-top: 0.15rem;">
            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #1d4ed8, #2563eb); color: #ffffff; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.55rem; box-shadow: 0 8px 20px rgba(29, 78, 216, 0.3); flex-shrink: 0; border: 1.5px solid rgba(255, 255, 255, 0.25);">
              <i class="fa-solid fa-microchip"></i>
            </div>
            <div>
              <h1 style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 900; color: #0f172a; line-height: 1.1; letter-spacing: -0.5px; margin: 0;">
                ECE ERP
              </h1>
              <span style="font-size: 0.8rem; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 1.1px;">
                Department of Electronics &amp; Computer Engineering
              </span>
            </div>
          </div>

          <p style="color: #475569; font-size: 0.84rem; line-height: 1.5; margin: 0.1rem 0 0 0; max-width: 520px;">
            The central institutional academic gateway for automated certificate evaluation, lecture attendance credit compensation, and division roster administration.
          </p>
        </div>

        <!-- Center Animated ECE Silicon & Architecture Centerpiece (Enlarged & High-Visibility Typography) -->
        <div class="ece-hero-interactive-centerpiece" style="margin: 0.75rem 0; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; z-index: 2;">
          <style>
            @keyframes ecePulseSlow {
              0%, 100% { transform: scale(1); opacity: 0.96; filter: drop-shadow(0 0 20px rgba(37, 99, 235, 0.35)); }
              50% { transform: scale(1.03); opacity: 1; filter: drop-shadow(0 0 34px rgba(37, 99, 235, 0.6)); }
            }
            @keyframes eceDashFlow {
              0% { stroke-dashoffset: 90; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes eceDashFlowRev {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 90; }
            }
            @keyframes eceFloatCard1 {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            @keyframes eceFloatCard2 {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(8px); }
            }
            @keyframes eceSignalPulse {
              0%, 100% { r: 4; opacity: 0.45; }
              50% { r: 7; opacity: 1; filter: drop-shadow(0 0 12px #38bdf8); }
            }
          </style>

          <div style="width: 100%; max-width: 580px; position: relative; padding: 0.5rem 0;">
            <!-- Floating Badge Left (Attendance Credit) -->
            <div style="position: absolute; top: -5px; left: -8px; z-index: 4; animation: eceFloatCard1 4s ease-in-out infinite; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(14px); border: 1.8px solid #bfdbfe; border-radius: 16px; padding: 0.55rem 1rem; box-shadow: 0 14px 30px -6px rgba(37, 99, 235, 0.2); display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 36px; height: 36px; border-radius: 12px; background: linear-gradient(135deg, #eff6ff, #dbeafe); color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; border: 1.5px solid #bfdbfe; flex-shrink: 0; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);">
                <i class="fa-solid fa-award"></i>
              </div>
              <div>
                <div style="font-size: 0.86rem; font-weight: 850; color: #1e3a8a; line-height: 1.2;">Attendance Credit</div>
                <div style="font-size: 0.76rem; font-weight: 750; color: #16a34a; display: flex; align-items: center; gap: 0.35rem; margin-top: 0.1rem;">
                  <span style="width: 7px; height: 7px; border-radius: 50%; background: #16a34a; display: inline-block; box-shadow: 0 0 6px #16a34a;"></span> 100% Automated
                </div>
              </div>
            </div>

            <!-- Floating Badge Right (HOD Approval) -->
            <div style="position: absolute; top: 5px; right: -8px; z-index: 4; animation: eceFloatCard2 4.5s ease-in-out infinite; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(14px); border: 1.8px solid #bbf7d0; border-radius: 16px; padding: 0.55rem 1rem; box-shadow: 0 14px 30px -6px rgba(22, 163, 74, 0.2); display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 36px; height: 36px; border-radius: 12px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; border: 1.5px solid #bbf7d0; flex-shrink: 0; box-shadow: 0 2px 8px rgba(22, 163, 74, 0.15);">
                <i class="fa-solid fa-signature"></i>
              </div>
              <div>
                <div style="font-size: 0.86rem; font-weight: 850; color: #166534; line-height: 1.2;">HOD Signature</div>
                <div style="font-size: 0.76rem; font-weight: 750; color: #2563eb; display: flex; align-items: center; gap: 0.35rem; margin-top: 0.1rem;">
                  <i class="fa-solid fa-bolt" style="font-size: 0.7rem;"></i> Instant Approval
                </div>
              </div>
            </div>

            <!-- Central Animated ECE Circuit & Microchip SVG (Enlarged Proportions) -->
            <svg viewBox="0 0 520 215" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; max-height: clamp(160px, 25vh, 230px); filter: drop-shadow(0 14px 36px rgba(37, 99, 235, 0.14));">
              <defs>
                <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#1e3a8a" />
                  <stop offset="45%" stop-color="#1d4ed8" />
                  <stop offset="100%" stop-color="#2563eb" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#f59e0b" />
                  <stop offset="100%" stop-color="#fbbf24" />
                </linearGradient>
              </defs>

              <!-- Radial Ambient Glow Behind Silicon -->
              <circle cx="260" cy="108" r="105" fill="#3b82f6" opacity="0.12" />

              <!-- Circuit Traces Left -->
              <path d="M 45 35 L 135 35 L 178 78 L 202 78" stroke="#93c5fd" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="6 4" style="animation: eceDashFlow 2s linear infinite;" />
              <path d="M 25 108 L 145 108 L 182 108 L 202 108" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 5" style="animation: eceDashFlow 1.6s linear infinite;" />
              <path d="M 55 180 L 145 180 L 182 135 L 202 135" stroke="#93c5fd" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="6 4" style="animation: eceDashFlow 2.2s linear infinite;" />

              <!-- Circuit Traces Right -->
              <path d="M 475 35 L 385 35 L 342 78 L 318 78" stroke="#93c5fd" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="6 4" style="animation: eceDashFlowRev 2s linear infinite;" />
              <path d="M 495 108 L 375 108 L 338 108 L 318 108" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 5" style="animation: eceDashFlowRev 1.6s linear infinite;" />
              <path d="M 465 180 L 375 180 L 338 135 L 318 135" stroke="#93c5fd" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="6 4" style="animation: eceDashFlowRev 2.2s linear infinite;" />

              <!-- Glowing Circuit Connection Nodes -->
              <circle cx="45" cy="35" r="5" fill="#2563eb" style="animation: eceSignalPulse 2.5s ease-in-out infinite;" />
              <circle cx="25" cy="108" r="5.5" fill="#38bdf8" style="animation: eceSignalPulse 2s ease-in-out infinite 0.5s;" />
              <circle cx="55" cy="180" r="5" fill="#2563eb" style="animation: eceSignalPulse 2.2s ease-in-out infinite 0.9s;" />

              <circle cx="475" cy="35" r="5" fill="#2563eb" style="animation: eceSignalPulse 2.5s ease-in-out infinite 0.3s;" />
              <circle cx="495" cy="108" r="5.5" fill="#38bdf8" style="animation: eceSignalPulse 2s ease-in-out infinite 0.7s;" />
              <circle cx="465" cy="180" r="5" fill="#2563eb" style="animation: eceSignalPulse 2.2s ease-in-out infinite 1.1s;" />

              <!-- Microchip Lead Pins -->
              <g stroke="#cbd5e1" stroke-width="3.2" stroke-linecap="round">
                <!-- Top Pins -->
                <line x1="222" y1="56" x2="222" y2="42" />
                <line x1="239" y1="56" x2="239" y2="42" />
                <line x1="260" y1="56" x2="260" y2="38" stroke="#3b82f6" />
                <line x1="281" y1="56" x2="281" y2="42" />
                <line x1="298" y1="56" x2="298" y2="42" />
                <!-- Bottom Pins -->
                <line x1="222" y1="156" x2="222" y2="170" />
                <line x1="239" y1="156" x2="239" y2="170" />
                <line x1="260" y1="156" x2="260" y2="174" stroke="#3b82f6" />
                <line x1="281" y1="156" x2="281" y2="170" />
                <line x1="298" y1="156" x2="298" y2="170" />
                <!-- Left Pins -->
                <line x1="202" y1="78" x2="188" y2="78" stroke="#2563eb" />
                <line x1="202" y1="93" x2="188" y2="93" />
                <line x1="202" y1="108" x2="185" y2="108" stroke="#3b82f6" />
                <line x1="202" y1="123" x2="188" y2="123" />
                <line x1="202" y1="138" x2="188" y2="138" stroke="#2563eb" />
                <!-- Right Pins -->
                <line x1="318" y1="78" x2="332" y2="78" stroke="#2563eb" />
                <line x1="318" y1="93" x2="332" y2="93" />
                <line x1="318" y1="108" x2="335" y2="108" stroke="#3b82f6" />
                <line x1="318" y1="123" x2="332" y2="123" />
                <line x1="318" y1="138" x2="332" y2="138" stroke="#2563eb" />
              </g>

              <!-- Central Microprocessor Unit (Chip Body - Enlarged) -->
              <g style="animation: ecePulseSlow 4s ease-in-out infinite; transform-origin: 260px 108px;">
                <!-- Outer Carrier Package -->
                <rect x="202" y="56" width="116" height="100" rx="18" fill="#0f172a" stroke="#3b82f6" stroke-width="2.8" />
                
                <!-- Silicon Die Internal Core -->
                <rect x="214" y="67" width="92" height="78" rx="12" fill="url(#chipGrad)" stroke="#60a5fa" stroke-width="1.8" />

                <!-- Silicon Wafer Microgrid Lines -->
                <path d="M 225 67 L 225 145 M 242 67 L 242 145 M 260 67 L 260 145 M 278 67 L 278 145 M 295 67 L 295 145" stroke="rgba(255,255,255,0.16)" stroke-width="1" />
                <path d="M 214 82 L 306 82 M 214 97 L 306 97 M 214 112 L 306 112 M 214 127 L 306 127" stroke="rgba(255,255,255,0.16)" stroke-width="1" />

                <!-- Gold Corner Accent Marks -->
                <circle cx="221" cy="74" r="3.2" fill="url(#goldGrad)" />
                <circle cx="299" cy="74" r="3.2" fill="url(#goldGrad)" />
                <circle cx="221" cy="138" r="3.2" fill="url(#goldGrad)" />
                <circle cx="299" cy="138" r="3.2" fill="url(#goldGrad)" />

                <!-- Central Microchip Emblem -->
                <rect x="235" y="83" width="50" height="46" rx="9" fill="#0f172a" stroke="#93c5fd" stroke-width="1.5" />
                
                <!-- Microchip CPU Labels (Bigger & Bolder Text) -->
                <text x="260" y="102" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">ECE</text>
                <text x="260" y="117" font-family="system-ui, -apple-system, sans-serif" font-weight="850" font-size="9" fill="#60a5fa" text-anchor="middle" letter-spacing="0.8">NMIET</text>

                <!-- Status LED on Chip -->
                <circle cx="260" cy="133" r="2.6" fill="#4ade80" />
              </g>
            </svg>

            <!-- Floating Badge Bottom (Campus Database Sync) -->
            <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); z-index: 4; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(14px); border: 1.8px solid #e2e8f0; border-radius: 30px; padding: 0.4rem 1.25rem; box-shadow: 0 8px 22px rgba(0, 0, 0, 0.07); display: flex; align-items: center; gap: 0.6rem; white-space: nowrap;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 10px #22c55e; display: inline-block;"></span>
              <span style="font-size: 0.82rem; font-weight: 850; color: #1e3a8a;">Division A &amp; B Academic Ledger Active</span>
              <span style="color: #cbd5e1;">&bull;</span>
              <span style="font-size: 0.76rem; font-weight: 750; color: #64748b;">AY 2025–2026</span>
            </div>
          </div>
        </div>

                <!-- Institutional Footer -->
        <div style="border-top: 1.2px solid #e2e8f0; padding-top: 0.55rem; display: flex; align-items: center; justify-content: space-between; z-index: 2;">
          <span style="font-size: 0.76rem; font-weight: 700; color: #64748b; display: flex; align-items: center; gap: 0.4rem;">
            <i class="fa-solid fa-building-columns" style="color: #2563eb;"></i> NMIET Dept. of Electronics &amp; Computer Engineering
          </span>
          <span style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 0.7rem; font-weight: 800; padding: 0.22rem 0.65rem; border-radius: 20px;">
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
            <div style="width: 100%; max-width: 440px; display: flex; flex-direction: column; align-items: center;">
              <div class="login-card">
                <!-- Premium Header -->
                <div style="text-align: center; margin-bottom: 0.85rem;">
                  <div class="brand-icon" style="margin: 0 auto 0.45rem; width: 44px; height: 44px; font-size: 1.35rem; border-radius: 12px; background: linear-gradient(135deg, #eff6ff, #dbeafe); color: #2563eb; border: 1.5px solid #bfdbfe; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.15);">
                    <i class="fa-solid fa-microchip"></i>
                  </div>
                  <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 900; color: var(--text-main); line-height: 1.15; margin: 0; letter-spacing: -0.3px;">Sign In to ECE ERP</h2>
                  <p style="color: var(--text-muted); font-size: 0.75rem; margin: 0.2rem 0 0 0; font-weight: 500;">Official Student &amp; Faculty Academic Portal</p>
                </div>

                <!-- Auth Mode Toggle Tabs (Sign In / Sign Up) -->
                <div style="display: flex; background: #f1f5f9; padding: 0.25rem; border-radius: 12px; margin-bottom: 0.75rem; border: 1px solid var(--border-color); gap: 0.25rem;">
                  <button type="button" class="btn btn-primary btn-sm" style="flex: 1; justify-content: center; font-size: 0.78rem; font-weight: 800; padding: 0.45rem 0.35rem; border-radius: 9px;" onclick="AuthView.switchTab('login')">
                    <i class="fa-solid fa-right-to-bracket"></i> Sign In
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm" style="flex: 1; justify-content: center; font-size: 0.78rem; font-weight: 700; border: none; background: transparent; color: var(--text-muted); padding: 0.45rem 0.35rem; border-radius: 9px;" onclick="AuthView.switchTab('register')">
                    <i class="fa-solid fa-user-plus"></i> Student Sign Up
                  </button>
                </div>

                <!-- Strict Login Section Selection Tabs -->
                <div style="margin-bottom: 0.75rem; background: #f8fafc; border: 1.5px solid var(--border-color); padding: 0.65rem 0.75rem; border-radius: 14px;">
                  <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.6px; color: #1e3a8a; font-weight: 800; margin-bottom: 0.45rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.25rem;">
                    <span><i class="fa-solid fa-layer-group" style="color: #2563eb;"></i> Select Login Section:</span>
                    <span id="login-section-badge" style="background: #2563eb; color: #ffffff; font-size: 0.64rem; padding: 0.14rem 0.5rem; border-radius: 20px; font-weight: 800;">STRICT ENFORCEMENT</span>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;">
                      <!-- Div A Button -->
                      <button type="button" id="btn-login-option-a" onclick="AuthView.selectLoginPortal('DIV_A')"
                        style="padding: 0.52rem 0.35rem; border-radius: 10px; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.35rem; ${ selectedPortal === 'DIV_A' ? 'background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; border: 1.8px solid #1e40af; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);' : 'background: #ffffff; color: var(--text-main); border: 1.5px solid var(--border-color);' }">
                        <i class="fa-solid ${ selectedPortal === 'DIV_A' ? 'fa-circle-check' : 'fa-circle-user' }"></i>
                        <span>Division A</span>
                      </button>

                      <!-- Div B Button -->
                      <button type="button" id="btn-login-option-b" onclick="AuthView.selectLoginPortal('DIV_B')"
                        style="padding: 0.52rem 0.35rem; border-radius: 10px; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.35rem; ${ selectedPortal === 'DIV_B' ? 'background: linear-gradient(135deg, #d97706, #b45309); color: #ffffff; border: 1.8px solid #92400e; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);' : 'background: #ffffff; color: var(--text-main); border: 1.5px solid var(--border-color);' }">
                        <i class="fa-solid ${ selectedPortal === 'DIV_B' ? 'fa-circle-check' : 'fa-circle-user' }"></i>
                        <span>Division B</span>
                      </button>
                    </div>

                    <!-- HOD Button -->
                    <button type="button" id="btn-login-option-hod" onclick="AuthView.selectLoginPortal('HOD')"
                      style="padding: 0.52rem 0.35rem; border-radius: 10px; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.4rem; ${ selectedPortal === 'HOD' ? 'background: linear-gradient(135deg, #16a34a, #15803d); color: #ffffff; border: 1.8px solid #166534; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.35);' : 'background: #ffffff; color: var(--text-main); border: 1.5px solid var(--border-color);' }">
                      <i class="fa-solid ${ selectedPortal === 'HOD' ? 'fa-shield-halved' : 'fa-chalkboard-user' }"></i>
                      <span>HOD &amp; Faculty Portal</span>
                    </button>
                  </div>

                  <!-- Live Notice Indicator -->
                  <div id="login-section-notice" style="margin-top: 0.4rem; font-size: 0.72rem; font-weight: 700; text-align: center; border-radius: 8px; padding: 0.32rem 0.5rem; transition: all 0.3s ease; ${
                    selectedPortal === 'DIV_A' ? 'background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af;' :
                    (selectedPortal === 'DIV_B' ? 'background: #fffbeb; border: 1px solid #fde68a; color: #b45309;' :
                    'background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;')
                  }">
                    ${
                      selectedPortal === 'DIV_A' ? '<i class="fa-solid fa-lock"></i> Strict Section: <strong>Division A Student</strong>' :
                      (selectedPortal === 'DIV_B' ? '<i class="fa-solid fa-lock"></i> Strict Section: <strong>Division B Student</strong>' :
                      '<i class="fa-solid fa-shield-halved"></i> Strict Section: <strong>HOD &amp; Faculty Desk</strong>')
                    }
                  </div>
                </div>

                <!-- Pre-Enrolled Student Guidance Banner -->
                <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1.5px solid #93c5fd; border-radius: 12px; padding: 0.5rem 0.75rem; margin-bottom: 0.75rem; font-size: 0.76rem; color: #1e3a8a; line-height: 1.4; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
                  <div style="display: flex; align-items: center; gap: 0.45rem;">
                    <i class="fa-solid fa-key" style="color: #2563eb; font-size: 0.85rem;"></i>
                    <span>Default Pass: <strong>Student@123</strong> (Enter PRN)</span>
                  </div>
                  <button type="button" onclick="openModal('modal-first-time-guide')" style="background: #ffffff; color: #1d4ed8; border: 1.2px solid #93c5fd; font-size: 0.7rem; font-weight: 800; padding: 0.22rem 0.55rem; border-radius: 7px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <span>5-Step Guide</span> <i class="fa-solid fa-arrow-right" style="font-size: 0.6rem;"></i>
                  </button>
                </div>

                <form id="form-login" onsubmit="AuthView.handleLogin(event)">
                  <div class="form-group" style="margin-bottom: 0.65rem;">
                    <label style="font-size: 0.78rem; font-weight: 700; margin-bottom: 0.25rem;"><i class="fa-solid fa-user-tag" style="color: var(--primary);"></i> PRN Number / Email</label>
                    <input type="text" id="login-email" class="form-control" placeholder="e.g. U251H001 or registered email" required value="" style="padding: 0.55rem 0.75rem; font-size: 0.86rem; border-radius: 10px;">
                  </div>

                  <div class="form-group" style="margin-bottom: 0.65rem;">
                    <label style="font-size: 0.78rem; font-weight: 700; margin-bottom: 0.25rem;"><i class="fa-solid fa-lock" style="color: var(--primary);"></i> Password</label>
                    <div class="password-toggle-group">
                      <input type="password" id="login-password" class="form-control" placeholder="Enter password" required value="" style="padding: 0.55rem 0.75rem; font-size: 0.86rem; border-radius: 10px;">
                      <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('login-password', this)" title="Show/Hide Password">
                        <i class="fa-solid fa-eye"></i>
                      </button>
                    </div>
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-size: 0.8rem;">
                    <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer; color: var(--text-muted); font-weight: 600;">
                      <input type="checkbox" checked> Remember Me
                    </label>
                    <a href="javascript:void(0)" style="font-weight: 700; color: var(--primary);" onclick="AuthView.switchTab('forgot')">Forgot Password?</a>
                  </div>

                  <button type="submit" id="btn-login-submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.72rem; font-size: 0.9rem; font-weight: 800; border-radius: 12px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);">
                    Sign In to Portal <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </form>
              </div>

              <!-- Sleek Floating Legal & Help Bar -->
              ${this.renderAuthFooter()}
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
          <div class="login-card-wrap" style="flex-direction: column;">
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
            ${this.renderAuthFooter()}
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
          <div class="login-card-wrap" style="flex-direction: column;">
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
            ${this.renderAuthFooter()}
          </div>
        </div>
      </div>
    `;
  },



  renderAuthFooter() {
    return `
      <div class="auth-app-footer" style="margin-top: 0.75rem; text-align: center; font-family: var(--font-body); width: 100%;">
        <!-- Quick App Help & Legal Bar -->
        <div style="background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(8px); border: 1.2px solid #e2e8f0; border-radius: 14px; padding: 0.45rem 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.65rem; flex-wrap: wrap; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03); margin-bottom: 0.45rem;">
          <button type="button" onclick="openModal('modal-first-time-guide')" style="background: none; border: none; color: #2563eb; font-weight: 800; font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.15rem 0.3rem;">
            <i class="fa-solid fa-compass"></i> <span>First-Time Guide</span>
          </button>
          <span style="color: #cbd5e1; font-size: 0.8rem;">•</span>
          <button type="button" onclick="openModal('modal-terms-conditions')" style="background: none; border: none; color: #475569; font-weight: 700; font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.15rem 0.3rem;">
            <i class="fa-solid fa-file-contract"></i> <span>Terms &amp; Conditions</span>
          </button>
          <span style="color: #cbd5e1; font-size: 0.8rem;">•</span>
          <button type="button" onclick="openModal('modal-privacy-policy')" style="background: none; border: none; color: #475569; font-weight: 700; font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.15rem 0.3rem;">
            <i class="fa-solid fa-shield-halved"></i> <span>Privacy Policy</span>
          </button>
        </div>

        <!-- Official Department Attribution -->
        <div style="font-size: 0.7rem; color: #94a3b8; line-height: 1.35; font-weight: 600;">
          <span>&copy; 2026 Nutan Maharashtra Institute of Engineering &amp; Technology (NMIET)</span> &bull; 
          <span style="color: #64748b; font-weight: 700;">Department of ECE</span>
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

      const personName = (res.user && res.user.name) || (res.profile && res.profile.name) || (meData.profile && meData.profile.name) || 'User';
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
      let errMsg = err ? (err.message || err.error || (typeof err === 'string' ? err : 'Login Failed')) : 'Login Failed';
      const isNet = (!navigator.onLine) || (typeof errMsg === 'string' && (
        errMsg.toLowerCase().includes('failed to fetch') ||
        errMsg.toLowerCase().includes('networkerror') ||
        errMsg.toLowerCase().includes('load failed') ||
        errMsg.toLowerCase().includes('network error')
      ));
      if (isNet) {
        Toast.error('Network Error', 'Please check your internet connection and try again.');
      } else {
        Toast.error(errMsg);
      }
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
