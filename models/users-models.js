const connection = require("../db/connection")

exports.checkUserExists = (username) => {
    return connection.query(`SELECT * FROM users WHERE username=$1;`,[username]).then((result) =>
    {if(result.rows.length === 0){
        return Promise.reject({ status: 404, msg: "Error - user not found"})
    }
    else{
          const {username} = result.rows[0]
           return username}
    }
    )
   
}