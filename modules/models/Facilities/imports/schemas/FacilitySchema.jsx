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

/**
 * @memberOf 		module:models/Facilities
 */
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
        /*relation:
        {
            type: ORM.HasMembers,
            source: "Files",
            key: "team._id"
        },*/
        input: DocExplorer
    },


	//}

	areaDeatails: 	{
		label: "Area information",
		type: "object",
		subschema: {
			 bookable:{
				 label: 'Bookable',
				 size: 6,
				 input: Switch,
				 type: "boolean",
				 defaultValue: true,
				 options:{
					 afterChange( item ) {
						 item.leasable = false;
					 }
				 }
			 },
			 leasable:{
				 label: 'Leasable',
				 size: 6,
				 type: "boolean",
				 input: Switch,
				 options:{
					 afterChange( item ) {
						 item.bookable = false;
					 }
				 }
			 },
			 tenant:{
				 label: "Select tenant or resident",
				 input: Select,
				 options: ( item ) => {
					 let facility = Session.getSelectedFacility(),
					 members = facility.getMembers({role: {$in: ["tenant","resident"] } });
					 return (
						 {
							 items: members ? members : null,
							 view: ContactCard,
						 }
					 );
				 },
				 condition( item ){
					 return item.leasable;
				 }
			 },
			 "unit":{
				 label: 'Unit',
				 type: 'string',
				 size:12,
				 input: Select,
				 options:{
					 items:[
						 "Years",
						 "Months",
						 "Weeks",
						 "Days",
						 "Hours",
					 ]
				 }
			 },
			 week:{
				 labe: "Week days",
				 type: "object",
				 input( props ) {
					 console.log(props.value);
					 let days = [ "Sun", "Mon", "Thu", "Wed", "Thr", "Fri", "Sat" ];
					 let selected = props.value || {};
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
												if ( selected[d] != null ) {
													selected[d].select = !selected[d].select;
													if(!selected[d].select){
														selected[d].time = "";
													}
												}
												if ( selected[d] == null ) {
													selected[d] = {};
													selected[d].select = true;
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
													if ( selected[d] == null ) {
														selected[d] = {};
														selected[d].select = true;
														selected[d].time = time;
													} else {
														selected[d].select = true;
														selected[d].time = time;
													}
													props.onChange(selected);
												}
											} value={selected[d] ? selected[d].time : ""} placeholder={"Time of avaliability"}/>
									</div>
								</div>
								)
							 })}
						 </div>
					 );
				 },
				 condition(item){
					 return item.unit == "Weeks";
				 }
			 },
			 year:{
				 label: 'Number of Year(s)',
				 size:6,
				 input: Select,
				 options:{
					 items:[
						 "1", "2", "3", "4",
					 ]
				 },
				 condition(item){
					 return item.unit == "Years";
				 }
			 },
			 month:{
				 label: 'Number of Month(s)',
				 size:6,
				 input: Select,
				 options:{
					 items:[
						 "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
					 ]
				 },
				 condition(item){
					 return item.unit == "Months";
				 }
			 },
			 day:{
				 label: 'Number of day(s)',
				 size:6,
				 input: Select,
				 options:{
					 items:[
						 "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
						"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
						"21", "22", "23", "24", "25", "26", "27", "28", "29",
					 ]
				 },
				 condition(item){
					 return item.unit == "Days";
				 }
			 },
			 hour:{
				 label: 'Number of Hour(s)',
				 size:6,
				 input: Select,
				 options:{
					 items:[
						 "0.25", "0.5", "0.75", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
						"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
						"21", "22", "23",
					 ]
				 },
				 condition(item){
					 return item.unit == "Hours";
				 }
			 },
			 "minimumAllowablePeriod":{
				 label: 'Minimum allowable period',
				 size:6,
				 input: Text
			 },
			 "maximumAllowablePeriod":{
				 label: 'Maximum allowable period',
				 size:6,
				 input: Text
			 },
			 "cost":{
				 label: 'Cost per unit',
				 size:6,
				 input: Currency
			 },
	},
 }
}

export default FacilitySchema;
