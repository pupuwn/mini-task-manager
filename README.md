# Mini Task Manager

A full-stack, lightweight task management application built as a take-home assignment. This application allows users to create tasks, update their statuses through a predefined workflow (`to_do` -> `pending` -> `in_progress` -> `done`), and view comprehensive audit logs of all state changes.

## How to Run

### Backend
```bash
cd packages/backend
npm install
npm run dev  # runs on http://localhost:3001
```

### Frontend
```bash
cd packages/frontend
npm install
npm run dev  # runs on http://localhost:5173
```

## Architecture

This application uses a clean, **Layered Architecture** on the backend to enforce the separation of concerns and maintain testability.

* **Router (`taskRoutes.ts`)**: The entry point for HTTP requests. It contains no business logic; it simply routes endpoints to the appropriate controller methods.
* **Controller (`taskController.ts`)**: Handles the HTTP request/response cycle. It parses inputs, calls the service layer, and maps service outputs or domain errors to standard HTTP status codes and JSON responses.
* **Service (`taskService.ts`)**: The core of the application. All business logic, validations (e.g., status transition sequence, actor validation), and orchestration reside here. It ensures that operations like updating a task's status and appending to the audit log happen atomically.
* **Repository (`taskRepository.ts`, `auditLogRepository.ts`)**: The data access layer. It abstracts away the underlying storage mechanism (currently in-memory Maps and Arrays) from the business logic.

**Frontend to Backend Communication**:
The frontend, built with React and Vite, communicates with the backend via RESTful HTTP calls using `axios`. The API calls are centralized in a dedicated service module (`api.ts`), keeping the React components completely decoupled from network logic.

## Assumptions

- **No authentication**: Actor selection is simulated via a predefined dropdown (`john.doe`, `jane.smith`, `alice.dev`, `bob.pm`, `charlie.qa`).
- **In-memory storage**: Chosen for simplicity and ease of setup for a take-home assignment. Data resets whenever the server restarts.
- **Timezones**: UTC timestamps are used throughout the system for consistency.
- **Status Workflow**: `"done"` is a terminal status — no further status changes are allowed once a task reaches this state.
- **Cascading Deletes**: Deleting a task permanently removes all of its associated audit logs. This is a known limitation for the sake of simplicity.

## Trade-offs

- **In-memory vs persistent storage**: We chose simplicity and zero-configuration over durability for the MVP scope. A real-world application would use a relational database like PostgreSQL.
- **Duplicated types between frontend and backend**: A pragmatic choice over introducing monorepo tooling (like Turborepo or npm workspaces with shared packages) to keep the repository extremely simple for a 3-5 hour task.
- **No frontend status validation**: The application trusts the backend to enforce the status workflow. The frontend optimistically shows the next valid status based on sequence logic but relies on the backend to reject invalid transitions.

## Reflective Questions

**1. How do you ensure audit logs are not modified?**
Audit logs are stored in a separate append-only Map/Array. The repository layer only exposes an `addLog()` method — no `updateLog()` or `deleteLog()` methods exist. The service layer never calls any mutation on existing logs.

**2. Which part of this solution is most at risk under high user load?**
The in-memory store is not thread-safe and would lose data on crashes. The biggest risk in a multi-user scenario is race conditions on the status update — two simultaneous PUT requests could both read the same "current status" and both succeed, creating duplicate audit logs. Solution: database transactions or optimistic locking.

**3. If this grew into a large system, what would you refactor first and why?**
Replace the in-memory storage with a proper database (e.g., PostgreSQL). The repository interface is already abstracted, making this a clean swap. Second: extract the audit log to a dedicated service with its own queue/store, so it can scale independently and handle massive write volumes without blocking core task updates.

**4. How did you use AI in this task, and how did you validate the output?**
AI was used to scaffold boilerplate (tsconfig, package.json), suggest layer structure, generate type definitions, and implement UI components based on Tailwind design systems. I validated by: reading all generated code line-by-line, manually testing each endpoint with curl/Postman, and ensuring the idempotency and status-flow logic matched the spec before committing.

## If I Had More Time

- Add persistent storage (SQLite via `better-sqlite3` or PostgreSQL).
- Add frontend status validation with user-friendly error messages and toast notifications.
- Add task filtering, searching, and sorting by status or priority.
- Add pagination for audit logs to support long-running tasks.
- Write extensive unit tests for the service layer (especially testing the edges of the status transition logic).


## AI Usage & Validation

I used AI as an assistant in completing this assignment. Here is a breakdown of its usage:

### Sections Assisted by AI

**Setup & boilerplate** — AI was used to initialize tsconfig.json, package.json, the folder structure, scaffold Express middleware, and initial React component templates. This section involves conventional and repetitive tasks.

**Initial type definitions** — AI suggested the initial structure for the `Task` and `AuditLog` interfaces, which I then modified: adding the `taskTitle` field as a snapshot in the audit log (so the log remains readable even if the task is deleted), and defining the `message` field as a human-readable string that meets the format specified in the spec.

### Sections I Decided on Myself

- **Business logic**: the `isValidTransition()` function, idempotency check, and the sequence of operations in `updateStatus()` (check existence → check idempotency → validate transition → update task → create log). This sequence is critical, and I wrote and understood it myself.
- **All architectural decisions**: in-memory vs. database, layered structure, hard delete vs. soft delete, duplicated types vs. shared package.
- **All documentation**: This README, assumptions, trade-offs, and reflective answers are my own thoughts.


### How I validate AI output

1. **Compile check**: `npm run build` must complete without errors — no `any` types hiding issues.

2. **Manual testing of critical business rules**:
   - PUT the same status twice → no new audit logs are created (idempotency ✓)
   - PUT skipping a transition (to_do → in_progress) → 400 response (✓)
   - PUT reversing a transition (in_progress → pending) → 400 response (✓)
   - PUT when status is already done → rejected (✓)
   - GET audit logs → entries appear in chronological ascending order (✓)

3. **Read critical functions line by line**: specifically `taskService.ts:updateStatus()` — I manually traced the sequence of operations before testing.

4. **End-to-end UI testing**: run the complete happy path from the browser, including switching actors and verifying that the audit log displays the correct actor.