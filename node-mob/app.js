
var express     = require('express');
var mongoose    = require('mongoose');
var http      = require('http');
var fs          = require('fs');
var nuuid 		= require('node-uuid');

var ldprops     = require('./ldapp_properties');
process.env.NODE_ENV = ldprops.env;
var User = require('./models/users/users');
var PORD = require('./models/po/purchaseorders');

var app         = express();

app.set('port', ldprops.port);

mongoose.connect(ldprops.dburl,ldprops.mongo_options, function(err){
			if(err){
						console.log('Connection error');
				}
			else{
				console.log('Connected to Database');
				}
		});


app.get('/getTokenByAuth', function(req, res){
	console.log('--- start getTokenByAuth --');
    var auth = req.headers['authorization'];
    console.log('auth -- '+auth);
    if(!auth) {
        res.status(401);
    }
    else if(auth){
        try    {
            var tmp = auth.split(' ');
            var buf = new Buffer(tmp[1], 'base64');
            var plain_auth = buf.toString();
            var creds = plain_auth.split(':');
            var username = creds[0];
            var password = creds[1];
            console.log('username -- '+username);
            console.log('password -- '+password);
            
        
            User.findOne({ username: username },function(err, user)   {
                if(err){
                    res.status(500);
                    console.log('err -- '+err);
                }
                else if(user == null){
                    res.status(400);
					res.send( JSON.parse('{"resultcode": "FAIL", "message":"user. not valid"}') );               }
                else{ 
                    if(user.status!=1){
                        res.status(401);
                        console.log('res -- '+res);
                    }
                    else if(!user.validPassword(password)){
                        res.status(401);
                        console.log('validPassword -- '+res);
                    }
                    else{
                        user.mapptoken = nuuid.v4();
                        user.save(function (err) 
                        {
                            if(err){
                                res.status(200);
                                res.send(200);
                                console.log('save error -- '+res);
                            }
                            else{
                               // res.status(200).send({ error: "boo:(" });
                            	// res.send(200);
                            	res.send( JSON.parse('{"resultcode": "SUCCESS", "matoken":"'+user.mapptoken+'"}') );     
                                console.log('save no error -- '+res);
                            }
                        });   
                    	}
                }
                
            	});
        
        }
        catch (error){
            res.status(500);
            console.log('500 error -- '+res);
        }
    }
    
});

app.get('/getLabelDoc', function(req, res){
    var apptoken = req.headers['apptoken'];
    var bqcode   = req.headers['bqcode'];
    console.log('bqcode -- '+bqcode);
    if(!apptoken){
        res.status(403);
    }
    else if(!bqcode){
        res.status(403);
    }
    else{User.findOne({ mapptoken: apptoken },function(err, user){
            if(err){
                res.status(200);}
            else if(user == null){
                res.status(200);
            }
            else{PORD.findOne({ bqcode: bqcode },function(err, pos){
                    if(err) {
                        res.status(200);
                    }
                    else if(pos == null){
                        res.status(200);
                    					}
                    else{                               
                        res.send(pos);
                    }
                });
            	}
        });

    	}

});


app.get('/getLabelDocNEW', function(req, res){
	console.log('getLabelDoc  -- '+req.headers['bqcode']);
    var bqcode   = req.headers['bqcode'];
    
    if(!bqcode){
        res.status(403);
    }
    else{PORD.findOne({ bqcode: bqcode },function(err, pos){
	        if(err) {
	            res.status(200);
	        }
	        else if(pos == null){
	            res.status(200);
	        					}
	        else{                               
	            res.send(pos);
	        }           	
        });
    }

});
http.createServer(app, function(req, res){
                        //res.writeHead(200);
                        console.log('Server running on port: ' + app.get('port'));
                    }
                    ).listen(app.get('port'));                                          