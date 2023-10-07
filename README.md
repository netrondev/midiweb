# MIDIWEB

Just a prototype for testing web midi.

# DEV NOTES

MIDI requires https.

```
pnpm dev | npx local-ssl-proxy --source 3005 --target 3000
```

open https://localhost:3005/

# To capture from ipad:

Install uxplay and avahi

```
systemctl start avahi-daemon.service
uxplay

# screenmirror from ipad
```
