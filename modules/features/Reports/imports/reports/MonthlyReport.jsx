import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Facilities } from '/modules/models/Facilities';
import { Calendar } from '/modules/ui/Calendar';
import { Files } from '/modules/models/Files';
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
		console.log(facility);

		return ( {
			expandall: false,
			team,
			facility
		} )
	},
	componentDidMount(){
		console.log("workig");
		$(".fc-left").hide();
		$(".fc-right").hide();
	},
	componentWillUnmount(){
		$(".fc-left").show();
		$(".fc-right").show();
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
		let team = Session.getSelectedTeam(),
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

		let facility = this.state.facility;
		let imgThumb = facility.thumb.hasOwnProperty("_id") ? facility.thumb._id : null
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
				<div style = {{border:"1px solid black"}}>
					{this.getImage(imgThumb,facility)}
				</div>
			<div>
			<div style={{paddingBottom:"6%",marginTop:"8%"}}>
				<MBMReport MonthlyReport/>
			</div>
			<div className="ibox">
				<div className="ibox-content" style={{padding:"7px",marginBottom:"5%"}}>
					<Calendar requests = { requests } />
				</div>
			</div>
			<div style={{borderTop:"2px solid black",paddingTop:"25px"}}>
				<MBMBuildingServiceReport MonthlyReport/>
			</div>
			<div style={{borderTop:"2px solid black",paddingTop:"25px"}}>
				<span style={{fontSize:"26px",fontWeight:"500"}}>Building Photos</span>
				<MBMServiceImages MonthlyReport/>
			</div>
		</div>
	</div>
		)
	}
} )
