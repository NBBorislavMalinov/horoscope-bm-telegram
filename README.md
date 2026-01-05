# Horoscope BM Telegram Bot

Седмичен хороскоп бот за Telegram, базиран на OpenAI GPT-4o.

## Функции

- Автоматично генериране на седмична астрологична прогноза
- Изпращане всяка неделя в 09:00 българско време
- Персонализиран за конкретна дата на раждане

## Формат на прогнозата

- 📅 ПЕРИОД
- 💼 РАБОТА И ПАРИ
- ❤️ ОТНОШЕНИЯ
- 🏃 ЗДРАВЕ И ЕНЕРГИЯ
- ✅ НАЙ-ДОБРИ ДНИ
- ⚠️ ДНИ ЗА ВНИМАНИЕ

## Настройка

### 1. GitHub Secrets

Добави тези secrets в Settings → Secrets and variables → Actions:

| Secret | Описание |
|--------|----------|
| `OPENAI_API_KEY` | API ключ от OpenAI |
| `TELEGRAM_BOT_TOKEN` | Токен от BotFather |
| `TELEGRAM_CHAT_ID` | ID на чата/потребителя |

### 2. Получаване на Chat ID

1. Изпрати `/start` на @horoscope_bm_bot
2. Провери getUpdates:
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/getUpdates"
   ```
3. Намери `chat.id` в отговора

### 3. Тестване

Използвай "Run workflow" от GitHub Actions за ръчно изпълнение.

## Разписание

- **Ден:** Неделя
- **Час:** 09:00 часа българско време (07:00 UTC зимно време)
- **Cron:** `0 7 * * 0`

## Технологии

- Node.js 20
- OpenAI API (GPT-4o)
- Telegram Bot API
- GitHub Actions

## Бот команди

- `/start` - Добре дошли
- `/horoscope` - Информация
- `/help` - Помощ

## Лиценз

MIT
