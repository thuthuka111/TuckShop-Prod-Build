const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const fs = require('fs');
const sql = require('./useMysql');
const google = require('./google-auth-library');
const path = require('path');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');

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
	cookie: { maxAge: 5256000 }// 60 days
}));

app.get('/', (req, res) => {
	console.log(req.sessionID);
	sql.sessionExists(req.sessionID, function(err, exists) {
		res.end(exists.toString());
	});
})
app.get('/API/getSessionID', (req, res) => {
	testJSON = { sessionID: req.sessionID };
	res.end(JSON.stringify(testJSON));
})
app.get('/API/userExists', (req, res) => {
	sql.sessionExists(req.sessionID, function(exists) {
		if(exists.length > 0){
			res.status(200).end(true.toString());
		}
		res.end(false.toString());
	});
})
app.get('/API/getMenuItems', (req, res) => {
	var menu = {categories: '', options: '', fillings: ''};
	sql.getAll('categories', function (categories) {
		menu.categories = categories;
		sql.getAll('options', function(options) {
			menu.options = options;
			sql.getAll('fillings', function(fillings) {
				menu.fillings = fillings;
				res.json(menu);
			});
		});
	});
})

app.post('/API/placeOrder', (req, res) => {
	console.log(JSON.stringify(req.body));
	order = JSON.stringify(req.body);
	sql.placeOrder(order);
})
app.post('/API/tokenSignIn', (req, res) => {
	// console.log(req.headers.cookie.substring(req.headers.cookie.indexOf('connect.sid=s%3A') + 16, req.headers.cookie.lastIndexOf('.')));
	// console.log(req.sessionID);
	google.verifyID(req.body.idToken, function(userInfo) {
		// console.dir(userInfo);// add a statement to check if the userInfo.email_verified == true
		sql.signUp(req.sessionID, userInfo.userID, userInfo.email, userInfo.name);
	});
})

app.listen(2021, () => {
	console.log('listening for port 2021');
});
