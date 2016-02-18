NotificationSummary = React.createClass({

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

	render() {
        var message = this.data.message||{};
        var creator = this.data.creator||Meteor.user();
        var createdAt = message.createdAt;
		return (
            <div>
            	<ContactAvatarSmall item={creator}/>
                <small>{moment(message.createdAt).fromNow()}</small>
                <div>
                    <strong>{creator.getName()}</strong> {
                    message.verb?
                        <span>{message.verb} <b><a href={message.getTargetUrl()}>{message.getTargetName()}</a></b></span>
                    :
                        <span>{message.subject}</span>
                    }<br/>
                </div>
            </div>
		)
	}
})

NotificationView = React.createClass({

    render() {
        return (
            <ul className="dropdown-menu dropdown-messages">
                {this.props.items&&this.props.items.length?
                	this.props.items.map(function(n){
                    return (
                    	<li key={n._id} className="notification-list-item">
                        	<div className="dropdown-messages-box">
	                            <NotificationSummary item={n} />
                        	</div>
                    	</li>
                    )
                })
                :<li style={{paddingLeft:"10px"}}>No notifications</li>}
            </ul>
        )
    }
})