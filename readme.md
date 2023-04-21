### Express MVC Boilerplate
This project uses MongoDB as the main database and Redis to store refresh tokens. Some concepts that are included are JWT Authentication, RBAC, Uploader, Data Seeder (mainly used for RBAC), Data Validation, Logger and etc.

#### Install Dependencies
`npm install -g nodemon`

`npm install`

#### Run
`npm run dev`

#### Notes
Please make sure to create a new .env file based on the .env.sample file. By default, using username and passwords for Mongodb and Redis is disabled. you can enable or disable this option by set `DATABASE_NAME_USE_AUTH` in the .env file by setting to `true` or `1` or `false` or `0`.