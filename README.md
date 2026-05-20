# MVP сайта для изготовления пластиковых деталей

## Запуск

1. Установите `Node.js` 20+.
2. Выполните `npm install`.
3. Скопируйте `.env.example` в `.env.local`.
4. Запустите проект: `npm run dev`.
5. Откройте `http://localhost:3000`.

## Что сейчас реализовано

- `Next.js + TypeScript + Tailwind CSS`
- многостраничная структура на `App Router`
- публичные страницы: главная, каталог, категории, товар, услуги, FAQ, контакты, delivery, about, thanks
- каталог с поиском и фильтрацией по категории
- карточки товаров и product pages
- формы заявок с клиентской и серверной валидацией
- загрузка изображений в заявке
- серверный endpoint для заявок: `POST /api/requests`
- корзина и короткий checkout без онлайн-оплаты
- серверный endpoint для заказов: `POST /api/orders`
- внутренний backoffice заказов
- внутренний inbox заявок
- публичная защищенная страница статуса заказа
- Playwright smoke-suite для ключевых сценариев

## Основные директории

- `app/*` — страницы, layout и API routes
- `app/api/requests/route.ts` — прием заявок
- `app/api/orders/route.ts` — прием заказов
- `components/shared/request-form.tsx` — единая форма заявки
- `components/cart/*` — корзина и checkout
- `data/site.ts` — каталог, категории, товарные данные
- `data/content.ts` — централизованный контент
- `lib/request-submission.ts` — контракт и валидация заявки
- `lib/requests-store.ts` — файловое хранение заявок
- `lib/order-submission.ts` — контракт и валидация заказа
- `lib/orders-store.ts` — файловое хранение заказов
- `tests/qa.spec.ts` — текущий smoke-suite

## Env-переменные

Скопируйте `.env.example` в `.env.local` и заполните нужные значения:

```env
NEXT_PUBLIC_SITE_NAME=Изготовление деталей
NEXT_PUBLIC_SITE_URL=https://example.com
REQUESTS_WEBHOOK_URL=https://your-endpoint.example/webhook
REQUESTS_WEBHOOK_TOKEN=
REQUESTS_WEBHOOK_TIMEOUT_MS=10000
OPERATIONS_MESSENGER_WEBHOOK_URL=
OPERATIONS_MESSENGER_WEBHOOK_TOKEN=
OPERATIONS_EMAIL_WEBHOOK_URL=
OPERATIONS_EMAIL_WEBHOOK_TOKEN=
OPERATIONS_SHEETS_WEBHOOK_URL=
OPERATIONS_SHEETS_WEBHOOK_TOKEN=
ORDERS_DATA_DIR=
REQUESTS_DATA_DIR=
REQUEST_ATTACHMENTS_DIR=
REQUEST_ATTACHMENTS_ACCESS_SECRET=
INTERNAL_BACKOFFICE_PASSWORD=
INTERNAL_BACKOFFICE_SESSION_SECRET=
ORDER_PUBLIC_ACCESS_SECRET=
```

Описание:

- `NEXT_PUBLIC_SITE_NAME` — имя сайта в webhook payload.
- `NEXT_PUBLIC_SITE_URL` — публичный адрес сайта для SEO-URL в `/sitemap.xml`; в production укажите реальный домен, например `https://example.com`.
- `REQUESTS_WEBHOOK_URL` — обязательный URL канала приема заявок и заказов.
- `REQUESTS_WEBHOOK_TOKEN` — необязательный bearer token для webhook.
- `REQUESTS_WEBHOOK_TIMEOUT_MS` — таймаут доставки primary webhook; по умолчанию `10000`, допустимый диапазон ограничивается кодом от 1000 до 30000 мс.
- `OPERATIONS_MESSENGER_WEBHOOK_URL` / `OPERATIONS_MESSENGER_WEBHOOK_TOKEN` — опциональный канал для уведомления в мессенджер через webhook-адаптер.
- `OPERATIONS_EMAIL_WEBHOOK_URL` / `OPERATIONS_EMAIL_WEBHOOK_TOKEN` — опциональный канал для email-уведомления через webhook-адаптер.
- `OPERATIONS_SHEETS_WEBHOOK_URL` / `OPERATIONS_SHEETS_WEBHOOK_TOKEN` — опциональный канал для записи в Google Sheets или аналогичную таблицу через webhook-адаптер.
- `ORDERS_DATA_DIR` — опциональный override директории заказов; по умолчанию `data/orders`.
- `REQUESTS_DATA_DIR` — опциональный override директории заявок; по умолчанию `data/requests`.
- `REQUEST_ATTACHMENTS_DIR` — опциональный override директории вложений заявок; по умолчанию `data/request-attachments`.
- `REQUEST_ATTACHMENTS_ACCESS_SECRET` — секрет для подписанных ссылок на приватные вложения заявок.
- `INTERNAL_BACKOFFICE_PASSWORD` — пароль для внутреннего backoffice.
- `INTERNAL_BACKOFFICE_SESSION_SECRET` — секрет cookie-сессии internal backoffice.
- `ORDER_PUBLIC_ACCESS_SECRET` — секрет для защищенных public status links заказа.

