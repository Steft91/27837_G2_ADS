const request = require('supertest');
const app = require('../app');
const service = require('../service/materiaService');

// Mock Auth: ADMIN for these operations usually
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

jest.mock('../service/materiaService');
jest.mock('../config/database', () => jest.fn());

describe('Materia Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/materias - Listar Materias', async () => {
        const mockMaterias = [{ name: 'Matematica', location: 'A1' }];
        service.findAll.mockResolvedValue(mockMaterias);

        const res = await request(app).get('/api/materias');

        expect(res.statusCode).toBe(200);
        expect(res.body.content).toEqual(mockMaterias);
    });

    test('POST /api/materias - Crear Materia', async () => {
        const newMateria = { name: 'Fisica', location: 'Lab 1', start: 10, end: 12, days: ['Lunes'] };
        service.create.mockResolvedValue(newMateria);

        const res = await request(app).post('/api/materias').send(newMateria);

        expect(res.statusCode).toBe(201);
        expect(service.create).toHaveBeenCalledWith(newMateria);
    });
});
