rm .env

if [[ ${API_URL} ]]; then
  echo "Using the api url ${API_URL}"
  echo API_HOST=${API_URL} >> .env 
else
  echo "Using default api url http://localhost:8082"
  echo "Set API_URL environment varible to change it"
  echo API_HOST=http://localhost:8082 >> .env 
fi 

yarn build

yarn start
