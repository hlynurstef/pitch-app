#!/bin/bash

dir=$(pwd)
#Define the string value
text="${dir}"

# Set space as the delimiter
IFS='/'

#Read the split words into an array based on space delimiter
read -a strarr <<< "$text"

if [ "${strarr[${#strarr[*]}-1]}" != "pitch-app" ]; then
  echo "must run this script from the root of the project, currently in ${dir}"
  exit 1
fi

python3 scripts/cors_http_server.py

exit 0