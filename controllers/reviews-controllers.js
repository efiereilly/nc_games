const { fetchReviews } = require("../models/reviews-models")

exports.getReviews = (req, res, next) => {
    
    const { restaurant_id } = req.params
    fetchReviews(restaurant_id).then((review) => {
        res.status(200).send({review})
    })
    .catch(err => {
        next(err)
    })
}

