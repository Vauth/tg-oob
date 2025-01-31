//-- github.com/vauth/tg-oob --//

const TOKEN = 'ENV_BOT_TOKEN' // Your bot token.
const WEBHOOK = '/endpoint'
const SECRET = 'ENV_BOT_SECRET' // Everything you wish.
const OWNER = 123456789 // Owner telegram id.

addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  const param =  url.searchParams
  const time = new Date().toTimeString()
  
  if (url.pathname === WEBHOOK) {
    event.respondWith(handleWebhook(event))
  } else if (url.pathname === '/registerWebhook') {
    event.respondWith(registerWebhook(event, url, WEBHOOK, SECRET))
  } else if (url.pathname === '/unRegisterWebhook') {
    event.respondWith(unRegisterWebhook(event))
  } else if (url.pathname === '/test') {
    event.respondWith(sendMessage(OWNER, "I'm alive."))
  } else if (param.has('send')) {
    event.respondWith(sendMessage(OWNER, "```javascript\n" + param.get('send') + "\n```" ))
  } else if (url.pathname.startsWith('/p/')) {
    event.respondWith(sendMessage(OWNER, "```javascript\n" + url + "\n```"))
  } else {
    event.respondWith(onError())
  }
})

async function handleWebhook (event) {
  if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== SECRET) {
    return new Response('Unauthorized', { status: 403 })
}

  const update = await event.request.json()
  event.waitUntil(onUpdate(update))
  return new Response('Ok')
}

async function onUpdate (update) {
  if ('message' in update) {await onMessage(update.message)}
}

function onMessage (message) {
  if (message.text == '/start') {
    return sendMessage(message.chat.id, "access forbidden 403.")
  }
}

async function sendMessage (chatId, text) {
  await fetch(apiUrl('sendMessage', {chat_id: chatId, parse_mode: 'markdown', text}))
  return new Response(JSON.stringify({"status": 200}), {
    headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'}
  })
}

async function onError () {
  return new Response(JSON.stringify({"status": 404, "message": "No handler for this request"}), {
    headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'}
  })
}

async function registerWebhook (event, requestUrl, suffix, secret) {
  const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${suffix}`
  const r = await (await fetch(apiUrl('setWebhook', { url: webhookUrl, secret_token: secret }))).json()
  return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
}

async function unRegisterWebhook (event) {
  const r = await (await fetch(apiUrl('setWebhook', { url: '' }))).json()
  return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
}

function apiUrl (methodName, params = null) {
  let query = ''
  if (params) {query = '?' + new URLSearchParams(params).toString()}
  return `https://api.telegram.org/bot${TOKEN}/${methodName}${query}`
}
