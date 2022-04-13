CRYPTO_ENV_PATH="./.env"
FE_ENV_PATH="../../fareplay-frontend-metaverse/.env"

npm run cp:artifact:token:fe
npm run cp:artifact:game:fe

# line01=$(sed -n '1p' $CRYPTO_ENV_PATH)
# line02=$(sed -n '2p' $CRYPTO_ENV_PATH)
# address01=$(echo $line01 | cut -c 21-)
# address02=$(echo $line02 | cut -c 20-)
# prefix01=$(echo $line01 | cut -c -20)
address01=$(awk '/PEAR_TOKEN_CONTRACT=/ {print $0}' "./../crypto/.env" | cut -c 21-)
address02=$(awk '/PEAR_GAME_CONTRACT=/ {print $0}' "./../crypto/.env" | cut -c 20-)

# if [[ $prefix01 == "PEAR_TOKEN_CONTRACT=" ]]
# then
    sed -i '' '/REACT_APP_PEAR_TOKEN_ADDRESS/d' $FE_ENV_PATH
    echo $'\n'"REACT_APP_PEAR_TOKEN_ADDRESS=${address01}" >> $FE_ENV_PATH
    sed -i '' '/^$/d' $FE_ENV_PATH

    sed -i '' '/REACT_APP_PEAR_GAME_ADDRESS/d' $FE_ENV_PATH
    echo $'\n'"REACT_APP_PEAR_GAME_ADDRESS=${address02}" >> $FE_ENV_PATH
    sed -i '' '/^$/d' $FE_ENV_PATH

#     address01=$(echo $line01 | cut -c 21-)
#     address02=$(echo $line02 | cut -c 20-)
#     echo "NODE_ENV=development" > $FE_ENV_PATH
#     echo "REACT_APP_PEAR_TOKEN_ADDRESS=${address01}" >> $FE_ENV_PATH
#     echo "REACT_APP_PEAR_GAME_ADDRESS=${address02}" >> $FE_ENV_PATH
# else
#     address01=$(echo $line02 | cut -c 20-)
#     address02=$(echo $line01 | cut -c 21-)
#     echo "NODE_ENV=development" > $FE_ENV_PATH
#     echo "REACT_APP_PEAR_GAME_ADDRESS=${address01}" >> $FE_ENV_PATH
#     echo "REACT_APP_PEAR_TOKEN_ADDRESS=${address02}" >> $FE_ENV_PATH
# fi
