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

---------------------------------------------------------------------------------------

## Day 5 — Organization & Multi-User Foundation

### Objective
Introduce basic organization support to enable a multi-user, multi-tenant system.Ensure every user belongs to an organization with a defined role.

### Completed
- Designed and implemented Organization data model
- Added automatic organization creation during user signup
- Assigned signup user as admin of the newly created organization
- Updated User schema to include:
    1. organizationId reference
    2. role within the organization (admin, member)
- Implemented basic invite system:
    1. Admin can invite users by email
    2. Invitation stored with pending status
- Implemented invite acceptance flow:
    1. User created via invite
    2. User attached to inviter’s organization
    3. Default role assigned as member
    4. Invite marked as accepted after use
- Enforced admin-only access for invite creation

### Validation
- Organization is automatically created on first user signup
- Signup user is correctly assigned admin role
- Users cannot exist without an associated organization
- Only admins can invite new users to an organization
- Invited users successfully join the correct organization
- Duplicate or invalid invites are prevented
- Cross-organization user attachment is not possible

### Notes
- Organization–user relationship kept minimal and explicit
- Invitation flow implemented without email delivery (manual acceptance)
- RBAC and permission granularity intentionally deferred
- Schema and logic structured to allow future multi-org and role expansion
- Focused on correctness, data integrity, and org-level isolation

---------------------------------------------------------------------------------------

## Day 6 — Role-Based Access Control (RBAC)

### Objective
Implement a robust authorization layer to strictly control who can perform which actions within the system, based on organizational roles. Ensure clear separation between authentication and authorization.

### Completed
- Finalized role definitions used across the system:
    1. `admin`
    2. `manager`
    3. `user`
- Designed and documented a permission matrix covering:
    1. Organization-level actions
    2. Project-level actions
    3. Task-level actions
- Implemented centralized RBAC middleware:
    1. Accepts allowed roles as parameters
    2. Validates authenticated user role against permitted roles
    3. Blocks unauthorized requests before controller execution
- Applied RBAC middleware at router level to critical APIs, including:
    1. Organization invite routes
    2. Project creation, update, and deletion routes
    3. Task assignment and deletion routes
- Enforced deny-by-default authorization strategy
- Integrated RBAC failures with existing error-handling flow

### Validation
- `admin` users can perform all permitted actions within the organization
- `manager` users can manage projects and tasks but cannot perform destructive organization-level actions
- `user` role is restricted to execution-level actions only
- Unauthorized role access consistently returns HTTP `403 Forbidden`
- Authorization checks run before controller logic
- Controllers contain no role or permission logic
- Authentication (JWT) and authorization (RBAC) remain fully decoupled

### Notes
- RBAC implementation is strictly role-based
- Resource ownership checks (e.g., task assignee validation) are intentionally handled outside RBAC
- Permission matrix serves as a long-term authorization contract
- Middleware is reusable and easily extensible for future roles or permissions
- Clean authorization failures prevent information leakage

---------------------------------------------------------------------------------------

## Day 7 — Error Handling & Input Validation

### Objective
Introduce centralized error handling and structured request validation to ensure consistent API behavior, predictable failure responses, and improved system reliability.

### Completed
- Implemented centralized global error handling middleware
- Created a reusable custom error class (AppError) for controlled application errors
- Integrated centralized error handling into the Express request lifecycle
- Implemented request validation using Zod
- Built reusable validation middleware for validating request bodies
- Separated validation schemas from business logic modules
- Standardized API error response structure across the application
- Ensured validation failures propagate through the centralized error handler
- Removed ad-hoc error responses from controllers in favor of consistent handling

### Validation
- Invalid request payloads are rejected before reaching controllers
- Validation errors return structured responses with clear messages
- Application errors thrown via AppError return correct HTTP status codes
- Unexpected runtime errors are safely caught by the global error handler
- No unhandled promise rejections or server crashes occur due to request errors
- Controllers remain focused on business logic without embedded error formatting

### Notes
- Validation schemas are defined separately from validation logic to maintain modular architecture
- Controllers and services throw errors rather than manually formatting responses
- Global error handler acts as the single response formatter for failures
- Zod ensures strict schema enforcement for request payloads
- This setup prepares the system for scalable API development and consistent error reporting

---------------------------------------------------------------------------------------

## Day 8 — Project Module (CRUD + Org Isolation)

### Objective
Implement a secure and scalable Project module within organizations, ensuring strict access control, data isolation, and production-ready API behavior

