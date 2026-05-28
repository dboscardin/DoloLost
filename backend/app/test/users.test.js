import request from 'supertest';
import app from '../app.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

import { afterEach, jest } from '@jest/globals';


describe('Eliminazione Account (DELETE /api/v2/users/me)', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Caso 41: Eliminazione account con token valido', async () => {

        const validId = '6a057de239043fb7ec300106';

        const token = jwt.sign(
            {
                _id: validId,
                username: 'tozzifabio',
                role: 'user',
                email: 'fabiotozzi@gmail.com'
            },
            process.env.SUPER_SECRET,
            { expiresIn: 86400 }
        );

        jest.spyOn(User, 'findByIdAndDelete').mockReturnValue({
            _id: validId,
            username: 'tozzifabio'
        });

        const response = await request(app)
            .delete('/api/v2/users/me')
            .set('x-access-token', token);

        expect(User.findByIdAndDelete).toHaveBeenCalledWith(validId);
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toMatch(/Account eliminato/);


    });

    test('Caso 42: Eliminazione account senza token', async () => {
        const response = await request(app)
            .delete('/api/v2/users/me')

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch('No token provided');
    });

    test('Caso 43: Eliminazione account con token non valido', async () => {

        const response = await request(app)
            .delete('/api/v2/users/me')
            .set('x-access-token', 'tokenNonValido');

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch('Token not valid');
    });

    test('Caso 44: Eliminazione utente inesistente', async () => {
        const validId = '6a057de239043fb7ec300106';

        const token = jwt.sign(
            {
                _id: validId,
                username: 'username',
                role: 'user',
                email: 'username@gmail.com'
            },
            process.env.SUPER_SECRET,
            { expiresIn: 86400 }
        );
        
        jest.spyOn(User, 'findByIdAndDelete').mockResolvedValue(null);


        const response = await request(app)
            .delete('/api/v2/users/me')
            .set('x-access-token', token);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch('Utente non trovato');
    });


})



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