### Что обязательно для production

Минимальный production-запуск этого проекта требует:

- `REQUESTS_WEBHOOK_URL`
- `REQUEST_ATTACHMENTS_ACCESS_SECRET`
- `INTERNAL_BACKOFFICE_PASSWORD`
- `INTERNAL_BACKOFFICE_SESSION_SECRET`
- `ORDER_PUBLIC_ACCESS_SECRET`

Сильно рекомендуется:

- `NEXT_PUBLIC_SITE_URL`
  - чтобы `/sitemap.xml` содержал абсолютные URL production-домена;
- `APP_URL`
  - чтобы в order/webhook уведомлениях формировались абсолютные public status links;
- `REQUESTS_WEBHOOK_TOKEN`
  - если primary receiver не принимает анонимные входящие webhook.

Опционально:

- `OPERATIONS_MESSENGER_WEBHOOK_*`
- `OPERATIONS_EMAIL_WEBHOOK_*`
- `OPERATIONS_SHEETS_WEBHOOK_*`

Эти sidecar-каналы не обязательны для приема заявки или заказа, если уже работает `REQUESTS_WEBHOOK_URL`, но полезны для реальной ручной обработки.

## Dev и Production

### Development

- локальная разработка может использовать dev fallback для чувствительных сценариев;
- internal backoffice может работать без явного `INTERNAL_BACKOFFICE_SESSION_SECRET`;
- public order status может использовать dev-only secret, если `ORDER_PUBLIC_ACCESS_SECRET` не задан.

### Production

- dev fallback для sensitive logic отключен;
- internal backoffice не включается без пары `INTERNAL_BACKOFFICE_PASSWORD` + `INTERNAL_BACKOFFICE_SESSION_SECRET`;
- public status links заказа не работают без `ORDER_PUBLIC_ACCESS_SECRET`;
- webhook token больше не используется как запасной секрет для backoffice или order access.
- вложения заявок больше не должны раздаваться из `public`; для signed access в production нужен `REQUEST_ATTACHMENTS_ACCESS_SECRET`.

### Как проект ведет себя без обязательных env

- без `REQUESTS_WEBHOOK_URL`
  - `POST /api/requests` честно возвращает `503 submission_unavailable`;
  - форма заявки показывает ошибку и не переводит пользователя на `/thanks`;
  - request/order delivery не притворяется рабочей;
- если primary webhook недоступен, вернул ошибочный HTTP-статус или не ответил за `REQUESTS_WEBHOOK_TIMEOUT_MS`
  - заявка не считается отправленной;
  - уже сохраненные вложения заявки удаляются, чтобы не оставлять приватные файлы без доставленной заявки;
  - пользователь видит нейтральную ошибку без URL, токенов и других секретов;
- без `INTERNAL_BACKOFFICE_PASSWORD` или `INTERNAL_BACKOFFICE_SESSION_SECRET` в production
  - `/internal/login` уходит в controlled misconfiguration state и не открывает backoffice;
- без `ORDER_PUBLIC_ACCESS_SECRET` в production
  - public status links заказа не включаются;
- без `REQUEST_ATTACHMENTS_ACCESS_SECRET` в production
  - private attachments не должны считаться готовыми для signed external access.

## Заявки

Формы доступны из модалки, `/contacts`, `/custom` и `/3d-scan`.

Flow:

1. Клиент проходит клиентскую валидацию.
2. Форма отправляет `POST /api/requests`.
3. Сервер повторно валидирует данные и файлы.
4. Если все корректно, данные отправляются через webhook.
5. Только при успешном ответе сервера происходит переход на `/thanks`.
6. После успешной доставки primary webhook заявка сохраняется во внутренний inbox `data/requests/*.json`.