### Completed
- Implemented Project CRUD APIs (Create, Read, Update, Delete)
- Enforced organization-level data isolation using `orgId`
- Integrated RBAC for project actions (admin, manager, user)
- Added input validation and defensive checks (including ObjectId validation)
- Implemented pagination with query parameters (`page`, `limit`)
- Sorted project listing by `createdAt` in descending order
- Implemented soft delete using `isDeleted` flag and `deletedAt` timestamp
- Excluded deleted projects from all read operations
- Added scheduled cleanup using cron job to permanently remove old deleted projects
- Created compound indexes for optimized query performance
- Enforced unique project names within an organization (partial index)

### Validation
- Only authorized roles can create, update, or delete projects
- Users can access only projects belonging to their organization
- Invalid or malformed IDs are rejected with proper error responses
- Pagination returns correct subset of projects with metadata
- Deleted projects are not accessible via APIs
- Cron job successfully removes projects deleted beyond retention window
- No cross-organization data access is possible
- API responses remain consistent via centralized error handling

### Notes
- Maintained strict separation of concerns (controller → service → model)
- Avoided overengineering while ensuring production-grade fundamentals
- Indexing strategy aligned with query patterns for scalability
- Soft delete strategy ensures recoverability while supporting cleanup
- Module designed to integrate seamlessly with upcoming Task system

---------------------------------------------------------------------------------------

## Day 9 — Task Module (CRUD + Assignment + Org  Isolation)

### Objective
Implement a robust Task module within projects, enabling task creation, assignment, updates, and deletion while ensuring strict organization-level isolation and role-based access control

### Completed
- Designed and implemented Task data model with fields:
    * `title`, `description`, `status`, `assignedTo`, `projectId`, `orgId`, `createdBy`
- Implemented Task CRUD APIs (Create, Read, Update, Delete)
- Enforced project-level association:
    * Tasks must belong to a valid project
- Enforced organization-level isolation using orgId
- Implemented task assignment logic:
    * Tasks can only be assigned to users within the same organization
- Integrated RBAC for task operations:
    * Restricted creation, updates, and deletion based on roles
- Added input validation using Zod for task payloads
- Implemented defensive checks:
    * Invalid ObjectId handling
    * Non-existent project/user validation
- Ensured soft delete for tasks using `isArchived` flag
- Excluded archived tasks from read operations
- Maintained consistent service-controller separation

### Validation
- Tasks can only be created within valid projects belonging to the user’s organization
- Users cannot access or manipulate tasks outside their organization
- Task assignment is restricted to users within the same organization
- Invalid projectId or assignedTo user is rejected with proper error response
- Unauthorized roles are blocked via RBAC middleware (403 Forbidden)
- Archived tasks are not returned in fetch APIs
- All APIs return consistent structured responses via centralized error handling
- Controllers remain thin; business logic resides in service layer

### Notes
- Focused on clean data relationships between Task → Project → Organization
- Status logic intentionally kept basic (to be expanded in Day 10)
- Assignment validation handled at service layer, not RBAC
- Soft delete ensures recoverability and audit readiness
- Module designed for scalability with future filtering and pagination support

---------------------------------------------------------------------------------------

## Day 10 — Task Workflow (Status Logic + RBAC Constraints)

### Objective
Enhance the Task module by introducing business-level workflow rules, ensuring controlled task lifecycle transitions and enforcing role-based constraints beyond basic CRUD operations

### Completed
- Defined task status system using controlled enum:
    * `todo`, `in_progress`, `done`
- Implemented status transition rules:
    * `todo → in_progress`
    * `in_progress → done`
    * Prevented invalid transitions (e.g., `todo → done`)
- Enforced immutability of completed tasks:
    * Tasks marked as `done` cannot be modified or updated
- Separated status updates into a dedicated endpoint:
    * `/tasks/:taskId/status`
- Ensured single source of truth for status logic within service layer
- Integrated RBAC constraints for status updates:
    * `admin` and `manager` can update any task
    * `member` can update only tasks assigned to them
- Added defensive checks:
    * Prevent same status updates
    * Validate status values against allowed enum
    * Ensure task exists within organization scope
- Introduced workflow metadata tracking:
    * `startedAt` set when task moves to `in_progress`
    * `completedAt` set when task moves to `done`
- Updated general task update API:
    * Restricted to only `title` and `description` updates
    * Prevented status modification through generic update route
- Enforced data integrity across all update paths
- Maintained clean separation:
    * Controller → validation
    * Service → business logic

### Validation
- Invalid status transitions are rejected with proper error responses
- Tasks cannot be updated once marked as `done`
- Members cannot update tasks not assigned to them
- Admins and managers can update status of any task within organization
- Status updates only occur through dedicated endpoint (no bypass)
- Workflow timestamps (`startedAt`, `completedAt`) are correctly set
- All operations respect organization-level isolation (`orgId`)
- Error handling remains consistent via centralized middleware

