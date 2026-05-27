import request from 'supertest';
import app from '../app.js';
import User from '../models/user.js';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

//manca registrazione
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


describe('Modifica dati utente (put: users/:id)', () => {

   
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test('Caso 36: Modifica corretta con vari dati', async () => {
        
        const payload = {
                        id: '69fa1f15cff2d08355d320e5',
                        username: 'alice01',
                        email: 'alice01@gmail.com',
                        role: 'user',
                    }
        const options = { expiresIn: 3600 }
        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        mockReqUser = {
            id: '69fa1f15cff2d08355d320e5',
            name: 'alice_old',
            username: 'alice01',
            save: jest.fn().mockResolvedValue({
                id: '69fa1f15cff2d08355d320e5',
                name: 'alice',
                username: 'alice02'
            })
        };

        jest.spyOn(User, 'findById').mockReturnValue({exec: jest.fn().mockResolvedValue(mockReqUser)});
        jest.spyOn(User, 'findOne').mockReturnValue(null);
        const response = await request(app)
            .put('/api/v2/users/69fa1f15cff2d08355d320e5')
            .set('x-access-token',token)
            .send({ name: 'alice', username: 'alice02' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User aggiornato con successo!');
        expect(response.body.user.username).toBe('alice02');
        expect(response.body.user.name).toBe('alice');
    });

    test('Caso 37: Modifica di un altro utente', async () => {
        
        const payload = {
                        id: '69fa1f15cff2d08355d320e6',
                        username: 'alice02',
                        email: 'alice01@gmail.com',
                        role: 'user',
                    }
        const options = { expiresIn: 3600 }
        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        mockReqUser = {
            id: '69fa1f15cff2d08355d320e5',
            name: 'alice_old',
            username: 'alice01'
            
        };
        jest.spyOn(User, 'findById').mockReturnValue({exec: jest.fn().mockResolvedValue(mockReqUser)});

        const response = await request(app)
            .put('/api/v2/users/69fa1f15cff2d08355d320e5')
            .set('x-access-token',token)
            .send({ name: 'alice' });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'Non sei autorizzato a modificare i dati di questo utente.');
    });

    test('Caso 38: Modifica username in uno già esistente', async () => {
        
        const payload = {
                        id: '69fa1f15cff2d08355d320e5',
                        username: 'alice01',
                        email: 'alice01@gmail.com',
                        role: 'user',
                    }
        const options = { expiresIn: 3600 }
        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        mockReqUser = {
            id: '69fa1f15cff2d08355d320e5',
            name: 'alice_old',
            username: 'alice01'
        };

        jest.spyOn(User, 'findById').mockReturnValue({exec: jest.fn().mockResolvedValue(mockReqUser)});
        jest.spyOn(User, 'findOne').mockReturnValue({id: '69fa1f15cff2d08355d320e6',   username: 'alice02',});
        const response = await request(app)
            .put('/api/v2/users/69fa1f15cff2d08355d320e5')
            .set('x-access-token',token)
            .send({ username: 'alice02' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Username già esistente');

    });

    test('Caso 39: Modifica mail in una già esistente', async () => {
        
        const payload = {
                        id: '69fa1f15cff2d08355d320e5',
                        username: 'alice01',
                        email: 'alice01@gmail.com',
                        role: 'user',
                    }
        const options = { expiresIn: 3600 }
        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        mockReqUser = {
            id: '69fa1f15cff2d08355d320e5',
            name: 'alice',
            username: 'alice01',
            
        };

        jest.spyOn(User, 'findById').mockReturnValue({exec: jest.fn().mockResolvedValue(mockReqUser)});
        jest.spyOn(User, 'findOne').mockReturnValue({id: '69fa1f15cff2d08355d320e6',   email: 'alice02@gmail.com',});
        const response = await request(app)
            .put('/api/v2/users/69fa1f15cff2d08355d320e5')
            .set('x-access-token',token)
            .send({ email: 'alice02@gmail.com' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Email già esistente');

    });
    
    test('Caso 40: Modifica password con vecchia password errata', async () => {
        
        const payload = {
                        id: '69fa1f15cff2d08355d320e5',
                        username: 'alice01',
                        email: 'alice01@gmail.com',
                        role: 'user',
                    }
        const options = { expiresIn: 3600 }
        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        mockReqUser = {
            id: '69fa1f15cff2d08355d320e5',
            name: 'alice_old',
            username: 'alice01',
            password: '$2b$10$fJB90S43njUQ92n7txGft.QM5O5T/PLVeEkWSyq9B1KQCO9eVLRoG',
            save: jest.fn().mockResolvedValue({
                id: '69fa1f15cff2d08355d320e5',
                name: 'alice',
                username: 'alice02'
            })
        };

        jest.spyOn(User, 'findById').mockReturnValue({exec: jest.fn().mockResolvedValue(mockReqUser)});

        const response = await request(app)
            .put('/api/v2/users/69fa1f15cff2d08355d320e5')
            .set('x-access-token',token)
            .send({ old_password: "alice2025", new_password:"alice2027"});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Vecchia password errata');
        
    });
});