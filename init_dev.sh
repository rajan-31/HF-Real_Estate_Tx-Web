#!/bin/bash
# # . ./init_dev.sh
# # docker ps --format 'table {{.ID}}\t{{.Command}}\t{{.Names}}'

tab="--tab"

# # aguments as commands
# arrcmd=( "$@" )

# # manual commands
arrcmd=( "cd ~/0.Learning/Blockchain/Hyperledger-Fabric/first/ && docker-compose start" "mongod --dbpath ~/5.Temp-DB-DS-Logs/db/mongo --logpath ~/5.Temp-DB-DS-Logs/log/mongodb/mongod.log --auth" "cd ~/0.Projects/r-estate-transactions_web/ && npm run dev" "cd ~/0.Learning/Blockchain/Hyperledger-Fabric/hyperledger_explorer && docker-compose start")



arrtitle=( "HF Network" "MongoDB Instance" "Web Server" "Fabric Explorer")

foo=""

arrcmd_len=${#arrcmd[@]}

n=`expr $arrcmd_len - 1`

for i in $(seq 0 $n); do
    foo+=($tab -e "bash -c '${arrcmd[$i]}';bash" -t "${arrtitle[$i]}")       
done

gnome-terminal "${foo[@]}"

# google-chrome "http://localhost:8081" "http://localhost:8080"

exit 0

# ---
# gnome-terminal --tab -e bash -c 'cd ~/0.Learning/Blockchain/Hyperledger-Fabric/first/ &&\
# docker-compose start';bash -t HF Network --tab -e bash -c 'mongod --dbpath ~/5.Temp-DB-DS-Logs/db/mongo --logpath ~/5.Temp-DB-DS-Logs/log/mongodb/mongod.log --auth';bash -t MongoDB Instance --tab -e bash -c 'cd ~/0.Projects/r-estate-transactions_web/ && npm run dev';bash -t Web Server