
DiscussionPost = React.createClass({

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
            message:message
        }
    },

    componentDidMount() {
        $(this.refs.input).elastic();
    },

    onChange(event) {
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
                        onChange={this.props.onChange}>
                    </textarea>
                </div>
            </div>
        )
    }
});

Discussion = React.createClass({

    onChange(index,event) {
    },

    render(){
        var messages = this.props.items;
        var component = this;
        return (
            <div>
            {messages.map(function(file,idx){
                return (
                    <div key={idx}>
                        <DiscussionPost
                            item={file}
                            onChange={component.onChange.bind(null,idx)}
                        />
                    </div>
                )
            })}
            
                <div>
                    <DiscussionPost onChange={component.onChange.bind(null,messages.length)}/>
                </div>
            
            </div>
        )
    }
})

IssueDiscussion = React.createClass({
	render() {
		return (
            <div className="feed-activity-list">
                {this.props.items.map(function(n){
                    return (<div key={n._id} className="feed-element">
                        <NotificationSummary item={n} />
                    </div>)
                })}
            </div>
		)
	}
});

