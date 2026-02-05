const request = require('supertest');
const app = require('../app');
const service = require('../service/dispositivoService');

// Mock Authentication Middleware to simulate Admin
jest.mock('../middleware/auth', () => (req, res, next) => {
    req.user = { id: 'admin123', role: 'ADMIN' };
    next();
});

jest.mock('../middleware/authorize', () => (roles) => (req, res, next) => {
    if (roles.includes('ADMIN')) {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
});

jest.mock('../service/dispositivoService');
jest.mock('../config/database', () => jest.fn());

describe('Dispositivo Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/dispositivos - Get All', async () => {
        const mockDispositivos = [{ type: 'Laptop', status: 'Disponible' }];
        service.findAll.mockResolvedValue(mockDispositivos);

        const res = await request(app).get('/api/dispositivos');

        expect(res.statusCode).toBe(200);
        expect(res.body.content).toEqual(mockDispositivos);
    });

    test('POST /api/dispositivos - Create Dispositivo', async () => {
        const newDisp = { type: 'Proyector', brand: 'Epson', model: 'X1', location: 'A1', status: 'Disponible' };
        service.create.mockResolvedValue(newDisp);

        const res = await request(app).post('/api/dispositivos').send(newDisp);

        expect(res.statusCode).toBe(201);
        expect(service.create).toHaveBeenCalledWith(newDisp);
    });
});
