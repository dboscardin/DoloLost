import request from 'supertest';
import app from '../app.js';
import { jest } from '@jest/globals';


//manca login
test('App module should be defined', () => {
    expect(app).toBeDefined();
});


test('GET / should return 200', () => {
    return request(app)
    .get('/')
    .expect(200);
});