# WorkSphere Backend — Daily Log

## Day 1 — Backend Foundation Setup

### Objective
Set up a clean production-ready backend foundation.

### Completed
- Initialized Node project
- Setup Express server
- Configured environment variables with validation
- Implemented MongoDB connection abstraction
- Ensured fail-fast behavior on DB failure
- Added /health route
- Structured project folders (config, routes, modules, etc.)
- Initialized Git repository
- Pushed initial commit to GitHub

### Validation
- Server starts only after DB connects
- If DB is down → process exits
- /health endpoint returns status: "ok"

### Notes
- Used ES modules
- Separated app.js and server.js responsibilities

---------------------------------------------------------------------------------------

## Day 2 — Auth Module & User Data Modeling

### Objective
Design and scaffold the authentication module with a clean, secure User database model.
Focus only on structure and data modeling — not full auth flow.

### Completed
- Created auth module structure (routes, controller, service, model)
- Designed User database schema using Mongoose
- Implemented required and unique constraints on email
- Added role-based access foundation using roles array
- Restricted role values using enum
- Configured default role assignment for new users
- Enabled automatic timestamps (createdAt, updatedAt)
- Ensured schema separation from auth logic and validation logic

### Validation
- User schema enforces required fields
- Duplicate emails are prevented at DB level
- Roles are safely restricted to allowed values
- createdAt and updatedAt are auto-managed by MongoDB
- No auth logic inside the schema

### Notes
- Focused only on data modeling and architecture
- No password hashing yet (planned for next phase)
- No JWT middleware yet
- Auth logic intentionally kept out of model

---------------------------------------------------------------------------------------

## Day 3 — Authentication: Signup & Login

### Objective
Enable secure user authentication using email/password and JWT-based access tokens.

### Completed
- Implemented user signup API with email and password
- Added password hashing using bcrypt before storing users
- Implemented user login API with credential verification
- Integrated JWT-based authentication for login flow
- Centralized JWT token generation logic in a utility module
- Configured access token expiration (24 hours)
- Validated presence of JWT secret at application startup
- Exposed auth routes under versioned API path (/api/v1/auth)
- Maintained modular separation between routes, models, utils, and config

### Validation
- Users can successfully sign up with valid credentials
- Duplicate email registration is prevented
- Passwords are securely hashed and never stored in plaintext
- Invalid login attempts are rejected with appropriate status codes
- Successful login returns a signed JWT access token
- JWT tokens expire after the configured duration
- Application fails to start if JWT secret is missing

### Notes
- JWT payload kept minimal (userId only)
- Token generation logic extracted for reuse and maintainability
- Signup flow currently returns a JWT for immediate authenticated access
- Auth middleware and protected routes intentionally deferred

---------------------------------------------------------------------------------------

## Day 4 — Auth Middleware & Protected Routes

### Objective
Secure application APIs by introducing JWT-based authentication middleware and enforcing protected access to routes.

### Completed
- Implemented reusable JWT authentication middleware
- Extracted and validated access token from Authorization header
- Verified JWT signature and expiration using shared secret
- Attached decoded user payload to req.user for downstream access
- Handled missing, invalid, and expired token scenarios gracefully
- Applied auth middleware to a sample protected route
- Verified protected route behavior using Postman

### Validation
- Requests without Authorization header are rejected with 401
- Requests with invalid or expired tokens are rejected with 401
- Requests with valid tokens successfully access protected routes
- Auth middleware blocks request execution before controller on failure
- Authenticated user context is available in controllers via req.user

### Notes
- Authentication logic cleanly separated from auth routes
- Middleware handles authentication only (no role/permission checks yet)
- Authorization (RBAC) intentionally deferred to a later phase
- Middleware designed to be reusable across multiple routes
- Focused on correctness and request lifecycle integration rather than over-engineering