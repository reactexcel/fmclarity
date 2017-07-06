import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Facilities } from '/modules/models/Facilities';
import { Files } from '/modules/models/Files';
import { Documents } from '/modules/models/Documents';
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
		// console.log(facility);

		return ( {
			expandall: false,
			team,
			facility
		} )
	},
	componentWillReceiveProps(props){
		this.setState({
			facility:props.facility
		})
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
							<div style= {{fontSize:"30px",fontWeight:"500",textAlign:"center",marginTop:"3%"}}>Monthly Report for {facility.name} for {moment().format('MMMM YYYY')} </div>
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
		let facility = this.state.facility;
		let imgThumb = facility.thumb.hasOwnProperty("_id") ? facility.thumb._id : null
		return (
				<div style = {{border:"1px solid black"}}>
					{this.getImage(imgThumb,facility)}
				</div>
		)
	}
} )
