import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Facilities } from '/modules/models/Facilities';
import { Reports } from '/modules/models/Reports';
import { Documents } from '/modules/models/Documents';
import DocViewEdit from '../../../.././models/Documents/imports/components/DocViewEdit.jsx';
import moment from 'moment';
import MBMServiceImages from '../reports/MBMServiceImages.jsx';
import MBMReport from '../reports/MBMReport.jsx';
import MBMBuildingServiceReport from '../reports/MBMBuildingServiceReport.jsx';


export default MonthlyReport = React.createClass( {

	getInitialState() {
		let	user = Meteor.user();
		let team = user.getSelectedTeam();
		let facility = Session.getSelectedFacility();

		return ( {
			currentDoc:'',
			docString:'',
			commentString:'',
			expandall: false,
			team,
			facility
		} )
	},

	componentWillMount(){
		let docString = this.docReactiveUpdate();
		this.setState({docString})
		let commentString = this.reportReactiveUpdate();
		this.setState({commentString})
	},
	componentDidMount(){
		let update = setInterval(()=>{

				PubSub.subscribe( 'stop', (msg,data) => {
					clearInterval(update)
				});
				let updatedString = this.docReactiveUpdate();
				let updatedComment = this.reportReactiveUpdate();
				if(updatedString != this.state.docString){
					this.setState({
						docString : updatedString
					})
				}
				if(updatedComment != this.state.commentString){
					this.setState({
						commentString : updatedComment
					})
				}
			},1000)
	},
	componentWillUnmount(){
		PubSub.publish('stop', "test");
	},
	docReactiveUpdate(){
		let docs = Documents.find({"type":"Contract"}).fetch();
		// console.log(docs.stringfy());
		// console.log(docs);
		let aa = docs.filter((doc) => doc.serviceType.hasOwnProperty("name"));
		let docString = " "
		aa.map((d)=>{
			docString = docString + d.expiryDate + d.clientExecutedDate + d.supplierExecutedDate + d.totalValue + d.serviceType.name
			if(d.hasOwnProperty("subServiceType")){
				if(d.subServiceType.hasOwnProperty("name")){
					docString = docString + d.subServiceType.name
				}
			}
			if(d.hasOwnProperty("supplier")){
				if(d.supplier.hasOwnProperty("name")){
					docString = docString + d.supplier.name
				}
			}
			if(d.hasOwnProperty("comment")){
					docString = docString + d.comment
			}
		})
		return docString
	},
	reportReactiveUpdate(){
		let query = {};
		query[ "facility._id" ] = this.state.facility ? this.state.facility._id : null;
		query[ "team._id" ] = this.state.team ? this.state.team._id : null;
		query["createdAt"] = {
			$gte: moment().subtract(1, "months").startOf("month").toDate(),
			$lte: moment().subtract(0, "months").endOf("month").toDate( )
		};
		let comments = Reports.find(query).fetch();

		comments = comments.filter((c) => c.hasOwnProperty("service"));
		let commentString = " "
		comments.map((c)=>{
			commentString = commentString + c.comment
		})
		return commentString
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
