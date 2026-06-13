import { Task, Status } from "../types";
export declare const taskRepository: {
    findAll(): Task[];
    findById(id: string): Task | undefined;
    create(title: string, description?: string): Task;
    updateStatus(id: string, status: Status): Task | undefined;
    /** Exposed only for testing — clears all data */
    _clear(): void;
};
//# sourceMappingURL=taskRepository.d.ts.map