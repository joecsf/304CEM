var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost', // assign your host name
	user: 'root',      //  assign your database username
	password: 'P@ssw0rd',      // assign your database password
	database: 'homework' // assign database Name
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;