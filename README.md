# Telegram OOB
Out-of-band with telegram bot api using cloudflare workers.

<br>

### 🗂 Variables:
```javascript
const TOKEN = 'ENV_BOT_TOKEN' // Your bot token.
const SECRET = 'ENV_BOT_SECRET' // Everything you wish.
const OWNER = 123456789 // Owner telegram id.
```

<br>

### ⚙️Deploy:
- Upload `worker.js` into [cloudflare workers](https://workers.cloudflare.com/).
- Modify the [variables](#Variables).
- Deploy.

<br>

### 🔗 Endpoints:
- Register Webhook
```javascript
XXX.XXXX.workers.dev/registerWebhook
// Response - Ok
```
- unRegister Webhook
```javascript
XXX.XXXX.workers.dev/unRegisterWebhook
// Response - Ok
```
- Send Test Request
```javascript
XXX.XXXX.workers.dev/test
// Response - {"status":200}
```
- Send Message:
```javascript
XXX.XXXX.workers.dev/?send=hello+world
// Response - {"status":200}
```

<br>

### 🛠 Tips:
- For better performance send data with `URL-encode` or `Base64` format.
```javascript
Text: test message

Encoded:
- test%20message // URL-encode
- dGVzdCBtZXNzYWdl // Base64
...
```
- You can use telegram markdown.
```markdown
*bold*
_italic_
[text](url)
`mono`
```code block```
```
