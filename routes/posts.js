const express = require('express');
const router = express.Router();

/* GET posts index /posts */
router.get('/', (req, res, next) => {
  res.send('INDEX /posts');
  // res.render('index', { title: 'Surf Shop - Home' });
});

/* GET posts new /posts/new */
router.get('/new', (req, res, next) => {
  res.send('NEW /posts/new');
  // res.render('index', { title: 'Surf Shop - Home' });
});

/* POST posts create /posts */
router.post('/', (req, res, next) => {
  res.send('CREATE /posts');
  // res.render('index', { title: 'Surf Shop - Home' });
});

/* GET posts show /posts/:id */
router.get('/:id', (req, res, next) => {
  res.send('SHOW /posts/:id');
  // res.render('index', { title: 'Surf Shop - Home' });
});

/* GET posts edit /posts/:id/edit */
router.get('/:id/edit', (req, res, next) => {
  res.send('EDIT /posts/:id/edit');
  // res.render('index', { title: 'Surf Shop - Home' });
});

/* PUT posts update /posts/:id */
router.put('/:id', (req, res, next) => {
  res.send('UPDATE /posts/:id');
  // res.render('index', { title: 'Surf Shop - Home' });
});

/* DELETE posts destroy /posts/:id */
router.delete('/:id', (req, res, next) => {
  res.send('DELETE /posts/:id');
  // res.render('index', { title: 'Surf Shop - Home' });
});

/*
GET     index   /posts
GET     new     /posts/new
POST    create  /posts
GET     show    /posts/:id
GET     edit    /posts/:id/edit
PUT     update  /posts/:id
DELETE  destroy /posts/:id
*/

module.exports = router;
