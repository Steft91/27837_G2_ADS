const request = require('supertest');
const app = require('../app');
const service = require('../service/inscripcionService');

// Mock Auth: ADMIN
jest.mock('../middleware/auth', () => (req, res, next) => {
    req.user = { id: 'admin123', role: 'ADMIN' };
    next();
});

jest.mock('../middleware/authorize', () => (roles) => (req, res, next) => {
    if (!roles || roles.includes('ADMIN')) {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
});

jest.mock('../service/inscripcionService');
jest.mock('../config/database', () => jest.fn());

describe('Inscripcion Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/inscripciones - List all', async () => {
        service.findAll.mockResolvedValue([]);
        const res = await request(app).get('/api/inscripciones');
        expect(res.statusCode).toBe(200);
    });

    test('POST /api/inscripciones - Create', async () => {
        const data = { estudianteId: 'e1', materiaId: 'm1', date: '2026-01-01' };
        service.create.mockResolvedValue(data);

        const res = await request(app).post('/api/inscripciones').send(data);

        expect(res.statusCode).toBe(201);
        expect(service.create).toHaveBeenCalledWith(data);
    });
});
