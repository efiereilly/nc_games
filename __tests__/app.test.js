const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const { categoryData, commentData, reviewData, userData } = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");


afterAll(() => {
    db.end();
  });

  beforeEach(() => {
    return seed({ categoryData, commentData, reviewData, userData  });
  });

  describe("/api/categories", () => {
    test("GET - status 200 - responds with array of category objects with properties slug and description", () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then((res) => {
            expect(res.body.categories.length).toBe(4)
            res.body.categories.forEach((category) => {
                const {slug, description} = category
                expect(typeof slug).toBe("string")
                expect(typeof description).toBe("string")
            })
        })
        
    })
  })

  describe("GET request to unavailable route responds with error",()=>{
    test("/api/not-a-route - status 404 - responds with error message ", () => {
        return request (app)
        .get("/api/not-a-route")
        .expect(404)
        .then((res)=>{
            expect(res.body).toEqual({msg: 'Error - not found'})
        })
    })
  })