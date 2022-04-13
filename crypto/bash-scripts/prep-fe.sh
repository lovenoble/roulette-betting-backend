CRYPTO_ENV_PATH="./.env"
FE_ENV_PATH="../../fareplay-frontend-metaverse/.env"

npm run cp:artifact:token:fe
npm run cp:artifact:game:fe

address01=$(awk '/PEAR_TOKEN_CONTRACT=/ {print $0}' "./../crypto/.env" | cut -c 21-)
address02=$(awk '/PEAR_GAME_CONTRACT=/ {print $0}' "./../crypto/.env" | cut -c 20-)

sed -i '' '/REACT_APP_PEAR_TOKEN_ADDRESS/d' $FE_ENV_PATH
echo $'\n'"REACT_APP_PEAR_TOKEN_ADDRESS=${address01}" >> $FE_ENV_PATH
sed -i '' '/^$/d' $FE_ENV_PATH

sed -i '' '/REACT_APP_PEAR_GAME_ADDRESS/d' $FE_ENV_PATH
echo $'\n'"REACT_APP_PEAR_GAME_ADDRESS=${address02}" >> $FE_ENV_PATH
sed -i '' '/^$/d' $FE_ENV_PATH

