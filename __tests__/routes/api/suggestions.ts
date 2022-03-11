import request from "supertest";
import {City} from '../../../src/models/city'

describe('GET /suggestions', () => {
        let app;
    beforeAll(async () => {
        app= require("../../../src/server");
    });
  
    afterAll(() => {

    });
    
    it('It should respond with an array of suggestions', async() => {
        const response = await request(app).get("/suggestions?q=lon&latitude=43.70011&longitude=-79.4163&radius=500&sort=name");
        jest.spyOn(City, 'aggregate').mockReturnValueOnce([
            {
                "_id": "622bb259716afb593c541c14",
                "name": "Colonial Park,PA,US",
                "distance": 435.49144565067877,
                "latitude": 40.30064,
                "longitude": -76.80969
            },
            {
                "_id": "622bb258716afb593c5419fd",
                "name": "Colonie,NY,US",
                "distance": 465.8783001149136,
                "latitude": 42.71786,
                "longitude": -73.83346
            }
        ] as any);
      expect(response.body).toEqual({
        "suggestions": [
            {
                "_id": "622bb259716afb593c541c14",
                "name": "Colonial Park,PA,US",
                "distance": 435.49144565067877,
                "latitude": 40.30064,
                "longitude": -76.80969
            },
            {
                "_id": "622bb258716afb593c5419fd",
                "name": "Colonie,NY,US",
                "distance": 465.8783001149136,
                "latitude": 42.71786,
                "longitude": -73.83346
            }
        ]
    });
    expect(response.statusCode).toBe(200);
    });
  });
  