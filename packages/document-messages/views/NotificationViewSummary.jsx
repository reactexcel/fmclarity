NotificationViewSummary = React.createClass({

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
            message:message
        }
    },

	render() {
        var message = this.data.message||{};
        var owner = this.data.owner||Meteor.user();
        var createdAt = message.createdAt;
		return (
            <div>
            	<ContactAvatarSmall item={owner}/>
                <small>{moment(message.createdAt).fromNow()}</small>
                <div>
                    <strong>{owner.getName()}</strong> {
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