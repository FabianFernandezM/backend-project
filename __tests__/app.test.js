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

describe("/api", () => {
    test("GET 200: Should return an object", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            expect(typeof body).toBe("object")
        })
    })
    test("GET 200: Should return an object with current endpoints with all information matching the endpoints.json file", () => {
        const endpoints = require(`${__dirname}/../endpoints.json`)
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(endpoints.length)
            expect(body).toEqual(endpoints)
        })
    })
})

describe("/api/articles/:article_id", () => {
    test("GET 200: Should return an object", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            expect(typeof body).toBe("object")
        })
    })
    test("GET 200: Should return an article object matching the ID input with the correct keys", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            expect(body.article_id).toBe(1)
            expect(body.title).toBe("Living in the shadow of a great man")
            expect(body.topic).toBe("mitch")
            expect(body.author).toBe("butter_bridge")
            expect(body.body).toBe("I find this existence challenging")
            expect(body.created_at).toBe("2020-07-09T20:11:00.000Z")
            expect(body.votes).toBe(100)
            expect(body.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        })
    })
    test('GET 404: sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then(({body}) => {
            expect(body.message).toBe('This article does not exist');
        });
    });
    test('GET 400: sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/not-an-id')
          .expect(400)
          .then(({body}) => {
            expect(body.message).toBe('Bad request');
        });
    });
})