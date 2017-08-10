import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Facilities } from '/modules/models/Facilities';
import { Calendar } from '/modules/ui/Calendar';
import { Files } from '/modules/models/Files';
import { Reports } from '/modules/models/Reports';
import { Documents } from '/modules/models/Documents';
import DocViewEdit from '../../../.././models/Documents/imports/components/DocViewEdit.jsx';
import moment from 'moment';
import MBMServiceImages from '../reports/MBMServiceImages.jsx';
import MBMDefectImages from '../reports/MBMDefectImages.jsx';
import MBMReport from '../reports/MBMReport.jsx';
import MonthlyReportHeader from '../reports/MonthlyReportHeader.jsx';
import MBMBuildingServiceReport from '../reports/MBMBuildingServiceReport.jsx';


export default MonthlyReport = React.createClass( {

	getInitialState() {
		let	user = Meteor.user();
		let team = user.getSelectedTeam();
		let facility = Session.getSelectedFacility()
		// console.log(facility);

		return ( {
			currentDoc:'',
			docString:'',
			commentString:'',
			expandall: false,
			team,
			facility,
			loaded: false, profile: null
		} )
	},
	componentWillMount(){
		this.setState({
			facility:Session.getSelectedFacility()
		})
		let docString = this.docReactiveUpdate();
		this.setState({docString})
		let commentString = this.reportReactiveUpdate();
		this.setState({commentString})
	},

	componentWillUnmount(){
		PubSub.publish('stop', "test");
		$(".fc-left").show();
		$(".fc-right").show();
		$(".facility-list-tile").show()
	},

	componentWillReceiveProps(props){
				// $(".loader").hide();
			this.setState({
				facility:Session.getSelectedFacility()
			})
	},
	componentDidMount(){
		$(".fc-left").hide();
		$(".fc-right").hide();
		$(".facility-list-tile").hide()
		setTimeout(function(){
			$(".loader").hide();
		},2000)
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
			$(".test").removeAttr("style");
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
			$(".test").css({"marginTop":"160px"});
			$("#toggleButton").show();
			$("#toggleButton2").show();
			$(".contact-card-avatar").show();
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
		$(".test").removeAttr("style");
		var component = this;
		document.title = "Monthly_Report" + '-' + component.state.facility.name + "_" + moment().format('MMMM YYYY') + "_" + moment().format('YYYY-MM-DD') + "_" + moment().format('hhmmss');
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
			$(".test").css({"marginTop":"160px"});
			$("#toggleButton").show();
			$("#toggleButton2").show();
			$(".contact-card-avatar").show();
			$(".page-wrapper-inner").css({"display":"inline-block"});
		},200);
	},

	getImage( _id,facility ){
		if(_id != null){
			let address = facility.address
			let file = Files.findOne({_id});
			let url = null;
			let { removedImg } = this.state;
			if (file != null ) {
				url = file.url();
				if( _.contains(["jpg", "png"], file.extension()) && !_.contains(removedImg, _id) ) {
					return (
						<div  key={_id}>
							<div style= {{fontSize:"30px",fontWeight:"500",textAlign:"center",marginTop:"3%"}}>Monthly Report ({moment().format('MMMM YYYY')}) For {facility.name}</div>
							<div style={{margin:"26% 0 4% 0",fontSize:"25px",fontWeight:"500",textAlign:"center",color:"darkgrey"}}>{address.streetNumber +" " + address.streetName +" " + address.streetType +"," + address.city +" " + address.state +" " + address.postcode}</div>
							<div style={{margin:"0 0 50% 17%"}}><img src={url} style={{ height:"30%", width:"80%" }} /></div>
						</div>
					);
				}
			}
			return null;
		}
	},

	render() {
				$(".fc-left").hide();
		let team = this.state.team,
				facility = this.state.facility,
        user = Meteor.user(),
        requests = null,
        facilities = null,
        statusFilter = { "status": { $nin: [ "Cancelled", "Deleted", "Closed", "Reversed" ] } },
        contextFilter = {};

    if ( team ) {
        facilities = team.getFacilities(); //Facilities.findAll( { 'team._id': team._id } );
        if ( facilities ) {
            let facilityThumbs = _.pluck( facilities, 'thumb' );
            Meteor.subscribe( 'Thumbs', facilityThumbs );
        }
    }

    if ( facility && facility._id ) {
        contextFilter[ 'facility._id' ] = facility._id;
    } else if ( team && team._id ) {
        contextFilter[ 'team._id' ] = team._id;
    }

    if ( user != null ) {
        // Requests.findForUser( Meteor.user() )...???
        requests = user.getRequests( { $and: [ statusFilter, contextFilter ] }, { expandPMP: true } );
    }

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
				<MonthlyReportHeader facility = {this.state.facility}/>
			<div>
			<div style={{paddingBottom:"6%",marginTop:"8%"}}>
				<MBMReport MonthlyReport/>
			</div>
			<div style={{width:"600px",marginLeft:"200px"}}>
				<div className="ibox-content" style={{padding:"7px",marginBottom:"5%"}}>
					<Calendar requests = { requests } />
				</div>
			</div>
			<div style={{borderTop:"2px solid black",paddingTop:"25px"}}>
				<MBMBuildingServiceReport MonthlyReport/>
			</div>
			<div style={{borderTop:"2px solid black",paddingTop:"25px"}}>
				<span style={{fontSize:"26px",fontWeight:"500"}}>Defects Table</span>
				<MBMDefectImages/>
			</div>
		</div>
	</div>
		)
	}
} )