Production-behavior:

- `REQUESTS_WEBHOOK_URL` обязателен: без него сайт возвращает ошибку отправки, а не ложный успех.
- `REQUESTS_WEBHOOK_TOKEN` добавляется только в серверный `Authorization: Bearer ...` header и не попадает в клиентский код.
- `REQUESTS_WEBHOOK_TIMEOUT_MS` ограничивает ожидание primary webhook, чтобы форма не зависала бесконечно.
- optional sidecar-каналы не заменяют primary webhook: если primary webhook не доставлен, заявка считается неотправленной.
- пользователю показываются безопасные сообщения без внутренних URL, токенов и деталей окружения.

Поддерживается загрузка файлов:

- форматы: `JPG`, `PNG`, `WEBP`
- несколько изображений в одной заявке
- серверное сохранение вложений перед отправкой webhook
- вложения сохраняются в приватное файловое хранилище `data/request-attachments/*`, а не в `public`
- webhook получает подписанные URL на защищенный route `/api/request-attachments/...`, если настроен `REQUEST_ATTACHMENTS_ACCESS_SECRET`

## Заказы

Checkout сейчас остается коротким и честным:

- без регистрации
- без онлайн-оплаты
- без автоматического расчета доставки
- с ручным подтверждением менеджером

Flow:

1. Клиент добавляет `direct-sale` товар в корзину.
2. Checkout отправляет `POST /api/orders`.
3. Сервер валидирует заказ, сохраняет snapshot в `data/orders/*.json`, а затем пытается доставить webhook.
4. Даже если webhook временно недоступен, заказ не теряется: он остается в локальном store и помечается статусом доставки.
5. При повторной отправке того же checkout используется `idempotencyKey`, поэтому сервер не создает бессмысленный дубль, а переиспользует уже сохраненный заказ.
6. После успешного сохранения клиент попадает на `/thanks`; страница честно показывает, был ли заказ уже доставлен менеджеру или пока только сохранен для повторной доставки.

Важно:

- заказы сейчас хранятся файлово, а не в БД;
- модель заказа сейчас `save first, deliver later`;
- для delivery используются состояния `pending_delivery`, `delivered`, `delivery_failed`;
- при временном сбое webhook корзина очищается только после успешного сохранения заказа, а не после внешней доставки;
- это MVP-слой, не финальная production-инфраструктура.

## Внутренний backoffice

Минимальный internal-only интерфейс доступен по `/internal/orders` и `/internal/requests`.

Что умеет:

- список заявок из форм сайта
- просмотр деталей заявки и приватных signed-вложений
- список заказов
- фильтр по статусам
- просмотр состава заказа и customer data
- обновление статуса заказа
- просмотр delivery-статуса webhook, числа попыток и последней ошибки
- ручной retry доставки менеджеру для недоставленных заказов
- выдача public status link

Пример env для включения:

```env
INTERNAL_BACKOFFICE_PASSWORD=change-me
INTERNAL_BACKOFFICE_SESSION_SECRET=change-me-too
ORDER_PUBLIC_ACCESS_SECRET=separate-public-order-secret
```

Ограничения:

- это временный password-based internal gate;
- сессия живет ограниченное время и проверяется по подписанной httpOnly cookie;
- после серии неудачных попыток входа включается базовый cooldown;
- полноценной auth-системы, ролей и RBAC пока нет;
- в production без обязательных env backoffice намеренно не включается.

## Webhook payload

Сайт отправляет `POST` с `Content-Type: application/json`.

Заголовки:

- `X-Request-Event: request.created` или `order.created`
- `X-Request-Id: <uuid>`
- `Authorization: Bearer <token>` — только если задан `REQUESTS_WEBHOOK_TOKEN`

