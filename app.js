const express = require("express");
const cors = require('cors');

const {getCategories} = require("./controllers/categories-controllers.js");
const { getReviews, getAllReviews, patchReviews } = require("./controllers/reviews-controllers.js");

const { getEndpoints } = require("./controllers/endpoints-controller.js");
const { getComments, postComments } = require("./controllers/comments-controllers.js");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/categories", getCategories)

app.get("/api/reviews", getAllReviews)

app.get("/api/reviews/:review_id", getReviews)

app.patch("/api/reviews/:review_id", patchReviews)

app.get("/api/reviews/:review_id/comments", getComments)

app.post("/api/reviews/:review_id/comments", postComments)

app.get("/api", getEndpoints)


app.get("*", (req,res) => {res.status(404).send({ msg : "Error - not found"})} )


app.use((err, req, res, next) => {
    if(err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg })
    }
    else {
        next(err)
    }
  });

  app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Error - bad request!' });
    } else {
        next(err)
    };
  }); 

  app.use((err,req,res,next) => {
    
    res.status(500).send({ msg: 'Internal Server Error' })
  })


module.exports =app