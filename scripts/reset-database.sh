#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "reset-database.sh <dbname>"
    exit 1
fi
mysql -uroot -e "DROP DATABASE IF EXISTS $1;"
mysql -uroot -e "CREATE DATABASE $1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
npx prisma migrate dev