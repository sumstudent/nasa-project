const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    })
})

describe('Test POST /launch', () => {
    const completeLaunchData = {
        mission: "TEST USS",
        rocket: "TEST NCC 1701-D",
        target: "Kepler-186 TEST",
        launchDate: "January 4, 2029",
    }

    const launchDataWithoutDate = {
        mission: "TEST USS",
        rocket: "TEST NCC 1701-D",
        target: "Kepler-186 TEST",
    }

    const launchDataMissingKeyProperty = {
        rocket: "TEST NCC 1701-D",
        target: "Kepler-186 TEST",
        launchDate: "January 4, 2029",
    }

    const launchDataMissingValueProperty =
    {
        mission: "",
        rocket: "TEST NCC 1701-D",
        target: "Kepler-186 TEST",
        launchDate: "January 4, 2029",
    }

    const launchDataInvalidDateProperty = {
        mission: "TEST USS",
        rocket: "TEST NCC 1701-D",
        target: "Kepler-186 TEST",
        launchDate: "TEST-test",
    }

    test('It should respond with 201 success', async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(launchDataWithoutDate);
    })

    test('It should catch missing key properties', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataMissingKeyProperty)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            message: 'CODE: 400, Missing required launch property. Status 1 Key pair missing',
        })
    })

    test('It should catch missing value properties', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataMissingValueProperty)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            message: "CODE: 400, Missing required launch property. Status 2 Value pair missing",
        })
    })

    test('It should catch invalid date', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataInvalidDateProperty)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            message: "CODE: 400, Invalid Date Property"
        })
    })
})