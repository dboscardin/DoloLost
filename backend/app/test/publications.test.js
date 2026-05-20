import request from 'supertest';
import app from '../app.js';
import { jest } from '@jest/globals';
import Publication from '../models/publication.js'; 

describe('Visualizzazione pubblicazioni e Filtra pubblicazioni (get: publications)', () => {

   
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Caso 0: Recupero di tutte le pubblicazioni senza filtri', async () => {

        const mockPublications =[
    {
        "location": {
            "type": "Point",
            "coordinates": [
                11.0395,
                45.8902
            ],
            "address": "Stazione ferroviaria di Trento, Piazza Dante, 38122 Trento TN"
        },
        "_id": "69fa1f15cff2d08355d320f8",
        "description": "Portafoglio nero",
        "category": "accessori",
        "notes": "",
        "image": "https://images.pexels.com/photos/4568373/pexels-photo-4568373.jpeg",
        "date": "2026-05-01T00:00:00.000Z",
        "state": "solved",
        "type": "found",
        "user": {
            "_id": "69fa1f15cff2d08355d320e5",
            "username": "alice01"
        },
    },
    {
        "location": {
            "type": "Point",
            "coordinates": [
                11.0388,
                45.8869
            ],
            "address": "Piazza Rosmini, Trento, TN"
        },
        "_id": "69fa1f15cff2d08355d320f9",
        "description": "Mazzo di chiavi trovato in Piazza Rosmini",
        "category": "Chiavi",
        "notes": "Portachiavi rosso",
        "image": "https://m.media-amazon.com/images/I/71ErXOL+dyL._AC_UF1000,1000_QL80_.jpg",
        "date": "2026-04-02T00:00:00.000Z",
        "state": "unresolved",
        "type": "lost",
        "user": {
            "_id": "69fa1f15cff2d08355d320e6",
            "username": "bruno02"
        },
    }];

       jest.spyOn(Publication, 'find').mockReturnValue({
            populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockPublications)
        })
    });
        const response = await request(app).get(`/api/v2/publications`);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('_id', '69fa1f15cff2d08355d320f8');
        expect(response.body[1]).toHaveProperty('_id', '69fa1f15cff2d08355d320f9');
        expect(response.body[0].user).toHaveProperty('username', 'alice01');
        expect(response.body[1].user).toHaveProperty('username', 'bruno02');
      
    });

    test('Caso 1: Filtraggio per category e type', async () => {

        const mockPublications =[
    
    {
        "location": {
            "type": "Point",
            "coordinates": [
                11.0388,
                45.8869
            ],
            "address": "Piazza Rosmini, Trento, TN"
        },
        "_id": "69fa1f15cff2d08355d320f9",
        "description": "Mazzo di chiavi trovato in Piazza Rosmini",
        "category": "chiavi",
        "notes": "Portachiavi rosso",
        "image": "https://m.media-amazon.com/images/I/71ErXOL+dyL._AC_UF1000,1000_QL80_.jpg",
        "date": "2026-04-02T00:00:00.000Z",
        "state": "unresolved",
        "type": "lost",
        "user": {
            "_id": "69fa1f15cff2d08355d320e6",
            "username": "bruno02"
        }
    }];
    const mockWhere = jest.fn().mockReturnThis();
    const mockRegex = jest.fn().mockReturnThis();
    const mockEquals = jest.fn().mockReturnThis();
    const mockGte = jest.fn().mockReturnThis();
    const mockLte = jest.fn().mockReturnThis();
    const mockExec = jest.fn().mockResolvedValue(mockPublications);
    const mockQueryObject = {
        where: mockWhere,
        regex: mockRegex,
        equals: mockEquals,
        gte: mockGte,
        lte: mockLte,
        exec: mockExec,
        populate: jest.fn().mockReturnThis(), 
        exec: jest.fn().mockResolvedValue(mockPublications) 
    };

        jest.spyOn(Publication, 'find').mockReturnValue(mockQueryObject);
    


        const response = await request(app).get(`/api/v2/publications`).query({
            type:'lost',
            category:'chiavi'
        });
       
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(mockRegex).toHaveBeenCalledWith(new RegExp('chiavi', 'i'));
        expect(mockWhere).toHaveBeenCalledWith('type');
        expect(mockEquals).toHaveBeenCalledWith('lost');
        
      
    });

    test('Caso 2: Filtraggio con data non nel range', async () => {

    const mockPublications =[];

    const mockWhere = jest.fn().mockReturnThis();
    const mockRegex = jest.fn().mockReturnThis();
    const mockEquals = jest.fn().mockReturnThis();
    const mockGte = jest.fn().mockReturnThis();
    const mockLte = jest.fn().mockReturnThis();
    const mockExec = jest.fn().mockResolvedValue(mockPublications);
    const mockQueryObject = {
        where: mockWhere,
        regex: mockRegex,
        equals: mockEquals,
        gte: mockGte,
        lte: mockLte,
        exec: mockExec,
        populate: jest.fn().mockReturnThis(), 
        exec: jest.fn().mockResolvedValue(mockPublications) 
    };
        jest.spyOn(Publication, 'find').mockReturnValue(mockQueryObject);
    


        const response = await request(app).get(`/api/v2/publications`).query({
            date_from: '2030-01-01T00:00:00.000Z'
        });
       
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(0);
        expect(mockWhere).toHaveBeenCalledWith('date');
        expect(mockGte).toHaveBeenCalledWith(new Date('2030-01-01T00:00:00.000Z'));
    });

    test('Caso 3: Recupero senza pubblicazioni nel db', async () => {

    const mockPublications =[];

     jest.spyOn(Publication, 'find').mockReturnValue({
            populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockPublications)
        })
     });


        const response = await request(app).get(`/api/v2/publications`);
       
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(0);
        
    });
   
});