"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// ─── Middleware ──────────────────────────────────────────────────────
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ─── Root ────────────────────────────────────────────────────────────
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
// ─── Health check ───────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// ─── API Routes ─────────────────────────────────────────────────────
app.use("/api", taskRoutes_1.default);
// ─── Start ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Mini Task Manager API running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map