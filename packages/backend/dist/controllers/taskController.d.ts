import { Request, Response } from "express";
export declare const taskController: {
    getAllTasks(_req: Request, res: Response): void;
    getTaskById(req: Request, res: Response): void;
    createTask(req: Request, res: Response): void;
    updateTaskStatus(req: Request, res: Response): void;
    getAuditLogsByTaskId(req: Request, res: Response): void;
    getAllAuditLogs(_req: Request, res: Response): void;
};
//# sourceMappingURL=taskController.d.ts.map