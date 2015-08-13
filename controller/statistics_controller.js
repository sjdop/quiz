var models = require('../models/models.js');

var statistics = { cant_questions: 0, cant_comments: 0, average: 0, cant_no_comments: 0, cant_with_comments: 0};

exports.get_statistics = function(req, res) {
	console.log(statistics);
	res.render('quizes/statistics', { statistics: statistics, errors: [] });
}

exports.calculate = function(req, res, next) {
	/*El número de preguntas
	El número de comentarios totales
	El número medio de comentarios por pregunta
	El número de preguntas sin comentarios
	El número de preguntas con comentarios*/

	models.Quiz.count()
		.then(function(count) {
			statistics.cant_questions = count;
			return models.Comment.count();
		})
		.then(function(count) {
			statistics.cant_comments = count;
			return models.Comment.countCommented();
		})
		.then(function(count) {
			statistics.cant_with_comments = count;
		})
		.catch(function(error) {
			next(error);
		})
		.finally(function(){
			next();
		});
}