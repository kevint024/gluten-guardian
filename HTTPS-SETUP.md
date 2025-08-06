# HTTPS Local Server Setup

## Quick HTTPS Solution
You can use `npx serve` with HTTPS:

```bash
npx serve dist -p 3000 --ssl-cert cert.pem --ssl-key key.pem
```

## Generate Self-Signed Certificate
1. Install OpenSSL (if not installed)
2. Generate certificate:
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

## Alternative: Use ngrok for HTTPS tunneling
```bash
# Install ngrok globally
npm install -g ngrok

# Serve your local site with HTTPS
ngrok http 3000
```

## Browser Security Notes
- **HTTP + localhost** = ✅ Camera works
- **HTTP + network IP** = ❌ Camera blocked 
- **HTTPS + any domain** = ✅ Camera works
- **GitHub Pages** = ✅ Camera works (auto-HTTPS)

## Current Status
- ✅ Works: `http://localhost:3000`
- ❌ Blocked: `http://192.168.1.3:3000`  
- ✅ Will work: `https://kevint024.github.io/gluten-guardian/`
