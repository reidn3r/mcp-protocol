import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksTool {
  constructor(private readonly prismaService: PrismaService) {}

  @Tool({
    name: 'create-new-task',
    description:
      'Create a new task on database and return the created task object',
    parameters: z.object({
      name: z.string(),
      description: z.string(),
      author: z.string(),
    }),
  })
  async createTasks({ name, description, author }) {
    const newTask: Task = await this.prismaService.createTask(
      name,
      description,
      author,
    );
    return {
      content: [
        {
          type: 'text',
          text: `Tarefa Criada com ID: (${newTask.id})\nTask:${JSON.stringify(newTask)}`,
        },
      ],
    };
  }

  @Tool({
    name: 'list-all-tasks',
    description: 'List all tasks in database',
    parameters: z.object({}),
  })
  async getAllTasks() {
    const tasks = await this.prismaService.task.findMany({});
    return {
      content: [
        {
          type: 'text',
          text: `Tarefas listadas: ${JSON.stringify(tasks)}`,
        },
      ],
    };
  }
}
