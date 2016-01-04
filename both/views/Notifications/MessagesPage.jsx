MessageBody = React.createClass({

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



MessagesPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('notifications');
        var user, notifications;
        user = Meteor.user();
        if(user) {
            notifications = user.getNotifications();
        }
        return {
            user: user,
            notifications : notifications
        }
    },

    render() {
        if(!this.data.notifications) {
            return <div></div>
        }
    	return (
            <div>
                <div className="issue-page wrapper wrapper-content animated fadeIn">
                    <FilterBox 
                        items={this.data.notifications}
                        itemView={{
                            summary:NotificationSummary,
                            detail:MessageBody
                        }}
                        newItemCallback={this.createNewIssue}
                    />
                </div>
            </div>


    	)
    }


})