const connection = require("../db/connection")


exports.checkReviewExists = (review_id) => {
    return connection.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id]).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "Error - review ID not found"})
        }
        
    })
}

exports.fetchReviews = (review_id) => {
    return connection.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id]).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "Error - review ID not found"})
        }
        return result.rows[0];
    })
}

exports.fetchAllReviews = (category) => {
    console.log(category)
    const queryValues = [];

    let queryStr = `SELECT reviews.review_id, title, category, review_img_url, reviews.created_at, reviews.votes, designer, owner,   COUNT(comment_id)::INT AS comment_count FROM reviews
    `;
  
    if (category) {
      queryStr += ` WHERE category = strategy
      `;
      queryValues.push(category);
    }

    queryStr+=   `LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`

    console.log(queryStr)

    return connection.query(queryStr, queryValues).then((result) =>{
        return result.rows
    })
}

exports.updateReview = (review_id, inc_votes) => {
    if (inc_votes){
    return connection.query(`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *`,[inc_votes, review_id]).then((result) => { if(result.rows.length === 0){
        return Promise.reject({ status: 404, msg: "Error - review ID not found"})
    }
        return result.rows[0]
    })}
    else {
        return Promise.reject({
          status: 400,
          msg: "Error - bad request, no votes value!",
        });
      }
}