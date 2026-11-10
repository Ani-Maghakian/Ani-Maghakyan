// Never store form content in browser storage, query strings or analytics.
(() => {
  document.querySelectorAll('form[data-business-inquiry]').forEach(form => {
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-status');
    let pending = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (pending || !form.reportValidity()) return;
      const data = new FormData(form);
      if (data.get('bot-field') || data.get('policy-accepted') !== 'accepted') return;
      pending = true;
      const label = button.textContent;
      button.disabled = true;
      button.textContent = form.dataset.sending;
      status.textContent = '';
      form.setAttribute('aria-busy', 'true');
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString(),
        });
        if (!response.ok) throw new Error('Submission failed');
        status.textContent = form.dataset.success;
        form.reset();
        document.dispatchEvent(new CustomEvent('business-inquiry:submitted'));
        // Keep disabled after success to prevent accidental duplicate leads.
      } catch {
        status.textContent = form.dataset.error;
        button.disabled = false;
        pending = false;
      } finally {
        form.removeAttribute('aria-busy');
        button.textContent = label;
        status.focus();
      }
    });
  });
})();
