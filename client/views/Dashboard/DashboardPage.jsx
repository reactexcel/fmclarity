import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

DashboardPage = React.createClass({

	render() {
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
				            	<UpdatesWidget/>
				            </div>
				        </div>
			            <div className="col-sm-6" style={{padding:"0 0 0 20px"}}>
				            <div className="ibox">
				            	<DashboardOverview />
				            </div>
				            <div className="ibox">
						        <LineChart />
				            </div>
				            <div className="ibox">
				            	<BarChart />
				            </div>
				        </div>
					</div>
				</div>
			</div>
		);
	}
})

                             
