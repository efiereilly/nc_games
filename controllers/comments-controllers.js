const fs = require("fs/promises")
const { fetchComments, insertComment } = require("../models/comments-models")



exports.getComments = (req,res,next) => {
    const { review_id } = req.params
    fetchComments(review_id).then((comments)=>{
        res.status(200).send({comments})
    }).catch((err)=>{
        next(err)
    })
}

exports.postComments = (req, res, next) => {
    const { review_id } = req.params
    const comment  = req.body
    insertComment(comment, review_id).then((comment) => {
        res.status(201).send({comment})
    }).catch((err) => {
        next(err)
    })
}

