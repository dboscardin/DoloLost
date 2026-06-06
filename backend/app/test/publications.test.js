import request from 'supertest';
import app from '../app.js';
import { expect, jest } from '@jest/globals';
import Publication from '../models/publication.js'; 
import jwt from 'jsonwebtoken';



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

describe('Visualizzazione pubblicazioni attive e filtraggio (get: publications/attive)', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });
    test('Caso 4: Recupero di tutte le pubblicazioni attive', async () => {

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
        "state": "unresolved",
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
    
        const response = await request(app).get(`/api/v2/publications/attive`);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('_id', '69fa1f15cff2d08355d320f8');
        expect(response.body[1]).toHaveProperty('_id', '69fa1f15cff2d08355d320f9');
        expect(response.body[0]).toHaveProperty('state', 'unresolved');
        expect(response.body[1]).toHaveProperty('state', 'unresolved');
        expect(mockWhere).toHaveBeenCalledWith('state');
        expect(mockEquals).toHaveBeenCalledWith('unresolved');
      
    });

    test('Caso 5: Filtraggio per description parziale', async () => {

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
    
        const response = await request(app).get(`/api/v2/publications/attive`).query({
            description: "mazzo"
        });
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('state', 'unresolved');
        expect(mockWhere).toHaveBeenCalledWith('state');
        expect(mockEquals).toHaveBeenCalledWith('unresolved');
        expect(mockWhere).toHaveBeenCalledWith('description');
        expect(mockRegex).toHaveBeenCalledWith(new RegExp('mazzo', 'i'));
      
    });

    test('Caso 6: Filtraggio senza risultati', async () => {

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
    
        const response = await request(app).get(`/api/v2/publications/attive`);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(0);
        expect(mockWhere).toHaveBeenCalledWith('state');
        expect(mockEquals).toHaveBeenCalledWith('unresolved');
      
    });
    test('Caso 7: Filtraggio con distanza non valida', async () => {
        const response = await request(app)
            .get('/api/v2/publications/attive')
            .query({ distance: -1 }); 


        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Distanza non valida');
    });

    test('Caso 8: Filtraggio con coordinate non valide (Longitudine fuori range)', async () => {
        const response = await request(app)
            .get('/api/v2/publications/attive')
            .query({ userLngLat: '-181,50.01' }); 


        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Longitudine non valida');
    });
    
});


describe('Ottenimento proprie pubblicazioni (get:publications/proprie)', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });
    test('Caso 9: Recupero corretto con token valido', async () => {

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
        "state": "unresolved",
        "type": "found",
        "user": {
            "_id": "69fa1f15cff2d08355d320e5",
            "username": "alice01"
        },
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
        
        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        const response = await request(app).get('/api/v2/publications/proprie').set('x-access-token',token);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0].user).toHaveProperty('_id', '69fa1f15cff2d08355d320e5');
        expect(mockWhere).toHaveBeenCalledWith('user')
        expect(mockEquals).toHaveBeenCalledWith('69fa1f15cff2d08355d320e5');
      
    });
    test('Caso 10: Recupero corretto con token valido ma senza pubblicazioni', async () => {

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
        
        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        const response = await request(app).get('/api/v2/publications/proprie').set('x-access-token',token);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(0);
        expect(mockWhere).toHaveBeenCalledWith('user')
        expect(mockEquals).toHaveBeenCalledWith('69fa1f15cff2d08355d320e5');
      
    });
    test('Caso 11: Tentativo di accesso senza token', async () => {

        const mockPublications =[];
        const response = await request(app).get('/api/v2/publications/proprie');
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'No token provided.');
      
    });
    test('Caso 12: Tentativo di accesso con token alterato o scaduto', async () => {

        const mockPublications =[];

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: -1 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);


        const response = await request(app).get('/api/v2/publications/proprie').set('x-access-token',token);
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Token not valid.');
      
    });   
});

