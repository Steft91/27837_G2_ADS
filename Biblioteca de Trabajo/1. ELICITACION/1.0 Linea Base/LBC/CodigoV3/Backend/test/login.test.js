const request = require('supertest');
const app = require('../app');
const Estudiante = require('../model/Estudiante');
const jwt = require('jsonwebtoken');

jest.mock('../model/Estudiante');
jest.mock('jsonwebtoken');
jest.mock('../config/database', () => jest.fn());

describe('Login Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /api/login - Student Login Success', async () => {
        const mockStudent = {
            _id: 'std123',
            email: 'juan@test.com',
            password: '123',
            name: 'Juan'
        };

        Estudiante.findOne.mockResolvedValue(mockStudent);
        jwt.sign.mockReturnValue('mocked_token');

        const res = await request(app).post('/api/login').send({
            email: 'juan@test.com',
            password: '123'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.content.role).toBe('ESTUDIANTE');
        expect(res.body.content.token).toBe('mocked_token');
    });

    test('POST /api/login - Admin Login Success', async () => {
        process.env.ADMIN_EMAIL = 'admin@test.com';
        process.env.ADMIN_PASSWORD = 'admin';
        process.env.JWT_SECRET = 'secret';

        // Mock student finding nothing
        Estudiante.findOne.mockResolvedValue(null);
        jwt.sign.mockReturnValue('admin_token');

        const res = await request(app).post('/api/login').send({
            email: 'admin@test.com',
            password: 'admin'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.content.role).toBe('ADMIN');
    });

    test('POST /api/login - Invalid Credentials', async () => {
        Estudiante.findOne.mockResolvedValue(null);
        const res = await request(app).post('/api/login').send({
            email: 'wrong@test.com',
            password: 'wrong'
        });
        expect(res.statusCode).toBe(401);
    });
});
