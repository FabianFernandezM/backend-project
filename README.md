# Northcoders News API

## Setup

In order to run this project, you will need to set up your test and development databases:
1. On the main project folder, create two .env files: ".env.development" and ".env.test"
2. On each one of these files, add the following line: "PGDATABASE=yourDatabaseName"

Please ensure to name your databases appropriately depending on their intended use. 

Once this is done, please have a look at the setup.sql file to drop and create your databases as needed.  

## Endpoints

### /api/topics
- **GET**: retrieves a list of the current topics present on the database.
