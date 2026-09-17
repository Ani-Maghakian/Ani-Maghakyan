import { buildIssueDraft } from './project-discussions-core.js';

// Nothing leaves the page until the visitor follows the explicit GitHub handoff.
for (const root of document.querySelectorAll('[data-project-discussion]')) {
  const form = root.querySelector('[data-discussion-form]');
  if (!form) continue;
  const status = form.querySelector('[data-discussion-send-status]');
  const handoff = form.querySelector('[data-handoff]');
  const link = form.querySelector('[data-github-handoff]');
  const longDraft = form.querySelector('[data-long-draft]');
  const copyField = longDraft.querySelector('textarea');
  const instructions = form.querySelector('[data-handoff-instructions]');
  const replyContext = form.querySelector('[data-reply-context]');
  const cancelReply = form.querySelector('[data-cancel-reply]');
  let parent = '';
  form.hidden = false;

  function resetHandoff() {
    handoff.hidden = true;
    link.removeAttribute('href');
    copyField.value = '';
    status.textContent = '';
  }
  form.addEventListener('input', resetHandoff);
  form.addEventListener('change', resetHandoff);
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-opinion-reply]');
    if (!button || !root.contains(button)) return;
    parent = button.dataset.opinionReply;
    replyContext.textContent = `${root.dataset.textReplying} ${button.dataset.replyName}`;
    replyContext.hidden = false;
    cancelReply.hidden = false;
    resetHandoff();
    form.elements.body.focus();
  });
  cancelReply.addEventListener('click', () => {
    parent = '';
    replyContext.hidden = true;
    cancelReply.hidden = true;
    resetHandoff();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    resetHandoff();
    if (!form.reportValidity()) return;
    try {
      const result = buildIssueDraft({
        repository: root.dataset.repository,
        project: root.dataset.project,
        locale: root.dataset.locale,
        name: form.elements.author.value,
        body: form.elements.body.value,
        parent,
        consent: form.elements.consent.checked,
      });
      link.href = result.url;
      longDraft.hidden = !result.manualCopy;
      copyField.value = result.manualCopy ? result.body : '';
      instructions.textContent = result.manualCopy ? root.dataset.textLongInstructions : root.dataset.textInstructions;
      handoff.hidden = false;
      status.textContent = root.dataset.textReady;
      // Preparation is not submission. Do not reset visitor text or log a lead.
      link.focus();
    } catch {
      status.textContent = root.dataset.textInvalid;
    }
  });
  form.querySelector('[data-copy-draft]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyField.value);
      status.textContent = root.dataset.textDraftCopied;
    } catch {
      copyField.focus();
      copyField.select();
      status.textContent = root.dataset.textCopyDraftError;
    }
  });
}

for (const button of document.querySelectorAll('[data-copy-email]')) {
  button.addEventListener('click', async () => {
    const box = button.closest('[data-discussion-contact]');
    const status = box.querySelector('[data-copy-status]');
    const language = document.documentElement.lang.split('-')[0];
    const labels = {
      hy: ['Email-ը պատճենված է։', 'Ընտրեք և պատճենեք ցուցադրված հասցեն։'],
      en: ['Email copied.', 'Select and copy the displayed address.'],
      ru: ['Email скопирован.', 'Выделите и скопируйте указанный адрес.'],
    }[language] || ['Email copied.', 'Select and copy the displayed address.'];
    try {
      await navigator.clipboard.writeText('maghaqyan@gmail.com');
      status.textContent = labels[0];
    } catch {
      status.textContent = labels[1];
    }
  });
}
