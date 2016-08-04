import React from 'react';
import ActionsMenu from 'meteor/fmc:actions-menu';
import {Calendar} from 'meteor/fmc:calendar';


// Dashboard
// The main landing page for FMs which is intended to give a broad overview of job status
DashboardPage = class DashboardPage extends React.Component {

	render() {
		var canGetMessages;
		var team = Session.getSelectedTeam();
		if(team) {
			canGetMessages = team.canGetMessages();
		}
		return(
			<div className="dashboard-page animated fadeIn">
				<FacilityFilter title="Dashboard"/>
		        <div className="row" style={{marginRight:"0px"}}>
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
			            	<UpdatesWidget/>
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

                             