describe('Ottenimento singola Pubblicazione (get: publications/:id)', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });
    

    test('Caso 13: Recupero avvenuto con successo', async () => {


        const mockPublications =
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
        "state": "unresolved",
        "type": "found",
        "user":  "69fa1f15cff2d08355d320e5"
            
        
    }
        const mockWhere = jest.fn().mockReturnThis();
        const mockEquals = jest.fn().mockReturnThis();
        const mockExec = jest.fn().mockResolvedValue(mockPublications);
        const mockQueryObject = {
        where: mockWhere,
        equals: mockEquals,
        exec: mockExec,
        populate: jest.fn().mockReturnThis(), 
        exec: jest.fn().mockResolvedValue(mockPublications) 
    };
        jest.spyOn(Publication, 'findById').mockReturnValue(mockQueryObject);

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        const response = await request(app).get('/api/v2/publications/69fa1f15cff2d08355d320f8').set('x-access-token', token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("user", '69fa1f15cff2d08355d320e5');
        
    });

    test('Caso 14: Id inesistente nel database', async () => {

        jest.spyOn(Publication, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        


        const response = await request(app)
            .get('/api/v2/publications/69fa1f15cff2d08355d320f8')
            .set('x-access-token', token);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Pubblicazione non trovata');

    });

    test('Caso 15: Tentativo di accesso senza token', async () => {

        jest.spyOn(Publication, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });

       
        const response = await request(app).get('/api/v2/publications/69fa1f15cff2d08355d320f8')

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'No token provided.');

    });
    
});


const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn().mockReturnValue({ data: { publicUrl: 'http://fake-supabase-url.com/immagine.png' } });


jest.unstable_mockModule('@supabase/supabase-js', () => ({
    createClient: () => ({
        storage: {
            from: () => ({
                upload: mockUpload,
                getPublicUrl: mockGetPublicUrl
            })
        }
    })
}));

