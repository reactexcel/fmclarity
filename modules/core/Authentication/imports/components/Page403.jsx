/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";

/**
 * @class           Page403
 * @memberOf        module:core/Authentication
 */
const Page403 = React.createClass( {
	render() {
		return (
		<div className="middle-box text-center animated fadeInDown">
			<h1>403</h1>
			<h3 className="font-bold">Access Denied</h3>

			<div className="error-desc">
				<p>You have either tried to log in with an expired or invalid authentication token, or you do not have permission to access this resource.</p>
				<p>If you think you should have access please contact <a href="mailto:admin@fmclarity.com">FM Clarity</a> for more information.</p>
			</div>
		</div>
		)
	}
} )

export default Page403;
