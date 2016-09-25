import React from "react";

import { UserPanel } from '/modules/models/Users';

export default function UserPageProfile( props ) {
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
