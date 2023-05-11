const { fetchReviews, fetchAllReviews } = require("../models/reviews-models")

exports.getReviews = (req, res, next) => {
    
    const { restaurant_id } = req.params
    fetchReviews(restaurant_id).then((review) => {
        res.status(200).send({review})
    })
    .catch(err => {
        next(err)
    })
}

exports.getAllReviews = (req, res, next) => {

    fetchAllReviews().then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch(err => {
        next(err)
    })
}
