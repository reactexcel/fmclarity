import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import Reports from '../Reports.js';
import { Documents } from '/modules/models/Documents';
import moment from 'moment';

export default ReportsNavWidget = React.createClass( {

	render() {
		var reports = Reports.getAll();
		var reportIds = Object.keys( reports ).filter((val) => val == "requests-status" || val == "request-breakdown-chart" || val == "request-activity-chart");
		var facility = Session.getSelectedFacility();
		if(facility){
			// console.log(facility);
			let docs = Documents.find({"facility._id": facility["_id"],"type":"Report","reportType": "Monthly Report"}).fetch();
			// console.log(docs);
			reportIds = Object.keys( reports )
			if(docs.length > 0){
				reportIds = Object.keys( reports ).filter((val)=> val != "monthly-report")
			}
		}
		return (
			<div>
		        {/*<ActionsMenu items={this.getMenu()} icon="eye" />*/}
		        <div className="ibox-title">
		        	<h2>Available Reports</h2>
		        </div>
		        <div className="ibox-content" style={{padding:"0px"}}>
					<div className="row">
						<div className="col-md-12">
						{reportIds.map(function(id){
							report = reports[id];
							return (
								<div className="grid-item" style={{padding:"15px"}} key={id}>
									<a style={{color:"#111"}} href={"/report/"+id+"/"}>{report.name}</a>
								</div>
							)
						})}
						</div>
					</div>
				</div>
			</div>
		)
	}
} )
