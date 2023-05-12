const connection = require("../db/connection")


exports.checkReviewExists = (review_id) => {
    return connection.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id]).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "Error - review ID not found"})
        }
        
    })
}

exports.fetchReviews = (restaurant_id) => {
    return connection.query(`SELECT * FROM reviews WHERE review_id = $1;`, [restaurant_id]).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "Error - review ID not found"})
        }
        return result.rows[0];
    })
}

exports.fetchAllReviews = () => {
    return connection.query(`SELECT reviews.review_id, title, category, review_img_url, reviews.created_at, reviews.votes, designer, owner,   COUNT(comment_id)::INT AS comment_count FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`).then((result) =>{
        return result.rows
    })
}

