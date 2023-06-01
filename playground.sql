\c nc_games_test

SELECT reviews.review_id, title, category, review_img_url, reviews.created_at, reviews.votes, designer, owner,   COUNT(comment_id)::INT AS comment_count FROM reviews 
LEFT JOIN comments ON comments.review_id = reviews.review_id 
WHERE reviews.category= 'dexterity'
    GROUP BY reviews.review_id
    ORDER BY created_at DESC
  
;


-- WHERE owner = "philippaclaire9"
--  ;


-- -- SELECT reviews.review_id, title, category, review_img_url, reviews.created_at, reviews.votes, designer, owner,   COUNT(comment_id)::INT AS comment_count FROM reviews WHERE category = strategy 

-- ;


