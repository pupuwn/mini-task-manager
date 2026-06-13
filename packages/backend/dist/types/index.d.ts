export type Status = "to_do" | "pending" | "in_progress" | "done";
export declare const STATUS_SEQUENCE: readonly Status[];
export declare const PREDEFINED_ACTORS: readonly ["john.doe", "jane.smith", "alice.dev", "bob.pm", "charlie.qa"];
export type Actor = (typeof PREDEFINED_ACTORS)[number];
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
export interface AuditLog {
    id: string;
    taskId: string;
    taskTitle: string;
    actor: string;
    fromStatus: Status;
    toStatus: Status;
    changedAt: string;
    message: string;
}
//# sourceMappingURL=index.d.ts.map