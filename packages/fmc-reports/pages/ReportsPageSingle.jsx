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
			<div className="report-page animated fadeIn">
				<div className="ibox">
					<Report/>
				</div>
			</div>
		)
	}
})