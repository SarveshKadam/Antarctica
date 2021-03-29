# Antarctica

A RestfulAPI for Registration,Login & a getUserList.
## Features ⭐

⚡️ Includes proper authentication for accessing the end-points\
⚡️ Authentication which involves login and registration\
⚡️ Sort feature to sort the data by First Name, Last Name, EmailID, employeeID and Organization Name\
⚡️ Pagination to the data which incorporates limit and skip\


## Folder Structure

```
App
├── middleware
│   └── authentication.js
├── model
│   └── employees.js
│   └── users.js
├── routes
│   └── employees.js
│   └── users.js
├── config.env
│   
└── app.js

```
In the above folder structure, we have our main file `app.js` which executes when our application is a ran.
We have a `model` folder for our database and a `routes` folder for user and employee routes.
Finally, we have our `middleware` folder which takes care of authentication.

We have two collections named `employees` and `users` in the model folder.
User can be created by passing First Name,Last Name, EmailID, Password, a unique employeeID and Organization Name in the Request Body.
It generates a token with which user can access all the endpoints.

POST- /users

Then there's the login feature, which allows users to log in using their email address and password.

POST- /users/login

We can read all users as well as the profile with which you logged in

GET- /users
GET- /users/me

Finally, we have update and delete endpoint as well where user can only update and delete the record he has logged in with.

PATCH- /users/me
DELETE- /users/me

Similarly, we have CRUD operations for employees/organization collection as well.

## Technologies used 🛠️

- [Node](https://nodejs.org/en/) - JavaScript Runtime
- [Express](https://expressjs.com/) - Node.js Framework
- [MongoDB](https://www.mongodb.com/) - NoSQL Database

## Deployment 📦

I used [heroku](https://dashboard.heroku.com/apps) to deploy API's!
