import OpenAI from 'openai';

// Configuration from environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Validate required environment variables
if (!OPENAI_API_KEY || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Birth data for horoscope
const BIRTH_DATA = {
  date: '27.09.1965',
  time: '05:03',
  place: 'Дупница, България',
  timezone: 'Europe/Sofia'
};

// Calculate the period (current week: Sunday to Saturday)
function getWeekPeriod() {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Start from today (Sunday) and go 6 days forward (to Saturday)
  const start = new Date(today);
  const end = new Date(today);
  end.setDate(today.getDate() + 6);

  const formatDate = (d) => {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}`;
  };

  return `${formatDate(start)} – ${formatDate(end)}`;
}

// Generate horoscope using OpenAI
async function generateHoroscope() {
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const period = getWeekPeriod();

  const prompt = `Ти си професионален астролог. Направи седмична астрологична прогноза за следващите 7 дни.

Данни за натала:
- Дата на раждане: ${BIRTH_DATA.date}
- Час на раждане: ${BIRTH_DATA.time}
- Място: ${BIRTH_DATA.place}
- Часова зона: ${BIRTH_DATA.timezone}

Период: ${period} (Неделя – Събота)

ФОРМАТ (ЗАДЪЛЖИТЕЛЕН):
- Текстът трябва да е на български език
- БЕЗ празни редове между секциите
- Всяко изречение да е на НОВ ред
- Да е практично и конкретно, без общи приказки
- Максимум 2000-2500 знака общо

СЕКЦИИ (точно в този ред):
1. 📅 ПЕРИОД: ${period}
2. 💼 РАБОТА И ПАРИ
3. ❤️ ОТНОШЕНИЯ
4. 🏃 ЗДРАВЕ И ЕНЕРГИЯ
5. ✅ НАЙ-ДОБРИ ДНИ: (посочи 2-3 конкретни дати)
6. ⚠️ ДНИ ЗА ВНИМАНИЕ: (посочи 2-3 конкретни дати)

Започни директно с прогнозата, без въведение.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1500,
    temperature: 0.7
  });

  return response.choices[0].message.content;
}

// Send message to Telegram
async function sendToTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    })
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`Telegram API error: ${result.description}`);
  }

  return result;
}

// Main function
async function main() {
  console.log('🔮 Generating weekly horoscope...');

  try {
    // Step 1: Generate horoscope
    const horoscope = await generateHoroscope();
    console.log('✅ Horoscope generated');
    console.log(`📝 Length: ${horoscope.length} characters`);

    // Step 2: Send to Telegram
    await sendToTelegram(horoscope);
    console.log('✅ Message sent to Telegram');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
