/**
 * @author          Norbert Glen <norbertglen7@gmail.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";

/**
 * @class           PageRequestLinkExpired
 * @memberOf        module:core/Authentication
 */
const PageRequestLinkExpired = React.createClass( {
	render() {
		return (
		<div className="middle-box text-center animated fadeInDown">
			<h1>403</h1>
			<h3 className="font-bold">Link is Expired</h3>

			<div className="error-desc">
				<p>Oops, the Work Order link you clicked on has expired. Try <a href={FlowRouter.path('login')}>logging in</a> and accessing it that way.</p>
			</div>
			<a href={FlowRouter.path('login')} className="btn btn-primary">Login</a>
		</div>
		)
	}
} )

export default PageRequestLinkExpired;
