const app = require("../app")
const request = require("supertest")
const db = require("../db/connection")
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")

beforeEach(() => seed(data));
afterAll(() => db.end());

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
    test("GET 200: Should return an array of article objects with the correct keys", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles.length).toBe(13)
            articles.forEach(article => {
                expect(typeof article.author).toBe("string")
                expect(typeof article.title).toBe("string")
                expect(typeof article.article_id).toBe("number")
                expect(typeof article.topic).toBe("string")
                expect(typeof article.created_at).toBe("string")
                expect(typeof article.votes).toBe("number")
                expect(typeof article.article_img_url).toBe("string")
                expect(typeof article.comment_count).toBe("number")
            });
        })
    })
    test("GET 200: Should return an array of article objects ordered in DESC order by 'created_at' value", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("created_at", {descending: true})
        })
    })
    test("GET 200: Should return an array of article objects with the correct topic as per specified query value", () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles.length).toBe(12)
            expect(articles).toBeSortedBy("created_at", {descending: true})
            articles.forEach(article => {
                article.topic = "mitch"
            });
        })
    })
    test("GET 404: Should return 'Not found' if the query name is valid but the value is not found within the database", () => {
        return request(app)
        .get("/api/articles?topic=banana")
        .expect(404)
        .then(({body}) => {
            const {message} = body
            expect(message).toBe("Not found")
        })
    })
    test("GET 400: Should return 'Query not allowed' if the query name is not valid", () => {
        return request(app)
        .get("/api/articles?banana=topic")
        .expect(400)
        .then(({body}) => {
            const {message} = body
            expect(message).toBe("Query not allowed")
        })
    })
})

describe("/api/articles/:article_id", () => {
    describe ("GET", () => {
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
        test("GET 200: Should return an article object with a comment_count key with the correct value", () => {
            return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({body}) => {
                const {article} = body
                expect(article.comment_count).toBe(11)
            })
        })
        test('GET 404: sends an appropriate status and error message when given a valid but non-existent id', () => {
            return request(app)
              .get('/api/articles/999')
              .expect(404)
              .then(({body}) => {
                expect(body.message).toBe('This article does not exist');
            })
        })
        test('GET 400: sends an appropriate status and error message when given an invalid id', () => {
            return request(app)
              .get('/api/articles/not-an-id')
              .expect(400)
              .then(({body}) => {
                expect(body.message).toBe('Bad request')
            })
        })
    })
    describe ("PATCH", () => {
        test("PATCH 200: Should return the updated article", () => {
            const votes = { inc_votes : 1 }
            return request(app)
            .patch("/api/articles/1")
            .send(votes)
            .expect(200)
            .then(({body}) => {
                const {article} = body
                expect(article.article_id).toBe(1)
                expect(article.title).toBe("Living in the shadow of a great man")
                expect(article.topic).toBe("mitch")
                expect(article.author).toBe("butter_bridge")
                expect(article.body).toBe("I find this existence challenging")
                expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
                expect(article.votes).toBe(101)
                expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
            })
        })
        test('PATCH 404: sends an appropriate status and error message when given a valid but non-existent article id', () => {
            const votes = { inc_votes : 1 }
            return request(app)
              .patch('/api/articles/999')
              .send(votes)
              .expect(404)
              .then(({body}) => {
                expect(body.message).toBe('This article does not exist');
            });
        });
        test('PATCH 400: sends an appropriate status and error message when given an invalid article id', () => {
            const votes = { inc_votes : 1 }
            return request(app)
              .patch('/api/articles/not-an-id')
              .send(votes)
              .expect(400)
              .then(({body}) => {
                expect(body.message).toBe('Bad request');
            });
        });
        test("PATCH 400: sends an appropriate status and error message when given an invalid input object", () => {
            const votes = { wrong_key : "hello" }
            return request(app)
            .patch("/api/articles/1")
            .send(votes)
            .expect(400)
            .then(({body}) => {
                const {message} = body
                expect(message).toBe("Bad request")})
        })
        test("PATCH 400: sends an appropriate status and error message when given valid object with wrong datatype keys", () => {
            const votes = { inc_votes : "not-a-number" }
            return request(app)
            .patch("/api/articles/1")
            .send(votes)
            .expect(400)
            .then(({body}) => {
                const {message} = body
                expect(message).toBe("Bad request")})
        })
    })
})

describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
        test("GET 200: Should return an array of comment objects with the correct keys", () => {
            return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({body}) => {
                const {comments} = body
                expect(comments.length).toBe(11)
                comments.forEach(comment => {
                    expect(typeof comment.comment_id).toBe("number")
                    expect(typeof comment.votes).toBe("number")
                    expect(typeof comment.created_at).toBe("string")
                    expect(typeof comment.author).toBe("string")
                    expect(typeof comment.body).toBe("string")
                    expect(typeof comment.article_id).toBe("number")
                });
            })
        })
        test("GET 200: Should return an array of comment objects ordered by most recent first", () => {
            return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({body}) => {
                const {comments} = body
                expect(comments.length).toBe(11)
                expect(comments).toBeSortedBy("created_at", {descending: true})
            })
        })
        test("GET 200: If the article exists but has no comments, it should return an empty array", () => {
            return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({body}) => {
                const {comments} = body
                expect(comments.length).toBe(0)
            })
        })
        test('GET 404: sends an appropriate status and error message when given a valid but non-existent id', () => {
            return request(app)
              .get('/api/articles/999/comments')
              .expect(404)
              .then(({body}) => {
                expect(body.message).toBe('This article does not exist');
            });
        });
        test('GET 400: sends an appropriate status and error message when given an invalid id', () => {
            return request(app)
              .get('/api/articles/not-an-id/comments')
              .expect(400)
              .then(({body}) => {
                expect(body.message).toBe('Bad request');
            });
        });
    })
    describe ("POST", () => {
        test("POST 201: Should return the posted comment", () => {
            const newComment = { username: "rogersop", body: "This is interesting" }
            return request(app)
                .post("/api/articles/1/comments")
                .send(newComment)
                .expect(201)
                .then(({body}) => {
                    const {comment} = body
                    expect(comment.comment_id).toBe(19)
                    expect(comment.votes).toBe(0)
                    expect(typeof comment.created_at).toBe("string")
                    expect(comment.author).toBe("rogersop")
                    expect(comment.body).toBe("This is interesting")
                    expect(comment.article_id).toBe(1)
            })
        })
        test('POST 404: sends an appropriate status and error message when given a valid but non-existent id', () => {
            const newComment = { username: "rogersop", body: "This is interesting" }
            return request(app)
                .post("/api/articles/999/comments")
                .send(newComment)
                .expect(404)
                .then(({body}) => {
                    expect(body.message).toBe('This article does not exist');
            });
        });
        test('POST 400: sends an appropriate status and error message when given an invalid id', () => {
            const newComment = { username: "rogersop", body: "This is interesting" }
            return request(app)
                .post("/api/articles/not-an-id/comments")
                .send(newComment)
                .expect(400)
                .then(({body}) => {
                    expect(body.message).toBe('Bad request');
            });
        });
        test('POST 400: sends an appropriate status and error message when given an incomplete input object', () => {
            const newComment = { username: "rogersop" }
            return request(app)
                .post("/api/articles/not-an-id/comments")
                .send(newComment)
                .expect(400)
                .then(({body}) => {
                    expect(body.message).toBe('Bad request');
            });
        });
        test('POST 400: sends an appropriate status and error message when given an input object with wrong datatype on keys', () => {
            const newComment = { username: 52666, body: false }
            return request(app)
                .post("/api/articles/1/comments")
                .send(newComment)
                .expect(400)
                .then(({body}) => {
                    expect(body.message).toBe('Bad request');
            });
        });
    })
})

describe("/api/comments/:comment_id", () => {
    describe ("DELETE", () => {
        test("DELETE 204: Should delete the comment and return no content", () => {
            return request(app)
            .delete("/api/comments/1")
            .expect(204)
        })
        test('DELETE 404: sends an appropriate status and error message when given a valid but non-existent comment id', () => {
            return request(app)
              .delete('/api/comments/999')
              .expect(404)
              .then(({body}) => {
                expect(body.message).toBe('This comment does not exist');
            });
        });
        test('DELETE 400: sends an appropriate status and error message when given an invalid comment id', () => {
            return request(app)
              .delete('/api/comments/not-an-id')
              .expect(400)
              .then(({body}) => {
                expect(body.message).toBe('Bad request');
            });
        });
    })
})

describe("/api/users", () => {
    test("GET 200: Should return an object with an 'users' key containing an array of user objects with the correct keys", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            const {users} = body
            expect(users.length).toBe(4)
            users.forEach(user => {
                expect(typeof user.username).toBe("string")
                expect(typeof user.name).toBe("string")
                expect(typeof user.avatar_url).toBe("string")
            });
        })
    })
})