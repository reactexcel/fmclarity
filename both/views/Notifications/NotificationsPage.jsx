NotificationSummary = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('users');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        var notification,actor,action,object;
        notification = this.props.item;
        if(notification) {
            actor = notification.getActor();
            action = notification.getAction();
            object = notification.getObject();
        }
        return {
            notification:notification,
            actor:actor,
            action:action,
            object:object
        }
    },

	render() {
        if(!this.data.object||!this.data.actor) return <div/>
		var data = this.data;
		var notification = data.notification;
		var object = this.data.object;
		return (
            <div>
            	<ContactAvatarSmall item={data.actor}/>
                <div className="media-body">
                    <small className="pull-right">{moment(notification.time).fromNow()}</small>
                    <strong>{data.actor.getName()}</strong> {data.action} an <strong>{notification.getObjectType()} "{object.getName()}"</strong>. <br/>
                    <small className="text-muted">{moment(notification.time).format('MMM Do YYYY, h:mm:ss a')}</small>
                    {object.description?<div className="well">{object.description}</div>:null}
                </div>
            </div>
		)
	}

})

NotificationsPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('notifications');
        var notifications = Meteor.user().getNotifications();
        return {
            notifications : notifications
        }
    },

    render() {
    	return (
    		<div>
    			{this.data.notifications.map(function(n){
    				return <div key={n._id}>
    					<NotificationSummary item={n} />
    				</div>
    			})}
    		</div>
    	)
    }


})