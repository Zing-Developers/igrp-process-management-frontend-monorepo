# iGRP Platform Process Management Client

A TypeScript client library and type definitions for interacting with the iGRP Process Management API. This monorepo provides a simple and type-safe way to manage processes, tasks, and areas in the iGRP platform.

## Requirements

- Node.js 20.x.x or higher
- TypeScript 5.2.2 or higher

## Installation

```bash
npm install @igrp/platform-process-management-client-ts
npm install @igrp/platform-process-management-types
```

## Configuration

This project is built with:

- Node.js 20.x.x
- Vite 6.3.5
- TypeScript (Vanilla TS template)
- Vitest for testing

## Project Structure

igrp-process-manager-frontend-monorepo/
├── packages/
│ ├── client/ # Client implementations for API calls
│ │ ├── src/
│ │ │ ├── client/ # Resource clients
│ │ │ ├── utils/ # Utility functions
│ │ │ └── index.ts # Main exports
│ │ └── package.json
│ └── types/ # Type definitions
│ ├── src/
│ │ ├── area.ts # Area-related types
│ │ ├── process.ts # Process-related types
│ │ ├── task.ts # Task-related types
│ │ ├── user.ts # User-related types
│ │ ├── response.ts # API response types
│ │ └── index.ts # Type exports
│ └── package.json
├── apps/
│ └── demo-app/ # Demo application
└── package.json # Monorepo configuration

## Usage

### Basic Usage

```typescript
import { ProcessManagementClient } from "@igrp/platform-process-management-client-ts";
import type {
  Process,
  Task,
  Area,
} from "@igrp/platform-process-management-types";

// Create a client instance
const client = ProcessManagementClient.create({
  baseUrl: "https://your-api-endpoint.com",
  timeout: 30000, // optional, defaults to 30000 (30 seconds)
  // Called before every request, so refreshed bearer tokens are supported.
  getHeaders: async () => ({
    Authorization: `Bearer ${await getAccessToken()}`,
  }),
});

// Use the client to interact with the API
async function getProcesses() {
  try {
    const response = await client.processes.getProcesses();
    console.log("Processes:", response.data);
  } catch (error) {
    console.error("Error fetching processes:", error);
  }
}
```

### Managing Processes

```typescript
// Get all processes
const processes = await client.processes.getProcesses();

// Get process instances
const instances = await client.processes.getProcessInstances({
  procReleaseKey: "my-process",
  status: "RUNNING",
});

// Create and start a process instance
const newInstance = await client.processes.createAndStartProcess({
  processKey: "process-key",
  applicationBase: "my-app",
  variables: [
    { name: "variable1", value: "value1" },
    { name: "variable2", value: "value2" },
  ],
});
```

### Managing Tasks

```typescript
// Get all tasks
const tasks = await client.tasks.getTasks({
  status: "CREATED",
  user: "john.doe",
});

// Get tasks assigned to current user
const myTasks = await client.tasks.getMyTasks();

// Get a specific task
const task = await client.tasks.getTaskById("task123");

// Complete a task
await client.tasks.completeTask("task123", {
  variables: [{ name: "result", value: "approved" }],
});

// Claim a task
await client.tasks.claimTask("task123");

// Assign a task to another user
await client.tasks.assignTask("task123", {
  user: "jane.smith",
  note: "Assigning to specialist",
});

// Unclaim/Release a task
await client.tasks.unclaimTask("task123", {
  note: "Releasing task back to pool",
});
```

### Managing Areas

```typescript
// Get all areas
const areas = await client.areas.getAreas({
  status: "ACTIVE",
  parentId: "parent123",
});

// Get a specific area
const area = await client.areas.getAreaById("area123");

// Create a new area
const newArea = await client.areas.createArea({
  code: "NEW_DEPARTMENT",
  name: "New Department",
  description: "A new organizational area",
  applicationBase: "my-app",
  parentId: "parent123",
});

// Update an area
await client.areas.updateArea("area123", {
  code: "NEW_DEPARTMENT",
  name: "New Department",
  description: "Updated description",
  applicationBase: "my-app",
});

// Get processes associated with an area
const areaProcesses = await client.areas.getAreaProcesses("area123", {
  status: "ACTIVE",
});

// Associate a process with an area
await client.areas.associateProcessToArea("area123", {
  processKey: "approval-process",
  releaseId: "release-1",
  name: "Approval Process",
});

// Remove process from area
await client.areas.removeProcessFromArea("area123", "process456");
```

### Managing M2M Keys

