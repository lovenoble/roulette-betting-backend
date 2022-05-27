#!/usr/bin/env bash

envRequiredFile=".env.required_vars"
pwd
while read -r line
do
    echo "[ENV] Checking for $line";

    if [ -z "${!line}" ]; then
        echo "[ENV] $line is unset";
        exit 1;
    else
        echo "[ENV] $line is set";
    fi
done < "$envRequiredFile"

echo "[ENV] Correct environment variables are present."
exit 0;