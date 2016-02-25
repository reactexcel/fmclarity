NotificationViewSummary = React.createClass({

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