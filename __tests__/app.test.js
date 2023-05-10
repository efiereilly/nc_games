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

  describe("/api/reviews/:review_id", () => {
    test("GET - status 200 - responds with array of review object with properties review_id title, review_body, designer, review_img_url, votes, category, owner and created_at", () => {
        return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then((res) => {
            // expect(res.body.review.length).toBe(1)
            console.log(res.body)
            const {review} = res.body
            expect(typeof review.review_id).toBe("number")
            expect(typeof review.title).toBe("string")
            expect(typeof review.category).toBe("string")
            expect(typeof review.designer).toBe("string")
            expect(typeof review.owner).toBe("string")
            expect(typeof review.review_body).toBe("string")
            expect(typeof review.review_img_url).toBe("string")
            expect(typeof review.created_at).toBe("string")
            expect(typeof review.votes).toBe("number")
            
        })
    } )
    test("GET - status 404 - invalid restaurant ID returns error", ()=> {
        return request(app)
        .get("/api/reviews/3000")
        .expect(404)
        .then((res) => {
        expect(res.body).toEqual({msg:"Error - review ID not found"})
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