import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import Reports from '../Reports.js';
import MBMServiceImages from '../reports/MBMServiceImages.jsx';
import MBMReport from '../reports/MBMReport.jsx';
import MBMBuildingServiceReport from '../reports/MBMBuildingServiceReport.jsx';


export default MonthlyReport = React.createClass( {

	render() {
		return (
			<div>
			<MBMReport/>
		  <MBMBuildingServiceReport/>
			<MBMServiceImages/>
			</div>
		)
	}
} )
