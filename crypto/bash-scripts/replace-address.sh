FRONTEND_ENV_PATH="../frontend/.env"
CRYPTO_ENV_PATH="./.env"
SERVER_ENV_PATH="../server/.env"

if [[ $1 == "token" ]]
then
    if [[ -z "$2" ]]
    then
        echo "Please pass in the $1 address as the second argument."
        exit 1
    fi
    echo "Equal to token"

    sed -i '' '/REACT_APP_PEAR_TOKEN_ADDRESS/d' $FRONTEND_ENV_PATH
    echo $'\n'"REACT_APP_PEAR_TOKEN_ADDRESS=$2" >> $FRONTEND_ENV_PATH
    sed -i '' '/^$/d' $FRONTEND_ENV_PATH
    sed -i '' '/PEAR_TOKEN_CONTRACT/d' $CRYPTO_ENV_PATH
    echo $'\n'"PEAR_TOKEN_CONTRACT=$2" >> $CRYPTO_ENV_PATH
    sed -i '' '/^$/d' $CRYPTO_ENV_PATH
    sed -i '' '/PEAR_TOKEN_ADDRESS/d' $SERVER_ENV_PATH
    echo $'\n'"PEAR_TOKEN_ADDRESS=$2" >> $SERVER_ENV_PATH
    sed -i '' '/^$/d' $SERVER_ENV_PATH
    npm run cp:artifact:token
    npm run cp:artifact:token:server
elif [[ $1 == "game" ]]
then
    if [[ -z "$2" ]]
    then
        echo "Please pass in the $1 address as the second argument."
        exit 1
    fi
    sed -i '' '/REACT_APP_PEAR_GAME_ADDRESS/d' $FRONTEND_ENV_PATH
    echo $'\n'"REACT_APP_PEAR_GAME_ADDRESS=$2" >> $FRONTEND_ENV_PATH
    sed -i '' '/^$/d' $FRONTEND_ENV_PATH
    sed -i '' '/PEAR_GAME_CONTRACT/d' $CRYPTO_ENV_PATH
    echo $'\n'"PEAR_GAME_CONTRACT=$2" >> $CRYPTO_ENV_PATH
    sed -i '' '/^$/d' $CRYPTO_ENV_PATH
    sed -i '' '/PEAR_GAME_ADDRESS/d' $SERVER_ENV_PATH
    echo $'\n'"PEAR_GAME_ADDRESS=$2" >> $SERVER_ENV_PATH
    sed -i '' '/^$/d' $SERVER_ENV_PATH
    npm run cp:artifact:game
    npm run cp:artifact:game:server
else
    echo "Please pass a valid variable identifier. (token, game)"
fi

