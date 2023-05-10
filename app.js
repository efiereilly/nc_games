const express = require("express");

const {getCategories} = require("./controllers/categories-controllers.js");
const { getReviews } = require("./controllers/reviews-controllers.js");

const { getEndpoints } = require("./controllers/endpoints-controller.js");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories)


app.get("/api/reviews/:restaurant_id", getReviews)


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
      res.status(400).send({ msg: 'Error - not a review ID' });
    } else res.status(500).send({ msg: 'Internal Server Error' });
  }); 


module.exports =app