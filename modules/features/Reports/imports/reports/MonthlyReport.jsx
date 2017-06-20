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
			document.title = "Monthly_Report" + '-' + component.state.facility.name + "_" + moment().format('MMMM YYYY') + "_" + moment().format('YYYY-MM-DD') + "_" + moment().format('hhmmss');
			$(".body-background").css({"position":"relative"});
			$(".page-wrapper-inner").css({"display":"block"});
			$("#toggleButton").hide();
			$("#toggleButton2").hide();
			$(".contact-card-avatar").hide()
			window.print();
			component.setState( {
				expandall: false
			} );
		},200);

		setTimeout(function(){
			$("#toggleButton").show();
			$("#toggleButton2").show();
			$(".contact-card-avatar").show();
			$(".body-background").css({"position":"fixed"});
			$(".page-wrapper-inner").css({"display":"inlineBlock"});
			Modal.show( {
			content: <DocViewEdit
			item = {{reportType : "Monthly Report" ,type : "Report" , name : "Monthly_Report" + '-' + component.state.facility.name + "_" + moment().format('MMMM YYYY') + "_" + moment().format('YYYY-MM-DD') + "_" + moment().format('hhmmss')}}
			onChange = { (data) => {
				return FlowRouter.go( '/dashboard' );
			}}
			model={Facilities}
			team = {Session.getSelectedTeam()}/>
			} )

		},200);
	},
	printChart(){
		var component = this;
		document.title = "Monthly_Report" + '-' + component.state.facility.name + "_" + moment().format('MMMM YYYY') + "_" + moment().format('YYYY-MM-DD') + "_" + moment().format('hhmmss');
		$(".body-background").css({"position":"relative"});
		$(".page-wrapper-inner").css({"display":"block"});
		$("#toggleButton").hide();
		$("#toggleButton2").hide();
		$(".contact-card-avatar").hide()
		component.setState( {
			expandall: true
		} );

		setTimeout(function(){
			window.print();
			component.setState( {
				expandall: false
			} );
			$("#toggleButton").show();
			$("#toggleButton2").show();
			$(".contact-card-avatar").show();
			$(".body-background").css({"position":"fixed"});
			$(".page-wrapper-inner").css({"display":"inlineBlock"});
		},200);
	},

	render() {
		return (
			<div>
				<div id="toggleButton">
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