### Notes
- Introduced workflow-driven backend design (beyond CRUD)
- Ensured domain invariants are enforced at service layer
- Avoided duplication by centralizing status logic
- RBAC handles access, while service layer enforces business rules
- Design aligns with real-world systems like Jira/Asana
- This step significantly improves system robustness and interview readiness

---------------------------------------------------------------------------------------

## Day 11 — Pagination & Filtering (Scalability Layer)

### Objective
Enhance existing Project and Task APIs to support scalable data retrieval using pagination and dynamic filtering. Ensure efficient querying, predictable performance, and clean API response design

### Completed
- Implemented pagination for Project and Task listing APIs
    * Supported query parameters: `page`, `limit`
    * Applied default values (`page = 1`, `limit = 10`)
    * Enforced upper limit cap (`limit ≤ 50`) to prevent abuse
- Integrated pagination logic at database level using:
    * `skip` and `limit` for controlled data retrieval
    * Parallel execution of data + count queries using `Promise.all`
- Standardized API response structure across modules:
    * Introduced consistent `data` and `pagination` format
    * Included `total`, `page`, `limit`, and `totalPages`
- Implemented filtering for Project APIs:
    * Supported filters: `status`, `ownerId`
    * Added search capability using regex on `name` and `description`
    * Introduced reusable filter builder utility for controlled query construction
- Implemented filtering for Task APIs:
    * Supported filters: `status`, `assignedTo`
    * Enforced role-based filtering:
        * `member` → only assigned tasks
        * `admin/manager` → optional assignment filtering
    * Added search support on `title` field
- Maintained strict organization-level data isolation:
    * All queries scoped with `orgId`
    * Verified project ownership before fetching tasks
- Improved query efficiency:
    * Used `.select()` to limit returned fields
    * Used `.lean()` for faster query execution
    * Avoided in-memory filtering; delegated all filtering to database
- Added defensive checks:
    * Pagination input validation (`NaN`, negative values)
    * ObjectId validation for `assignedTo`
    * Enum validation for `status`
- Maintained clean architecture:
    * Controller → request parsing & validation
    * Service → business logic & DB queries
    * Utils → reusable filtering logic (where applicable)

### Validation
- Pagination returns correct subsets of data based on page and limit
- Total count and totalPages are accurately calculated
- Filtering works independently and in combination (e.g., status + search)
- Role-based restrictions correctly limit task visibility for members
- Users cannot access data outside their organization
- Invalid query parameters are safely handled with defaults
- APIs return consistent response structure across Project and Task modules
- Query performance remains stable under larger datasets

### Notes
- Pagination ensures predictable response size and prevents large payloads
- Filtering is executed at database level for optimal performance
- Search implemented using regex (suitable for current scale; can be upgraded to text index later)
- Introduced controlled abstraction (buildFilter) without over-engineering
- Task API retains business-specific logic (RBAC, assignment) within service layer
- Designed APIs to align with real-world systems (Jira, Notion, Trello)
- This step transitions the backend from CRUD-based design to scalable API design

---------------------------------------------------------------------------------------

## Day 12 — Role Update (RBAC Enforcement + Atomic Constraints)

### Objective
Implement secure role update functionality within an organization while enforcing strict RBAC rules, organization isolation, and atomic database updates

### Completed
- Implemented role update API for updating user roles within an organization
- Enforced organization-level constraint:
    * Users can only be updated within the same orgId
- Implemented atomic update using single-query findOneAndUpdate:
    * Combined existence check, org validation, and role comparison in one DB call
- Prevented redundant updates:
    * Disallowed updating user to the same role using $ne condition
- Integrated role validation:
    * Restricted updates to predefined roles (admin, manager, member)
- Added ObjectId validation for userId to prevent invalid queries
- Ensured service-controller separation:
    * Controller handles validation
    * Service handles DB logic and constraints
- Used runValidators to enforce schema-level validation during update
- Used .lean() for optimized query performance

### Validation
- Role updates succeed only if:
    * Target user exists
    * User belongs to same organization
    * New role is valid
    * New role is different from current role
- Invalid userId is rejected before DB query
- Unauthorized or invalid updates return 404 (merged constraint failure)
- No cross-organization role updates are possible
- No redundant role updates occur
- API response returns updated user data correctly

### Notes
- Used constraint-based query approach instead of multiple DB calls for better efficiency and atomicity
- Merged multiple failure cases (not found, unauthorized, same role) into a single response for simplicity
- RBAC enforcement relies on middleware for requester validation; service enforces target-level constraints
- Implementation prioritizes performance, consistency, and clean architecture over granular error differentiation
- Design aligns with production patterns for secure role management systems

---------------------------------------------------------------------------------------

