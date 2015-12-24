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
                    {/*<small className="pull-right">{moment(notification.time).fromNow()}</small>*/}
                    {/*message - this is the subject*/}
                    <strong>{data.actor.getName()}</strong> {data.action} {notification.getObjectType()} <strong>{object.getName()}</strong><br/>
                    <small className="text-muted">{moment(notification.time).format('MMM Do YYYY, h:mm:ss a')}</small>
                    {/*object.description?<div>{object.description}</div>:null*/}
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