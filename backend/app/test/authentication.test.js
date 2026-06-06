import request from 'supertest';
import app from '../app.js';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

describe('Login User (post:authentication)', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Caso 26: Autenticazione con credenziali valide', async () => {
        const credentials = {
            username: "tommaso14",
            password: "tommaso14"
        };

        const fakeUserInDb = {
            _id: "6a057de239043fb7ec300106",
            username: "tommaso14",
            name: "Tommaso",
            email: "tommaso@test.com",
            role: "user",
            password: "hashed_password_placeholder"
        };

        jest.spyOn(User, 'findOne').mockReturnValue({
            exec: jest.fn().mockResolvedValue(fakeUserInDb)
        });


        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        const response = await request(app)
            .post('/api/v2/auth')
            .send(credentials);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Enjoy your token!');
        expect(response.body).toHaveProperty('token');
        expect(response.body.username).toBe(fakeUserInDb.username);
        expect(response.body.name).toBe(fakeUserInDb.name);
        expect(response.body.id).toBe(fakeUserInDb._id);
        expect(response.body.role).toBe(fakeUserInDb.role);
    });

    test('Caso 27: Autenticazione con password sbagliata', async () => {
        const credentials = {
            username: "tommaso14",
            password: "tommaso15"
        };

        const fakeUserInDb = {
            _id: "6a057de239043fb7ec300106",
            username: "tommaso14",
            password: "hashed_password_placeholder"
        };

        jest.spyOn(User, 'findOne').mockReturnValue({
            exec: jest.fn().mockResolvedValue(fakeUserInDb)
        });

        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

        const response = await request(app)
            .post('/api/v2/auth')
            .send(credentials);

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Password errata');
        expect(response.body).not.toHaveProperty('token');
    });

    test('Caso 28: Autenticazione con utente non trovato', async () => {
        const credentials = {
            username: "tommaso15",
            password: "tommaso14"
        };


        jest.spyOn(User, 'findOne').mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });

        const response = await request(app)
            .post('/api/v2/auth')
            .send(credentials);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Utente non trovato');
        

        const compareSpy = jest.spyOn(bcrypt, 'compare');
        expect(compareSpy).not.toHaveBeenCalled();
    });

    test('Caso 29:Autenticazione Admin', async () => {
        const credentials = {
            username: "admin03",
            password: "adminpass3"
        };

        const fakeUserInDb = {
            _id: "6a057de239043fb7ec300106",
            username: "admin03",
            name: "Tommaso",
            email: "tommaso@test.com",
            role: "admin",
            password: "hashed_password_placeholder"
        };

        jest.spyOn(User, 'findOne').mockReturnValue({
            exec: jest.fn().mockResolvedValue(fakeUserInDb)
        });


        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        const response = await request(app)
            .post('/api/v2/auth')
            .send(credentials);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Enjoy your token!');
        expect(response.body).toHaveProperty('token');
        expect(response.body.username).toBe(fakeUserInDb.username);
        expect(response.body.name).toBe(fakeUserInDb.name);
        expect(response.body.id).toBe(fakeUserInDb._id);
        expect(response.body.role).toBe(fakeUserInDb.role);
    });
});