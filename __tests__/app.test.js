const app = require("../app")
const request = require("supertest")
const db = require("../db/connection")
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
    test("GET 200: Should return an array", () => {
    })
    test("GET 200: Should return an array of topic objects", () => {
    })
    test("GET 404: Should return a 'Not found' is the path is incorrect", () => {
    })
})