const express = require('express');
const Community = express.Router();
const { communityPost } = require('../../db/index');

Community.use(express.json());

// express handles request; db models + sequelize handle querying
Community.get('/post', (req, res) => {
  communityPost.findAll()
    .then((data) => {
      console.log(data[1].dataValues);
      res.send(data);
    });
});

Community.post('/post', (req, res) => {
  console.log(req.body);
  const { title, body, user_id } = req.body;
  communityPost.create({
    title,
    body,
    user_id
  })
    .then((created) => {
      res.send(created);
    })
    .catch((err) => {
      console.error(err);
    });
});
//   .then((tr) => {
//     res.send('good try', tr)
//   })
//   .catch((err) => {
//     console.error(err)
//   })

module.exports = Community;
