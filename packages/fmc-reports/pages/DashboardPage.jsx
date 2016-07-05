import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

// Dashboard
// The main landing page for FMs which is intended to give a broad overview of job status
DashboardPage = React.createClass({

	render() {
		var canGetMessages;
		var team = Session.getSelectedTeam();
		if(team) {
			canGetMessages = team.canGetMessages();
		}
		return(
			<div>
				<div className="row wrapper page-heading">
					<div className="col-lg-12">
			            <FacilityFilter title="Dashboard"/>
					</div>
				</div>
			    <div className="wrapper wrapper-content animated fadeIn">
			        <div className="row" style={{margin:"5px 0 0 -20px"}}>
			            <div className="col-sm-6" style={{padding:"0 0 0 20px"}}>
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
			            <div className="col-sm-6" style={{padding:"0 0 0 20px"}}>
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
			</div>
		);
	}
})

                             
