import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Repositories
import { PrismaWorkflowRepository } from "./repositories/prisma/PrismaWorkflowRepository";
import { PrismaUserRepository, PrismaTriggerRepository, PrismaActionRepository } from "./repositories/prisma/PrismaOtherRepositories";

// Services
import { WorkflowService } from "./services/WorkflowService";

// Controllers
import { WorkflowController } from "./controllers/WorkflowController";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

try {
  // Dependency Injection
  const workflowRepo = new PrismaWorkflowRepository();
  const userRepo = new PrismaUserRepository();
  const triggerRepo = new PrismaTriggerRepository();
  const actionRepo = new PrismaActionRepository();

  const workflowService = new WorkflowService(
    workflowRepo,
    userRepo,
    triggerRepo,
    actionRepo
  );

  const workflowController = new WorkflowController(workflowService);

  // Routes
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Workflow Endpoints
  app.post("/workflows", (req, res) => workflowController.create(req, res));
  app.get("/workflows", (req, res) => workflowController.list(req, res));
  app.post("/workflows/:id/activate", (req, res) => workflowController.activate(req, res));

  // Trigger Endpoint (Receive events)
  app.post("/events", (req, res) => workflowController.trigger(req, res));

  // Mock User Creation (for testing)
  app.post("/users", async (req, res) => {
    try {
      const { name, email } = req.body;
      const user = await userRepo.create({ name, email });
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const server = app.listen(PORT, () => {
    console.log(`[Workflow Engine] running on http://localhost:${PORT}`);
  });

  // Handle server errors
  server.on('error', (error: any) => {
    console.error('Server error:', error);
    process.exit(1);
  });

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });

} catch (error) {
  console.error('Failed to initialize server:', error);
  process.exit(1);
}
