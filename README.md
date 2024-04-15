# Northcoders News API

## Setup

In order to run this project, you will need to set up your test and development databases:
1. On the main project folder, create two .env files: ".env.development" and ".env.test"
2. On each one of these files, add the following line: "PGDATABASE=yourDatabaseName"

Please ensure to name your databases appropriately depending on their intended use. 

Once this is done, please have a look at the setup.sql file to drop and create your databases as needed. 

## Files

### endpoints.json
This file contains information about all endpoints present on the database. It ***MUST*** be updated when adding a new endpoint with all the necessary information for the user. Please see the file for examples on how to write new endpoints information.

## Endpoints

### /api
- **GET**: retrieves a list of the current endpoints present on the database.
    - **Parameters**: N/A
    - **Output**: Returns an ***object*** containing all (***object***) endpoints from the endpoints.json file.

### /api/topics
- **GET**: retrieves a list of the current topics present on the database.
    - **Parameters**: N/A
    - **Output**: Returns an ***array*** containing all (***object***) topics from the database.
