const connection = require("../db/connection")
const { checkReviewExists, getAuthor } = require("./reviews-models")

exports.fetchComments = (review_id) => {
    return checkReviewExists(review_id).then(()=>
    {return connection.query(`SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at DESC;`,[review_id]).then((result)=> {
        return result.rows
    })})
}

exports.insertComment = (comment, review_id) => {
    const intID = Number(review_id)
    if(comment.body && comment.username){
    const {username, body} = comment
    const newCommentQuery = `INSERT INTO comments (body, author, votes, review_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *`
    return getAuthor(review_id).then((author) => {
        return connection.query(newCommentQuery,[body, author,0,intID]).then((result)=>{
            return result.rows[0]
        })    
    })}
    else { return Promise.reject({ status: 400, msg: "Error - bad request, comment missing properties!"})}

}