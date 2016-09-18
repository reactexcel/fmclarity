import React from 'react';

import { Calendar } from '/modules/ui/Calendar';
import { InboxWidget } from '/modules/models/Message';
import { FacilityFilter } from '/modules/models/Facilities';

import ProgressOverviewChart from '../reports/ProgressOverviewChart.jsx';
import RequestActivityChart from '../reports/RequestActivityChart.jsx';
import RequestBreakdownChart from '../reports/RequestBreakdownChart.jsx';


// Dashboard
// The main landing page for FMs which is intended to give a broad overview of job status
export default function DashboardPage( props ) {
	let canGetMessages = false;
	if ( props.team != null ) {
		props.team.canGetMessages();
	}
	return (
		<div className="dashboard-page animated fadeIn">
			<FacilityFilter team = { props.team }/>
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
