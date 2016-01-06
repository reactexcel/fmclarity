NotificationSummary = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, post, creator;
        query = this.props.item;
        post = Posts.findOne(query);
        if(post) {
            creator = post.getCreator()
        }
        return {
            creator:creator,
            post:post
        }
    },

	render() {
        var post = this.data.post||{};
        var creator = this.data.creator||Meteor.user();
        var createdAt = post.createdAt;
		return (
            <div>
            	<ContactAvatarSmall item={creator}/>
                <small>{moment(post.createdAt).fromNow()}</small>
                <div>
                    <strong>{creator.getName()}</strong> {post.subject}<br/>
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