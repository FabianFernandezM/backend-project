# Northcoders News API

## What is NC News API?

NC News API allows the creation of SQL-based databases and permits the user to interact with databases through different endpoints. 

To see a live example of this API, please follow this link: [NC News](https://nc-news-78g8.onrender.com/). You can use the endpoints listed in this file to see what the API returns when calling different endpoints.

## Setup

First off, clone the repository to your local machine. You can find information on how to do this here: [Cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

*Please note that if you plan to develop this API further and use it in production, you might need your own Github repository*

Once you have cloned the repository, open it with your preferred software (example: [VSCode](https://code.visualstudio.com/download)) and run the following commands in the console:
- **npm install** *// Installs all npm dependencies*
- **npm setup-dbs** *// Drops and set up databases as specified in the setup.psql file*
- **npm seed** *// Seeds database with the data present in db/data folders*

If you would like to run any tests during your development, you can use **npm test**. This will run all JEST tests present in the *__test__* folder

Once you have completed the above, you will need to set up your test and development databases:
1. On the root project folder, create two .env files: "**.env.development**" and "**.env.test**"
2. On each one of these files, add the following line: "**PGDATABASE=yourDatabaseName**"

Please ensure to name your databases appropriately depending on their intended use. 

Once this is done, please have a look at the setup.sql file to drop and create your databases as needed. 

Please note you will need both **Node.js v21.6.1** and **PostgreSQL 14.11** (or newer) to run this project.

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
    - **Queries**: topic, sort_by, order
    - **Output**: Returns an ***object*** with a "topic" key containing an ***array*** containing all (***object***) topics from the database.
- **POST**: posts a topic and retrieves the posted topic.
    - **Parameters**: N/A
    - **Body**: { slug: "name", description: "text"}
    - **Output**: Returns an ***object*** with a "topic" key containing the posted topic ***object***.

### /api/articles
- **GET**: retrieves the list of articles present in the database.
    - **Parameters**: N/A
    - **Queries:**: "author", "topic", "sort_by", "order", "p", "limit"
    - **Output**: Returns an ***object*** with an "articles" key containing an ***array***  with all (***object***) articles from the database.
- **POST**: posts an article and retrieves the posted article.
    - **Parameters**: N/A
    - **Body**: { author: "name", title: "title", body: "text", topic: "topic" }
    - **Output**: Returns an ***object*** with an "article" key containing the posted article ***object***.
- **DELETE**: deletes the article with the ID provided and all comments on that article. Returns nothing.
    - **Parameters**: article_id (number)
    - **Output**: N/A

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
    - **Queries:**: "p", "limit"
    - **Output**: Returns an ***object*** with a "comments" key containing an ***array*** of comments from the database.
- **POST**: posts a comment to the requested article ID and retrieves the posted comment.
    - **Parameters**: article_id (number)
    - **Body**: {username: "string", body: "string"}
    - **Output**: Returns an ***object*** with a "comment" key containing an ***array*** with the posted comment.

### /api/comments/:comment_id
- **DELETE**: deletes the comment with the ID provided. Returns nothing.
    - **Parameters**: comment_id (number)
    - **Output**: N/A
- **PATCH**: increase or decrease the votes key on the comment with the ID provided. Returns the updated comment.
    - **Parameters**: comment_id (number)
    - **Body**: { inc_votes : 1 }
    - **Output**: Returns an ***object*** with a "comment" key containing an updated (***object***) comment from the database.

### /api/users
- **GET**: retrieves the list of users present in the database.
    - **Parameters**: N/A
    - **Output**: Returns an ***object*** with an "users" key containing an ***array***  with all (***object***) users from the database.

### /api/users/:username
- **GET**: retrieves a user from the database.
    - **Parameters**: username
    - **Output**: Returns an ***object*** with an "user" key containing an (***object***) user from the database.

