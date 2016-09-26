/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import NotificationViewSummary from './NotificationViewSummary.jsx';

/**
 * @class           NotificationList
 * @memberOf        module:models/Notifications
 */
export default NotificationList = React.createClass({

    render() {
        return (
            <ul className="dropdown-menu dropdown-messages" style = { { maxHeight: "500px", overflowY : "auto" } }>
                { this.props.items && this.props.items.length ?
                	this.props.items.map( ( n ) => {
                        return (
                        	<li key = { n._id } className = "notification-list-item">
                            	<div className = "dropdown-messages-box">
    	                            <NotificationViewSummary item = { n } />
                            	</div>
                        	</li>
                        )
                    })
                :
                    <li style = { {padding:"10px 18px", borderBottom:"1px solid #ddd"} }>No new notifications</li>
                }
                <li className="browse-button">
                    <a href = { FlowRouter.path('messages') }>View all</a>
                </li>
            </ul>
        )
    }
})