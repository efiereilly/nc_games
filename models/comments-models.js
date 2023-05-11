const connection = require("../db/connection")
const { checkReviewExists } = require("./reviews-models")

exports.fetchComments = (review_id) => {
    return checkReviewExists(review_id).then(()=>
    {return connection.query(`SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at DESC;`,[review_id]).then((result)=> {
        return result.rows
    })})
}