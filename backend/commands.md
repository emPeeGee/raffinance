# Commands cheatsheet

## Creating docker container
1. Create dockerfile
2. `docker build -t raffinance-img .`
This will create an image from dockerfile
3. `docker run --name raffinance-db -p 5436:5432 -d raffinance-img`
--name is container nm



## get inside the db
1. `docker ps` List processes
2. `docker exec -it #id bash` Connect to docker instance
3. `psql -U postgres raffinance` Connect to database
