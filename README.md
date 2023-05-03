# MIDIWEB

Just a prototype for testing web midi.

# DEV NOTES

MIDI requires https.

```
pnpm dev | npx local-ssl-proxy --source 3005 --target 3000
```

open https://localhost:3005/
