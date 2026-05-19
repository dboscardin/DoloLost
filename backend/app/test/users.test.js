import request from 'supertest';
import app from '../app.js';
import User from '../models/user.js';
import { jest } from '@jest/globals';


describe('Visualizzazione Contatto (GET /api/v2/users/:id)', () => {

   
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Caso 29: Visualizzazione contatto corretto', async () => {
        const validId = '69fa1f15cff2d08355d320e5';
        
       
        const mockUser = {
            _id: validId,
            username: 'alice01',
            name: 'Alice',
            surname: 'Rossi',
            role: 'user',
            email: 'alice01@gmail.com'
        };

        jest.spyOn(User, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUser)
        });

        const response = await request(app).get(`/api/v2/users/${validId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', validId);
        expect(response.body).toHaveProperty('username', 'alice01');
        expect(response.body).toHaveProperty('name', 'Alice');
        expect(response.body).toHaveProperty('surname', 'Rossi');
        expect(response.body).toHaveProperty('email', 'alice01@gmail.com');
        expect(response.body.self).toBe(`/api/v2/users/${validId}`);
    });


    test('Caso 30: Visualizzazione con id errato', async () => {
        const invalidId = '69fa1f15cff2d08355d330e5';

  
        jest.spyOn(User, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });


        const response = await request(app).get(`/api/v2/users/${invalidId}`);


        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Utente non trovato' });
    });
});