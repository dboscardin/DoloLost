import request from 'supertest';
import app from '../app.js';
import User from '../models/user.js';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

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
        expect(response.body.error).toEqual( 'Utente non trovato');
    });
});
describe('Eliminazione user (delete: users/:id)', () => {

   
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Caso 41: Eliminazione del proprio account con token valido', async () => {
        const targetUserId = "6a057de239043fb7ec300106"
        const payload = { id: targetUserId, email: 'user@test.com', role: 'user' };
        const token = jwt.sign(payload, process.env.SUPER_SECRET, { expiresIn: 3600 });

        jest.spyOn(User, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue({ _id: targetUserId, email: 'user@test.com' })
        });


        jest.spyOn(User, 'findByIdAndDelete').mockResolvedValue({ _id: targetUserId });


        const response = await request(app)
            .delete(`/api/v2/users/${targetUserId}`)
            .set('x-access-token', token);


        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body).toHaveProperty("message","Account eliminato con successo");
        expect(User.findByIdAndDelete).toHaveBeenCalledWith(targetUserId);
    });
    test('Caso 42: Eliminazione senza token', async () => {
        const targetUserId = "6a057de239043fb7ec300106"
        jest.spyOn(User, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue({ _id: targetUserId })
        });
        jest.spyOn(User, 'findByIdAndDelete');
        const response = await request(app).delete('/api/v2/users/' + targetUserId);
        expect(response.status).toBe(401);
        expect(User.findByIdAndDelete).not.toHaveBeenCalled();
    });
    test('Caso 43: Eliminazione account di un altro utente', async () => {
        const targetUserId = "6a057de239043fb7ec300106"
        const targetUserId2 = "6a057de239043fb7ec300107"; 
        const payload = { id: targetUserId2, role: 'user' };
        const token = jwt.sign(payload, process.env.SUPER_SECRET, { expiresIn: 3600 });

        jest.spyOn(User, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue({ _id: targetUserId })
        });

        const response = await request(app)
            .delete('/api/v2/users/'+targetUserId)
            .set('x-access-token', token);

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Non sei autorizzato a eliminare questo Utente.");
    });

    test('Caso 44: Eliminazione di un account non esistente', async () => {
        const targetUserId = "6a057de239043fb7ec300106"
        const payload = { id: targetUserId, role: 'user' };
        const token = jwt.sign(payload,  process.env.SUPER_SECRET, { expiresIn: 3600 });

        
        jest.spyOn(User, 'findById').mockReturnValue({ exec: jest.fn().mockResolvedValue(null)});

        const response = await request(app)
            .delete('/api/v2/users/' + targetUserId)
            .set('x-access-token', token);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Utente non trovato");
    });
});
