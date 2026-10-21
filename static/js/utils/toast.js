/* Toast Notification & Premium Popup Controller */
const Toast = {
  // Mapping of standard message keys to clean title, description, and status types
  presets: {
    'Login Successful': { title: 'Login Successful', desc: 'Welcome back! You have successfully signed in.', type: 'success' },
    'Login Failed': { title: 'Login Failed', desc: 'Please check your credentials and try again.', type: 'error' },
    'Profile Updated': { title: 'Profile Updated', desc: 'Your profile has been updated successfully.', type: 'success' },
    'Saved Successfully': { title: 'Saved Successfully', desc: 'Your changes have been saved successfully.', type: 'success' },
    'Updated Successfully': { title: 'Updated Successfully', desc: 'Your information has been updated successfully.', type: 'success' },
    'Certificate Uploaded': { title: 'Certificate Uploaded', desc: 'Your certificate has been uploaded successfully.', type: 'success' },
    'Certificate Deleted': { title: 'Certificate Deleted', desc: 'The certificate has been deleted successfully.', type: 'success' },
    'Password Changed Successfully': { title: 'Password Changed Successfully', desc: 'Your account is now secure.', type: 'success' },
    
    'Something Went Wrong': { title: 'Something Went Wrong', desc: 'Please try again.', type: 'error' },
    'Upload Failed': { title: 'Upload Failed', desc: "We couldn't upload your certificate. Please try again.", type: 'error' },
    'Unable to Load Data': { title: 'Unable to Load Data', desc: 'Please try again in a moment.', type: 'error' },
    
    'No Internet Connection': { title: 'No Internet Connection', desc: 'Please check your connection and try again.', type: 'warning' },
    'Server Unavailable': { title: 'Server Unavailable', desc: 'Please try again in a moment.', type: 'warning' },
    'Request Timed Out': { title: 'Request Timed Out', desc: 'Please try again.', type: 'warning' },

    'Signing In...': { title: 'Signing in...', desc: 'Verifying your credentials...', type: 'loading' },
    'Signing in...': { title: 'Signing in...', desc: 'Verifying your credentials...', type: 'loading' },
    'Uploading...': { title: 'Uploading...', desc: 'Transferring your file securely...', type: 'loading' },
    'Saving...': { title: 'Saving...', desc: 'Updating backend records...', type: 'loading' },
    'Deleting...': { title: 'Deleting...', desc: 'Removing requested record...', type: 'loading' },
    'Processing...': { title: 'Processing...', desc: 'Completing operation...', type: 'loading' }
  },

  show(titleOrMsg, descOrType = '', type = 'info', customDuration = null) {
    const container = document.getElementById('toast-container');
    if (!container) return null;

    let finalTitle = titleOrMsg || 'Notification';
    let finalDesc = '';
    let finalType = type;

    if (typeof descOrType === 'string' && ['success', 'error', 'warning', 'info', 'loading'].includes(descOrType)) {
      finalType = descOrType;
    } else if (descOrType && typeof descOrType === 'string') {
      finalDesc = descOrType;
    }

    // Match preset title and description if string exists in preset registry
    if (this.presets[titleOrMsg]) {
      const p = this.presets[titleOrMsg];
      finalTitle = p.title;
      finalDesc = finalDesc || p.desc;
      finalType = p.type;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${finalType}`;

    let icon = 'fa-circle-info';
    if (finalType === 'success') icon = 'fa-circle-check';
    if (finalType === 'error') icon = 'fa-circle-xmark';
    if (finalType === 'warning') icon = 'fa-triangle-exclamation';
    if (finalType === 'loading') icon = 'fa-circle-notch fa-spin';

    toast.innerHTML = `
      <div class="toast-icon-wrap">
        <i class="fa-solid ${icon}"></i>
      </div>
      <div class="toast-body">
        <div class="toast-title">${finalTitle}</div>
        ${finalDesc ? `<div class="toast-desc">${finalDesc}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()" title="Close">&times;</button>
    `;

    container.appendChild(toast);

    toast.dismiss = () => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px) scale(0.95)';
        setTimeout(() => toast.remove(), 250);
      }
    };

    toast.update = (newTitle, newDesc = '', newType = null) => {
      const titleEl = toast.querySelector('.toast-title');
      let descEl = toast.querySelector('.toast-desc');
      const iconEl = toast.querySelector('.toast-icon-wrap i');
      
      if (titleEl && newTitle) titleEl.innerText = newTitle;
      
      if (descEl) {
        if (newDesc) descEl.innerText = newDesc;
        else if (newDesc === '') descEl.remove();
      } else if (newDesc) {
        const bodyEl = toast.querySelector('.toast-body');
        if (bodyEl) {
          descEl = document.createElement('div');
          descEl.className = 'toast-desc';
          descEl.innerText = newDesc;
          bodyEl.appendChild(descEl);
        }
      }

      if (newType) {
        toast.className = `toast toast-${newType}`;
        let newIcon = 'fa-circle-info';
        if (newType === 'success') newIcon = 'fa-circle-check';
        if (newType === 'error') newIcon = 'fa-circle-xmark';
        if (newType === 'warning') newIcon = 'fa-triangle-exclamation';
        if (newType === 'loading') newIcon = 'fa-circle-notch fa-spin';
        if (iconEl) iconEl.className = `fa-solid ${newIcon}`;
      }
    };

    // Duration: 0 means persistent (never auto-closes until explicitly dismissed)
    const duration = (customDuration !== null) ? customDuration : (finalType === 'loading' ? 8000 : 4000);
    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss();
      }, duration);
    }

    return toast;
  },

  success(title, desc = '') { return this.show(title, desc, 'success'); },
  error(title, desc = '') { return this.show(title, desc, 'error'); },
  info(title, desc = '') { return this.show(title, desc, 'info'); },
  warning(title, desc = '') { return this.show(title, desc, 'warning'); },
  loading(title, desc = '') { return this.show(title, desc, 'loading'); },
  persistent(title, desc = '', type = 'loading') { return this.show(title, desc, type, 0); }
};

window.Toast = Toast;
window.showToast = function(msg, type = 'info') {
  if (type === 'success') return Toast.success(msg);
  if (type === 'error') return Toast.error(msg);
  if (type === 'warning') return Toast.warning(msg);
  if (type === 'loading') return Toast.loading(msg);
  return Toast.show(msg, '', type);
};

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}
