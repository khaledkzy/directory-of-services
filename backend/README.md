
To Run
============
1. `> yarn` , install all dependency .
2. `> yarn start  or yarn run dev`, start server.

Data to be migrate
==================
`./data.json`

Api end-point
============
1. `localhost:3002/api/service/migrate` , to load the service data in to the database.
2. `localhost:3002/api/service/all` , to get all the inserted data.
3. `localhost:3002/api/service`, to post the data .

## There are four scripts important to understand what they are doing
1- `yarn run migrate` for migrate the data locally
2- `yarn run dev` to run the server at development mode
3- `yarn start-prod` to run the server at production mode
4- `yarn migrate-prod` to migrate the data into cloud database