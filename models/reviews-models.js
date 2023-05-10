const connection = require("../db/connection")

exports.fetchReviews = (restaurant_id) => {
    return connection.query(`SELECT * FROM reviews WHERE review_id = $1;`, [restaurant_id]).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "Error - review ID not found"})
        }
        return result.rows[0];
    })
}