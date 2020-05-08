const express = require('express')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize')
const {Like, Rank} = require('./db/models');
const PORT = 5200

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/like', async (req, res) => {
  const data = await Like.findAndCountAll({
    where: {target: req.query.target}
  })
  res.render('pages/like', {
    target: req.query.target,
    count: data.count
  });
});

app.get('/share', async (req, res) => {
  const data = await Like.findAndCountAll({
    where: {creator: req.query.creator}
  })
  res.render('pages/share', {
    creator: req.query.creator,
    count: data.count
  });
});

app.post('/like', async (req, res) => {
  const likes = await Like.findAll({
    where: {target: req.body.target, creator: req.body.creator}
  })

  if(likes.length === 0){
    try{
      await Like.create({target: req.body.target, creator: req.body.creator})
      const data = await Like.findAndCountAll({
        where: {target: req.body.target}
      })
      await Rank.findOne({
        where: {phone: req.body.target}
      }).then((rank) => {
        if (!rank) {
          return Rank.create({phone: req.body.target})
        }
        Rank.update({likeCount: rank.likeCount ++},{phone: req.body.target})
      })
      res.send({count: data.count})
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
