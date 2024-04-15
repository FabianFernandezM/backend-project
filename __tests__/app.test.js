const app = require("../app")
const request = require("supertest")
const db = require("../db/connection")
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
    test("GET 200: Should return an object with an array on its 'topics' key", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            const {topics} = body
            expect(typeof body).toBe("object")
            expect(Array.isArray(topics)).toBe(true)
        })
    })
    test("GET 200: Should return an array of topic objects", () => {
        const topicsFile = require(`${__dirname}/../db/data/test-data/topics.js`)
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            const {topics} = body
            expect(topics.length).toBe(topicsFile.length)
            expect(topics).toEqual(topicsFile)
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
            const {endpoints} = body
            expect(typeof endpoints).toBe("object")
        })
    })
    test("GET 200: Should return an object with current endpoints with all information matching the endpoints.json file", () => {
        const endpointsFile = require(`${__dirname}/../endpoints.json`)
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            const {endpoints} = body
            expect(endpoints.length).toBe(endpointsFile.length)
            expect(endpoints).toEqual(endpointsFile)
        })
    })
})

describe("/api/articles/:article_id", () => {
    test("GET 200: Should return an object", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(typeof article).toBe("object")
        })
    })
    test("GET 200: Should return an article object matching the ID input with the correct keys", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(article.article_id).toBe(1)
            expect(article.title).toBe("Living in the shadow of a great man")
            expect(article.topic).toBe("mitch")
            expect(article.author).toBe("butter_bridge")
            expect(article.body).toBe("I find this existence challenging")
            expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
            expect(article.votes).toBe(100)
            expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
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

describe("/api/articles", () => {
    test("GET 200: Should return an object with an array on its 'articles' key", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(typeof body).toBe("object")
            expect(Array.isArray(articles)).toBe(true)
        })
    })
    test("GET 200: Should return an array of article objects with the correct keys, ordered in DESC order by 'created_at' value", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("created_at", {descending: true})
            articles.forEach(article => {
                expect(typeof article.author).toBe("string")
                expect(typeof article.title).toBe("string")
                expect(typeof article.article_id).toBe("number")
                expect(typeof article.topic).toBe("string")
                expect(typeof article.created_at).toBe("string")
                expect(typeof article.votes).toBe("number")
                expect(typeof article.article_img_url).toBe("string")
                expect(typeof article.comment_count).toBe("string")
            });
        })
    })
})