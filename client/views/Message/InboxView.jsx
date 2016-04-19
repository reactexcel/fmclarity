Inbox = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var inbox, messages;
        inbox = this.props.for;
        if(inbox) {
            messages = inbox.getMessages();
        }
        return {
            inbox:inbox,
            messages:messages||[]
        }
    },

    render(){
        var inbox = this.data.inbox;
        var messages = this.data.messages;
        var readOnly = this.props.readOnly;
        return (
            <div className="feed-activity-list">
                {
                (messages&&messages.length)?
                    messages.map(function(message,idx){
                        return (
                            <div key={message._id} className="feed-element">
                                <MessageView item={message}/>
                            </div>
                        )
                    })
                :null
                }
                {
                readOnly?null:
                    <div className="feed-element" style={{paddingBottom:0,borderBottom:"none"}}>
                        <MessageView inbox={inbox}/>
                    </div>
                }
            
            </div>
        )
    }
})