var express = require('express');
var router = express.Router();

var quizController = require('../controller/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

router.param('quizId', quizController.load); // autoload :quizId

router.get('/quizes', quizController.index);

router.get('/quizes/:quizId(\\d+)', quizController.show);

router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

router.get('/author', quizController.author);

module.exports = router;
