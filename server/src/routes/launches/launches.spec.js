const request = require('supertest'); // supertest a tool that makes requests against API
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /v1/launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
            // expect(response.statusCode).toBe(200);
        });
    });

    describe('Test POST /v1/launch', () => {
        const completedLaunchData = {
            mission: 'Interstellar',
            rocket: 'Shuttle Four',
            target: 'Kepler-62 f',
            launchDate: 'October 12, 2030',
        };

        const launchDataWithoutDate = {
            mission: 'Interstellar',
            rocket: 'Shuttle Four',
            target: 'Kepler-62 f',
        };

        const launchDataWithInvalidDate = {
            mission: 'Interstellar',
            rocket: 'Shuttle Four',
            target: 'Kepler-62 f',
            launchDate: 'Nov',
        };

        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completedLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);

            const requestDate = new Date(
                completedLaunchData.launchDate
            ).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);

            expect(response.body).toMatchObject(launchDataWithoutDate);
        });

        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            });
        });

        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            });
        });
    });
});