describe('Creazione pubblicazione (post: publications)', () => {

    afterEach(() => {
        jest.restoreAllMocks();
        
    });
    

    test('Caso 16: Creazione di una nuova pubblicazione valida', async () => {

        const newPublicationData = {
            "description": "mazzo chiavi di casa",
            "category": "chiavi",
            "date": "2023-10-01T12:00:00Z",
            "type": "lost",
            "image": "C:\\somepath\\image.png",
            "lat": "11.0395", 
            "lng": "45.8902",
            "address": "Stazione ferroviaria di Trento, Piazza Dante, 38122 Trento TN"
        };
        
       const newId = "69fa1f15cff2d08355d32999";

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

         jest.spyOn(Publication, 'create').mockResolvedValue({
            _id: newId, publication: newPublicationData, user: payload.id, self: "api/v2/publications/" + newId
        });

        const response = await request(app).post('/api/v2/publications').set('x-access-token', token).send(newPublicationData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("self", '/api/v2/publications/' + newId);
        expect(Publication.create).toHaveBeenCalled();
        expect(response.body.publication.publication).toHaveProperty("image", "C:\\somepath\\image.png");
    });
    test('Caso 17: Creazione senza description', async () => {

        const newPublicationData = {
            "description": "",
            "category": "chiavi",
            "date": "2023-10-01T12:00:00Z",
            "type": "lost",
            "lat": "11.0395", 
            "lng": "45.8902",
            "address": "Stazione ferroviaria di Trento, Piazza Dante, 38122 Trento TN"
        };
        
       const newId = "69fa1f15cff2d08355d32999";

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

         jest.spyOn(Publication, 'create').mockResolvedValue({
            _id: newId, ...newPublicationData, user: payload.id, self: "api/v2/publications/" + newId
        });

        const response = await request(app).post('/api/v2/publications').set('x-access-token', token).send(newPublicationData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'La descrizione deve essere di almeno 5 caratteri.');
    });
    test('Caso 18: Creazione con data nel futuro', async () => {

        const newPublicationData = {
            "description": "mazzo chiavi di casa",
            "category": "chiavi",
            "date": "2027-10-01T12:00:00Z",
            "type": "lost"
        };
        
       const newId = "69fa1f15cff2d08355d32999";

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

         jest.spyOn(Publication, 'create').mockResolvedValue({
            _id: newId, ...newPublicationData, user: payload.id, self: "api/v2/publications/" + newId
        });

        const response = await request(app).post('/api/v2/publications').set('x-access-token', token).send(newPublicationData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'La data non può essere nel futuro.');
    });
    test('Caso 19: Tentativo di creazione senza token', async () => {

        const newPublicationData = {
            "description": "mazzo chiavi di casa",
            "category": "chiavi",
            "date": "2023-10-01T12:00:00Z",
            "type": "lost"
        };
        
       const newId = "69fa1f15cff2d08355d32999";

        
        jest.spyOn(Publication, 'create').mockResolvedValue({
            _id: newId, ...newPublicationData, self: "api/v2/publications/" + newId
        });

        const response = await request(app).post('/api/v2/publications').send(newPublicationData);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'No token provided.');
    });
    test('Caso 20: Creazione pubblicazione senza immagine', async () => {

        const newPublicationData = {
            "description": "mazzo chiavi di casa",
            "category": "chiavi",
            "date": "2023-10-01T12:00:00Z",
            "type": "lost",
            "image": "",
            "lat": "11.0395", 
            "lng": "45.8902",
            "address": "Stazione ferroviaria di Trento, Piazza Dante, 38122 Trento TN"
        };
        
       const newId = "69fa1f15cff2d08355d32999";

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

         jest.spyOn(Publication, 'create').mockResolvedValue({
            _id: newId, publication: newPublicationData, user: payload.id, self: "api/v2/publications/" + newId
        });

        const response = await request(app).post('/api/v2/publications').set('x-access-token', token).send(newPublicationData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("self", '/api/v2/publications/' + newId);
        expect(Publication.create).toHaveBeenCalled();
        expect(response.body.publication.publication).toHaveProperty("image", "");
    });
    test('Caso 21: Upload file troppo grande (>1MB)', async () => {
        const buffer = Buffer.alloc(1024 * 1024 * 1.5); // File da 1.5 MB

        const newPublicationData = {
            "description": "mazzo chiavi di casa",
            "category": "chiavi",
            "date": "2023-10-01T12:00:00Z",
            "type": "lost",
            "lat": "11.0395", 
            "lng": "45.8902",
            "address": "Stazione ferroviaria di Trento, Piazza Dante, 38122 Trento TN"
        };
        
        const newId = "69fa1f15cff2d08355d32999";
        const payload = {
            id: '69fa1f15cff2d08355d320e5',
            username: 'alice01',
            email: 'alice01@gmail.com',
            role: 'user',
        };
        const token = jwt.sign(payload, process.env.SUPER_SECRET || 'test_secret', { expiresIn: 3600 });

        
        mockUpload.mockResolvedValue({
            error: { message: "The object exceeded the maximum allowed size" },
            data: null
        });

        const mockNewPub = { _id: newId, ...newPublicationData, user: payload.id };
        jest.spyOn(Publication, 'create').mockResolvedValue(mockNewPub);
        jest.spyOn(Publication, 'findByIdAndDelete').mockResolvedValue(mockNewPub);


        const response = await request(app)
            .post('/api/v2/publications')
            .set('x-access-token', token)
            .field('description', newPublicationData.description)
            .field('category', newPublicationData.category)
            .field('date', newPublicationData.date)
            .field('type', newPublicationData.type)
            .field("address", newPublicationData.address)
            .field('lat', newPublicationData.lat)
            .field('lng', newPublicationData.lng)
            .attach('image', buffer, 'immagine_pesante.png');


        expect(response.status).toBe(500);
        expect(response.body.error).toContain("Upload immagine fallito");
        expect(response.body.details).toContain("The object exceeded the maximum allowed size");
        expect(Publication.create).toHaveBeenCalled();
        expect(Publication.findByIdAndDelete).toHaveBeenCalledWith(newId);
    });
    test('Caso 22: Lat non valida', async () => {

        const newPublicationData = {
            "description": "mazzo chiavi di casa",
            "category": "chiavi",
            "date": "2023-10-01T12:00:00Z",
            "type": "lost",
            "image": "C:\\somepath\\image.png",
            "lat": "100", 
            "lng": "45.8902",
            "address": "Stazione ferroviaria di Trento, Piazza Dante, 38122 Trento TN"
        };
        
       const newId = "69fa1f15cff2d08355d32999";

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

         jest.spyOn(Publication, 'create').mockResolvedValue({
            _id: newId, publication: newPublicationData, user: payload.id, self: "api/v2/publications/" + newId
        });

        const response = await request(app).post('/api/v2/publications').set('x-access-token', token).send(newPublicationData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Latitudine non valida");
    });
});

describe('Modifica pubblicazione (put: publications)', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });
    

    test('Caso 23: Modifica stato della pubblicazione', async () => {

        const id = "69fa1f15cff2d08355d32999";

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);
        
        const mockSave = jest.fn().mockResolvedValue({
            _id: id,
            description: "mazzo chiavi di casa",
            category: "chiavi",
            date: "2023-10-01T12:00:00Z",
            type: "lost",
            state: "solved", 
            user: payload.id
        });
        
        const mockPublicationInstance = {
            _id: id,
            description: "mazzo chiavi di casa",
            category: "chiavi",
            date: "2023-10-01T12:00:00Z",
            type: "lost",
            state: "unresolved", 
            user: payload.id,    
            save: mockSave       
        };


        jest.spyOn(Publication, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockPublicationInstance)
        });

        const response = await request(app).put('/api/v2/publications/' + id).set('x-access-token', token).send({"type" : "solved"});

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("self", '/api/v2/publications/' + id);
        expect(mockSave).toHaveBeenCalled();
    });
    test('Caso 24: Modifica da utente non autorizzato', async () => {

        const id = "69fa1f15cff2d08355d32999";

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
            
        
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);
        
        const mockSave = jest.fn().mockResolvedValue({
            _id: id,
            description: "mazzo chiavi di casa",
            category: "chiavi",
            date: "2023-10-01T12:00:00Z",
            type: "lost",
            state: "solved", 
            user: "69fa1f15cff2d08355d320e6"
        });
        
        const mockPublicationInstance = {
            _id: id,
            description: "mazzo chiavi di casa",
            category: "chiavi",
            date: "2023-10-01T12:00:00Z",
            type: "lost",
            state: "unresolved", 
            user: "69fa1f15cff2d08355d320e6",    
            save: mockSave       
        };


        jest.spyOn(Publication, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockPublicationInstance)
        });

        const response = await request(app).put('/api/v2/publications/' + id).set('x-access-token', token).send({"type" : "solved"});

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("Non sei autorizzato a modificare questa pubblicazione.");
    });
    test('Caso 25: Modifica su ID inesistente', async () => {

        const id = "69fa1f15cff2d08355d32999";

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);
        
        


        jest.spyOn(Publication, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });

        const response = await request(app).put('/api/v2/publications/' + id).set('x-access-token', token).send({"type" : "solved"});

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Pubblicazione non trovata");
    });
    
});


