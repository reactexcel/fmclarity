import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Facilities } from '/modules/models/Facilities';
import DocViewEdit from '../../../.././models/Documents/imports/components/DocViewEdit.jsx';
import moment from 'moment';
import Reports from '../Reports.js';
import MBMServiceImages from '../reports/MBMServiceImages.jsx';
import MBMReport from '../reports/MBMReport.jsx';
import MBMBuildingServiceReport from '../reports/MBMBuildingServiceReport.jsx';


export default MonthlyReport = React.createClass( {

	getInitialState() {
		let	user = Meteor.user();
		let team = user.getSelectedTeam();
		let facility = Session.getSelectedFacility();

		return ( {
			expandall: false,
			team,
			facility
		} )
	},

	archiveChart(){
		var component = this;
		component.setState( {
			expandall: true
		} );

		setTimeout(function(){
			window.print();
			component.setState( {
				expandall: false
			} );
		},200);

		setTimeout(function(){
			Modal.show( {
			content: <DocViewEdit
			item = {{reportType : "Monthly Report" ,type : "Report" , name : "Monthly Report" + ' ' + '(' + moment().format('MMMM YYYY') + ')'}}
			onChange = { (data) => { console.log("onChangeHandler"); }}
			model={Facilities}
			team = {Session.getSelectedTeam()}/>
			} )

		},200);
	},
	printChart(){
		var component = this;
		component.setState( {
			expandall: true
		} );

		setTimeout(function(){
			window.print();
			component.setState( {
				expandall: false
			} );
		},200);
	},

	render() {
		return (
			<div>
				<div>
					<button className="btn btn-flat"  onClick={this.printChart}>
						<i className="fa fa-print" aria-hidden="true"></i>
					</button>
					<button className="btn btn-flat"  onClick={this.archiveChart}>
						Archive
					</button>
				</div>
			<div style={{paddingBottom:"10%"}}>
				<MBMReport MonthlyReport/>
			</div>
			<div style={{borderTop:"2px solid black",paddingTop:"25px"}}>
				<MBMBuildingServiceReport MonthlyReport/>
			</div>
			<div style={{borderTop:"2px solid black",paddingTop:"25px"}}>
				<span style={{fontSize:"26px",fontWeight:"500"}}>Building Photos</span>
				<MBMServiceImages MonthlyReport/>
			</div>
		</div>
		)
	}
} )
