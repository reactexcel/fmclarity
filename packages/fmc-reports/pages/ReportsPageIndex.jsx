import React from "react";
import {GridView} from "react-gridview";

ReportsPageIndex = React.createClass({
	render() {
		var reports = Reports.getAll();
		var reportIds = Object.keys(reports);
		return (
			<div className="reports-index-page">
				<div className="wrapper wrapper-content animated fadeIn">
					<div className="ibox">
						<h1>Reports</h1>
						<ul>
						{reportIds.map(function(id){
							report = reports[id];
							return (
								<li key={id}><a href={"/report/"+id+"/"}>{report.name}</a></li>
							)
						})}
						</ul>
					</div>
				</div>
			</div>
		)
	}
})