/** Shared build-time contract. Visitor text is never interpolated into HTML. */
export const discussionCopy = {
  hy: {
    heading: 'Քննարկում և կարծիքներ', discuss: 'Քննարկել',
    intro: 'Ի՞նչ տպավորություն թողեց այս աշխատանքը։ Կիսվեք ձեր կարծիքով։',
    name: 'Անուն կամ կեղծանուն', body: 'Ձեր կարծիքը', submit: 'Ուղարկել կարծիքը',
    consent: 'Համաձայն եմ, որ իմ նշած անունն ու կարծիքը հրապարակվեն այս նախագծի էջում՝ ստուգումից հետո։',
    notice: 'Կարծիքները հրապարակվում են ստուգումից հետո։ Մի ուղարկեք անձնական տվյալներ կամ չհրապարակված սցենարներ։ Անունները չեն հաստատվում։',
    privacy: 'Կարծիքների մշակման մասին', privacyText: 'Անունը, կարծիքը, լեզուն և ամսաթիվը պահվում են Supabase-ում։ Մինչև հաստատումը դրանք հասանելի են միայն կայքի կառավարիչներին։ Հաստատված կարծիքները երևում են նախագծի բոլոր երեք լեզվային էջերում։ Հեռացման հարցով գրեք՝',
    disabled: 'Մեկնաբանությունների ընդունումը դեռ միացված չէ։ Գործնական առաջարկների համար օգտվեք ստորև նշված email-ից։',
    nojs: 'Կարծիքները կարդալու կամ գրելու համար անհրաժեշտ է JavaScript։',
    loading: 'Կարծիքները բեռնվում են…', empty: 'Հրապարակված կարծիքներ դեռ չկան։',
    loadError: 'Կարծիքները չհաջողվեց բեռնել։ Փորձեք կրկին։', retry: 'Փորձել կրկին',
    queued: 'Ձեր կարծիքն ընդունված է ստուգման։ Այն դեռ հրապարակված չէ։',
    sendError: 'Ուղարկումը չհաջողվեց։ Ձեր գրածը պահպանվել է այս դաշտում։ Փորձեք կրկին։',
    rate: 'Շատ հաճախ եք ուղարկում։ Մի փոքր անց փորձեք կրկին։',
    invalid: 'Ստուգեք անունը, կարծիքը և հրապարակման համաձայնությունը։',
    reply: 'Պատասխանել', replying: 'Պատասխան՝', cancel: 'Չեղարկել պատասխանը', more: 'Ավելին',
    business: 'Համագործակցության առաջարկ ուղարկել', subject: 'Համագործակցության առաջարկ',
    copy: 'Պատճենել email-ը', copied: 'Email-ը պատճենված է։', copyError: 'Ընտրեք և պատճենեք ցուցադրված հասցեն։'
  },
  en: {
    heading: 'Discussion and comments', discuss: 'Discuss',
    intro: 'What did you think of this work? Share your opinion.',
    name: 'Name or pseudonym', body: 'Your comment', submit: 'Submit comment',
    consent: 'I agree to publish my chosen name and comment on this project page after moderation.',
    notice: 'Comments are published after moderation. Do not include personal details or unpublished scripts. Display names are not verified.',
    privacy: 'About comment data', privacyText: 'Your name, comment, language and date are stored in Supabase. Before approval they are available only to site administrators. Approved comments appear on all three language versions of this project. For removal requests, email:',
    disabled: 'Comment submissions are not enabled yet. For business proposals, use the email below.',
    nojs: 'JavaScript is required to read or submit comments.',
    loading: 'Loading comments…', empty: 'There are no published comments yet.',
    loadError: 'Comments could not be loaded. Please try again.', retry: 'Try again',
    queued: 'Your comment was received for moderation. It is not published yet.',
    sendError: 'Submission failed. Your text is still in this field. Please try again.',
    rate: 'Too many submissions. Please try again later.',
    invalid: 'Check your name, comment and publication consent.',
    reply: 'Reply', replying: 'Reply to:', cancel: 'Cancel reply', more: 'Load more',
    business: 'Send a collaboration proposal', subject: 'Collaboration proposal',
    copy: 'Copy email', copied: 'Email copied.', copyError: 'Select and copy the displayed address.'
  },
  ru: {
    heading: 'Обсуждение и отзывы', discuss: 'Обсудить',
    intro: 'Какое впечатление оставила эта работа? Поделитесь мнением.',
    name: 'Имя или псевдоним', body: 'Ваш комментарий', submit: 'Отправить комментарий',
    consent: 'Я согласен на публикацию указанного имени и комментария на странице проекта после модерации.',
    notice: 'Комментарии публикуются после проверки. Не отправляйте личные данные или неопубликованные сценарии. Имена пользователей не проверяются.',
    privacy: 'Об обработке комментариев', privacyText: 'Имя, комментарий, язык и дата хранятся в Supabase. До одобрения они доступны только администраторам сайта. Одобренные комментарии видны на всех трёх языковых страницах проекта. Для удаления напишите:',
    disabled: 'Приём комментариев пока не включён. Для деловых предложений используйте email ниже.',
    nojs: 'Для чтения и отправки комментариев требуется JavaScript.',
    loading: 'Загружаем комментарии…', empty: 'Опубликованных комментариев пока нет.',
    loadError: 'Не удалось загрузить комментарии. Попробуйте ещё раз.', retry: 'Повторить',
    queued: 'Комментарий принят на проверку. Он пока не опубликован.',
    sendError: 'Не удалось отправить комментарий. Текст остался в поле. Попробуйте ещё раз.',
    rate: 'Слишком много отправок. Попробуйте позже.',
    invalid: 'Проверьте имя, комментарий и согласие на публикацию.',
    reply: 'Ответить', replying: 'Ответ для:', cancel: 'Отменить ответ', more: 'Показать ещё',
    business: 'Отправить предложение о сотрудничестве', subject: 'Предложение о сотрудничестве',
    copy: 'Скопировать email', copied: 'Email скопирован.', copyError: 'Выделите и скопируйте указанный адрес.'
  }
};

