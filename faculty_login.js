var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'course_feedback'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/faculty_login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM facultylogin WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/success');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/success', function (req, res) {
	var rr="<html>";
	rr = rr+"<body>";
	rr=rr+"<form  method='post' action='get' >";
	rr = rr+"course name"+"<input type='text' name='coursename' value=' '> <br> <br>" ; 
	rr = rr+"<input type='submit' align='left' name='t2' value='Submit '>";
	rr = rr+"</form>";
	rr = rr+"</body>";
	res.send(rr);
})



app.post('/get', function (req, res) {
    cname = req.body.coursename
    connection.query('select * from courses where coursename = ?',[cname], function (err, result) {
    if (err) throw err;
    res.send(result)
    console.log(result)
});


});
     





app.listen(3000);
