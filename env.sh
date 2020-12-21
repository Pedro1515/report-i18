if [[ ${API_URL} ]]; then
  echo "Using the api url ${API_URL}"
  echo NEXT_PUBLIC_API_HOST_URL=${API_URL} >> .env 
else
  echo "Using default api url http://localhost:8082"
  echo "Set API_URL environment varible to change it"
  echo NEXT_PUBLIC_API_HOST_URL=http://localhost:8082 >> .env 
fi 

yarn start
