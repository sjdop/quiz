var models = require('../models/models.js');

exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
			where: { id: Number(quizId) },
			include: [{ model: models.Comment }] 
		}).then(
		function(quiz) {
			if ( quiz ) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			}
		}).catch(function( error ) { next(error) });
}

exports.index = function(req, res, next) {
	if(req.query.search != null) {
		//Funcion de busqueda
		var search = "%" + req.query.search.replace(/\s/g, "%") + "%";
		var theme = req.query.tema;
		models.Quiz.findAll({where:["pregunta like ? AND tema = ?", search, theme]}).then(function(quizes) {
			res.render('quizes/index.ejs', { quizes: quizes, errors: []});
		}).catch(function(error) { next(error); });
	} else {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index.ejs', { quizes: quizes, errors: []});
		}).catch(function(error) { next(error); });
	}
};

exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz, errors: []});
};

exports.answer = function(req, res) {
	var resultado = "Incorrecto";
	if ( req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', 
		{ quiz: req.quiz,
			respuesta: resultado,
			errors: []
		});
};

exports.author = function(req, res) {
	res.render('author/author', {nombre: 'Juan David', apellidos: 'Osorio Posada', errors: []});
}

exports.new = function(req, res) {
	var quiz = models.Quiz.build( //crea el objeto quiz
		{ pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema" }
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
}

exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	
	var errors = quiz.validate();
	if(errors) {
		var i = 0;
		var errores = new Array();
		for(var prop in errors) {
			errores[i++] = { message: errors[prop]};
		}
		res.render('quizes/new', {quiz: quiz, errors: errores});
	} else {
		quiz.save({fields: ["pregunta", "respuesta", "tema"]})
		.then(
			function() {
				res.redirect('/quizes');
			})
	}
};

exports.edit = function(req, res) {
	var quiz = req.quiz; //autoload de la instancia de quiz
	res.render('quizes/edit', {quiz: quiz, errors: []});
}

exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	var errors = req.quiz.validate();
	if(errors) {
		var i = 0;
		var errores = new Array();
		for(var prop in errors) {
			errores[i++] = { message: errors[prop]};
		}
		res.render('quizes/edit', { quiz: req.quiz, errors: errores});
	} else {
		req.quiz.save( {fields: ["pregunta", "respuesta","tema"]})
		.then( function() { res.redirect('/quizes')});
	}
}

exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
}