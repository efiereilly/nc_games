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
    test("GET - status 200 - responds with review object with properties review_id title, review_body, designer, review_img_url, votes, category, owner and created_at", () => {
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

describe("/api/reviews", () => {
    test("GET - status 200 - responds with array of review objects which have properties owner, title, review_id, category, review_img_url, created_at, votes, designer and comment_count", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((res)=>{
            expect(res.body.reviews).toBeSortedBy("created_at", {descending: true})
            expect(res.body.reviews.length).toBe(13)
            res.body.reviews.forEach(review => {
                expect(typeof review.owner).toBe("string")
                expect(typeof review.title).toBe("string")
                expect(typeof review.review_id).toBe("number")
                expect(typeof review.category).toBe("string")
                expect(typeof review.review_img_url).toBe("string")
                expect(typeof review.created_at).toBe("string")
                expect(typeof review.votes).toBe("number")
                expect(typeof review.designer).toBe("string")
                expect(typeof review.comment_count).toBe("number")
            })
        })
    })
})



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

