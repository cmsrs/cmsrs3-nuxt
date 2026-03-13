#!/bin/bash

clear
echo "=== TREE APP ==="  >> app_dump.txt
tree app > app_dump.txt


echo "=== APP ==="  >> app_dump.txt
echo -e "\n=== FILE CONTENTS ===" >> app_dump.txt
find app -type f -exec sh -c '
  echo "===== $1 ====="
  cat "$1"
  echo
' _ {} \; >> app_dump.txt

echo "=== TREE TESTS ==="  >> app_dump.txt
tree tests >> app_dump.txt

echo "=== tests ==="  >> app_dump.txt
find tests -type f -exec sh -c '
  echo "===== $1 ====="
  cat "$1"
  echo
' _ {} \; >> app_dump.txt

echo "=== nuxt.config.ts ===" >> app_dump.txt
cat nuxt.config.ts >> app_dump.txt

echo -e "\n=== GIT DIFF (ostatnie zmiany) ===" >> app_dump.txt
git diff app/ >> app_dump.txt

cat app_dump.txt

npm run test:run >> app_dump.txt
#npx vitest run tests/nuxt/index.test.ts
