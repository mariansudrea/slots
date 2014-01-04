var http = require('http');
var url = require('url');
var sys = require('util');
var db = require("node-mysql");
var exec = require('child_process').exec;
var query = require('querystring');
var bc = require('bcrypt-nodejs');
var child;

var output = [];
var x = 0;
var first,second,third;
var reel = [];
var message1;

function createResult()
	{
	console.log('random numbers generated');
	first = Math.floor(Math.random()*20);
	second = Math.floor(Math.random()*20);
	third = Math.floor(Math.random()*20); 
	console.log("First # : " + first + " Second # " + second + " Third # : " + third);
	reel  = ["e","b1","b2","e","b3","e","e","b2","e","b","e","7","e","e","b3","e","b2","e","7","b3"];


	lt = reel[first+1];
	if (lt==undefined){lt=reel[0];}
        lm = reel[first];
        lb = reel[first-1];
	if (lb==undefined){lb=reel[reel.length-1];}
        ct = reel[second+1];
	if (ct==undefined){ct=reel[0];}
        cm = reel[second];
        cb = reel[second-1];
	if (cb==undefined){cb=reel[reel.length-1];}
        rt = reel[third+1];
	if (rt==undefined){rt=reel[0];}
        rm = reel[third];
        rb = reel[third-1];
	if (rb==undefined){rb=reel[reel.length-1];}

	console.log("lt: " + lt + " ct:  " + ct + " rt: " + rt);
	console.log("lm: " + lm + " cm:  " + cm + " rm: " + rm);
	console.log("lb: " + lb + " cb:  " + cb + " rb: " + rb);
	
	message1 = "Nothing.";
        if (lm==cm && cm==rm)
                {if (lm!="e")
                	{console.log("hit on middle line!!!");
			console.log("processing payout for '" + lm + "'.")
			message1 = "LINE 1 HIT";
			}
				
                }
        if (lt==cm && cm==rb && b.linesPlayed >= 4)
                {if (lt!="e")
                	{console.log("hit on left top to right bottom!!!");
			console.log("processing payout for '" + lt + "'.")
			message1 = "LINE 4 HIT";

			}
                }
        if (lb==cm && cm==rt && b.linesPlayed == 5)
                {if (lb!="e")
        	        {console.log("hit on left bottom to top right!!!");
			console.log("processing payout for '" + lb + "'.")
			message1 = "LINE 5 HIT";

			}
                }
        if (lt==ct&&ct==rt && b.linesPlayed >= 2)
                {if (lt!="e")
              		{console.log("hit on top line!!!");
			console.log("processing payout for '" + lt + "'.")
			message1 = "LINE 2 HIT";

			}
                }
        if (lb==cb&&cb==rb && b.linesPlayed >= 3)
                {if (lb!="e")
                	{console.log("hit on bottom line!!!");
			console.log("processing payout for '" + lb + "'.")
			message1 = "LINE 3 HIT";

			}
                }
	}