Пример для заявки:

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
    "details": "Нужно изготовить деталь по образцу.",
    "productName": "Панель салона"
  },
  "meta": {
    "channel": "webhook",
    "site": "Изготовление деталей"
  }
}
```

## Операционные уведомления

Поверх primary webhook теперь можно подключать легкий fan-out для ручной обработки без полноценной CRM.

Как это работает:

1. `REQUESTS_WEBHOOK_URL` остается обязательным primary-каналом для текущего MVP-flow.
2. После успешной доставки в primary-канал система может дополнительно отправить sidecar-уведомления:
   - в мессенджер;
   - на email;
   - в Google Sheets или аналогичную таблицу.
3. Failure optional-канала не ломает обработку заявки или заказа, если primary webhook уже принял событие.

Поддержанные env:

- `OPERATIONS_MESSENGER_WEBHOOK_URL`
- `OPERATIONS_MESSENGER_WEBHOOK_TOKEN`
- `OPERATIONS_EMAIL_WEBHOOK_URL`
- `OPERATIONS_EMAIL_WEBHOOK_TOKEN`
- `OPERATIONS_SHEETS_WEBHOOK_URL`
- `OPERATIONS_SHEETS_WEBHOOK_TOKEN`

Формат:

- primary webhook получает исходное событие `request.created` или `order.created`;
- messenger-канал получает компактный текстовый payload для чат-уведомления;
- email-канал получает `subject`, `text`, `html` и `rawEvent`;
- sheets-канал получает `row`-объект и `rawEvent`.

Это сделано как adapter-friendly слой: удобнее всего подключать Make, n8n, Zapier, Apps Script или свой небольшой receiver.

### Минимальный внешний receiver

Для первого запуска не нужна CRM. Достаточно одного внешнего receiver, который умеет принимать `POST` JSON по `REQUESTS_WEBHOOK_URL` и дальше:

- отправлять уведомление в мессенджер;
- пересылать письмо;
- писать строку в Google Sheets / Apps Script / Make / n8n.

Минимальный рабочий вариант для малого бизнеса:

1. поднять один primary receiver;
2. убедиться, что он принимает `request.created` и `order.created`;
3. при необходимости включить sidecar webhook для messenger/email/sheets;
4. проверить retry delivery из backoffice на одном тестовом заказе.

Подходящие внешние варианты:

- Make
- n8n
- Google Apps Script
- небольшой свой webhook endpoint

## Проверки

Доступные команды:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run test:e2e`

Текущее состояние тестов:

- `tests/qa.spec.ts` — компактный smoke-suite под текущий MVP;
- покрывает главную, каталог, товар, корзину, checkout, форму заявки, internal login и public order status.
- Playwright использует изолированные runtime-директории `tmp/e2e/orders`, `tmp/e2e/requests` и `tmp/e2e/request-attachments`, чтобы не смешивать smoke-данные с локальными заказами, заявками и вложениями.

Примечание по lint:

- `npm run lint` запускает `eslint .`;
- команда не должна открывать интерактивный wizard;
- это обычная проверка для локального pre-release / CI-like workflow.

### Минимальный checklist запуска

1. Скопировать `.env.example` в production secret store или `.env.production`.
2. Заполнить:
   - `REQUESTS_WEBHOOK_URL`
   - `REQUEST_ATTACHMENTS_ACCESS_SECRET`
   - `INTERNAL_BACKOFFICE_PASSWORD`
   - `INTERNAL_BACKOFFICE_SESSION_SECRET`
   - `ORDER_PUBLIC_ACCESS_SECRET`
   - `APP_URL`
3. Поднять и проверить primary webhook receiver.
4. Отправить тестовую заявку через `/contacts`.
5. Проверить, что receiver получил `request.created`.
6. Проверить, что `/internal/login` открывается и пускает в `/internal/orders`.
7. Проверить, что из карточки тестового заказа доступен public status link.
8. При необходимости включить `OPERATIONS_MESSENGER_*`, `OPERATIONS_EMAIL_*`, `OPERATIONS_SHEETS_*`.
9. Прогнать:
   - `npm run build`
   - `npm run test:e2e`

## Docker / VPS

Минимальный production-контур использует standalone build Next.js без отдельной БД, nginx или HTTPS-слоя внутри приложения.

Подробный production dry run перед реальным VPS-запуском описан в [docs/production-dry-run.md](docs/production-dry-run.md).

### Локальная проверка образа

```bash
docker build -t autodetail-fdm-mvp .
docker run --rm -p 127.0.0.1:3000:3000 --env-file .env.production -v ./data/orders:/app/data/orders -v ./data/requests:/app/data/requests -v ./data/request-attachments:/app/data/request-attachments autodetail-fdm-mvp
```

### Запуск через docker compose

1. Создайте production env-файл вне Git, например `.env.production`, на основе `.env.example`.
2. Убедитесь, что runtime-директории существуют:

```bash
mkdir -p data/orders data/requests data/request-attachments
```

3. Запустите:

```bash
docker compose --env-file .env.production up -d --build
docker compose ps
```

