
import { User, UserRole, DeviceDisponibility, Loan, Equipment } from '@/types';

const BASE_URL = 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
    status: string;
    message: string;
    content: T;
}

export interface LoginResponse {
    token: string;
    role: UserRole;
    user?: User; // Backend might not return full user object in content, but we decode it or fetch it?
    // backend returns { token, role } in content.
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    if (!response.ok) {
        // If backend returns { status: 'error', message: '...' }
        throw new Error(data.message || response.statusText);
    }
    return data;
}

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const api = {
    // Auth
    login: async (email: string, password: string): Promise<ApiResponse<{ token: string; role: string }>> => {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(res);
    },

    // Estudiantes
    getEstudiante: async (id: string) => {
        const res = await fetch(`${BASE_URL}/estudiantes/${id}`, {
            headers: getHeaders(),
        });
        return handleResponse<any>(res);
    },

    // Dispositivos
    getDispositivos: async () => {
        const res = await fetch(`${BASE_URL}/dispositivos`, {
            headers: getHeaders(),
        });
        return handleResponse<any[]>(res);
    },

    getDispositivosDisponibles: async () => {
        // Logic for availability might be different, but for now assuming fetching all and filtering in front or back
        // Or backend has specific logic.
        // Based on controller logic in frontend, it seems to just count stats.
        const res = await fetch(`${BASE_URL}/dispositivos`, {
            headers: getHeaders(),
        });
        return handleResponse<any[]>(res);
    },

    createDispositivo: async (data: any) => {
        const res = await fetch(`${BASE_URL}/dispositivos`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    updateDispositivo: async (id: string, data: any) => {
        const res = await fetch(`${BASE_URL}/dispositivos/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    deleteDispositivo: async (id: string) => {
        const res = await fetch(`${BASE_URL}/dispositivos/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    // Prestamos
    createPrestamo: async (data: any) => {
        const res = await fetch(`${BASE_URL}/prestamos`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    getPrestamos: async () => {
        const res = await fetch(`${BASE_URL}/prestamos`, {
            headers: getHeaders(),
        });
        return handleResponse<any[]>(res);
    },

    // Inscripciones / Materias
    getInscripciones: async () => {
        const res = await fetch(`${BASE_URL}/inscripciones`, {
            headers: getHeaders(),
        });
        return handleResponse<any[]>(res);
    },

    getMaterias: async () => {
        const res = await fetch(`${BASE_URL}/materias`, {
            headers: getHeaders(),
        });
        return handleResponse<any[]>(res);
    }
};
