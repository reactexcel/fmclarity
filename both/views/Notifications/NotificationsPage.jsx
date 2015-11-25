NotificationSummary = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('users');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        var notification = this.props.item;
        var actor = notification.getActor();
        return {
        	notification:notification,
        	actor:actor,
        	action:notification.getAction(),
        	object:notification.getObject()
        }
    },

	render() {
		var data = this.data;
		var notification = data.notification;
		var object = this.data.object;
		return (
            <div>
            	<ContactAvatarSmall item={data.actor}/>
                <div className="media-body">
                    <small className="pull-right">{moment(notification.time).fromNow()}</small>
                    <strong>{data.actor.getName()}</strong> {data.action} an <strong>{object.collectionName} "{object.getName()}"</strong>. <br/>
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