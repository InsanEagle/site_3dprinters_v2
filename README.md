# MVP сайта для изготовления пластиковых деталей

## Запуск

1. Установите `Node.js` 20+.
2. Выполните `npm install`.
3. Скопируйте `.env.example` в `.env.local`.
4. Запустите проект: `npm run dev`.
5. Откройте `http://localhost:3000`.

## Что реализовано

- `Next.js + TypeScript + Tailwind CSS`
- многостраничная структура на `app router`
- общие `Header` / `Footer`
- главная, каталог, категории, товар, услуги, FAQ, контакты, delivery, thanks
- модальное окно заявки и формы на страницах услуг/контактов
- серверная точка входа для заявок: `POST /api/requests`
- реальная доставка заявок через webhook

## Структура проекта

- `app/*` — страницы и layout
- `app/api/requests/route.ts` — серверный endpoint для приема заявок
- `components/shared/request-form.tsx` — клиентская форма со статусами и валидацией
- `data/site.ts` — базовые данные сайта и каталога
- `data/content.ts` — централизованный контент
- `lib/content.ts` — safe-content helpers
- `lib/request-submission.ts` — контракт заявки, серверная валидация и webhook delivery
- `types/index.ts` — общие типы

## Настройка отправки заявок

Для MVP выбран webhook.

Почему webhook:

- не требует отдельной базы и очередей;
- легко подключается к Make, n8n, Zapier, serverless endpoint, CRM или собственному обработчику;
- решение обратимое и не привязывает проект к тяжелой инфраструктуре.

### Env-переменные

Скопируйте `.env.example` в `.env.local` и заполните:

```env
NEXT_PUBLIC_SITE_NAME=Изготовление деталей
REQUESTS_WEBHOOK_URL=https://your-endpoint.example/webhook
REQUESTS_WEBHOOK_TOKEN=
```

Описание:

- `NEXT_PUBLIC_SITE_NAME` — имя сайта в webhook payload.
- `REQUESTS_WEBHOOK_URL` — обязательный URL канала приема заявок.
- `REQUESTS_WEBHOOK_TOKEN` — необязательный bearer token для webhook.

### Формат webhook payload

Сайт отправляет `POST` с `Content-Type: application/json`.

Заголовки:

- `X-Request-Event: request.created`
- `X-Request-Id: <uuid>`
- `Authorization: Bearer <token>` — только если задан `REQUESTS_WEBHOOK_TOKEN`

Тело:

```json
{
  "event": "request.created",
  "requestId": "uuid",
  "createdAt": "2026-04-11T12:00:00.000Z",
  "payload": {
    "source": "contacts-page-form",
    "name": "Иван",
    "contact": "+7 999 000-11-22",
    "brand": "BMW",
    "model": "E39",
    "details": "Нужно изготовить пластиковую деталь по образцу.",
    "productName": "Панель салона под замену"
  },
  "meta": {
    "channel": "webhook",
    "site": "Изготовление деталей"
  }
}
```

## Flow заявки

1. Пользователь отправляет форму из модалки, `/custom`, `/3d-scan` или `/contacts`.
2. На клиенте проходит валидация обязательных полей.
3. Форма отправляет `POST /api/requests`.
4. Сервер повторно валидирует данные.
5. Сервер формирует webhook event и отправляет его на `REQUESTS_WEBHOOK_URL`.
6. Только при `2xx` ответе webhook форма считается успешно отправленной и переводит пользователя на `/thanks`.
7. Если webhook не настроен или вернул ошибку, пользователь получает понятное сообщение без fake-success.

## Что сейчас не поддерживается

- загрузка файлов через сайт пока отключена;
- email/CRM интеграция напрямую не подключена;
- без заполненного `REQUESTS_WEBHOOK_URL` отправка форм недоступна.

## Как проверить интеграцию

### Локальная проверка

1. Поднимите любой тестовый webhook receiver.
2. Укажите его URL в `REQUESTS_WEBHOOK_URL`.
3. Запустите сайт.
4. Отправьте форму с `/contacts` или `/custom`.
5. Убедитесь, что receiver получил JSON payload.
6. Убедитесь, что после `2xx` ответа произошел переход на `/thanks`.

### Проверка ошибок

- Если webhook не задан, API вернет `503 submission_unavailable`.
- Если webhook отвечает не `2xx`, API вернет `502/500`-подобную ошибку на уровне бизнес-логики с сообщением о недоставке.
- Если обязательные поля заполнены неверно, API вернет `400 validation_error`.

## Где менять реальные данные сайта

- `data/site.ts` — контакты, товары, категории
- `data/content.ts` — тексты страниц, формы, CTA, FAQ

## Что еще нужно сделать вручную

- подставить реальный `REQUESTS_WEBHOOK_URL`
- при необходимости задать `REQUESTS_WEBHOOK_TOKEN`
- подключить внешний сценарий обработки webhook:
  - email,
  - Telegram,
  - CRM,
  - Make/n8n/Zapier,
  - собственный backend
- при необходимости реализовать загрузку файлов отдельным безопасным этапом
