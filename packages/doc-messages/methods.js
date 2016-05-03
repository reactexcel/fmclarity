Meteor.methods({
	//probably Messages.markAllNotificationsRead
  'Messages.markAllNotificationsAsRead':function(inboxId) {
    Messages.update({
      "inboxId.collectionName":inboxId.collectionName,
      "inboxId.query":inboxId.query,
      read:false
    },{
      $set:{read:true}
    },{
      multi:true
    });
  },

  //no reason why this can't be Messages.sendEmail hey??
  'Messages.sendEmail':function(user,message) {
    if(Meteor.isServer) {Meteor.defer(function(){

      /*
      if(!FM.inProduction()) {
        console.log('development');
      }
      else {
        console.log('production');
      }
      */
      if(user) {

        var element = React.createElement(EmailMessageView,{user:user,item:message});
        var html = ReactDOMServer.renderToStaticMarkup (element);
        var address = user.emails[0].address;
        var to = user.name?(user.name+" <"+address+">"):address;

        var email = {
            bcc :["leo@fmclarity.com","rich@fmclarity.com"],
            from:"FM Clarity <no-reply@fmclarity.com>",
            subject:(message.subject||"FM Clarity notification"),
            html:html
        }

        if(FM.inProduction()) {
          message.to = to;
        }
        else {
          email.subject = "[to:"+to+"]"+email.subject;
        }
        Email.send(email);
      }
    })}
  }
})
