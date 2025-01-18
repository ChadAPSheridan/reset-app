import request from 'supertest';
import { app } from '../app';

describe('App', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(200);
  });
});

