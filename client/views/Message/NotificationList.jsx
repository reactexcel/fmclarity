NotificationList = React.createClass({

    render() {
        return (
            <ul className="dropdown-menu dropdown-messages">
                {
                this.props.items&&this.props.items.length?
                	this.props.items.map(function(n){
                        return (
                        	<li key={n._id} className="notification-list-item">
                            	<div className="dropdown-messages-box">
    	                            <NotificationViewSummary item={n} />
                            	</div>
                        	</li>
                        )
                    })
                :
                    <li style={{padding:"10px 18px",borderBottom:"1px solid #ddd"}}>No new notifications</li>
                }
                <li className="browse-button">
                    <a href={FlowRouter.path('messages')}>View all</a>
                </li>
            </ul>
        )
    }
})