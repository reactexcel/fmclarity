import React from 'react';
import { Calendar } from 'meteor/fmc:calendar';

import { InboxWidget } from 'meteor/fmc:doc-messages';

// Dashboard
// The main landing page for FMs which is intended to give a broad overview of job status
DashboardPage = class DashboardPage extends React.Component {

	render() {
		var canGetMessages;
		var team = Session.getSelectedTeam();
		if ( team ) {
			canGetMessages = team.canGetMessages();
		}
		return (
			<div className="dashboard-page animated fadeIn">
				{/*<FacilityFilter/>*/}
		        <div className="row" style={{paddingTop:"50px"}}>
		            <div className="col-sm-6" style={{paddingRight:"0px"}}>
			            <div className="ibox">
			            	<div className="ibox-content" style={{padding:"7px"}}>
				            	<Calendar />
				            </div>
			            </div>
			            <div className="ibox">
			            	<ReportsNavWidget />
			            </div>
			            {canGetMessages?<div className="ibox">
			            	<InboxWidget/>
			            </div>:null}
			        </div>
		            <div className="col-sm-6" style={{paddingRight:"0px"}}>
			            <div className="ibox">
			            	<ProgressOverviewChart />
			            </div>
			            <div className="ibox">
					        <RequestActivityChart />
			            </div>
			            <div className="ibox">
			            	<RequestBreakdownChart />
			            </div>
			        </div>
				</div>
			</div>
		);
	}
}
