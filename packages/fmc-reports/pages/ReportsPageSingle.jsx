import React from "react";
import {GridView} from "react-gridview";

ReportsPageSingle = React.createClass({
	getInitialState() {
		var report = Reports.get({id:this.props.id});
		return report;
	},

	render() {
		var Report = this.state.content;
		return (
			<div className="report-page">
				<div className="wrapper wrapper-content animated fadeIn">
					<div className="ibox">
						<Report/>
						<div style={{position:"absolute",top:"15px",right:"18px",fontSize:"19px"}}>
							<a style={{color:"#000",opacity:"0.5"}} href="print" target="_blank"><i className="fa fa-print"></i></a>
						</div>
					</div>
				</div>
			</div>
		)
	}
})