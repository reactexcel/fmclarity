

function parseUsefulLines(str){
	
	var startPosition=str.indexOf("MIME-Version: 1.0");
	//var startPosition=str.indexOf("Subject: [");
	
	var usefulLines = str.substr(startPosition);
	return usefulLines;
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

function imapInit(){
	imap = new Imap(mailConfig);
	imap.once('ready', function() {
	var fs = require('fs'), fileStream;

		openInbox(function(err, box) {
			
		  if (err) throw err;
		  var today=new Date();
		  imap.search([ 'UNSEEN', ['SINCE', today] ], function(err, results) {

			if (err) throw err;
			try{
				var f = imap.fetch(results,  { bodies: '' , markSeen:true});
				
				
				f.on('message', function(msg, seqno) {
					var filename='msg-' + seqno + '-body.txt';
					console.log('Message #%d', seqno);
					var prefix = '(#' + seqno + ') ';
				  
					msg.on('body', function(stream, info) {
						var buffer = '';
						stream.on('data', function(chunk) {
							buffer += chunk.toString('utf8');
						});
						stream.once('end', function() {
							//console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
							//var rawText=inspect(Imap.parse(buffer));
							//console.log(buffer);
							
							if( buffer.indexOf('SELENIUM TEST') >0 ){
								var usefulLines = parseUsefulLines(buffer);
								usefulLines.replace("  ", " ");
								//console.log(usefulLines);
							
							
								var lines = usefulLines.split("\n");
								
								for (i=0 ; i<lines.length ; i++){
									console.log(i+'-'+lines[i]);
								}
								
								
								var subject=lines[4];
								var recipient=lines[12];
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
					console.log(prefix + 'Finished');
				  });
				});
				f.once('error', function(err) {
				  console.log('Fetch error: ' + err);
				});
				f.once('end', function() {
				  console.log('Done fetching all messages!');
				  imap.end();
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
    path:'/mailcheck/{recipient}/{subject}/{assertText}', 
    handler: function (request, reply) {
		imapInit();
		imap.connect();
		
		
		
		console.log(request.params.recipient);
		console.log(request.params.subject);
		console.log(request.params.assertText);
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


