import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../shared/entities/task.entity';

@Injectable()
export class CreateTaskRepository {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
    ) { }

    async create(taskData: Partial<Task>): Promise<Task> {
        const task = this.taskRepository.create(taskData);
        return this.taskRepository.save(task);
    }
}
