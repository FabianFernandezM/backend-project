const app = require("../app")
const request = require("supertest")
const db = require("../db/connection")
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
    test("GET 200: Should return an array", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body)).toBe(true)
        })
    })
    test("GET 200: Should return an array of topic objects", () => {
        const topics = require(`${__dirname}/../db/data/test-data/topics.js`)
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(topics.length)
            expect(body).toEqual(topics)
        })
    })
    test("GET 404: Should return a 'Path not found' is the path is incorrect", () => {
        return request(app)
        .get("/api/incorrectPath")
        .expect(404)
        .then(({body}) => {
            const {message} = body
            expect(message).toBe("Path not found")
        })
    })
})