describe('Cancella Pubblicazione (delete: publications/:id)', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });
    

    test('Caso 37: Eliminazione con successo', async () => {

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        jest.spyOn(Publication, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue({
                _id: '69fa1f15cff2d08355d320f8',
                user: '69fa1f15cff2d08355d320e5'
            })
        });

        jest.spyOn(Publication, 'deleteOne').mockResolvedValue({
            acknowledged: true,
            deletedCount: 1
        });


        const response = await request(app)
            .delete('/api/v2/publications/69fa1f15cff2d08355d320f8')
            .set('x-access-token', token);

        expect(response.status).toBe(200);
        expect(response.body.success).toHaveProperty('acknowledged', true);
        expect(response.body.success).toHaveProperty('deletedCount', 1);
    });

    test('Caso 38: Eliminazione pubblicazione non esistente', async () => {

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        jest.spyOn(Publication, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });


        const response = await request(app)
            .delete('/api/v2/publications/69fa1f15cff2d08355d320f9')
            .set('x-access-token', token);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Pubblicazione non trovata');
    });
    
    test('Caso 39: Eliminazione pubblicazione di un altro utente', async () => {

        const payload = {
                id: '69fa1f15cff2d08355d320e5',
                username: 'alice01',
                email: 'alice01@gmail.com',
                role: 'user',
            }
        const options = { expiresIn: 3600 }

        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        jest.spyOn(Publication, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue({
                _id: '69fa1f15cff2d08355d320f8',
                user: '69fa1f15cff2d08355d320e4'
            })
        });


        const response = await request(app)
            .delete('/api/v2/publications/69fa1f15cff2d08355d320f8')
            .set('x-access-token', token);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'Non sei autorizzato a eliminare questa pubblicazione.');
    });

    
});