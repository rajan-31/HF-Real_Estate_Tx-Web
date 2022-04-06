#!/bin/bash
# # . ./init_dev.sh
# # docker ps --format 'table {{.ID}}\t{{.Command}}\t{{.Names}}'

tab="--tab"

# # aguments as commands
# arrcmd=( "$@" )

# # manual commands
arrcmd=( "cd ~/0.Learning/Blockchain/Hyperledger-Fabric/first/ && docker-compose start" "mongod --dbpath ~/5.Temp-DB-DS-Logs/db/mongo --logpath ~/5.Temp-DB-DS-Logs/log/mongodb/mongod.log --auth" "cd ~/0.Projects/r-estate-transactions_web/ && npm run dev" )



arrtitle=( "HF Network" "MongoDB Instance" "Web Server")

foo=""

arrcmd_len=${#arrcmd[@]}

n=`expr $arrcmd_len - 1`

for i in $(seq 0 $n); do
    foo+=($tab -e "bash -c '${arrcmd[$i]}';bash" -t "${arrtitle[$i]}")       
done

gnome-terminal "${foo[@]}"

exit 0