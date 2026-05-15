#!/bin/bash
cd "$(dirname "$0")"

PORT=7777

# Matar servidor anterior en ese puerto si existe
lsof -ti tcp:$PORT | xargs kill -9 2>/dev/null

# Arrancar servidor HTTP en background
python3 -m http.server $PORT &
SERVER_PID=$!

sleep 0.4
open "http://localhost:$PORT/score-player-test.html"

echo "Score Player arrancado en http://localhost:$PORT"
echo "Pulsa Ctrl+C para parar el servidor"

# Mantener el script vivo para que el servidor no muera
wait $SERVER_PID
