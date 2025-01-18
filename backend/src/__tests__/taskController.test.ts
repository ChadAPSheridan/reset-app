import request from 'supertest';
import { app, server } from '../app';
import sequelize from '../config/database';
import Task from '../models/taskModel';
import Column from '../models/columnModel';
import { TaskInstance } from '../types/task';

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create default columns
  await Column.bulkCreate([
    { title: 'To Do', description: 'Tasks to be done', position: 1 },
    { title: 'In Process', description: 'Tasks in progress', position: 2 },
    { title: 'Done', description: 'Completed tasks', position: 3 },
  ]);
});

afterAll(async () => {
  await sequelize.close();
  if (server) {
    server.close();
  }
});

describe('Task API', () => {
  it('should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        columnId: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Task');
    expect(response.body.description).toBe('This is a test task');
    expect(response.body.columnId).toBe(1);
  });

  it('should get all tasks', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should update a task', async () => {
    const task: TaskInstance = await Task.create({
      title: 'Update Task',
      description: 'This task will be updated',
      columnId: 1,
      row: 0,
    });

    const response = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({
        title: 'Updated Task',
        description: 'This task has been updated',
        columnId: 2,
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Task');
    expect(response.body.description).toBe('This task has been updated');
    expect(response.body.columnId).toBe(2);
  });

  it('should delete a task', async () => {
    const task: TaskInstance = await Task.create({
      title: 'Delete Task',
      description: 'This task will be deleted',
      columnId: 1,
      row: 0,
    });

    const response = await request(app).delete(`/api/tasks/${task.id}`);

    expect(response.status).toBe(204);

    const deletedTask = await Task.findByPk(task.id);
    expect(deletedTask).toBeNull();
  });
});