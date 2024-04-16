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
    - **Output**: Returns an ***object*** with an "endpoints" key containing all (***object***) endpoints from the endpoints.json file.

### /api/topics
- **GET**: retrieves a list of the current topics present on the database.
    - **Parameters**: N/A
    - **Output**: Returns an ***object*** with a "topic" key containing an ***array*** containing all (***object***) topics from the database.

### /api/articles
- **GET**: retrieves the list of articles present in the database.
    - **Parameters**: N/A
    - **Output**: Returns an ***object*** with an "articles" key containing an ***array***  with all (***object***) articles from the database.

### /api/articles/:article_id
- **GET**: retrieves an article with the requested ID.
    - **Parameters**: article_id (number)
    - **Output**: Returns an ***object*** with an "article" key containing an (***object***) article from the database.
- **POST**: Updates and article's votes key and responds with the updated article.
    - **Parameters**: article_id (number)
    - **Body**: {inc_votes: "number"}
    - **Output**: Returns an ***object*** with an "article" key containing an updated (***object***) article from the database.

### /api/articles/:article_id/comments
- **GET**: retrieves a list of comments from the requested article ID.
    - **Parameters**: article_id (number)
    - **Output**: Returns an ***object*** with a "comments" key containing an ***array*** of comments from the database.
- **POST**: posts a comment to the requested article ID and retrieves the posted comment.
    - **Parameters**: article_id (number)
    - **Body**: {username: "string", body: "string"}
    - **Output**: Returns an ***object*** with a "comment" key containing an ***array*** with the posted comment.

### /api/comments/:comment_id
- **DELETE**: deletes the comment with the ID provided. Returns nothing.
    - **Parameters**: comment_id (number)
    - **Output**: N/A

### /api/users
- **GET**: retrieves the list of users present in the database.
    - **Parameters**: N/A
    - **Output**: Returns an ***object*** with an "users" key containing an ***array***  with all (***object***) users from the database.

