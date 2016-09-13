import React from "react";

import UserCard from './UserCard.jsx';

export default function UserPageProfile( props ) {
	return (
		<div className = "user-page animated fadeIn">
	        <div className = "row">
	            <div className = "col-lg-6">
	            	<div className = "ibox">
						<UserCard item = { props.user } edit = { true }/>
					</div>
				</div>
			</div>
		</div>
	)
}
