let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let jsonParser = bodyParser.json();
let {
	DATABASE_URL,
	PORT
} = require('./config');

let {
	BookMarkToUpdate
} = require('./model');

let app = express();

let server;

/* Tu código va aquí */
app.put('/api/bookmarks/:id', jsonParser, (req, res) => {
	let id = req.body.id;
	let newBookmark = req.body;


	// Test ID: 5e3195689e529236d44c7da4

	if (isBlank(id)) {
		return res.status(406).send('Id no encontrado en el cuerpo.');
	} else {
		if (id == req.params.id) {
			if (isBlank(newBookmark.titulo) && isBlank(newBookmark.descripcion) && isBlank(newBookmark.url)) {
				return res.status(406).send('Favor de introducir campos a acutalizar.');
			} else {
				BookMarkToUpdate.updateBookmark(newBookmark)
					.then(bookmark => {
						return res.status(201).json(bookmark);
					})
					.catch(error => {
						res.statusMessage = "Error en conexión con la base de datos";
						return res.status(500).json(error);
					});
			}
		} else {
			return res.status(409).send('El id de los parametros y el del body no coinciden.');
		}
	}
});

app.get('/api/getBookmarks', (req, res) => {
	BookMarkToUpdate.getAll()
		.then(bookmarkList => {
			return res.status(200).json(bookmarkList);
		})
		.catch(error => {
			console.log(error);
			res.statusMessage = "Hubo un error de conexion con la BD."
			return res.status(500).send();
		});
});

app.post('/api/createBookmark', jsonParser, (req, res) => {
	let newBookmark = req.body;

	BookMarkToUpdate.create(newBookmark)
		.then(bookmark => {
			return res.status(201).json(bookmark);
		})
		.catch(error => {
			console.log(error);
			res.statusMessage = "Hubo un error de conexion con la BD."
			return res.status(500).send();
		});

});


function isBlank(param) {
	if (param == null || param == undefined || param == "" || param == " ") {
		return true;
	} else {
		return false;
	}
}

function runServer(port, databaseUrl) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, response => {
			if (response) {
				return reject(response);
			} else {
				server = app.listen(port, () => {
						console.log("App is running on port " + port);
						resolve();
					})
					.on('error', err => {
						mongoose.disconnect();
						return reject(err);
					})
			}
		});
	});
}

function closeServer() {
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close(err => {
					if (err) {
						return reject(err);
					} else {
						resolve();
					}
				});
			});
		});
}
runServer(PORT, DATABASE_URL);

module.exports = {
	app,
	runServer,
	closeServer
}