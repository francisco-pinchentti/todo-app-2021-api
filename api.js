const sqlite3 = require('sqlite3').verbose();
const restify = require('restify');
const config = require('./config.json');
const corsMiddleware = require('restify-cors-middleware')

// initialization

const db = new sqlite3.Database(
	config.dbPath,
	sqlite3.OPEN_READWRITE,
	(err) => {
		if (err) {
			console.error(err.message);
		} else {
			console.log('Connected to database.');
		}
	}
);

const server = restify.createServer();

const cors = corsMiddleware({
	origins: ['http://localhost:3000']
});

server.pre(cors.preflight);
server.use(cors.actual);

// request handlers

const getTodos = (req, res, next) => {

	const stmt = `SELECT t.rowid, t.description, t.isDone
		FROM todos t
		LIMIT 25;`;

	db.all(stmt, [], (err, rows) => {
		if (err) {
			next(err);
		} else {
			res.send({
				todos: rows,
				from: 0,
				limit: 25
			});
			next();
		}
	});

};

const postTodo = (req, res, next) => {
	const description = req.body.description;
	const isDone = req.body.isDone;
	const stmt1 = `INSERT INTO todos (description, isDone) VALUES ("${description}", ${isDone});`;
	const stmt2 = `SELECT rowid FROM todos ORDER BY rowid DESC LIMIT 1;`;

	db
		.serialize(() => {
			db.run(stmt1)
		})
		.get(stmt2, (err, row) => {
			if (err) {
				next(err);
			} else {
				res.send({ id: row.rowid });
				next();
			}
		});
}

const delTodos = (req, res, next) => {
	const { id } = req.params;
	const stmt = `DELETE FROM todos WHERE rowid=?`;
	db.run(stmt, id, function (err) {
		if (err) {
			next(err);
		} else {
			if (this.changes) {
				res.send({
					id,
					affectedRows: this.changes
				});
			} else {
				res.send();
			}
			next();
		}
	});
}

const putTodos = (req, res, next) => {
	const { id } = req.params;
	const description = req.body.description;
	const isDone = req.body.isDone;
	const params = [
		description,
		isDone,
		id
	];

	db.run('UPDATE todos SET description=?, isDone=? WHERE rowid=?', params, function (err, rows) {
		if (err) {
			next(err);
		} else {
			res.send();
			next();
		}
	});
}

// wiring

server.use(restify.plugins.bodyParser());

server.get('/api/todos', getTodos);
server.post('/api/todos', postTodo);
server.del('/api/todos/:id', delTodos);
server.put('/api/todos/:id', putTodos);

// startup

server.listen(config.port, function () {
	console.log('%s listening at %s', server.name, server.url);
});

// cleanup

server.on('close', () => {
	db.close();
});
