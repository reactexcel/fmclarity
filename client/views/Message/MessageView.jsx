
MessageView = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, message, creator;
        query = this.props.item;
        message = Messages.findOne(query);
        if(message) {
            creator = message.getCreator()
        }
        return {
            creator:creator,
            inbox:this.props.inbox,
            message:message
        }
    },

    componentDidMount() {
        $(this.refs.input).elastic();
    },

    submit() {
        var input = this.refs.input;
        var inboxId = this.data.inbox.getInboxId();
        Meteor.call("Messages.create",{
            inboxId:inboxId,
            verb:"sent a message to",
            body:input.value
        });
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
        var creator = this.data.creator||Meteor.user();
        var createdAt = message.createdAt;
        var used = false;
        return(
            <div>
                <ContactAvatarSmall item={creator}/>
                <div className="media-body">
                    {message.body||message.subject||message.verb?
                    <div>
                        <small className="pull-right">{moment(message.createdAt).fromNow()}</small>
                        <strong>{creator.getName()}</strong> {
                        message.verb?
                            <span>{message.verb} <b><a href={message.getTargetUrl()}>{message.getTargetName()}</a></b></span>
                        :
                            <span>{message.subject}</span>
                        }<br/>
                        <small className="text-muted">{moment(createdAt).format('MMM Do YYYY, h:mm:ss a')}</small>
                        <div>{message.body}</div>
                    </div>
                    :
                    <textarea 
                        ref="input"
                        style={{width:"80%"}}
                        placeholder="Leave a comment or question..."
                        className={"input inline-form-control "+(used?'used':'')}
                        defaultValue={message.body} 
                        onKeyDown={this.handleKeyPress}>
                    </textarea>
                    }
                </div>
            </div>
        )
    }
});