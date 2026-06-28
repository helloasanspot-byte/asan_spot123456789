export type TelegramSendResult = {
  chatId: string
  ok: boolean
  status: number
  text?: string
  error?: string
}

const getTelegramBotToken = () => process.env.TELEGRAM_BOT_TOKEN
const getTelegramChatIds = () => [process.env.TELEGRAM_CHAT_ID, process.env.TELEGRAM_CHAT_ID_2].filter(Boolean) as string[]

const sendTelegramRequest = async (method: string, payload: Record<string, any>, chatIds: string[]) => {
  const botToken = getTelegramBotToken()
  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured')
  }

  return Promise.all(chatIds.map(async (chatId) => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat_id: chatId, ...payload }),
      })

      const text = await response.text()
      if (!response.ok) {
        return {
          chatId,
          ok: false,
          status: response.status,
          text,
          error: `Telegram API returned status ${response.status}`,
        }
      }

      return {
        chatId,
        ok: true,
        status: response.status,
        text,
      }
    } catch (error: any) {
      return {
        chatId,
        ok: false,
        status: 0,
        error: error?.message || 'Unknown network error',
      }
    }
  }))
}

export const sendTelegramMessage = async (text: string, parseMode = 'Markdown') => {
  const chatIds = getTelegramChatIds()
  if (chatIds.length === 0) {
    throw new Error('TELEGRAM_CHAT_ID and TELEGRAM_CHAT_ID_2 are not configured')
  }
  return sendTelegramRequest('sendMessage', { text, parse_mode: parseMode }, chatIds)
}

export const sendTelegramPhoto = async (photoUrl: string, caption: string, parseMode = 'Markdown') => {
  const chatIds = getTelegramChatIds()
  if (chatIds.length === 0) {
    throw new Error('TELEGRAM_CHAT_ID and TELEGRAM_CHAT_ID_2 are not configured')
  }
  return sendTelegramRequest('sendPhoto', { photo: photoUrl, caption, parse_mode: parseMode }, chatIds)
}
