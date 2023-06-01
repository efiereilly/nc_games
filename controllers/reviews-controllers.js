const { fetchReviews, fetchAllReviews, updateReview } = require("../models/reviews-models")

exports.getReviews = (req, res, next) => {
    
    const { review_id } = req.params
    fetchReviews(review_id).then((review) => {
        res.status(200).send({review})
    })
    .catch(err => {
        next(err)
    })
}

exports.getAllReviews = (req, res, next) => {
    const { category } = req.query;
    fetchAllReviews(category).then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch(err => {
        next(err)
    })
}

exports.patchReviews = (req, res, next) => {
    const { review_id } = req.params
    const { inc_votes } = req.body
    updateReview(review_id, inc_votes).then((review) => {
        res.status(200).send({review})
    }).catch((err)=>{
        next(err)
    })
}
