const sqlite3 = require('sqlite3').verbose();
const config = require('./config.json');

const db = new sqlite3.Database(
	config.dbPath,
	sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
	(err) => {
		if (err) {
			console.error(err.message);
		} else {
			console.log('Connected to database.');
		}
	}
);

db.serialize(() => {

	db.run(`CREATE TABLE todos (description text, isDone boolean)`)
		.run(`INSERT INTO todos (description, isDone) VALUES
			("lorem", true),
			("ipsum", false)
		`)

});

db.close();
