const request = require('supertest');
const app = require('../app');
const service = require('../service/prestamoService');

// Mock middleware to be flexible or hardcode one role.
// Limitation: Jest mocks are module-level. Hard to switch roles per test block easily without `jest.resetModules` or similar patterns.
// We will assume the user IS authenticated as ESTUDIANTE for creation tests.
jest.mock('../middleware/auth', () => (req, res, next) => {
    req.user = { id: 'estudiante123', role: 'ESTUDIANTE' };
    next();
});

jest.mock('../middleware/authorize', () => (roles) => (req, res, next) => {
    // A simple pass-through if role matches 'ESTUDIANTE' for the 'POST' and 'GET historial' route
    // But wait, the route / active and / historial don't use authorize(), only auth().
    // The POST / uses authorize(['ESTUDIANTE']).
    if (roles && roles.includes('ESTUDIANTE')) {
        next();
    } else {
        // If roles is undefined (not used), pass.
        next();
    }
});

jest.mock('../service/prestamoService');
jest.mock('../config/database', () => jest.fn());

describe('Prestamo Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /api/prestamos - Crear Prestamo', async () => {
        const mockPrestamo = {
            tipoDispositivo: 'Laptop',
            start: '2026-02-03T10:00:00',
            end: '2026-02-03T12:00:00'
        };

        service.create.mockResolvedValue({ ...mockPrestamo, status: 'ACTIVO', id: 'p1' });

        const res = await request(app).post('/api/prestamos').send(mockPrestamo);

        // If it fails with 403 it's the middleware mock.
        expect(res.statusCode).toBe(201);
        expect(res.body.content.status).toBe('ACTIVO');
    });

    test('GET /api/prestamos/historial - Obtener Historial', async () => {
        service.getHistorialPrestamosByUsuario.mockResolvedValue([]);
        const res = await request(app).get('/api/prestamos/historial');
        expect(res.statusCode).toBe(200);
        expect(service.getHistorialPrestamosByUsuario).toHaveBeenCalledWith('estudiante123');
    });

    test('GET /api/prestamos/activo - Obtener Activo', async () => {
        service.getPrestamoActivoByUsuario.mockResolvedValue(null); // No active loan
        const res = await request(app).get('/api/prestamos/activo');
        // The router returns 404 if no active loan
        expect(res.statusCode).toBe(404);
    });
});
