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
  test("PATCH - status 200 responds with the updated review", () => {
    return request(app)
    .patch("/api/reviews/5")
    .expect(200)
    .send({inc_votes: 10})
    .then((res) => {
      const {review}=res.body
      expect(review.votes).toBe(15)
      expect(review.owner).toBe("mallionaire")
      expect(review.title).toBe("Proident tempor et.")
      expect(review.review_id).toBe(5)
      expect(review.category).toBe("social deduction")
      expect(review.designer).toBe("Seymour Buttz")
      expect(typeof review.review_img_url).toBe("string")
      expect(typeof review.created_at).toBe("string")     
    })
  })
  test("PATCH - status 200 responds with the updated review with decreased votes", () => {
    return request(app)
    .patch("/api/reviews/12")
    .expect(200)
    .send({inc_votes: -100})
    .then((res) => {
      const {review}=res.body
      expect(review.votes).toBe(0)
      expect(review.title).toBe("Scythe; you're gonna need a bigger table!")
      expect(review.review_id).toBe(12)
      expect(typeof review.owner).toBe("string")
      expect(typeof review.category).toBe("string")
      expect(typeof review.review_img_url).toBe("string")
      expect(typeof review.created_at).toBe("string")
      expect(typeof review.designer).toBe("string")
    })
  })
  test("PATCH - status 200 - if object has additional properties these do not impact comment the vote update", () => {
    return request(app)
    .patch("/api/reviews/12")
    .expect(200)
    .send({inc_votes: -100, inc_review_id:5})
    .then((res) => {
      const {review}=res.body
      expect(review.votes).toBe(0)
      expect(review.title).toBe("Scythe; you're gonna need a bigger table!")
      expect(review.review_id).toBe(12)
      expect(typeof review.owner).toBe("string")
      expect(typeof review.category).toBe("string")
      expect(typeof review.review_img_url).toBe("string")
      expect(typeof review.created_at).toBe("string")
      expect(typeof review.designer).toBe("string")
    })
  })
  test ("PATCH - status 400 - review ID not of correct form returns bad request error", () => {
    return request(app)
    .patch("/api/reviews/nonsense")
    .expect(400)
    .send({inc_votes: -100})
    .then((res) => {
    expect(res.body).toEqual({msg:"Error - bad request!"})
  })
  })
  test("PATCH - status 404 - invalid review ID returns ID not found error", ()=> {
    return request(app)
    .patch("/api/reviews/3000")
    .expect(404)
    .send({inc_votes: -100})
    .then((res) => {
    expect(res.body).toEqual({msg:"Error - review ID not found"})
  })
  })
  
  test ("PATCH - status 400 - if property is missing from the object in the request", () => {
    return request(app)
    .patch("/api/reviews/3")
    .expect(400)
    .send({})
    .then((res) => {
    expect(res.body).toEqual({msg:"Error - bad request, no votes value!"})
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

// test("GET - status: 200 - can filter review by category", () => {
//   return request(app)
//     .get("/api/reviews?category=strategy")
//     .expect(200)
//     .then((res) => {
//       res.body.reviews.forEach((review)=>{
//           expect(review.category).toBe("strategy")
//       })
//   });
// });

describe("/api/reviews/:review_id/comments", ()=> {
    test ("GET - status 200 - responds with an array of comments for the given review id, each having properties comment_id, votes, created_at, author, body, review_id and sorted by date", ()=>{
        return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then((res)=>{
          expect(res.body.comments.length).toBe(3)
          expect(res.body.comments).toBeSortedBy("created_at", {descending: true})
          res.body.comments.forEach(comment => {
            expect(typeof comment.comment_id).toBe("number")
            expect(typeof comment.votes).toBe("number")
            expect(typeof comment.created_at).toBe("string")
            expect(typeof comment.author).toBe("string")
            expect(typeof comment.body).toBe("string")
            expect(typeof comment.review_id).toBe("number")
            
          })
        })
    })
    test("GET - status 200 - responds with an empty array if a valid review ID is given which has no comments",()=>{
      return request(app)
      .get("/api/reviews/8/comments")
      .expect(200)
      .then((res)=>{
        expect(res.body.comments).toEqual([])
      })
    })
    test ("GET - status 400 - review ID not of correct form returns bad request error", () => {
      return request(app)
      .get("/api/reviews/nonsense/comments")
      .expect(400)
      .then((res) => {
      expect(res.body).toEqual({msg:"Error - bad request!"})
  })
  })
  test("GET - status 404 - invalid review ID returns ID not found error", ()=> {
    return request(app)
    .get("/api/reviews/3000/comments")
    .expect(404)
    .then((res) => {
    expect(res.body).toEqual({msg:"Error - review ID not found"})
})
})

test("POST - status 201 - responds with the added comment object", () => {
  return request(app)
  .post("/api/reviews/8/comments")
  .expect(201)
  .send({username:'dav3rid', body:'great game'})
  .then((result => {
    
    const {comment}= result.body
    expect(comment.body).toBe('great game')
    expect(comment.author).toBe("dav3rid")
    expect(comment.votes).toBe(0)
    expect(comment.review_id).toBe(8)
    expect(typeof comment.comment_id).toBe('number')
    expect(typeof comment.created_at).toBe("string")

  }))
})
test ("POST - status 201 - if comment has additional properties these do not impact comment posting", () => {
  return request(app)
  .post("/api/reviews/3/comments")
  .expect(201)
  .send({username:'dav3rid', body:'great game', votes:300, anything_else:"here"})
  .then((result) => {
    const {comment}= result.body
    expect(Object.keys(comment).length).toBe(6)
    expect(comment.body).toBe('great game')
    expect(comment.author).toBe("dav3rid")
    expect(comment.votes).toBe(0)
    expect(comment.review_id).toBe(3)
    expect(typeof comment.comment_id).toBe('number')
    expect(typeof comment.created_at).toBe("string")
})
})
test ("POST - status 400 - review ID not of correct form returns bad request error", () => {
  return request(app)
  .post("/api/reviews/nonsense/comments")
  .expect(400)
  .send({username:'dav3rid', body:'great game'})
  .then((res) => {
  expect(res.body).toEqual({msg:"Error - bad request!"})
})
})
test ("POST - status 400 - if property is missing from the comment object in the request", () => {
  return request(app)
  .post("/api/reviews/3/comments")
  .expect(400)
  .send({})
  .then((res) => {
  expect(res.body).toEqual({msg:"Error - bad request, incorrect properties!"})
})
})

test("POST - status 404 - invalid review ID returns ID not found error", ()=> {
  return request(app)
  .post("/api/reviews/3000/comments")
  .expect(404)
  .send({username:'dav3rid', body:'great game'})
  .then((res) => {
  expect(res.body).toEqual({msg:"Error - review ID not found"})
})
})
test("POST - status 404 - user ID not in database returns user not found error", ()=> {
  return request(app)
  .post("/api/reviews/8/comments")
  .expect(404)
  .send({username:'efie', body:'great game'})
  .then((res) => {
  expect(res.body).toEqual({msg:"Error - user not found"})
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

