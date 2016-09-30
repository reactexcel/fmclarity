/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { UserPanel } from '/modules/models/Users';

/**
 * @class 			UserPageProfile
 * @memberOf 		module:models/User
 */
function UserPageProfile( props ) {
	return (
		<div className = "user-page animated fadeIn">
	        <div className = "row">
	        	<div className="col-lg-2"></div>
	            <div className="col-lg-8">
	            	<div className = "ibox">
						<UserPanel item = { props.user }/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserPageProfile;