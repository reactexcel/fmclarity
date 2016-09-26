/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";
import TeamView from './TeamView.jsx';

/**
 * @class           TeamPageProfile
 * @memberOf        module:models/Teams
 */
function TeamPageProfile( props ) {
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
export default TeamPageProfile;