По умолчанию контейнер слушает `3000`, а host binding ограничен loopback: `127.0.0.1:${APP_PORT:-3000}:3000`.
После подключения reverse proxy / HTTPS внешний порт `3000` не должен быть открыт наружу. Публичный доступ должен идти через Caddy, nginx или Traefik на портах `80/443`, а proxy должен передавать запросы в Next.js на `http://127.0.0.1:3000`.
SSH `22` на VPS лучше ограничить своим IP `/32` на firewall/security-group уровне.

### Production env

Для production обязательны:

- `REQUESTS_WEBHOOK_URL`
- `REQUEST_ATTACHMENTS_ACCESS_SECRET`
- `INTERNAL_BACKOFFICE_PASSWORD`
- `INTERNAL_BACKOFFICE_SESSION_SECRET`
- `ORDER_PUBLIC_ACCESS_SECRET`

Сильно рекомендуется:

- `NEXT_PUBLIC_SITE_URL`
- `APP_URL`
- `REQUESTS_WEBHOOK_TOKEN`, если primary receiver требует bearer token

Опциональные sidecar-каналы:

- `OPERATIONS_MESSENGER_WEBHOOK_*`
- `OPERATIONS_EMAIL_WEBHOOK_*`
- `OPERATIONS_SHEETS_WEBHOOK_*`

### Volumes

`docker-compose.yml` монтирует три runtime-хранилища:

- `./data/orders:/app/data/orders`
- `./data/requests:/app/data/requests`
- `./data/request-attachments:/app/data/request-attachments`

Эти директории содержат рабочие данные MVP и должны переживать пересборку контейнера.

На Linux/VPS убедитесь, что пользователь контейнера может писать в эти директории. Если нужны права вручную, выполните на сервере:

```bash
mkdir -p data/orders data/requests data/request-attachments
sudo chown -R 1001:1001 data/orders data/requests data/request-attachments
```

### Backup / restore

Минимальный backup перед деплоем или обновлением:

```bash
mkdir -p backups
tar -czf backups/site-data-$(date +%Y%m%d-%H%M%S).tar.gz data/orders data/requests data/request-attachments
```

Restore:

```bash
docker compose stop app
tar -xzf backups/site-data-YYYYMMDD-HHMMSS.tar.gz
docker compose up -d
```

После restore проверьте `/internal/orders`, `/internal/requests` и отправку тестовой заявки.

## Что сейчас не реализовано

- онлайн-оплата
- личный кабинет пользователя
- полноценная БД
- production-grade auth для backoffice
- сложный ecommerce checkout
- полноценная CRM

## Что нужно подставить вручную

- реальный `REQUESTS_WEBHOOK_URL`
- при необходимости `REQUESTS_WEBHOOK_TOKEN`
- для production: `INTERNAL_BACKOFFICE_SESSION_SECRET`
- для production: `ORDER_PUBLIC_ACCESS_SECRET`
- при необходимости `INTERNAL_BACKOFFICE_PASSWORD`
- реальные товарные данные, фотографии и business content

## Операционные уведомления

Текущий production-like MVP использует схему `primary + sidecar fan-out`:

- `REQUESTS_WEBHOOK_URL` — обязательный основной канал для заявок и заказов;
- `OPERATIONS_MESSENGER_WEBHOOK_*` — опциональный канал для мессенджера;
- `OPERATIONS_EMAIL_WEBHOOK_*` — опциональный канал для email;
- `OPERATIONS_SHEETS_WEBHOOK_*` — опциональный канал для Google Sheets / Apps Script / Make / n8n.

Дополнительно можно задать:

- `APP_URL` — чтобы в order-уведомлениях появлялись абсолютные public status links;
- `OPERATIONS_MESSENGER_LABEL`, `OPERATIONS_EMAIL_LABEL`, `OPERATIONS_SHEETS_LABEL` — чтобы в backoffice и логике fan-out показывались человекочитаемые имена каналов.

Практика настройки:

1. Настройте один обязательный primary receiver.
2. Подключите нужные optional sidecar receivers.
3. Проверьте, что primary принимает `request.created` и `order.created`.
4. Убедитесь, что optional receivers принимают sidecar payload для своего канала.

Важно:

- failure optional-канала не ломает общий flow, если primary уже успешно принял событие;
- retry заказа из backoffice повторно прогоняет fan-out и сохраняет результат последней попытки по каналам;
- в карточке заказа в backoffice теперь видны статусы доставки по каналам.