http.createServer(function (req, res) {

	
	console.log('\nrequest IP : ' + req.connection.remoteAddress);	
	a = req.url;
	b = query.parse(req.url);
	console.log('URL STRING : ' + a);
	console.log('username : ' + b.username);
	console.log('password : ' + b.password);
	console.log('type of request : ' + b.type);
	console.log('sessionId : ' + b.sessionId);
	console.log('creditsPlayed : ' + b.creditsPlayed);
	console.log('linesPlayed : ' + b.linesPlayed);

if (b.type != 'login' && b.type != 'create' && b.type != 'action') 	//BAD REQUEST HEADER
	{res.writeHead(200, {'Content-Type': 'application/json'});
	res.end('_testcb(\'Invalid Request\')');
	}
else	{								//PROCESS REQUEST
	var connection = db.createConnection({				//CONNECT TO DATABASE
	  	host     : 'localhost',
	  	user     : 'root',
//	  	password : ''    UNCOMMENT WITH LOCAL DB PASSWORD
	  	database : 'test',
		});
	connection.connect();
	if (b.type == 'login')									//BEGIN LOGIN HANDLER
		{connection.query('SELECT * FROM table1 WHERE name="' + b.username + '"', function(err, rows, fields) {
			if (err)
				{
				throw err;
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end('_testcb(\'There is a problem with our server. Please try again later.\')');
				connection.end();
				}
			if (typeof(rows[0])=='undefined')					//BAD USER NAME
				{
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end('_testcb(\'User not recognized\')');
				console.log('Request result: Bad User name');
				connection.end();
				}
			if (typeof(rows[0])=='object')
				{
				if (bc.compareSync(b.password,rows[0].password))
					{												//SUCCESFUL LOGIN CODE HERE
					
					
					randomSessionId = Math.floor(Math.random()*1000001);
					console.log(randomSessionId);
					
					//bc.hashSync(randomSessionId);					
					//console.log('random number: ' + randomSessionId);

					bc.hash(randomSessionId, null, null, function(err, hash){
						console.log('hash generated for session : ' + hash);
						x = escape(hash);
						x = b.username + '' + x;
						console.log('sessionID: ' + x);
						res.writeHead(200, {'Content-Type': 'application/json'});
						res.end('_testcb(\'{\"sessionID\" : \"' + x + '\",\
									\"message\" : \"Welcome, <b>' + b.username + '<\/b>.\"}\')');					
						console.log("Request result: Successful login");
						connection.query('UPDATE table1 SET sessionID="' + x + '",sessionIdTime="' + b._ + '" WHERE name="' + b.username + '"', function(err) {
							if(err) 
								{throw err;}
							res.writeHead(200, {'Content-Type': 'application/json'});
							res.end('_testcb(\'{\"sessionID\" : \"' + x + '\"}\')');
							console.log('hash stored');
							connection.end();
							});
						});
			
					}
				else 	{
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end('_testcb(\'Password bad.\')');
					console.log('Request result: Bad Password.');
					connection.end();
					}
				}
			});
		}										//END OF LOGIN HANDLER
	if (b.type == 'create')
		{connection.query('SELECT * FROM table1 WHERE name="' + b.username + '"', function(err, rows, fields) {
			if (typeof(rows[0])=='object')
				{
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end('_testcb(\'That username is not available. Please try a different username\')');
				console.log('Request result: Username taken already.');
				connection.end();
				}
			else
				{

				bc.hash(b.password, null, null, function(err, hash){
					console.log("Hashing password for new user \"" + b.username + "\"");
					connection.query("INSERT INTO table1 (`name`, `password`) VALUES ('" + b.username + "', '" + hash + "')", function(err) {
						if(err) 
							{throw err;}
						else
							{
							res.writeHead(200, {'Content-Type': 'application/json'});
							res.end('_testcb(\'User ' + b.username + ' created successfully\')');
							console.log('Request result: Successful account creation.');
							connection.end();
							}
						});
					});
				}
			});
			
		}
	if (b.type == 'action')
		{connection.query('SELECT * FROM table1 WHERE sessionId="' + b.sessionId + '"', function(err, rows, fields){
			if (typeof(rows[0])=='object')
				{
				// RESULT AND PAYOUT
				createResult();
				
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.write('_testcb(\'{"message" : "You are logged in as : <b>' + rows[0].name + '<\/b>",\
							"sessionID":"' + b.sessionId + '",\
							"first":"' + first + '",\
							"second":"' + second + '" ,\
							"message1":"' + message1 + '" ,\
							"third":"' + third + '"}\')');



	//			res.write('_testcb(\'You are logged in as : <b>' + rows[0].name + '<\/b>\')');
				res.end();
				connection.end();
				}
			else
				{
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end('_testcb(\'Session has expired\')');
				connection.end();
				}	
		});
	//	res.writeHead(200, {'Content-Type': 'application/json'});
	//	res.end('_testcb(\'Under construction.\')');
		}	
	}
//connection.end();
}).listen(8888);
	
	       
console.log("Server has started.");
//console.log(typeof(db));
















//OUTDATED CODE
//		res.end('_testcb(\'{"habibi": "' + x + '"}\')');   JSON FORMAT RESPONSE
/*	GETTING DIFFERENT PROPERTIES OF 'req' OBJECT
	for (i in req)
		{
		console.log(req[i]);
		x++;
		if (x>15)
			break;
		}


		{if (typeof(req[i])=='object')
			{if (req[i]!=null&&req[i].referer!=null)
				{console.log('Origin of request: ' + req[i].referer);}
			}
		}
*/	

/* 	HASHING PASSWORD AND COMPARING TEXT TO HASH
bc.hash("", null, null, function(err, hash){
		console.log("Hash output : " + hash);
		var hashed = hash;
		bc.compare("", hashed, function(err,res){
			console.log('Result : ' + res);
		})
	})
*/



/* 			****THE FIRST CONNECTION
	connection.query('SELECT * FROM table1 WHERE name="' + b.username + '"', function(err, rows, fields) {
		if (err)
			throw err;



		if (typeof(rows[0])=='undefined')//bad username
			{
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end('_testcb(\'User not recognized\')');
			}
		console.log('type of rows[0] : ' + typeof(rows[0]));
		
		if (typeof(rows[0])=='object')
			{
			console.log('first row: ' + rows[0].nicknamen);
			x = escape(rows[0].acctBalance);
			res.writeHead(200, {'Content-Type': 'application/json'});

			if (bc.compareSync(b.password,rows[0].password))
				res.end('_testcb(\'' + x + '\')');
			else
				res.end('_testcb(\'FAILED_LOGIN\')');
			connection.end();
			}
		});
*/
