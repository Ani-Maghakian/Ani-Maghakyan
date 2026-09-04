# Ani Maghakyan — SEO MAX v2

Дата: 03.09.2026

Это production-ready SEO-релиз для `Ani-Maghakian/Ani-Maghakyan` без редизайна текущей главной страницы.

## Что делает релиз

- обновляет официальный архив с 46 до 47 проектов;
- добавляет текущий проект 2026 года `Մի գեղեցիկ օր / Mi Gexecik Or`;
- обновляет публичный масштаб до `2 300+` указанных серий;
- усиливает HY / EN / RU title и description;
- расширяет Person schema: occupations, nationality, image, sameAs;
- добавляет Book + FAQ structured data;
- добавляет новые проверенные источники: Oragir, SHANT TV, KinoPoisk, elCinema;
- создаёт 30 самостоятельных индексируемых страниц:
  - 6 проектов × 3 языка = 18;
  - Biography / Press / Books / Work with Ani × 3 языка = 12;
- всего после релиза: 33 основных индексируемых URL;
- каждая новая страница получает canonical, hreflang HY/EN/RU/x-default, JSON-LD, H1, внутренние ссылки и evidence/source section;
- главные HY/EN/RU страницы автоматически получают видимую внутреннюю перелинковку на новые страницы;
- sitemap автоматически расширяется;
- IndexNow после деплоя отправляет все 30 новых URL;
- CI проверяет существование новых страниц, canonical, hreflang, JSON-LD и sitemap;
- генерируется `llms.txt` только как дополнительный discovery-файл, не как заявленный ranking factor;
- в `docs/SEO-OPERATING-SYSTEM.md` сохраняется стратегия: аудитория, семантика, конкуренты, PR, KPI и сценарии роста.

## Проверки, выполненные до упаковки

- `node --check` — установщик: PASS
- `node --check` — data/generator/IndexNow scripts: PASS
- механическое применение patch к тестовой структуре текущего repo: PASS
- генерация standalone pages: PASS
- создано 30 новых страниц + 3 home = 33 HTML pages: PASS
- sitemap содержит новые URL: PASS
- внутренние ссылки на homepage: PASS
- JSON-LD на project page: PASS

## Применение

Из корня репозитория:

```bash
node /path/to/ani-seo-max-v2/apply-seo-max-v2.mjs
npm test
```

После зелёного CI изменения можно коммитить в `main`. GitHub Pages workflow пересоберёт сайт и отправит старые + новые URL через IndexNow.

## Что не делает релиз

- не покупает ссылки;
- не создаёт fake reviews;
- не добавляет hidden text;
- не создаёт сотни doorway pages;
- не выдаёт неподтверждённые awards/claims;
- не скрывает расхождения между официальным авторским архивом и внешними базами.

## Внешние account-level шаги

Google Search Console, Bing Webmaster Tools и Yandex Webmaster требуют доступ владельца к соответствующим аккаунтам. В repo уже предусмотрены verification env hooks и IndexNow. Количественный baseline запросов/кликов нельзя честно заполнить до подключения Search Console.
