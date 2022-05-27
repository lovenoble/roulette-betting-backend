#!/usr/bin/env bash

envRequiredFile=".env.required_vars"
pwd
while read -r line
do
    echo "Checking for $line";

    if [ -z "${!line}" ]; then
        echo "$line is unset";
        exit 1;
    else
        echo "$line is set";
    fi
done < "$envRequiredFile"

echo "Correct environment variables are present."
exit 0;