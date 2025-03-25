import request from 'supertest';
import app from '../app';
import { describe, it, expect, beforeAll } from 'vitest';
import { vi } from 'vitest';
vi.mock('../utils/redis', () => ({
    initRedis: async () => ({
        get: async () => null,
        set: async () => {},
        del: async () => {},
    }),
}));
let token: string;

beforeAll(async () => {
    const res = await request(app).post('/api/auth/login').send({
        email: 'admin@teampulse.com',
        password: 'admin123',
    });

    token = res.body.token;
});

describe('Check-In Routes', () => {
    it('should create a new check-in for an authenticated user', async () => {
        const res = await request(app)
            .post('/api/check-ins')
            .set('Authorization', `Bearer ${token}`)
            .send({
                mood: 'happy',
                tasksCompleted: 'Wrote some tests',
                blockers: 'None',
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.mood).toBe('happy');
    });

    it('should get team check-ins for admin', async () => {
        const res = await request(app)
            .get('/api/check-ins/team')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get my own check-ins', async () => {
        const res = await request(app)
            .get('/api/check-ins')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});