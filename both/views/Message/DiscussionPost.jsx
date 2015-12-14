
DiscussionPost = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, message, creator;
        query = this.props.value;
        message = Messages.findOne(query);
        if(message) {
            creator = message.getCreator()
        }
        return {
            creator:creator,
            message:message
        }
    },

    componentDidMount() {
        $(this.refs.input).elastic();
    },

    submit(event) {
        var callback = this.props.onChange;
        var message = this.data.message||{
            _creator:{
                _id:Meteor.userId()
            }
        };
        message.body = event.target.value;
        // returns reference object to save
        Meteor.call("Message.save",message,function(err,response){
            event.target.value = null;
            callback(response);
        })
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
                    <small className="pull-right">{moment(message.createdAt).fromNow()}</small>
                    {message.body?
                    <div>
                        <strong>{creator.getName()}</strong> {message.subject}<br/>
                        <small className="text-muted">{moment(createdAt).format('MMM Do YYYY, h:mm:ss a')}</small>
                    </div>
                    :null}
                    <textarea 
                        ref="input"
                        style={{width:"80%"}}
                        placeholder="Leave a comment or question..."
                        className={"input inline-form-control "+(used?'used':'')}
                        defaultValue={message.body} 
                        onKeyDown={this.handleKeyPress}>
                    </textarea>
                </div>
            </div>
        )
    }
});