import User from "./User";
import Status from "./Status";
import Priority from "./Priority";

// Type definition for Task model - Task.d.ts
type Task = {
    id?: number;
    content: string;
    deadline?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    user: User;
    status?: Status;
    priority?: Priority;
};

export default Task;
