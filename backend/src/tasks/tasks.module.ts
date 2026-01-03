import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './shared/entities/task.entity';
import { CreateTaskController } from './features/create-task/create-task.controller';
import { CreateTaskService } from './features/create-task/create-task.service';
import { CreateTaskRepository } from './features/create-task/create-task.repository';
import { GetTaskByIdController } from './features/get-task-by-id/get-task-by-id.controller';
import { GetTaskByIdService } from './features/get-task-by-id/get-task-by-id.service';
import { GetTaskByIdRepository } from './features/get-task-by-id/get-task-by-id.repository';
import { GetTasksController } from './features/get-tasks/get-tasks.controller';
import { GetTasksService } from './features/get-tasks/get-tasks.service';
import { GetTasksRepository } from './features/get-tasks/get-tasks.repository';
import { UpdateTaskController } from './features/update-task/update-task.controller';
import { UpdateTaskService } from './features/update-task/update-task.service';
import { UpdateTaskRepository } from './features/update-task/update-task.repository';
import { RemoveTaskController } from './features/remove-task/remove-task.controller';
import { RemoveTaskService } from './features/remove-task/remove-task.service';
import { RemoveTaskRepository } from './features/remove-task/remove-task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [
    CreateTaskController,
    GetTaskByIdController,
    GetTasksController,
    UpdateTaskController,
    RemoveTaskController,
  ],
  providers: [
    CreateTaskRepository,
    CreateTaskService,
    GetTaskByIdRepository,
    GetTaskByIdService,
    GetTasksRepository,
    GetTasksService,
    UpdateTaskRepository,
    UpdateTaskService,
    RemoveTaskRepository,
    RemoveTaskService,
  ],
})
export class TasksModule {}
