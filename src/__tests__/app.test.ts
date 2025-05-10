import request from 'supertest';
import app from '../app';

describe('App', () => {
    describe('GET /health', () => {
        it('should return 200 OK with status', async () => {
            const response = await request(app).get('/health');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'ok');
            expect(response.body).toHaveProperty('environment');
        });
    });
}); 