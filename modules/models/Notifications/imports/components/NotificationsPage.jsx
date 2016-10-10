/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import NotificationViewSummary from './NotificationViewSummary.jsx';

/**
 * UI component which renders a page of notifications
 * @class           NotificationsPage
 * @memberOf        module:models/Notifications
 * @param           {object} props
 * @param           {array} props.items - The notifications items to render (individually passed to NotificationViewSummary)
 */
function NotificationsPage( props ) {

    return (
		<div>
			<div className="issue-page wrapper wrapper-content animated fadeIn">
				<div className="row">
					<div className="col-xs-12">
						<div className="ibox feed-activity-list">
			            { props.items.map( ( notification ) => {
			                    return (
									<div key = { notification._id } className = "feed-element">
			                            <NotificationViewSummary item = { notification } />
			                        </div>
			                    )
			            } ) }
			            </div>
			        </div>
			    </div>
			</div>
        </div>
    )
}

export default NotificationsPage;
