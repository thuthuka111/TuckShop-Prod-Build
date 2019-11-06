const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const fs = require('fs');
const sql = require('./useMysql');
const google = require('./google-auth-library');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',//service rovider (eg'yahoo)
	auth: {
		user: 'thuthuka.khumalo@student.stbenedicts.co.za',
		pass: '#2poopoo'
	}
});
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	genid: (req) => {
		return uuid() // use UUIDs for session IDs
	},
	store: sql.MySQLStore(),//new MySQLStore({}, connection),//this saving could be replaced with storing in a database
	secret: 'wussgood fam',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 5256000000 }// 60 days
}));

app.get('/', (req, res) => {
	console.log(req.sessionID);
	/*sql.sessionExists(req.sessionID, function(err, exists) {
		res.end(exists.toString());
	});*/
	sql.makeAllTables();
})
app.get('/API/getSessionID', (req, res) => {
	testJSON = { sessionID: req.sessionID };
	res.end(JSON.stringify(testJSON));
})
app.get('/API/userExists', (req, res) => {

	// sql.sessionExists(req.sessionID, function (exists) {
	sql.sessionExists(req.headers.cookie.substring(req.headers.cookie.indexOf('connect.sid=s%3A') + 16, req.headers.cookie.lastIndexOf('.')), function (exists) {
		if (exists.length > 0) {
			res.status(200).end(true.toString());
		}
		res.end(false.toString());
	});
})
app.get('/API/getMenuItems', (req, res) => {
	var menu = { categories: '', options: '', fillings: '' };
	sql.getCategories(function (categories) {
		menu.categories = categories;
		sql.getOptions(function (options) {
			menu.options = options;
			sql.getFillings(function (fillings) {
				menu.fillings = fillings;
				res.json(menu);
			});
		});
	});
})
app.get('/API/getOrders', (req, res) => {
	sql.getOrders(function (orders) {
		res.json(formatOrders(orders));
	});
})
app.get('/API/pendingUserOrders', (req, res) => {
	sql.sessionExists(req.headers.cookie.substring(req.headers.cookie.indexOf('connect.sid=s%3A') + 16, req.headers.cookie.lastIndexOf('.')), function (exists) {
		if (exists.length > 0) {// he ahs been here before
			sql.getUserByID(exists[0].sessionID, function (user) {
				if (user.length > 0) {// has signed in
					sql.getUserPendingOrders(user[0].name, function (pendingOrders) {
						res.json(formatOrders(pendingOrders));
					});
				}
				else {// not signed in
					res.end(false.toString());
				}
			});
		}
		else {// user doesnt exist
			res.end(false.toString());
		}

	});
})

app.post('/API/placeOrder', (req, res) => {
	order = req.body;
	console.log(order);
	sql.getUserByID(req.sessionID, function (user) {
		sql.placeOrder(order, user[0].userID);
		res.end(true.toString());
	});

})

app.post('/API/tokenSignIn', (req, res) => {
	// console.log(req.headers.cookie.substring(req.headers.cookie.indexOf('connect.sid=s%3A') + 16, req.headers.cookie.lastIndexOf('.')));
	google.verifyID(req.body.idToken, function (userInfo) {
		// console.dir(userInfo);// add a statement to check if the userInfo.email_verified == true
		sql.signUp(req.sessionID, userInfo.userID, userInfo.email, userInfo.name);
		res.end(true.toString());
	});
})
app.post('/API/setOrderState', (req, res) => {
	/*sql.getUserByOrderID(req.body.orderID, function (user) {
		console.log(user);
		var mailOptions = {
			from: 'thuthuka.khumalo@student.stbenedicts.co.za',
			to: user[0].email,
			subject: 'Confirmation Email',
			html: '<h1>Hi ' + user[0].name + '</h1><p>Your order has been comfimed</p>',
			text: 'That where does this go'
		};
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
	});*/

	if (req.body.state === 'Waiting') {
		//send order confirmation email
	}
	else {
		sql.setOrderState(req.body.orderID, req.body.state);
	}

})

app.listen(2021, () => {
	console.log('listening for port 2021');
});

formatOrders = function (orders) {
	orders.push({// eliminates edge cases
		category: 'FFFF',
		filling: 'FFFF',
		name: 'FFFF',
		optionName: 'FFFF',
		orderID: -1,
		state: 'FFFF'
	});

	let orderTemp = {
		orderID: -1,
		category: '',
		filling: [],
		name: '',
		option: '',
		state: ''
	};
	let ordersTemp = [];
	let same = false;

	for (let i = 0; i < orders.length - 1; i++) {// formates the sequel result into data that can be usefull
		orderTemp.orderID = orders[i].orderID;
		orderTemp.category = orders[i].category;
		if (orders[i].filling != 'None') {
			orderTemp.filling.push(orders[i].filling);
		}
		orderTemp.name = orders[i].name;
		orderTemp.option = orders[i].optionName;
		orderTemp.state = orders[i].state;

		if (same && !(orders[i].orderID === orders[i + 1].orderID)) {// true and nextid is not equal
			// add filling, push, same = false
			ordersTemp.push(orderTemp);
			orderTemp = {
				category: '',
				filling: [],
				name: '',
				option: '',
				state: ''
			};
			same = false;
		}
		else if (same && orders[i].orderID === orders[i + 1].orderID) {// same and next id is equal
			// add filling
		}
		else if (!same && !(orders[i].orderID === orders[i + 1].orderID)) {// false and next id is not equal
			// push, clear template
			ordersTemp.push(orderTemp);
			orderTemp = {
				category: '',
				filling: [],
				name: '',
				option: '',
				state: ''
			};
		}
		else {// nextID is equal and same = false
			if (orders[i].orderFillingID === orders[i + 1].orderFillingID) {
				// set same = true, dont push
				same = true;
			}
			else {// categories are different
				// push, clear template
				ordersTemp.push(orderTemp);
				orderTemp = {
					category: '',
					filling: [],
					name: '',
					option: '',
					state: ''
				};
			}
		}
	}
	ordersTemp.push({// eliminates edge cases
		category: 'FFFF',
		filling: 'FFFF',
		name: 'FFFF',
		optionName: 'FFFF',
		orderID: -1,
		state: 'FFFF'
	});
	let ordersTempTemp = [];
	let orderTempTemp = {
		name: '',
		state: '',
		orders: []
	}
	for (let i = 0; i < ordersTemp.length - 1; i++) {
		orderTempTemp.name = ordersTemp[i].name;
		orderTempTemp.state = ordersTemp[i].state;
		if (same) {
			// console.log('push orders');
			orderTempTemp.orders.push(ordersTemp[i]);
			if (!(ordersTemp[i].name === ordersTemp[i + 1].name)) {
				same = false;
				// console.log('push all, clear');
				ordersTempTemp.push(orderTempTemp);
				orderTempTemp = {
					name: '',
					orders: []
				}
			}
		}
		else if (ordersTemp[i].name === ordersTemp[i + 1].name) {
			// console.log('set same = true, push orders');
			same = true;
			orderTempTemp.orders.push(ordersTemp[i]);
		}
		else {
			// console.log('push all, clear');
			ordersTempTemp.push(orderTempTemp);
			orderTempTemp = {
				name: '',
				orders: []
			}
		}
	}
	return ordersTempTemp;
}