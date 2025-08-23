import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 import { Container, ITask } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ContainerWithTasks {
  id: string;
  title: string;
  tasks: ITask[]; // full tasks array here
}
// export function normalizeKanban(data: ContainerWithTasks[]) {
//   const tasks: ITask[] = [];
//   const containers: Container[] = data.map((container) => {
//     const taskIds = container.tasks.map((task) => {
//       tasks.push(task);
//       return task.id;
//     });
//     return { id: container.id, title: container.title, taskIds };
//   });
//   return { tasks, containers };
// }
