import React from "react";
import _ from 'lodash';
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import Reports from '../Reports.js';
import { Documents } from '/modules/models/Documents';
import moment from 'moment';

export default ReportsNavWidget = React.createClass( {
 	abc(id){
		$(".loader").show();
		setTimeout(function(){
			FlowRouter.go("/report/"+id+"/");
		},2000)
	},
	render() {
		// <a  style={{color:"#111"}} href={"/report/"+id+"/"}>{report.name}</a>
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
		let xyz = _.map(reportIds, (id) => {
			report = reports[id];
			return (
				<div id="report-link" onClick={()=>this.abc(id)} className="grid-item" style={{padding:"15px", cursor:"pointer", textDecoration:'underline'}} key={id}>
					{report.name}
				</div>
			)
		})
		return (
			<div>
		        {/*<ActionsMenu items={this.getMenu()} icon="eye" />*/}
		        <div className="ibox-title">
		        	<h2 style = {{testTransform:'uppercase',fontWeight:'400'}}>Available Reports</h2>
		        </div>
		        <div className="ibox-content" style={{padding:"0px"}}>
					<div className="row">
						<div className="col-md-12">
						{xyz}
						</div>
					</div>
				</div>
			</div>
		)
	}
} )
