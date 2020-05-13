const express = require('express')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize')
const {Like, Rank} = require('./db/models');
const PORT = 5100

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  res.render('pages/index',{creator: req.query.creator});
});

app.get('/like', async (req, res) => {
  let rank = null
  if(req.query.target){
    rank = await Rank.findOne({
      where: {phone: req.query.target}
    })
  }
  res.render('pages/like', {
    target: req.query.target,
    count: rank && rank.dataValues && rank.dataValues.likeCount
  });
});

app.get('/share', async (req, res) => {
  const rank = await Rank.findOne({
    where: {phone: req.query.creator || 0}
  })
  const result = await Rank.findAll({
    limit: 10 ,
    order: [[Sequelize.col('likeCount'),'DESC']]
  })
  const bigger = await Rank.findAndCountAll({
    where: Sequelize.where(
      Sequelize.literal('likeCount'),
      '>',
      (rank && rank.dataValues && rank.dataValues.likeCount) || 0
    )
  })
  res.render('pages/share', {
    creator: req.query.creator,
    rank: (rank && rank.dataValues) || {likeCount: 0, phone: req.query.creator},
    ranks: result,
    biggerCount: bigger.count
  });
});

app.get('/check', async (req, res) => {
  const rank = await Rank.findOne({
    where: {phone: req.query.creator || 0}
  })
  res.send({likeCount: (rank && rank.dataValues && rank.dataValues.likeCount) || 0})
});

app.get('/logout', async (req, res) => {
  res.render('pages/logout');
});

app.get('/api/rank', async (req, res) => {
  const result = await Rank.findAll({
    limit: 10 ,
    order: [[Sequelize.col('likeCount'),'DESC']]
  })
  res.send(result);
})

app.post('/like', async (req, res) => {
  const likes = await Like.findAll({
    where: {target: req.body.target, creator: req.body.creator}
  })
  if(likes.length === 0){
    try{
      await Like.create({target: req.body.target, creator: req.body.creator})
      const rank = await Rank.findOne({
        where: {phone: req.body.target}
      })
      if (rank && rank.dataValues && rank.dataValues.id) {
        await rank.update({likeCount: rank.dataValues.likeCount + 1})
        res.send({count: rank.dataValues.likeCount})
      }else{
        Rank.create({phone: req.body.target})
        res.send({count: 1})
      }
    }catch (e) {
      res.statusCode = 400;
      res.send(e)
    }
  }else{
    res.statusCode = 400;
    res.send('你已经点过赞');
  }
})

app.listen(PORT);
