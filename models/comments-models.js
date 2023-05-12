const connection = require("../db/connection");
const { checkReviewExists } = require("./reviews-models");
const { checkUserExists } = require("./users-models");

exports.fetchComments = (review_id) => {
  return checkReviewExists(review_id).then(() => {
    return connection
      .query(
        `SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at DESC;`,
        [review_id]
      )
      .then((result) => {
        return result.rows;
      });
  });
};

exports.insertComment = (comment, review_id) => {
  const intID = Number(review_id);
  if (Object.keys(comment).length==2 && comment.body && comment.username) {
    const { username, body } = comment;
    return checkReviewExists(review_id)
      .then(() => {
        return checkUserExists(username);
      })
      .then((name) => {
        const newCommentQuery = `INSERT INTO comments (body, author, votes, review_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
        return connection
          .query(newCommentQuery, [body, name, 0, intID])
          .then((result) => {
            return result.rows[0];
          });
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: "Error - bad request, incorrect properties!",
    });
  }
};
