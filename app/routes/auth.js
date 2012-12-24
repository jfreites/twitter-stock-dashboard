/*
 * GET OAuth connect.
 */

var OAuth= require('oauth').OAuth;
var sys = require('sys');

var oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
	"Twitter-Consumer-Key",
	"Twitter-Consumer-Secret",
	"1.0",
	"http://twitter-stock-dashboard.jonathanfreites.c9.io/auth/callback",
	"HMAC-SHA1"
);

exports.twitter = function(req, res){
    oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
        	if (error) {
    			console.log(error);
    			res.send("yeah no. didn't work.")
    		}
    		else {
    			req.session.oauth = {};
    			req.session.oauth.token = oauth_token;
    			console.log('oauth.token: ' + req.session.oauth.token);
    			req.session.oauth.token_secret = oauth_token_secret;
    			console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
    			res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
    	}
    });
};

exports.callback = function(req, res, next){
    if (req.session.oauth) {
        	req.session.oauth.verifier = req.query.oauth_verifier;
    		var oauth = req.session.oauth;
    
    		oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
    		function(error, oauth_access_token, oauth_access_token_secret, results){
    			if (error){
    				console.log(error);
    				res.send("yeah something broke.");
    			} else {
    				req.session.oauth.access_token = oauth_access_token;
    				req.session.oauth.access_token_secret = oauth_access_token_secret;
                    console.log("You are signed in " + results.screen_name + " with id " + results.user_id);
                    oa.get("https://api.twitter.com/1/account/verify_credentials.json", req.session.oauth.access_token, req.session.oauth.access_token_secret, function (error, data, response) {
                        if (error) {
                            res.send("Error getting twitter screen name : " + sys.inspect(error), 500);
                        } else {
                            console.log(data);
                            req.session.bio = data['description'];                               
                            res.send('Hi ' + results.screen_name +', you Bio is: ' + req.session.bio);
                        }  
                    }); 
    			}
    		}
    		);
    	} else
    		next(new Error("you're not supposed to be here."))
};
