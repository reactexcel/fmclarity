/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import NotificationViewSummary from './NotificationViewSummary.jsx';

/**
 * UI component which renders a list of notifications
 * @class           NotificationList
 * @memberOf        module:models/Notifications
 * @param           {object} props
 * @param           {array} props.items - The notifications items to render (individually passed to NotificationViewSummary)
 */
function NotificationList( { items } ) {

    console.log( items );

    return (
        <ul className="dropdown-menu dropdown-messages" style = { { maxHeight: "500px", overflowY : "auto" } }>
            { items && items.length ?
                items.map( ( n ) => {
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
                <a href = { FlowRouter.path('notifications') }>View all</a>
            </li>
        </ul>
    )
}

export default NotificationList;
