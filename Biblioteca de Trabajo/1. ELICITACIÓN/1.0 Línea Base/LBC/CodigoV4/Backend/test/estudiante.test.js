const request = require('supertest');
const app = require('../app');
const service = require('../service/estudianteService');
const jwt = require('jsonwebtoken');

// Mock Authentication Middleware
jest.mock('../middleware/auth', () => (req, res, next) => {
    req.user = { id: 'estudiante123', role: 'ESTUDIANTE' };
    next();
});

jest.mock('../middleware/authorize', () => (roles) => (req, res, next) => {
    // Simple mock: assumes user is authorized if auth middleware passed
    // and we don't need detailed role check for these unit tests mostly,
    // or we can simulate based on roles arg.
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
        return res.status(403).json({ status: 'error', message: 'No autorizado' });
    }
    next();
});

// Mock Service
jest.mock('../service/estudianteService');

// Mock Database Connection prevent real connection
jest.mock('../config/database', () => jest.fn());

describe('Estudiante Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Since we mocked auth as ESTUDIANTE, some endpoints might fail 403.
    // We need to dynamicall mock auth per test or use a different approach.
    // For simplicity, let's just test what an ESTUDIANTE can triggers or 
    // mock the middleware differently for admin tests.

    // Actually, Jest mocks are hoisted. We should probably use a helper or just testing 'public' routes for now, 
    // or better, verify the 'POST /' which is public (usually). 
    // But wait, the router code says: router.post('/', ...) without auth? 
    // Let's check router code again. Ah, line 102: router.post('/', async...) -> No auth! Great.

    test('POST /api/estudiantes - Create Estudiante (Success)', async () => {
        const mockData = { name: 'Juan', email: 'juan@test.com', password: '123', career: 'Systems' };

        service.create.mockResolvedValue(mockData);

        const res = await request(app).post('/api/estudiantes').send(mockData);

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('success');
        expect(service.create).toHaveBeenCalledWith(mockData);
    });

    test('POST /api/estudiantes - Create Estudiante (Failure)', async () => {
        service.create.mockRejectedValue(new Error('Email already exists'));

        const res = await request(app).post('/api/estudiantes').send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toBe('Email already exists');
    });
});
