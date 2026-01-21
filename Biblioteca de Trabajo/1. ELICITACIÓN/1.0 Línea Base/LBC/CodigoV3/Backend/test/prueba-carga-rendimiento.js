// Autor: Mateo Medranda
import http from 'k6/http';
import { sleep, check } from 'k6';


export let options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '30s', target: 300 },
        { duration: '1s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'], //rate indica que el 1% de las solicitudes deben fallar
    },
}

export default function () {
    // Prueba login (POST)
    let loginRes = http.post("http://host.docker.internal:3001/api/login", JSON.stringify({ email: "admin@email.com", password: "admin" }), { headers: { 'Content-Type': 'application/json' } });
    check(loginRes, {
        'login status 200': (r) => r.status === 200,
        'login < 500ms': (r) => r.timings.duration < 500
    });
    let token = loginRes.json('token');
    let authHeaders = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};

    // Dispositivos
    let resDispGet = http.get("http://host.docker.internal:3001/api/dispositivos");
    check(resDispGet, {
        'GET dispositivos 200': (r) => r.status === 200,
        'GET dispositivos < 500ms': (r) => r.timings.duration < 500
    });

    // Estudiantes
    let resEstGet = http.get("http://host.docker.internal:3001/api/estudiantes", authHeaders);
    check(resEstGet, {
        'GET estudiantes 200': (r) => r.status === 200,
        'GET estudiantes < 500ms': (r) => r.timings.duration < 500
    });

    // Inscripciones
    let resInsGet = http.get("http://host.docker.internal:3001/api/inscripciones", authHeaders);
    check(resInsGet, {
        'GET inscripciones 200': (r) => r.status === 200,
        'GET inscripciones < 500ms': (r) => r.timings.duration < 500
    });

    // Materias
    let resMatGet = http.get("http://host.docker.internal:3001/api/materias");
    check(resMatGet, {
        'GET materias 200': (r) => r.status === 200,
        'GET materias < 500ms': (r) => r.timings.duration < 500
    });

    // Préstamos
    let resPresGet = http.get("http://host.docker.internal:3001/api/prestamos", authHeaders);
    check(resPresGet, {
        'GET prestamos 200': (r) => r.status === 200,
        'GET prestamos < 500ms': (r) => r.timings.duration < 500
    });

    sleep(1);
}