
tree  app >  app_dump.txt
find app -type f -exec sh -c 'echo "===== $1 ====="; cat "$1"; echo' _ {} \; >> app_dump.txt
