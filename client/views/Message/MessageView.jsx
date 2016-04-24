
MessageView = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, message, owner;
        query = this.props.item;
        message = Messages.findOne(query);
        if(message) {
            owner = message.getOwner()
        }
        return {
            owner:owner,
            inbox:this.props.inbox,
            message:message
        }
    },

    componentDidMount() {
        $(this.refs.input).elastic();
    },

    submit() {
        var input = this.refs.input;
        var owner = Meteor.user();
        var inbox = this.data.inbox;
        var inboxId = inbox.getInboxId();
        //console.log(inbox);
        inbox.sendMessage({
            type:"comment",
            verb:"commented on",
            subject:owner.getName()+" commented on \""+inbox.getName()+"\"",
            body:input.value
        });
        /*
        Meteor.call("Messages.create",{
            inboxId:inboxId,
            verb:"sent a message to",
            body:input.value
        });
        */
        input.value = null;
    },    

    handleKeyPress(event) {
        if(!event.shiftKey&&event.keyCode==13) {
            event.preventDefault();
            this.submit(event);
        }
    },

    render() {
        var message = this.data.message||{};
        var owner = this.data.owner||Meteor.user();
        var createdAt = message.createdAt;
        var used = false;
        if(message.type=="comment") {
            return (<div>
                <ContactAvatarSmall item={owner}/>
                <div className="media-body" style={{paddingLeft:"5px",whiteSpace:"pre-wrap"}}>
                    <div>
                        <small className="pull-right" style={{color:"#999",marginLeft:"10px"}}>{moment(message.createdAt).fromNow()}</small>
                        <div style={{width:"90%"}}>
                            {/*<a style={{fontWeight:"bold"}}>{owner.getName()}</a> */}{message.body}
                        {/*<small className="text-muted">{moment(createdAt).format('MMM Do YYYY, h:mm:ss a')}</small>*/}
                        </div>
                    </div>
                </div>
            </div>)
        }
        else if(message.body||message.subject||message.verb) {
            return (<div>
                <ContactAvatarSmall item={owner}/>
                <div className="media-body" style={{paddingLeft:"5px",whiteSpace:"pre-wrap"}}>
                    <div>
                        <small className="pull-right" style={{color:"#999",marginLeft:"10px"}}>{moment(message.createdAt).fromNow()}</small>
                        <a style={{fontWeight:"bold"}}>{owner.getName()}</a> {
                        message.verb?
                            <span>{message.verb} <b><a href={message.getTargetUrl()}>{message.getTargetName()}</a></b></span>
                        :
                            <span>{message.subject}</span>
                        }<br/>
                        <div>{message.body}</div>
                        <small className="text-muted">{moment(createdAt).format('MMM Do YYYY, h:mm:ss a')}</small>
                    </div>
                </div>
            </div>)
        }
        else {
            return (<div>
                <ContactAvatarSmall item={owner}/>
                <div className="media-body">
                    <textarea 
                        ref="input"
                        style={{width:"80%"}}
                        placeholder="Leave a comment or question..."
                        className={"input inline-form-control "+(used?'used':'')}
                        defaultValue={message.body} 
                        onKeyDown={this.handleKeyPress}>
                    </textarea>
                </div>
            </div>)
        }
    }
});