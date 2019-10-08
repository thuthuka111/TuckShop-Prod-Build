const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);//this saves session id's
const bcrypt = require('bcrypt');

var con = mysql.createConnection({
	host: "localhost",
	user: "thuthuka",
	password: "#1Poopoo",
	port: 3306,
	database: "tuckShopDb"
});

exports.MySQLStore = function () {
	return new MySQLStore({
		schema: {
			tableName: 'userSessions',
			columnNames: {
				session_id: 'sessionID',
				expires: 'expireDate',
				data: 'data'
			}
		}
	}/*this is for options*/,
		con);
}
exports.makeUserSessionsTable = function () {
	sql = 'CREATE TABLE userSessions (sessionID VARCHAR(128), expireDate INT(11), data TEXT)';
	con.query(sql, (err, result) => {
		if (err) throw err;
		console.log('table \'usersessions\' table created');
	})
}
exports.makeUserTable = function () {// remved grade VARCHAR(16), school VARCHAR(32),, username VARCHAR(32)location VARCHAR(32),
	var sql = `CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, sessionID VARCHAR(128), userID VARCHAR(32), email VARCHAR(32), name VARCHAR(32))`;
	con.query(sql, (err, result) => {
		if (err) throw err;
		console.log("Database name created");
	});
}

exports.makeCategoriesTable = function () {
	sql = 'CREATE TABLE IF NOT EXISTS categories (category TEXT)';
	con.query(sql, (err, results) => {
		if (err) throw err;
		console.log('categories table created');
		fillCategoriesTable();
	});
}
fillCategoriesTable = function () {
	var sql = 'INSERT INTO categories (category) VALUES (?), (?), (?), (?), (?), (?)';
	var inserts = ['Burger', 'Roll', 'Wrap', 'Tramezzini', 'Sandwich', 'Salads'];
	con.query(sql, inserts, (err, results) => {
		if (err) throw err;
		console.log('categories added to menu');
	});
}
exports.makeFillingsTable = function () {
	sql = 'CREATE TABLE IF NOT EXISTS fillings (category TEXT, filling TEXT)';
	con.query(sql, (err, result) => {
		if (err) throw err;
		console.log('Fillings table created');
		fillFillingsTable();
	});
}
fillFillingsTable = function () {// FILLINGS IS GONNA BE A JSON
	var sql = 'INSERT INTO fillings (category, filling) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?)';
	var inserts = ['Burger', '{}', 'Roll', '{}', 'Wrap', '{}', 'Tramezzini', '{}', 'Sandwich', '{}', 'Salads', '{}'];
	con.query(sql, inserts, (err, results) => {
		if (err) throw err;
		console.log('fillings added to table');
	});
}
exports.makeOptionsTable = function () {
	sql = 'CREATE TABLE IF NOT EXISTS options (category TEXT, options TEXT)';
	con.query(sql, (err, result) => {
		if (err) throw err;
		console.log('Menu Table created');
		fillOptionsTable();
	});
}
fillOptionsTable = function () {
	var sql = 'INSERT INTO options (category, options) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?)';
	var inserts = ['Burger', 'beef', 'Burger', 'chicken', 'Roll', 'Frank', 'Roll', 'Bacon', 'Roll', 'Bacon & Cheese', 'Wrap', 'Beef', 'Wrap', 'Chicken', 'Tramezzini', 'Cheese', 'Sandwich', 'Choose filling', 'Salad', 'Bacon and Blue Cheese', 'Salad', 'Chicken Mayo', 'Salad', 'Greek', 'Salad', 'Tuna', 'Salad', 'Grilled Chicken'];
	con.query(sql, inserts, (err, results) => {
		if (err) throw err;
		console.log('options added to menu');
	});
}

exports.signUp = function (sessionID, userID, email, name) {
	var sql = `INSERT INTO user (sessionID, userID, email, name) VALUES (?, ?, ?, ?)`;
	var inserts = [sessionID, userID, email, name];
	con.query(sql, inserts, (err, results) => {
		if (err) throw err;
		console.log("user created");
		console.log(results);
	});
}

exports.getAll = function (tableName, callback) {
	var sql = `SELECT * FROM ${tableName}`;
	var inserts = [tableName];
	con.query(sql, function (err, results) {
		if (err) throw err;
		callback(results);
	});
}







exports.getUserByID = function (sessionID, callback) {
	// console.log('sessionID: ' + sessionID);
	var sql = 'SELECT * FROM user WHERE sessionID = ?';
	var inserts = [sessionID];
	con.query(sql, inserts, function (err, result) {
		// console.log(result[0]);
		var objs = { email: result[0].email, username: result[0].name };
		//objs.push();
		callback(null, objs);
	});
}

exports.sessionExists = function (sessionID, callback) {
	var sql = 'SELECT sessionID FROM user WHERE sessionID = ?';
	var inserts = [sessionID];
	con.query(sql, inserts, function (err, result) {
		if (err) throw err;
		callback(result);
	});
}
exports.clearTable = function (tableName) {
	var sql = 'TRUNCATE TABLE ?';
	var inserts = [tableName];
	con.query(sql, inserts);
	console.log(`${tableName} deleted`);
}


exports.print = function (tableName) {
	var sql = 'SELECT * FROM ?';
	var inserts = [tableName];
	con.query(sql, inserts, function (err, results, fields) {
		if (err) throw err;
		console.log(results);
	});
}
exports.dropTable = function (tableName) {
	var sql = 'DROP TABLE ?';
	var inserts = [tableName];
	con.query(sql, inserts, function (err, results, fields) {
		if (err) throw err;
		console.log(results);
	});
}
exports.getUserName = function (sessionID) {
	var sql = `SELECT username FROM user WHERE sessionID = ?`;
	var inserts = [sessionID];
	con.query(sql, inserts, function (err, results, fields) {
		if (err) throw err;
		console.log(results);
	});
}
exports.userExists = function (sessionID, callback) {
	var sql = 'SELECT * FROM user WHERE sessionID= ?';
	var inserts = [sessionID];
	con.query(sql, inserts, function (err, result) {// later make this check for emails
		// Load hash from your password DB.
		try {
			bcrypt.compare(password, result[0].password, function (err, res) {
				if (res == true) {
					callback(null, true);
				}
				else {
					callback(null, false);
				}
			});
		}
		catch (err) { callback(null, false) }
	});
}
module.exports.changeSessionID = function (newSessionID, username) {
	var sql = 'UPDATE user SET sessionID = ? WHERE username = ?';
	var inserts = [newSessionID, username];
	con.query(sql, inserts, function (err, result) {
		if (err) throw err;
		console.log('sessionID updated for ' + username);
		console.log(result);
	})
}