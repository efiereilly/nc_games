const express = require("express");
const {getCategories} = require("./controllers/categories-controllers.js")
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories)

app.get("*", (req,res) => {res.status(404).send({ msg : "Error - not found"})} )

app.use((err, req, res, next) => {
    res.status(err.status).send({ msg: err.msg });
  });


module.exports =app