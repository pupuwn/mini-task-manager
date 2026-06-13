import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root
app.get("/", (_req, res) => {
  res.json({
    name: "Mini Task Manager API",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      tasks: "GET /api/tasks",
      createTask: "POST /api/tasks",
      getTask: "GET /api/tasks/:id",
      updateStatus: "PUT /api/tasks/:id/status",
      taskAuditLogs: "GET /api/tasks/:id/audit-logs",
      allAuditLogs: "GET /api/audit-logs",
    },
  });
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api", taskRoutes);

// Start
app.listen(PORT, () => {
  console.log(`Mini Task Manager API running on http://localhost:${PORT}`);
});

export default app;