export function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function validateConfig(config) {
  if (!config || typeof config.enabled !== 'boolean') throw new Error('Set an explicit discussion enabled boolean.');
  if (config.contactEmail !== 'maghaqyan@gmail.com') throw new Error('Public contact must match the owner-approved address.');
  if (config.enabled) {
    let endpoint;
    try { endpoint = new URL(config.endpoint); } catch { throw new Error('A real Supabase function endpoint is required.'); }
    if (endpoint.protocol !== 'https:' || !/^[a-z0-9-]+\.supabase\.co$/.test(endpoint.hostname)
        || endpoint.pathname !== '/functions/v1/project-discussions' || endpoint.search || endpoint.hash
        || endpoint.username || endpoint.password || endpoint.port) {
      throw new Error('Use the HTTPS project-discussions endpoint of the connected Supabase project.');
    }
  }
  return config;
}

export function pageIdentity(relativeFile) {
  const parts = relativeFile.replaceAll('\\', '/').split('/');
  const locale = ['en', 'ru'].includes(parts[0]) ? parts.shift() : 'hy';
  const tail = parts.join('/').replace(/(^|\/)index\.html$/, '').replace(/\/$/, '');
  const match = /^projects\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(tail);
  return { locale, tail, project: match ? match[1] : null };
}

export function mailto(locale, context = '') {
  const text = discussionCopy[locale] || discussionCopy.hy;
  const subject = text.subject + (context ? ` — ${context}` : '');
  return `mailto:maghaqyan@gmail.com?subject=${encodeURIComponent(subject)}`;
}

function contactFragment(locale, context) {
  const t = discussionCopy[locale];
  return `<aside class="discussion-business" data-discussion-contact>
  <a class="discussion-business-action" data-track="contact_email" href="${escapeHtml(mailto(locale, context))}">${escapeHtml(t.business)}</a>
  <div class="discussion-email"><a href="mailto:maghaqyan@gmail.com">maghaqyan@gmail.com</a>
  <button type="button" data-copy-email>${escapeHtml(t.copy)}</button></div>
  <p data-copy-status role="status" aria-live="polite"></p>
</aside>`;
}

