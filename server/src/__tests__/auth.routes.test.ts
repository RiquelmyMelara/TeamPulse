import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

describe('Auth Routes', () => {
    it('should reject login with invalid credentials', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'wrong@example.com',
            password: 'invalidpass',
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    it('should login with valid credentials and return a token', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'admin@teampulse.com',
            password: 'admin123',
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe('admin@teampulse.com');
    });
});
