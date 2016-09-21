import React from "react";

export default ReportsPageIndex = React.createClass({
	render() {
		var reports = Reports.getAll();
		var reportIds = Object.keys(reports);
		return (
			<div className="reports-index-page">
				<div className="wrapper wrapper-content animated fadeIn">
					<div className="row">
						<div className="col-md-3">
						{reportIds.map(function(id){
							report = reports[id];
							return (
								<div className="grid-item" style={{margin:"10px 0px",padding:"10px",textAlign:"center"}} key={id}>
									<a href={"/report/"+id+"/"}>{report.name}</a>
								</div>
							)
						})}
						</div>
					</div>
				</div>
			</div>
		)
	}
})