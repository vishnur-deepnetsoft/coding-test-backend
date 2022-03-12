
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../../src/server';
import request from 'supertest';
import City from '../../../src/models/city';


beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: 'coding_test' });
    await City.insertMany([
        {
            name: "Colonial Park,PA,US",
            state: 'PA',
            country: 'US',
            location: {
                type: 'Point',
                coordinates: [-76.80969, 40.30064],
            },
        },
        {
            name: "Colonie",
            state: 'NY',
            country: 'US',
            location: {
                type: 'Point',
                coordinates: [-73.83346, 42.71786],
            },
        },
    ]);

})

describe('/suggestions api test ', () => {
    test('it should return suggestions', async () => {
        const response = await request(app).get('/suggestions').query({
            q: 'lon',
            latitude: 43.70011,
            longitude: -79.4163,
            radius: 500,
            sort: 'name',
        })
            .catch((err) => {
                throw err;
            });
        expect(response.statusCode).toEqual(200)
        expect(response.body.suggestions).toHaveLength(2);

    });
    test('return no matching documents', async () => {
        const response = await request(app).get('/suggestions').query({
            q: 'unknown',
            latitude: 43.70011,
            longitude: -79.4163,
            radius: 500,
            sort: 'name',
        })
            .catch((err) => {
                throw err;
            });
        expect(response.statusCode).toEqual(200)
        expect(response.body.suggestions).toHaveLength(0);

    });
    test('query param q is empty ', async () => {
        const response = await request(app).get('/suggestions').query({
            latitude: 43.70011,
            longitude: -79.4163,
            radius: 500,
            sort: 'name',
        })
            .catch((err) => {
                throw err;
            });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error','"q" is required')
    })
});




