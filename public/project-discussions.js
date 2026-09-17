(() => {
  'use strict';
  // No visitor text is stored in localStorage, analytics, URLs, or HTML markup.
  const locale = document.documentElement.lang.toLowerCase().split('-')[0];
  const copyLabels = {
    hy: ['Email-ը պատճենված է։', 'Ընտրեք և պատճենեք ցուցադրված հասցեն։'],
    en: ['Email copied.', 'Select and copy the displayed address.'],
    ru: ['Email скопирован.', 'Выделите и скопируйте указанный адрес.']
  }[locale] || ['Email copied.', 'Select and copy the displayed address.'];
  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', async () => {
      const status = button.closest('[data-discussion-contact]').querySelector('[data-copy-status]');
      try {
        await navigator.clipboard.writeText('maghaqyan@gmail.com');
        status.textContent = copyLabels[0];
      } catch { status.textContent = copyLabels[1]; }
    });
  });
  document.querySelectorAll('[data-project-discussion][data-enabled="true"]').forEach(init);

  function init(root) {
    const text = (key) => root.getAttribute('data-text-' + key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())) || key;
    const form = root.querySelector('[data-discussion-form]');
    const list = root.querySelector('[data-discussion-list]');
    const status = root.querySelector('[data-discussion-status]');
    const sendStatus = root.querySelector('[data-discussion-send-status]');
    const retry = root.querySelector('[data-discussion-retry]');
    const more = root.querySelector('[data-discussion-more]');
    const cancel = root.querySelector('[data-cancel-reply]');
    const replyContext = root.querySelector('[data-reply-context]');
    const submit = form.querySelector('[type="submit"]');
    const rows = new Map();
    let cursor = '';
    let replyTo = null;
    let requestId = null;
    let busy = false;
    let loading = false;
    form.hidden = false;

    async function api(method, payload) {
      const url = new URL(root.dataset.endpoint);
      if (method === 'GET') {
        url.searchParams.set('project', root.dataset.project);
        if (cursor) url.searchParams.set('after', cursor);
      }
      const response = await fetch(url, {
        method, credentials: 'omit', cache: 'no-store',
        headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {},
        body: method === 'POST' ? JSON.stringify(payload) : undefined,
        signal: AbortSignal.timeout(15000)
      });
      let value;
      try { value = await response.json(); } catch { throw new Error('invalid_response'); }
      if (!response.ok) {
        const error = new Error(value.error || 'request_failed');
        error.status = response.status;
        throw error;
      }
      return value;
    }

    function render() {
      list.replaceChildren();
      const roots = new Map();
      const ordered = [...rows.values()];
      for (const row of ordered.filter((item) => !item.parent_id)) {
        const article = makeComment(row, true);
        const replies = document.createElement('div');
        replies.className = 'discussion-replies';
        article.append(replies);
        list.append(article);
        roots.set(row.id, replies);
      }
      for (const row of ordered.filter((item) => item.parent_id)) {
        const parent = roots.get(row.parent_id);
        // A parent can be removed by moderation between paginated requests.
        if (parent) parent.append(makeComment(row, false));
      }
    }

    function makeComment(row, allowReply) {
      const article = document.createElement('article');
      article.className = 'discussion-comment';
      article.id = 'comment-' + row.id;
      const header = document.createElement('header');
      const name = document.createElement('strong');
      name.textContent = row.author_name;
      const date = document.createElement('time');
      date.dateTime = row.published_at;
      date.textContent = new Intl.DateTimeFormat(root.dataset.locale, { dateStyle: 'medium' }).format(new Date(row.published_at));
      const body = document.createElement('p');
      body.lang = row.language;
      body.textContent = row.body;
      header.append(name, date);
      article.append(header, body);
      if (allowReply) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = text('reply');
        button.addEventListener('click', () => {
          replyTo = row.id;
          requestId = null;
          replyContext.textContent = text('replying') + ' ' + row.author_name;
          replyContext.hidden = cancel.hidden = false;
          form.elements.body.focus();
        });
        article.append(button);
      }
      return article;
    }

    async function load(reset = false) {
      if (loading) return;
      loading = true;
      if (reset) { cursor = ''; rows.clear(); }
      retry.hidden = true;
      more.disabled = true;
      status.textContent = text('loading');
      try {
        const value = await api('GET');
        if (!Array.isArray(value.items)) throw new Error('invalid_response');
        for (const item of value.items) rows.set(item.id, item);
        cursor = value.next_cursor || '';
        render();
        more.hidden = !cursor;
        status.textContent = rows.size ? '' : text('empty');
      } catch {
        status.textContent = text('loadError');
        retry.hidden = false;
      } finally {
        loading = false;
        more.disabled = false;
      }
    }
    retry.addEventListener('click', () => load(true));
    more.addEventListener('click', () => load());
    cancel.addEventListener('click', () => {
      replyTo = requestId = null;
      replyContext.hidden = cancel.hidden = true;
    });
    form.addEventListener('input', () => { if (!busy) requestId = null; });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (busy || !form.reportValidity()) return;
      const author = form.elements.author.value.trim();
      const body = form.elements.body.value.trim();
      if (author.length < 2 || body.length < 5 || !form.elements.consent.checked) {
        sendStatus.textContent = text('invalid'); return;
      }
      if (!requestId) requestId = crypto.randomUUID();
      busy = true;
      submit.disabled = true;
      sendStatus.textContent = '';
      // Freeze the submitted snapshot to make retry/idempotency unambiguous.
      const controls = [...form.elements];
      controls.forEach((control) => { control.disabled = true; });
      try {
        const result = await api('POST', {
          project: root.dataset.project, author, body, language: root.dataset.locale,
          parent_id: replyTo, request_id: requestId, consent: true,
          website: form.elements.website.value
        });
        if (result.status !== 'pending') throw new Error('invalid_response');
        form.reset();
        requestId = replyTo = null;
        replyContext.hidden = cancel.hidden = true;
        sendStatus.textContent = text('queued');
        // Never add an unapproved submission to the public list.
      } catch (error) {
        sendStatus.textContent = text(error.status === 429 ? 'rate' : error.status === 400 ? 'invalid' : 'sendError');
      } finally {
        busy = false;
        controls.forEach((control) => { control.disabled = false; });
      }
    });
    load();
  }
})();