export function discussionFragment(project, locale, config) {
  const t = discussionCopy[locale];
  const labels = Object.entries(t).map(([key, value]) => `data-text-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}="${escapeHtml(value)}"`).join(' ');
  const active = config.enabled;
  return `<section id="discussion" class="project-discussion" tabindex="-1" aria-labelledby="discussion-title"
 data-project-discussion data-project="${escapeHtml(project)}" data-locale="${locale}"
 data-enabled="${active}" data-endpoint="${active ? escapeHtml(config.endpoint) : ''}" ${labels}>
<h2 id="discussion-title">${escapeHtml(t.heading)}</h2>
<p>${escapeHtml(t.intro)}</p>
${active ? `<p class="discussion-notice">${escapeHtml(t.notice)}</p>
<details class="discussion-privacy"><summary>${escapeHtml(t.privacy)}</summary><p>${escapeHtml(t.privacyText)} <a href="mailto:maghaqyan@gmail.com">maghaqyan@gmail.com</a></p></details>
<noscript><p>${escapeHtml(t.nojs)}</p></noscript>
<div class="discussion-controls"><p data-discussion-status role="status" aria-live="polite"></p>
<button type="button" data-discussion-retry hidden>${escapeHtml(t.retry)}</button></div>
<div data-discussion-list aria-label="${escapeHtml(t.heading)}"></div>
<button type="button" data-discussion-more hidden>${escapeHtml(t.more)}</button>
<form data-discussion-form hidden>
<p data-reply-context hidden></p><button type="button" data-cancel-reply hidden>${escapeHtml(t.cancel)}</button>
<label for="discussion-name">${escapeHtml(t.name)}</label>
<input id="discussion-name" name="author" type="text" minlength="2" maxlength="60" required autocomplete="nickname">
<label for="discussion-body">${escapeHtml(t.body)}</label>
<textarea id="discussion-body" name="body" minlength="5" maxlength="3000" rows="5" required></textarea>
<div class="discussion-honeypot" aria-hidden="true"><label for="discussion-website">Website</label><input id="discussion-website" name="website" tabindex="-1" autocomplete="off"></div>
<label class="discussion-consent"><input name="consent" type="checkbox" required><span>${escapeHtml(t.consent)}</span></label>
<button type="submit">${escapeHtml(t.submit)}</button>
<p data-discussion-send-status role="status" aria-live="polite"></p>
</form>` : `<p class="discussion-notice">${escapeHtml(t.disabled)}</p>`}
</section>`;
}

/** Only the known generated anchor shapes are changed; scripts stay byte-identical. */
export function integrateHtml(html, relativeFile, config, assetSuffix = '') {
  validateConfig(config);
  if (html.includes('<!-- PROJECT_DISCUSSIONS_V1 -->')) return html;
  const canonical = /<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/i.exec(html)?.[1];
  if (!canonical || !html.includes('</main>')) return html;
  const { locale, project, tail } = pageIdentity(relativeFile);
  const t = discussionCopy[locale];
  const pageUrl = new URL(canonical);
  const rootPath = pageUrl.pathname.slice(0, pageUrl.pathname.length -
    ((locale === 'hy' ? '' : locale + '/') + (tail ? tail + '/' : '')).length);
  if (!rootPath.endsWith('/')) throw new Error(`Cannot derive site asset root: ${canonical}`);
  const title = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1].replace(/<[^>]*>/g, '').trim() || '';
  const businessContext = project || tail.startsWith('services/') ? title : '';
  const emailHref = mailto(locale, businessContext);
  const oldLabels = new Set(['Քննարկել նախագիծը', 'Discuss a project', 'Обсудить проект']);
  // Preserve external sources, viewing URLs, social profile links and language/navigation URLs.
  html = html.split(/(<script\b[\s\S]*?<\/script>)/gi).map((part) => {
    if (/^<script\b/i.test(part)) return part;
    return part.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (full, attributes, contents) => {
      const label = contents.replace(/<[^>]*>/g, '').trim();
      const business = /data-track="contact_(instagram|email)"/.test(attributes);
      if (!business && !oldLabels.has(label)) return full;
      const discuss = !business && Boolean(project);
      let attrs = attributes.replace(/\s(?:href|target|rel|data-track)="[^"]*"/g, '');
      const href = discuss ? '#discussion' : emailHref;
      attrs += ` href="${escapeHtml(href)}" data-track="${discuss ? 'view_discussion' : 'contact_email'}"`;
      return `<a${attrs}>${escapeHtml(discuss ? t.discuss : t.business)}</a>`;
    });
  }).join('');
  const block = '\n<!-- PROJECT_DISCUSSIONS_V1 -->\n' +
    (project ? discussionFragment(project, locale, config) : '') + contactFragment(locale, businessContext) + '\n';
  html = html.replace('</main>', block + '</main>');
  html = html.replace('</head>', `<link rel="stylesheet" href="${rootPath}project-discussions.css${assetSuffix}">\n<script src="${rootPath}project-discussions.js${assetSuffix}" defer></script>\n</head>`);
  return html;
}
