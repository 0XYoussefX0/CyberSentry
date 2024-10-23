#!/bin/sh
npx drizzle-kit studio --port 4001 &

# Wait for the server to be ready
until curl -s http://localhost:4001 > /dev/null; do
  echo "Waiting for studio server to be ready..."
  sleep 1
done

npx drizzle-kit push
wait
