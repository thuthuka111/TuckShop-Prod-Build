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

exports.makeAllTables = function () {
	this.makeUserSessionsTable();
	this.makeUserTable();
	sql = 'CREATE table categories (category TEXT, categoryID INT PRIMARY KEY AUTO_INCREMENT)';
	con.query(sql, (err) => {
		if (err) throw err;
		sql = 'ALTER TABLE categories AUTO_INCREMENT = 0';
		con.query(sql, (err) => {
			if (err) throw err;
			sql = `INSERT INTO categories (category) VALUES ('Burger'), ('Roll'), ('Wrap'), ('Tramezzini'), ('Sandwich'), ('Salad')`;
			con.query(sql, (err) => {
				if (err) throw err;
			});
		});
	});
	sql = 'CREATE table categoryFillingLink (categoryID INT, fillingID INT)';
	con.query(sql, (err) => {
		if (err) throw err;
		sql = `INSERT INTO categoryFillingLink (categoryID, fillingID) VALUES (3, 1000), (3, 1002), (3, 1003), (3, 1004), (3, 1005), (3, 1006), (3, 1007), (3, 1008), (3, 1008), (3, 1009), (3, 1010), (3, 1011), (3, 1012), (3, 1013), (3, 1014), (4, 1000), (4, 1002), (4, 1003), (4, 1004), (4, 1005), (4, 1006), (4, 1007), (4, 1008), (4, 1008), (4, 1009), (4, 1010), (4, 1011), (4, 1012), (4, 1013), (4, 1014)`;
		con.query(sql, (err) => {
			if (err) throw err;
		});
	});
	sql = 'CREATE TABLE fillings(fillingID INT PRIMARY KEY AUTO_INCREMENT, filling TEXT)';
	con.query(sql, (err) => {
		if (err) throw err;
		sql = 'ALTER TABLE fillings AUTO_INCREMENT = 1000';
		con.query(sql, (err) => {
			if (err) throw err;
			sql = `INSERT INTO fillings(filling) VALUES ('Bacon'), ('Chicken Mayo'), ('Grilled Chicken'), ('Mince'), ('Ham'), ('Mushroom'), ('Feta'), ('Egg'), ('Tomato'), ('Avocado'), ('Mozzarella'), ('Blue Cheese'), ('Tuna Mayo'), ('Onion'), ('Cheese'), ('None')`;
			con.query(sql, (err) => {
				if (err) throw err;
			});
		});
	});
	sql = 'CREATE TABLE options(optionID INT PRIMARY KEY AUTO_INCREMENT, optionName TEXT)';
	con.query(sql, (err) => {
		if (err) throw err;
		sql = 'ALTER TABLE options AUTO_INCREMENT = 2000';
		con.query(sql, (err) => {
			if (err) throw err;
			sql = `INSERT into options(optionName) VALUES ('Beef'), ('Chicken'), ('Large'), ('Mini'), ('Frank'), ('Bacon'), ('Bacon & cheese'), ('Bacon and Blue Cheese'), ('Chicken Mayo'), ('Greek'), ('Tuna'), ('Grilled Chicken'), ('Cheese'), ('Cheese & Tomato'), ('Ham & Cheese'), ('Ham, Cheese & Tomato'), ('Ham & Tomato'), ('Chicken Mayo'), ('Bacon & Egg'), ('Bacon, Egg & Cheese'), ('Mince'), ('Mince & Cheese')`;
			con.query(sql, (err) => {
				if (err) throw err;
			});
		});
	});
	sql = 'CREATE table categoryOptionLink(categoryID INT, optionID INT)';
	con.query(sql, (err) => {
		if (err) throw err;
		sql = `INSERT INTO categoryOptionLink (categoryID, optionID) VALUES (1, 2000), (1, 2001), (1, 2022), (2, 2007), (2, 2005), (2, 2012), (2, 2004), (3, 2000), (3, 2001), (4, 2002), (4, 2003), (5, 2012), (5, 2013), (5, 2015), (5, 2014), (5, 2017), (5, 2018), (5, 2019), (5, 2020), (5, 2021), (6, 2007), (6, 2008), (6, 2010), (6, 2009), (6, 2011)`;
		con.query(sql, (err) => {
			if (err) throw err;
		});
	});
	sql = 'CREATE table availability(itemID INT, availability INT)';
	con.query(sql, (err) => {
		if (err) throw err;
		sql = `INSERT INTO availability (availability, itemID) VALUES (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 2000), (1, 2001), (1, 2002), (1, 2003), (1, 2004), (1, 2005), (1, 2006), (1, 2007), (1, 2008), (1, 2009), (1, 2010), (1, 2011), (1, 2012), (1, 2013), (1, 2014), (1, 2015), (1, 2016), (1, 2017), (1, 2018), (1, 2019), (1, 2020), (1, 2021), (1, 2022), (1, 1000), (1, 1001), (1, 1002), (1, 1003), (1, 1004), (1, 1005), (1, 1006), (1, 1007), (1, 1008), (1, 1009), (1, 1010), (1, 1011), (1, 1012) ,(1, 1013), (1, 1014)`;
		con.query(sql, (err) => {
			if (err) throw err;
		});
	});
	sql = 'CREATE TABLE orders(userID TEXT, orderID INT PRIMARY KEY AUTO_INCREMENT)';
	con.query(sql, (err) => {
		if (err) throw err;
	});
	sql = 'CREATE table ordersLink(orderID INT, categoryID INT, optionID INT, orderFillingID INT PRIMARY KEY AUTO_INCREMENT)';
	con.query(sql, (err) => {
		if (err) throw err;
	});
	sql = 'CREATE table orderLinkfillingLink(orderFillingID INT, fillingID INT)';
	con.query(sql, (err) => {
		if (err) throw err;
	});
	sql = 'CREATE table orderStatesLink(orderID INT, stateID INT)';
	con.query(sql, (err) => {
		if (err) throw err;
		sql = `INSERT INTO orderStates (state) VALUES ('Waiting'), ('Ready to Collect'), ('Completed'), ('Accepted)`;
		con.query(sql, (err) => {
			if (err) throw err;
		});
	});
	sql = 'CREATE table orderStates(state TEXT, stateID INT PRIMARY KEY AUTO_INCREMENT)';
	con.query(sql, (err) => {
		if (err) throw err;
	});
}

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
		console.log('table \'usersessions\' table CREATEd');
	})
}
exports.makeUserTable = function () {// remved grade VARCHAR(16), school VARCHAR(32),, username VARCHAR(32)location VARCHAR(32),
	var sql = 'CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, sessionID VARCHAR(128), userID VARCHAR(32), email TEXT), name VARCHAR(32))';
	con.query(sql, (err, result) => {
		if (err) throw err;
		console.log("Database name CREATEd");
	});
}

