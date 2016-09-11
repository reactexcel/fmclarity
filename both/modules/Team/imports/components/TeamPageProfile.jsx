import React from "react";
import TeamView from './TeamView.jsx';

export default function TeamPageProfile( props ) {
	if ( !props.team ) {
		return <div/>
	}
	return (
		<div className="team-page animated fadeIn">
	        <div className="row">
	        	<div className="col-lg-2"></div>
	            <div className="col-lg-8">
	            	<div className="ibox">
						<TeamView item = { props.team }/>
					</div>
				</div>
	        	<div className="col-lg-2"></div>
			</div>
		</div>
	)
}
