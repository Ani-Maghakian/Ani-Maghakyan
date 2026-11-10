const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const businessFormCopy = {
  hy: {
    title: 'Գործնական համագործակցություն (Պրոդյուսերների և ստուդիաների համար)',
    warning: 'Ուշադրություն․ Maghakian Scripts-ը չի ընդունում և չի դիտարկում չհրապարակված սցենարներ, սյուժետային գաղափարներ կամ սինոփսիսներ։ Խնդրում ենք չուղարկել ստեղծագործական մտահղացումներ։ Չպահանջված ստեղծագործական նյութերը, սյուժեներն ու գաղափարները ենթակա չեն դիտարկման, և դրանց ուղարկումը չի ստեղծում որևէ հեղինակային, գաղտնիության կամ համագործակցության պարտավորություն հեղինակի և Maghakian Scripts-ի համար։ Այս ձևաչափը միայն արտադրական պատվերների տեխնիկական քննարկման համար է։',
    company: 'Ընկերություն / Ստուդիա / Հարթակ', contact: 'Կոնտակտային անձ', email: 'Էլ. փոստ', service: 'Ծառայության ձևաչափը', choose: 'Ընտրեք ծառայությունը',
    services: ['Սերիալի մշակում', 'Շոուռանինգ', 'Սցենարագրություն'], description: 'Գործնական նկարագրություն',
    placeholder: 'Նշեք միայն ձևաչափը, սերիաների քանակը և ժամկետները։ Մի՛ ուղարկեք սյուժեի նկարագրություն',
    consent: 'Հաստատում եմ, որ հաղորդագրությունը չի պարունակում սցենար կամ ստեղծագործական գաղափար, և ընդունում եմ չպահանջված նյութերի քաղաքականությունը',
    privacy: 'Տվյալները պահվում են Netlify Forms-ում՝ ձեր գործնական հարցմանը պատասխանելու համար։ Ֆայլեր չեն ընդունվում։',
    send: 'Ուղարկել գործնական հարցումը', sending: 'Ուղարկվում է…', success: 'Շնորհակալություն։ Ձեր գործնական հարցումն ուղարկված է։', error: 'Հարցումը չուղարկվեց։ Փորձեք կրկին կամ կապվեք էլ. փոստով։',
  },
  en: {
    title: 'Business collaboration (for producers and studios)',
    warning: 'Please note: Maghakian Scripts does not accept or review unpublished scripts, story ideas or synopses. Please do not send creative concepts. Unsolicited creative materials, plots and ideas are not considered, and sending them creates no copyright, confidentiality or collaboration obligation for the author or Maghakian Scripts. This form is solely for technical discussions of production commissions.',
    company: 'Company / Studio / Platform', contact: 'Contact person', email: 'Email', service: 'Service format', choose: 'Select a service',
    services: ['Series development', 'Showrunning', 'Screenwriting'], description: 'Business description',
    placeholder: 'Include only the format, episode count and deadlines. Do not send a plot description.',
    consent: 'I confirm that this message contains no script or creative idea, and I accept the unsolicited materials policy.',
    privacy: 'Details are stored in Netlify Forms to respond to your business inquiry. Attachments are not accepted.',
    send: 'Send business inquiry', sending: 'Sending…', success: 'Thank you. Your business inquiry has been submitted.', error: 'Your inquiry could not be sent. Please try again or contact us by email.',
  },
  ru: {
    title: 'Деловое сотрудничество (для продюсеров и студий)',
    warning: 'Внимание: Maghakian Scripts не принимает и не рассматривает неопубликованные сценарии, сюжетные идеи и синопсисы. Пожалуйста, не отправляйте творческие замыслы. Незапрошенные творческие материалы, сюжеты и идеи не подлежат рассмотрению, а их отправка не создаёт для автора и Maghakian Scripts обязательств в отношении авторских прав, конфиденциальности или сотрудничества. Форма предназначена только для технического обсуждения производственных заказов.',
    company: 'Компания / Студия / Платформа', contact: 'Контактное лицо', email: 'Электронная почта', service: 'Формат услуги', choose: 'Выберите услугу',
    services: ['Разработка сериала', 'Шоураннинг', 'Написание сценария'], description: 'Деловое описание',
    placeholder: 'Укажите только формат, количество серий и сроки. Не отправляйте описание сюжета.',
    consent: 'Подтверждаю, что сообщение не содержит сценария или творческой идеи, и принимаю политику в отношении незапрошенных материалов.',
    privacy: 'Данные сохраняются в Netlify Forms для ответа на ваш деловой запрос. Файлы не принимаются.',
    send: 'Отправить деловой запрос', sending: 'Отправка…', success: 'Спасибо. Ваш деловой запрос отправлен.', error: 'Не удалось отправить запрос. Попробуйте ещё раз или свяжитесь с нами по электронной почте.',
  },
};
export function businessForm(locale, basePath = '') {
  const t = businessFormCopy[locale];
  return `<section class="business-inquiry" aria-labelledby="business-inquiry-title"><h2 id="business-inquiry-title">${esc(t.title)}</h2><div class="materials-policy" id="materials-policy"><p>${esc(t.warning)}</p></div>
<form name="business-inquiry-${locale}" method="POST" action="${basePath}/" data-netlify="true" netlify-honeypot="bot-field" data-business-inquiry data-locale="${locale}" data-sending="${esc(t.sending)}" data-success="${esc(t.success)}" data-error="${esc(t.error)}" aria-describedby="materials-policy form-privacy">
<input type="hidden" name="form-name" value="business-inquiry-${locale}"><input type="hidden" name="policy-version" value="2026-11-10"><p hidden><label>Leave empty<input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<div class="business-form-grid"><label>${esc(t.company)}<input name="company" autocomplete="organization" maxlength="160" required></label><label>${esc(t.contact)}<input name="contact-person" autocomplete="name" maxlength="120" required></label><label>${esc(t.email)}<input type="email" name="email" autocomplete="email" maxlength="254" required></label><label>${esc(t.service)}<select name="service" required><option value="">${esc(t.choose)}</option>${['series-development','showrunning','screenwriting'].map((value, i) => `<option value="${value}">${esc(t.services[i])}</option>`).join('')}</select></label></div>
<label>${esc(t.description)}<textarea name="business-description" rows="4" maxlength="1200" placeholder="${esc(t.placeholder)}" required></textarea></label>
<label class="policy-consent"><input type="checkbox" name="policy-accepted" value="accepted" required aria-describedby="materials-policy"><span>${esc(t.consent)}</span></label><p class="form-privacy" id="form-privacy">${esc(t.privacy)}</p><button type="submit">${esc(t.send)}</button><p class="form-status" role="status" aria-live="polite" tabindex="-1"></p></form></section>`;
}