exports.signUp = function (sessionID, userID, email, name) {
	var sql = `INSERT INTO user (sessionID, userID, email, name) VALUES (?, ?, ?, ?)`;
	var inserts = [sessionID, userID, email, name];
	con.query(sql, inserts, (err, results) => {
		if (err) throw err;
		console.log("user CREATEd");
		console.log(results);
	});
}


exports.getCategories = function (callback) {
	sql = 'SELECT category FROM categories';
	con.query(sql, (err, result) => {
		if (err) throw err;
		callback(result);
	});
}
exports.getOptions = function (callback) {
	sql = 'SELECT category, optionName AS \'option\' FROM categories, options, categoryOptionLink WHERE categories.categoryID = categoryOptionLink.categoryID AND categoryOptionLink.optionID = options.optionID';
	con.query(sql, (err, result) => {
		if (err) throw err;
		callback(result);
	});
}
exports.getFillings = function (callback) {
	sql = 'SELECT category, filling FROM categories, fillings, categoryFillingLink WHERE categories.categoryID = categoryFillingLink.categoryID AND categoryFillingLink.fillingID = fillings.fillingID ORDER BY category';
	con.query(sql, (err, result) => {
		if (err) throw err;
		callback(result);
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

exports.placeOrder = function (orderInfo, userID) {
	sql = 'INSERT INTO orders (userID) VALUES (?)';
	inserts = [userID];
	con.query(sql, inserts, (err) => {
		if (err) throw err;
		sql = 'SELECT orderID FROM orders WHERE userID = ? ORDER BY orderID DESC LIMIT 1';
		con.query(sql, inserts, (err, orderID) => {
			if (err) throw err;
			sql = 'INSERT INTO orderStatesLink (orderID, stateID) VALUES (?, 1)';
			inserts = [orderID[0].orderID];
			con.query(sql, inserts, (err) => {
				if (err) throw err;
			});
			sql = 'SELECT categoryID, optionID FROM categories, options WHERE category = ? AND optionName = ?';
			for (const order of orderInfo) {
				inserts = [order.category, order.option]
				con.query(sql, inserts, (err, categAndOptIDs) => {
					if (err) throw err;
					sql = 'INSERT INTO ordersLink (orderID, categoryID, optionID) VALUES (?, ?, ?)';
					inserts = [orderID[0].orderID, categAndOptIDs[0].categoryID, categAndOptIDs[0].optionID];
					con.query(sql, inserts, (err) => {
						if (err) throw err;
						sql = 'SELECT orderFillingID FROM ordersLink WHERE orderID = ? AND categoryID = ? AND optionID = ?';
						inserts = [orderID[0].orderID, categAndOptIDs[0].categoryID, categAndOptIDs[0].optionID];
						for (const extra of order.extras) {
							con.query(sql, inserts, (err, orderFillingID) => {
								if (err) throw err;
								sql = 'SELECT fillingID FROM fillings WHERE filling = ?';
								if (!extra) {
									inserts = ['None'];
								}
								else {
									inserts = [extra];
								}
								con.query(sql, inserts, (err, fillingIDs) => {
									if (err) throw err;
									sql = 'INSERT INTO orderLinkfillingLink (orderfillingID, fillingID) VALUES (?, ?)';
									inserts = [orderFillingID[0].orderFillingID, fillingIDs[0].fillingID];
									con.query(sql, inserts, (err) => {
										if (err) throw err;
									});
								});
							});
						}
					});
				});
			}
		});
	});
}
exports.getOrders = function (callback) {
	var sql = 'select distinct orders.orderID, name, optionName, category, filling, state FROM user, categories, fillings, options, orders, ordersLink, orderLinkfillingLink, orderStates, orderStatesLink WHERE orders.userID = user.userID AND orders.orderID = ordersLink.orderID AND ordersLink.categoryID = categories.categoryID AND ordersLink.optionID = options.optionID AND ordersLink.orderFillingID = orderLinkfillingLink.orderFillingID AND orderLinkfillingLink.fillingID = fillings.fillingID AND orders.orderID = orderStatesLink.orderID AND orderStatesLink.stateID = orderStates.stateID AND state != \'Completed\' ORDER BY orders.orderID';
	con.query(sql, function (err, result) {
		if (err) throw err;
		callback(result);
	});
}
exports.setOrderState = function (orderID, state) {
	sql = 'select orderStates.stateID, state from orderStates, orderStatesLink where orderID = ? and state = ?';
	inserts = [orderID, state];
	con.query(sql, inserts, function (err, result) {
		if (err) throw err;
		console.log(result);
		sql = 'UPDATE orderStatesLink SET stateID = ? WHERE orderID = ?';
		inserts = [result[0].stateID, orderID];
		con.query(sql, inserts, function (err) {
			if (err) throw err;
		});
	});
}
exports.getUserByOrderID = function(orderID, callback) {
	sql = 'SELECT DISTINCT email, name FROM orders, user WHERE orders.orderID = ? AND orders.userID = user.userID';
	inserts = [orderID];
	con.query(sql, inserts, function (err, result) {
		if (err) throw err;
		callback(result);
	});
}
exports.getUserByID = function (sessionID, callback) {
	// console.log('sessionID: ' + sessionID);
	var sql = 'SELECT * FROM user WHERE sessionID = ? OR userID = ?';
	var inserts = [sessionID, sessionID];
	con.query(sql, inserts, function (err, result) {
		if (err) throw err;
		callback(result);
	});
}
exports.getUserPendingOrders = function(name, callback) {
	sql = 'select distinct orders.orderID, name, optionName, category, filling, state FROM user, categories, fillings, options, orders, ordersLink, orderLinkfillingLink, orderStates, orderStatesLink WHERE orders.userID = user.userID AND user.name = ? AND orders.orderID = ordersLink.orderID AND ordersLink.categoryID = categories.categoryID AND ordersLink.optionID = options.optionID AND ordersLink.orderFillingID = orderLinkfillingLink.orderFillingID AND orderLinkfillingLink.fillingID = fillings.fillingID AND orders.orderID = orderStatesLink.orderID AND orderStatesLink.stateID = orderStates.stateID AND state != \'Completed\' ORDER BY orders.orderID'
	inserts = [name];
	con.query(sql, inserts, function (err, orders) {
		if (err) throw err;
		callback(orders);
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
		// Load hash FROM your password DB.
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