```typescript
const keys = await client.m2mKeys.getKeys();
const created = await client.m2mKeys.createKey({
  clientName: "process-worker",
  permissions: ["process:read"],
  email: "owner@example.com",
});
await client.m2mKeys.rotateKey(created.data.id!);
await client.m2mKeys.revokeKey(created.data.id!);
```

## API Reference

### ProcessManagementClient

The main client that provides access to all API resources.

```typescript
const client = ProcessManagementClient.create({
  baseUrl: "https://your-api-endpoint.com",
  timeout: 30000,
  headers: { Authorization: "Bearer token" },
});
```

### ProcessClient

Methods for managing processes and process instances:

- `getProcesses(filters?)`: Get all processes with optional filters
- `getProcessInstances(filters?)`: Get process instances with filters
- `getProcessInstanceById(id)`: Get a specific process instance
- `createAndStartProcess(data)`: Create and start a process instance
- `createProcessInstance(data)`: Create without starting
- `startProcessInstance(id, data)`: Start an existing process instance
- `configureProcessArtifact(id, taskKey, data)`: Configure a task artifact
- `deployProcess(data)`: Deploy BPMN XML

### TaskClient

Methods for managing tasks:

- `getTasks(filters?)`: Get all tasks with optional filters
- `getMyTasks(filters?)`: Get tasks assigned to current user
- `getTaskById(id)`: Get a specific task by ID
- `completeTask(id, variables?)`: Complete a task with optional variables
- `claimTask(id)`: Claim a task
- `unclaimTask(id, body?)`: Release/unclaim a task
- `assignTask(id, params)`: Assign a task to a user
- `getAvailableTasks(filters?)`: Get unassigned tasks
- `getTasksByProcessInstance(processInstanceId, params?)`: Get tasks by process instance
- `getTasksByUser(userId, params?)`: Get tasks by user

### AreaClient

Methods for managing areas:

- `getAreas(filters?)`: Get all areas with optional filters
- `getAreaById(id)`: Get a specific area by ID
- `createArea(area)`: Create a new area
- `updateArea(id, area)`: Update an existing area
- `deleteArea(id)`: Delete an area
- `getAreaProcesses(id, filters?)`: Get processes associated with an area
- `associateProcessToArea(areaId, processData)`: Associate a process with an area
- `removeProcessFromArea(areaId, processId)`: Remove a process from an area

### ActivityClient and M2MKeyClient

- `activities`: activity detail, progress, and instance operations
- `m2mKeys`: list, create, rotate, and revoke machine-to-machine keys

## Type Definitions

The `@igrp/platform-process-management-types` package provides comprehensive TypeScript definitions:

### Core Types

- `Process`: Process definition and metadata
- `ProcessInstance`: Running process instance
- `Task`: Task definition and state
- `Area`: Organizational area structure
- `User`: User information

### Response Types

- `ApiResponse<T>`: Standard API response wrapper
- `PaginatedResponse<T>`: Paginated response for list endpoints
- `PostResponse`: Response for POST operations
- `ApiError`: Error response structure

## Error Handling

The client provides a standardized error handling mechanism:

```typescript
import { ApiClientError } from "@igrp/platform-process-management-client-ts";

try {
  const processes = await client.processes.getProcesses();
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error(`API Error (${error.status}): ${error.message}`);
    console.error("Details:", error.details);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Development

### Building the project

```bash
# Build all packages
pnpm build

# Build specific packages
pnpm build:types
pnpm build:client
```

### Publishing packages

```bash
# Release all packages
pnpm release

# Deploy specific packages
pnpm deploy:types
pnpm deploy:client
```

## Testing

Unit tests are written using [Vitest](https://vitest.dev/), and test coverage includes all major client functionalities.

### Running Tests

To run the test suite:

```bash
pnpm test
```

To run tests in watch mode:

```bash
pnpm test:watch
```

To check test coverage:

```bash
pnpm test:coverage
```

### Test Structure

Each client test follows a consistent mock-based structure to isolate API logic:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
// Mock BaseApiClient and inject into ProcessClient, TaskClient, AreaClient
```

Mocks are created for:

- `get`
- `post`
- `put`
- `delete`

This ensures no real HTTP calls are made during test execution.

### Linting and Type Safety

Before submitting changes, ensure code and tests pass linting and type checks:

```bash
pnpm lint
pnpm typecheck
```

## Contributing

Contributions to the iGRP Process Management client are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Write tests for your changes
5. Run the tests to ensure they pass
6. Submit a pull/merge request

## License

MIT License - see the LICENSE file for details.

## Packages

- **@igrp/platform-process-management-client-ts**: Main client library
- **@igrp/platform-process-management-types**: TypeScript type definitions

Both packages are published to the NOSI registry at `https://sonatype.nosi.cv/repository/igrp/`
