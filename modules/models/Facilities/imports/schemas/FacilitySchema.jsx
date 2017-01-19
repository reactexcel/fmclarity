/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import './AddressSchema.jsx';
import { Documents, DocExplorer } from '/modules/models/Documents';
import { Text, TextArea, Select, Switch, Currency, DateTime, StartEndTimePicker} from '/modules/ui/MaterialInputs';
import { Users } from '/modules/models/Users';
import { ContactCard } from '/modules/mixins/Members';
import React from "react";
import moment from 'moment';

/**
 * @memberOf 		module:models/Facilities
 */
let initiallUnit = "m";
let item = null;
const FacilitySchema = {
	//$schema:              "http://json-schema.org/draft-04/schema#",
	//title:                "Facility",
	//description:          "A site maintained by a team",

	//properties:
	//{

	////////////////////////////////////////////////////
	// Basic info
	////////////////////////////////////////////////////
	_id: {
		label: "Auto generated document id",
		description: "Document id generated by Mongo",
		type: "string",
		input: Text,
		options: {
			readonly: true
		},
		defaultValue: () => {
			return Random.id();
		}
	},

	name: {
		label: "Name",
		description: "A short identifier for the building (ie 12 Smith St)",
		type: "string",
		input: Text,
		required: true,
		autoFocus: true,
	},

	address: {
		label: "Address",
		description: "The location of the site",
		type: "object",
		required: true,
		subschema: AddressSchema,
	},

	type: {
		label: "Property type",
		input: Select,
		type: "string",
		required: true,
		options: {
			items: [
				"Commercial",
				"Retail",
				"Residential",
				"Industrial"
			]
		}
	},

	description: {
		label: "Description",
		description: "A brief description of the site",
		type: "string",
		optional: true,
		input: TextArea,
	},

	size: {
		label: "Size",
		description: "The net lettable area in metres squared",
		type: "number",
		optional: true,
		input: Text,
		size: 6
	},

	operatingTimes: {
		label: "Operating times",
		description: "When this site is open",
		type: "string",
		optional: true,
		input: Text
	},

	////////////////////////////////////////////////////
	// Configuration
	////////////////////////////////////////////////////

	levels: {
		label: "Areas",
		description: "The primary areas or zones for this site",
		type: [ Object ],
		//defaultValue: () => {
		//return JSON.parse( JSON.stringify( Config.defaultLevels ) )
		//},
		//input 			levels editor
	},

	areas: {
		label: "Building areas",
		description: "The main bookable or maintainable secondary areas for this site",
		type: [ Object ],
		//defaultValue: () => {
		//return JSON.parse( JSON.stringify( Config.defaultAreas ) )
		//}
		//input 			areas editor
	},

	servicesRequired: {
		label: "Services Required",
		description: "The services required to maintain this site",
		type: [ Object ],
		//defaultValue: () => {
		//return JSON.parse( JSON.stringify( Config.services ) )
		//}
	},

	////////////////////////////////////////////////////
	// Relations
	////////////////////////////////////////////////////

	team: {
		label: "Team",
		description: "The team that maintains this site",
		/*relation: {
			join: ( item ) => {
				if ( item.team && item.team._id ) {
					return Teams.findOne( item.team._id );
				}
			},
			unjoin: ( item ) => {
				return _.pick( item.team, '_id', 'name' );
			}
		},*/
		input: Select,
		options: ( item ) => {

			return {
				items: Meteor.user().getTeams()
			}

		}
	},

	members: {
		label: "Members",
		description: "Stakeholders and staff for this site"
	},

	suppliers: {
		label: "Suppliers",
		description: "Contractors supplying services for this facility",
	},

	contact: {
		label: "Primary contact",
		description: "Primary contact for the facility",
		relation: {
			join: ( facility ) => {
				var contacts = facility.getMembers( {
					role: "manager"
				} );
				if ( contacts && contacts.length ) {
					return contacts[ 0 ]
				}
			},
			unjoin: ( facility ) => {
				return null
			}
		}
	},

    documents: {
        label: "Documents",
        description: "Saved facility documents",
        type: "array",
        /*relation:
        {
            type: ORM.HasMembers,
            source: "Files",
            key: "team._id"
        },*/
        input: DocExplorer
    },


	//}

	areaDetails: 	{
		label: "Area information",
		type: "object",
		subschema: {
			 type:{
				 label: 'Type',
				 size: 12,
				 input: Select,
				 type: "string",
				 options:{
					 items:[
						 'Bookable',
						 'Leasable',
						 'Standard'
					 ],
					 afterChange( item ) {
						 //item.leasable = false;
						 item.unit = null;
						 item.day = null;
						 item.hour = null;
						 item.week = null;
						 item.month = null;
						 //item.tenant = null;
 						 item.nla = null;
 						 item.areaUnit = null;
						 item.minimumAllowablePeriod = null;
						 item.maximumAllowablePeriod = null;
					 }
				 },
				 condition(item) {
					 item.type  = item.type || "Standard";
					 return true;
				 }
			 },
			//  leasable:{
			// 	 label: 'Leasable',
			// 	 size: 6,
			// 	 type: "boolean",
			// 	 input: Switch,
			// 	 options:{
			// 		 afterChange( item ) {
			// 			 item.bookable = false;
			// 			 item.unit = null;
			// 			 item.day = null;
			// 			 item.hour = null;
			// 			 item.week = null;
			// 			 item.month = null;
			// 			// item.tenant = null;
			// 			 item.nla = null;
			// 			 item.areaUnit = null;
			// 			 item.minimumAllowablePeriod = null;
			// 			 item.maximumAllowablePeriod = null;
			// 		 }
			// 	 }
			//  },
			//  tenant:{
			// 	 label: "Select tenant or resident",
			// 	 input: Select,
			// 	 options: ( item ) => {
			// 		 let facility = Session.getSelectedFacility(),
			// 		 members = facility.getMembers({role: {$in: ["tenant","resident"] } });
			// 		 return (
			// 			 {
			// 				 items: members ? members : null,
			// 				 view: ContactCard,
			// 			 }
			// 		 );
			// 	 },
			// 	 condition( item ){
			// 		 return item.leasable;
			// 	 }
			//  },
			 "unit":{
				 label: 'Unit',
				 type: 'string',
				 size:6,
				 input: Select,
				 options:{
					 items:[
						 "Months",
						 "Weeks",
						 "Days",
						 "Hours",
					 ]
				 },
				 condition(item){
					 return item.type === "Bookable";
				 }
			 },
			 day:{
				 label: 'Booking increment',
				 size:6,
				 input: Select,
				 options(item){
					 let items = ["1", "2", "3", "4", "5", "6"]
					 items = items.map((m)=>{
						 return m +" "+ item.unit
					 });
				 return({items:items,})
				 },
				 condition(item){
					 return item.unit == "Days";
				 }
			 },
			 hour:{
				 label: 'Booking increment',
				 size:6,
				 input: Select,
				 options(item){
					 let items = [
						 "0.25", "0.5", "0.75", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
						"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
						"21", "22", "23",
					 ]
					 items = items.map((m)=>{
						 return m +" "+ item.unit
					 });
				 return({items:items,})
				 },
				 condition(item){
					 return item.unit == "Hours";
				 }
			 },
			 daySelector:{
				 labe: "Days",
				 type: "object",
				 input( props ) {
					 let days = [  'M-F', "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ];
					 let weekDays = [ "Mon", "Tue", "Wed", "Thu", "Fri" ]
					 let weekEnds = [ "Sun", "Sat", ];
					 let selected = props.value || {
						  'M-F': {select:false,time:""},
						  "Sun": {select:false,time:""},
						  "Mon": {select:false,time:""},
							"Tue": {select:false,time:""},
							"Wed": {select:false,time:""},
							"Thu": {select:false,time:""},
							"Fri": {select:false,time:""},
							"Sat": {select:false,time:""}
					 };
					 console.log(selected);
					 return (
						 <div className="row" style={{ margin: "20px"}}>
							 {days.map( ( d, id )=>{
							return (
								<div className="col-sm-6" key={id}>
								<div className="col-sm-2">
									<button
										className = "week-selector"
										style = {{
											"borderRadius": "50%",
											"border": "1px solid #4CAF50",
											"height": "35px",
											"width": "35px",
											"backgroundColor": selected[d] && selected[d].select?'#4CAF50':"#fefefe",
											"color": selected[d] && selected[d].select?"#ffffff":"#4CAF50",
											"textAlign": "center",
											'marginTop': '20px',
    									'marginLeft': '13px',
										}}
										onClick={
											( ) => {
												if ( d == 'M-F' ) {
													selected[d].select = !selected[d].select;
													if(!selected[d].select){
														selected[d].time = "";
													}
													for ( let i in weekDays ){
														let day = weekDays[i];
														if ( selected[ day ] != null ) {
															selected[day].select = selected[d].select;
															if(!selected[day].select){
																selected[day].time = "";
															}
														}
													}
												} else {
													if( selected['M-F'].select ) {
														selected['M-F'].select = false;
														selected['M-F'].time = "";
													}
													if ( selected[d] != null ) {
														selected[d].select = !selected[d].select;
														if(!selected[d].select){
															selected[d].time = "";
														}
													}
												}
												props.onChange(selected);
											}}
											>
										<b>{d.toUpperCase()}</b>
									</button>
									</div>
									<div className="col-sm-10">
										<StartEndTimePicker onChange={
												( time ) => {
													if ( d == 'M-F' ) {
														selected[d].select = true;
														selected[d].time = time;
														for ( let i in weekDays ){
															let day = weekDays[i];
															if ( selected[ day ] != null ) {
																selected[day].select = selected[d].select;
																selected[day].time = selected[d].time;
															}
														}
													} else {
														selected[d].select = true;
														selected[d].time = time;
													}
													props.onChange(selected);
												}
											} value={selected[d] ? selected[d].time : ""} placeholder={"Time of availability"}/>
									</div>
								</div>
								)
							 })}
						 </div>
					 );
				 },
				 condition(item){
					 return _.contains( [  "Days", "Hours"], item.unit);
				 }
			 },
			//  year:{
			// 	 label: 'Number of Year(s)',
			// 	 size:6,
			// 	 input: Select,
			// 	 options:{
			// 		 items:[
			// 			 "1", "2", "3", "4",
			// 		 ]
			// 	 },
			// 	 condition(item){
			// 		 return item.unit == "Years";
			// 	 }
			//  },
			 month:{
				 label: 'Booking increment',
				 size:6,
				 input: Select,
				 options(item){
					 let items = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
					 items = items.map((m)=>{
						 return m +" "+ item.unit
					 });
				 return({items:items,})
				 },
				 condition(item){
					 return item.unit == "Months";
				 }
			 },
			 week:{
				 label: 'Booking increment',
				 size:6,
				 input: Select,
				 options(item){
					 let items = ["1", "2", "3", "4"]
					 items = items.map((m)=>{
						 return m +" "+ item.unit
					 });
				 return({items:items,})
				 },
				 condition(item){
					 return item.unit == "Weeks";
				 }
			 },
			 areaType:{
				 label: 'Area Type',
				 size:12,
				 input: Select,
				 options:{
					 items:[
						 "Commercial",
						 "Retail",
						 "Industrial",
						 "Other"
					 ]
				 },
				 condition(item){
					 return item.type === "Leasable" || item.type === "Standard";
				 }
			 },
			 "minimumAllowablePeriod":{
				 label: 'Minimum allowable period',
				 size:6,
				 input(props){
					 return(
						 	<div className="row">
								<div className="col-xs-10">
									<Text {...props}/>
								</div>
								<div className="col-xs-2" style={{marginTop: "7%"}}>
									<span>{props.item.unit}</span>
								</div>
							</div>
					 )
				 },
				 condition(item){
					 return item.type === "Bookable";
				 }
			 },
			 "maximumAllowablePeriod":{
				 label: 'Maximum allowable period',
				 size:6,
				 input(props){
					 return(
						 	<div className="row">
								<div className="col-xs-10">
									<Text {...props}/>
								</div>
								<div className="col-xs-2" style={{marginTop: "7%"}}>
									<span>{props.item.unit}</span>
								</div>
							</div>
					 )
				 },
				 condition(item){
					 return item.type === "Bookable";
				 }
			 },
			 "cost":{
				 label: 'Cost per unit',
				 size:6,
				 input: Currency,
				 condition(item){
					 return item.type === "Bookable";;
				 }
			 },
			 nla:{
				 label: 'Net Lettable Area',
				 size:6,
				 input: Text,
				 condition(item){
					 return item.type === "Leasable" || item.type === "Standard" ;
				 }
			 },
			 areaUnit:{
				 label: 'Net Lettable Area in',
				 size:6,
				 input: Select,
				 defaultValue: "m",
				 options(item){
					 item.areaUnit = item.areaUnit ?item.areaUnit:"m"
					 return ({
						 view: props => <span>{props.item}<sup>2</sup></span>,
						 items:[
							 "m",
							 "ft",
						 ],
						 afterChange( item ) {
							 if ( item.areaUnit == 'm' && item.areaUnit != initiallUnit) {
								 initiallUnit = item.areaUnit;
								 item.nla = Math.round(parseInt(item.nla) * 0.09290 ).toString();
							 }
							 if ( item.areaUnit == 'ft' && item.areaUnit != initiallUnit) {
								 initiallUnit = item.areaUnit;
								 item.nla = Math.round(parseInt(item.nla) * 10.7639 ).toString();
							 }
						 },
					 });
				 },
				 condition(item){
					 return item.type === "Leasable" || item.type === "Standard";
				 }
			 },
			 areaDescription:{
				 label: "Area description",
				 size: 12,
				 input: Text,
			 }
		 },
	 },

	 serviceDetails:{
		 label: "Area information",
		 type: "object",
		 subschema: {
			 baseBuilding:{
				 label: "Base Building",
				 type: 'boolean',
				 size:6,
				 input: Switch,
				 options:{
					 afterChange(item){
						 item.tenant = !item.baseBuilding;
					 }
				 }
			 },
			 tenant:{
				 label: "Tenancy",
				 type: "boolean",
				 size:6,
				 input: Switch,
				 options:{
					 afterChange(item){
						 item.baseBuilding = !item.tenant;
					 }
				 }
			 },
			 glAccount:{
				 label: "GL Account",
				 type: "string",
				 input: Select,
				 options( item ){
					 return {
						 items:[ "Not applicable" ],
					 }
				 },
				 condition(itm){
					 item = itm
					 return true;
				 }
			 },
			 cfy: {
				 size: 1,
				 input( props ){
					 let month = parseInt(moment().format("M"));
					 return (
						 <div style={item.glAccount !== "Not applicable"?{}:{ paddingTop: "3px", marginTop:'100%' }}>
							 <span style={{paddingLeft:"0px"}}>FY{props.cfy?props.cfy:( month > 6 ? parseInt(moment().format("YY"))+1 :moment().format("YY") )}</span>
						 </div>
					 )
				 }
			 },
			 budget:{
				 label:"Enter budget",
				 size: 11,
				 input( props ){
					 return(
						 item.glAccount == "Not applicable"?
						 	 <Currency { ...props }/>:
						 <div style={{marginLeft:"-7px"}}>
							 Budget: <span>${props.value!=""?props.value:0 }</span>
						 </div>
					 )
				 }
			 },
			 workOrder:{
				 label: "WO#",
				 type: "boolean",
				 size: 6,
				 input: Switch,
				 options:{
					 afterChange(item){
						 item.purchaseOrder = !item.workOrder;
					 }
				 }
			 },
			 purchaseOrder:{
				 label: "PO#",
				 type: 'boolean',
				 size: 6,
				 input: Switch,
				 options:{
					 afterChange(item){
						 item.workOrder = !item.purchaseOrder
					 }
				 }
			 },
			 assetTrackig:{
				 label: "Asset tracking",
				 type: 'boolean',
				 size: 6,
				 input: Switch,
				 condition(item){
					 return item.purchaseOrder;
				 }
			 }
		 }
	 },
}

export default FacilitySchema;
