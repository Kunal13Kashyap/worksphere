WORKSPHERE — DAY 1 TASK

Objective

Set up a clean, production-ready backend foundation.
Nothing more. No auth. No models.

TASK 1 — Initialize Backend

Inside backend/:

Initialize Node project

Install:

express

mongoose

dotenv

Create basic Express server

Make server listen on port from .env

TASK 2 — Folder Structure

Create:

backend/
 ├── src/
 │   ├── config/
 │   ├── modules/
 │   ├── middleware/
 │   ├── routes/
 │   ├── utils/
 │   ├── app.js
 │   └── server.js
 ├── .env
 ├── .gitignore
 ├── package.json


No extra folders.

TASK 3 — Environment Configuration

Inside .env:

PORT

MONGO_URI

JWT_SECRET (placeholder only)

No hardcoded values in code.

TASK 4 — MongoDB Connection

Create DB connection file inside config/

Connect using MONGO_URI

Log success once

If DB fails → exit process

Server must not silently continue.

TASK 5 — Health Route

Create:

GET /health


Response:

{
  status: "ok"
}


Test it using Postman or browser.

TASK 6 — Git Setup

git init

Proper .gitignore

First commit message:

feat: initialize backend structure with DB connection and health route


Push to GitHub

OUT OF SCOPE TODAY

Do NOT:

Add auth

Add user model

Add validation

Add roles

Add frontend

Add random packages

END OF DAY CHECKLIST

By tonight you must be able to say:

Server runs cleanly

DB connects

/health works

GitHub repo created

README created with basic project overview