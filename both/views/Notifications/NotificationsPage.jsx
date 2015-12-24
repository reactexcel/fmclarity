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
    				return (
                        <div key={n._id}>
    					   <NotificationSummary item={n} />
    				    </div>
                    )
    			})}
    		</div>
    	)
    }


})