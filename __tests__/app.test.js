const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const endPoints = require("../endpoints.json");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed({ categoryData, commentData, reviewData, userData });
});

describe("/api/categories", () => {
  test("GET - status 200 - responds with array of category objects with properties slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories.length).toBe(4);
        res.body.categories.forEach((category) => {
          const { slug, description } = category;
          expect(typeof slug).toBe("string");
          expect(typeof description).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("GET - status 200 - responds with JSON describing all API endpoints", () => {
    ;
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body.endPoints).toEqual(endPoints);
      });
  });
});


  describe("/api/reviews/:review_id", () => {
    test("GET - status 200 - responds with array of review object with properties review_id title, review_body, designer, review_img_url, votes, category, owner and created_at", () => {
        return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then((res) => {
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
    test("GET - status 404 - invalid review ID returns error", ()=> {
        return request(app)
        .get("/api/reviews/3000")
        .expect(404)
        .then((res) => {
        expect(res.body).toEqual({msg:"Error - review ID not found"})
    })
  })
  test("GET - status 400 - review ID not of correct form returns error", ()=> {
    return request(app)
    .get("/api/reviews/nonsense")
    .expect(400)
    .then((res) => {
    expect(res.body).toEqual({msg:"Error - bad request!"})
})
})
})

// describe("/api/reviews/:review_id/comments", ()=> {
//     test ("GET - status 200 - responds with an array of comments for the given review id, each having properties comment_id, votes, created_at, author, body, review_id and sorted by date", ()=>{
//         return request(app)
//         .get("/api/reviews/3/comments")
//         .expect(200)
//     })
// })


describe("GET request to unavailable route responds with error", () => {
  test("/api/not-a-route - status 404 - responds with error message ", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ msg: "Error - not found" });
      });
  });
});

