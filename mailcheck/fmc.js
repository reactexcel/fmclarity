





function parseUsefulLines(str){
	
	var startPosition=str.indexOf("MIME-Version: 1.0");
	//var startPosition=str.indexOf("Subject: [");
	
	var usefulLines = str.substr(startPosition);
	return usefulLines;
}


function decode_special_chars(str){
	/* 
		Restore original whitespaces by replacing underscores.
		The encoding with underscore was necessary to transmit
		the text in a REST API call.
	*/
	
	return str.replace(/_/g,' ')
			.replace(/LSqrBrkt/g,'[')
			.replace(/RSqrBrkt/g,']')
			.replace(/\r/g,'')
			.replace(/\n/g,'')
			.replace(/HashTag/g,'#')
			.replace(/DblQt/g,'"');
	
}

function clean_string(str){
	/* 
		Remove html formatting and symbols
	*/
	
	var cleaned = str.replace(/\&quot;/g,'"')
					.replace(/[=\n\r]/g, '')
					.replace(/<div>/g, '|')
					.replace(/<\/div>/g, '|')
					.replace(/<br>/g, '|')
					.replace(/<br\/>/g, '|')
				;

	//make all spaces  single space	- this is considered faster over regex replace	
	while (cleaned.indexOf("  ") !== -1) {
		cleaned = cleaned.replace(/  /g, " ");
	}			
	
	return cleaned;
}


//==========================
var imap = null;

var mailConfig ={
  user: 'ttest.55.0.54@gmail.com',
  password: 'java@123',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
};

var Imap = require('imap'),
    inspect = require('util').inspect;



function openInbox(cb) {
  imap.openBox('INBOX', true, cb);  //imap.openBox(MAILBOX,readonly,var)
}

function imapInit(startText,assertText,endText){
	imap = new Imap(mailConfig);
	imap.once('ready', function() {
	var fs = require('fs'), fileStream;
	var foundCount=0;
	/*
	console.log('startText  - '+startText);
	console.log('assertText - '+assertText);
	console.log('endText    - '+endText);
	return;
	*/
	
		openInbox(function(err, box) {
			
		  if (err) throw err;
		  var today=new Date();
		  //imap.search([ 'UNSEEN', ['SINCE', today] ], function(err, results) {
		  imap.search([ 'UNSEEN', ['ON', 'March 06, 2017'] ], function(err, results) {

			if (err) throw err;
			try{
				var f = imap.fetch(results,  { bodies: '' , markSeen:true});
				
				
				f.on('message', function(msg, seqno) {
					var filename='msg-' + seqno + '-body.txt';
					//console.log('Checking message #%d', seqno);
					var prefix = '(#' + seqno + ') ';
				  
					msg.on('body', function(stream, info) {
						var buffer = '';
						stream.on('data', function(chunk) {
							buffer += chunk.toString('utf8');
						});
						stream.once('end', function() {
						
							var cleaned1 = clean_string(buffer);
							var cleaned2 = cleaned1.substring(cleaned1.indexOf(startText)+startText.length) ;
							var cleaned = cleaned2.substring(
												0,
												cleaned2.indexOf(endText)
											) ;
							
							var lines = cleaned.split('|');
							
							for (i=0 ; i<lines.length ; i++){
								console.log(i+'-'+lines[i]);

								if( lines[i].indexOf(assertText) >=0 ){
									//check if assertText is found in line element
									foundCount++;
								}
							
							}
							
							
							
						
						});
					});
				  
				  /*
				  msg.on('body', function(stream, info) {
					console.log(prefix + 'Body');
					stream.pipe(fs.createWriteStream(filename));
				  });
				  
				  */
				  /*
				  msg.once('attributes', function(attrs) {
					console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
				  });
				  */
				  msg.once('end', function() {
					//console.log(prefix + 'Finished');
				  });
				});
				f.once('error', function(err) {
				  console.log('Fetch error: ' + err);
				});
				f.once('end', function() {
					console.log('Done fetching all messages!');
					imap.end();
				  
					if(foundCount==1){
						console.log('Found: %s',assertText);
					}else if(foundCount>1){
						console.log('Found %d instances of: %s',foundCount,assertText);
					}else{
						console.log('Not Found: %s',assertText);
								
					}				  
				});
				
			}catch(err){
				
				console.log(err);		
				imap.end();
			}
			
		  });
		  
		});
		
	});

	imap.once('error', function(err) {
	  console.log(err);
	});

	imap.once('end', function() {
	  console.log('Connection ended');
	});
	
}
//imap.connect();

//============================================
'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

// Add the route
server.route({
    method: 'GET',
    path:'/hello', 
    handler: function (request, reply) {
        return reply('hello world');
    }
});


server.route({
    method: 'GET',
    //path:'/mailcheck/{assertText}', 
	//example curl http://localhost:8000/mailcheck/The_following_requests_have_been_created:/work_order_HashTag1233_DblQtSELENIUM_TEST_-_Aircon_not_workingDblQt/The_following_requests
	path:'/mailcheck/{startText}/{assertText}/{endText}', 
    handler: function (request, reply) {
		//console.log(decode_special_chars(request.params.assertText));
		
		imapInit(	decode_special_chars(request.params.startText),
					decode_special_chars(request.params.assertText),
					decode_special_chars(request.params.endText)
				);
		imap.connect();
		
		
        return reply('mailcheck initated.');
    }
});


// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});


