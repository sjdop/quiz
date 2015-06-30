var models = require('../models/models.js');

/*exports.question = function(req, res) {
	res.render('quizes/question', { pregunta: 'Capital de Italia'});
}

exports.answer = function(req, res) {
	if(req.query.respuesta === 'Roma') {
		res.render('quizes/answer', {respuesta: 'Correcto'});
	} else {
		res.render('quizes/answer', {respuesta: 'Incorrecto'});
	}
}*/

exports.question = function(req, res) {
	models.Quiz.findAll().success(function(quiz) {
		res.render('quizes/question', { pregunta: quiz[0].pregunta});
	});
};

exports.answer = function(req, res) {
	models.Quiz.findAll().success(function(quiz) {
		if ( req.query.respuesta === quiz[0].respuesta) {
			res.render('quizes/answer', {respuesta: 'Correcto'});
		} else {
			res.render('quizes/answer', {respuesta: 'Incorrecto'});
		}
	});
};

exports.author = function(req, res) {
	res.render('author/author', {nombre: 'Juan David', apellidos: 'Osorio Posada'});
}