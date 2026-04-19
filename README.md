# Workflow Automation Engine

A powerful workflow automation system that enables businesses to automate repetitive tasks and processes through event-driven workflows.

## Project Overview

The Workflow Automation Engine is a full-stack application that allows users to:
- **Define custom workflows** with trigger events and automated actions
- **Execute workflows** automatically when specific events occur
- **Monitor workflow execution** with detailed logging
- **Scale operations** by chaining multiple actions together

### Use Cases

This system is ideal for automating:
- **User Onboarding**: Send welcome emails, create user accounts, add to CRM when a user signs up
- **Order Processing**: Send confirmation emails, update inventory, notify shipping team when an order is placed
- **Payment Processing**: Generate invoices, update subscription status, send receipts when payment is received
- **Customer Engagement**: Trigger follow-up emails, schedule calls, update CRM based on user actions

### Key Features

- **Event-Driven Architecture**: Workflows execute automatically when specified events occur
- **Flexible Triggers**: Support for multiple event types (USER_SIGNUP, ORDER_CREATED, etc.)
- **Action Strategies**: Extensible action system (Email, Webhook, Slack, and more)
- **Real-Time Execution**: Immediate processing of events with status tracking
- **Visual Interface**: Intuitive React frontend for workflow management
- **RESTful API**: Clean backend API for integration with other systems
- **Audit Logging**: Complete execution history for debugging and compliance

### Technology Stack

- **Frontend (25%)**: React + Vite - Modern, fast UI for workflow management
- **Backend (75%)**: Node.js + Express + TypeScript - Robust API server
- **Database**: PostgreSQL - Reliable data storage with Prisma ORM
- **Design Patterns**: Strategy Pattern, Factory Pattern, Repository Pattern

## Architecture

- **Frontend (25%)**: React + Vite (UI for workflow management)
- **Backend (75%)**: Node.js + Express + TypeScript (API, workflow execution)
- **Database**: PostgreSQL (via Prisma ORM)

## Project Structure

```
├── src/                   # Backend API (75%)
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── repositories/    # Data access layer
│   ├── engine/          # Workflow execution engine
│   ├── factories/       # Action strategy factory
│   ├── strategies/      # Action implementations
│   ├── lib/             # Utilities (Prisma client)
│   └── index.ts         # Backend entry point
├── frontend/             # Frontend (25%)
│   ├── src/
│   │   ├── App.jsx      # Main React component
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Styles
│   ├── index.html       # HTML template
│   ├── vite.config.js   # Vite configuration
│   └── package.json
├── prisma/              # Database schema
│   └── schema.prisma
├── prisma.config.ts     # Prisma configuration
└── package.json         # Monorepo root scripts
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Setup

1. **Install all dependencies:**
```bash
npm run install:all
```

2. **Configure environment variables:**
```bash
# Create .env file in root
DATABASE_URL=your_database_url
PORT=3000
```

3. **Set up database:**
```bash
npx prisma generate
npx prisma db push
```

### Running the Application

**Important:** The backend must run in the foreground (not background) to stay alive.

**Terminal 1 - Backend (must stay open):**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run frontend:dev
```

**Or individually:**
```bash
# Backend only (foreground)
npm run backend:dev

# Frontend only
npm run frontend:dev
```

### Access

- **Frontend**: http://localhost:5173 (or next available port)
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## Workflow Execution Flow

The workflow automation engine follows this execution flow:

```
1. Event Trigger
   ↓
2. Event Received by Backend (/events endpoint)
   ↓
3. WorkflowEngine identifies matching workflows
   - Filters active workflows
   - Matches by event type (USER_SIGNUP, ORDER_CREATED, etc.)
   ↓
4. For each matching workflow:
   - Log execution start (status: in_progress)
   - Execute each action in sequence
     - Email Action → Send email
     - Webhook Action → Call external API
     - Slack Action → Send Slack message
   - Log execution result (status: success/failed)
   ↓
5. Response sent to frontend
```

### How It Works

1. **Create a Workflow:**
   - Define workflow name
   - Select trigger event (e.g., USER_SIGNUP)
   - Add actions with configuration (e.g., send email to user)
   - Workflow saved as "inactive" by default

2. **Activate Workflow:**
   - Call `/workflows/:id/activate` endpoint
   - Workflow status changes to "active"
   - Now ready to respond to events

3. **Trigger Event:**
   - Send event to `/events` endpoint with:
     - `eventType`: The event type to match
     - `payload`: Data to pass to actions
   - Engine finds all active workflows matching the event type
   - Executes each workflow's actions sequentially

4. **Action Execution:**
   - Each action uses a strategy pattern
   - ActionFactory creates appropriate action strategy
   - Strategy executes with provided configuration
   - Results logged in ExecutionLog table

### Example Workflow

**Scenario:** Send welcome email when user signs up

1. **Create Workflow:**
   - Name: "User Welcome Email"
   - Trigger Event: USER_SIGNUP
   - Action: EMAIL
   - Config: `{ recipient: "{{email}}", subject: "Welcome!", body: "Thanks for signing up" }`

2. **Activate Workflow**
   - Call POST `/workflows/{id}/activate`

3. **Trigger Event:**
   ```json
   POST /events
   {
     "eventType": "USER_SIGNUP",
     "payload": {
       "userId": "123",
       "email": "newuser@example.com",
       "name": "John Doe"
     }
   }
   ```

4. **Result:**
   - Engine finds "User Welcome Email" workflow
   - Executes EMAIL action with provided payload
   - Logs execution as success
   - Returns response to frontend

## Features

### Frontend
- Create workflows with triggers and actions
- List all workflows
- Activate/deactivate workflows
- Trigger events to execute workflows
- Real-time response display

### Backend API

**Workflow Endpoints:**
- `POST /workflows` - Create a new workflow
- `GET /workflows` - List all workflows
- `POST /workflows/:id/activate` - Activate a workflow
- `POST /events` - Trigger an event

**Supported Event Types:**
- USER_SIGNUP
- USER_LOGIN
- ORDER_CREATED
- PAYMENT_RECEIVED

**Supported Action Types:**
- EMAIL - Send email
- WEBHOOK - Call webhook
- SLACK - Send Slack message

## Scripts

- `npm run dev` - Start backend server
- `npm run start` - Start backend in production
- `npm run build` - Build backend TypeScript
- `npm run backend:dev` - Start backend (alias)
- `npm run frontend:dev` - Start frontend development server
- `npm run frontend:install` - Install frontend dependencies
- `npm run install` - Install all dependencies


