#!/usr/bin/env bash

envRequiredFile=".env.required_vars"
pwd
envString=''
while read -r line
do
    if [ ! -z "${!line}" ]; then
        echo "[ENV] Propagating $line";
        envString+="$line=${!line} "
    fi
    
done < "$envRequiredFile"

if [ ! -z $envString]; then
    # echo $envString
    eb setenv $envString
fi

exit 0;