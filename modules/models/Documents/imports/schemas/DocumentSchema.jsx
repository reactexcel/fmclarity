import { FileExplorer } from '/modules/models/Files';
import DocTypes from './DocTypes.jsx';

import { Text, TextArea, Select, DateInput, Currency, Switch } from '/modules/ui/MaterialInputs';
import { Facilities, FacilityListTile } from '/modules/models/Facilities';
import { Teams } from '/modules/models/Teams';
import { Requests } from '/modules/models/Requests';

import { ContactCard } from '/modules/mixins/Members';

import React from 'react';

const defaultContactRole = 'supplier manager';
let onServiceChange = null;
export default DocumentSchema = {

	name: {
		label: "Document name",
		type: "string",
		input: Text,
		size: 6,
	},

	type: {
		label: "Document type",
		size: 6,
		type: "string",
		input: Select,
		options: {
			items: DocTypes
		}
	},
	description: {
		label: "Description",
		optional: true,
		type: "string",
		input: TextArea
	},
	comment: {
		label: "Comment",
		optional: true,
		type: "string",
		input: TextArea
	},

	documentNumber: {
		input: Text,
		label: "Document #",
		optional: true,
		type: "string",
		size: 6,
		condition: function( item ) {
			return [
				"Contract",
				"Emergency Management",
				"House Rules",
				"Insurance",
				"Invoice",
				"MSDS",
				"Plan",
				"Management Plan",
				"Assessment",
			    "Confirmation",
			    "Certificate",
			    "Log",
				"Procedure",
				"Quote",
				"Register",
				"Registration",
				"Service Report",
			].indexOf( item.type ) > -1;
		},
	},


	facility: {

		label: "Facility",
		optional: true,
		description: "The site for this job",
		type: "object",
		size: 12,
		input: Select,
		defaultValue: ( item ) =>{
				return Session.getSelectedFacility();
		},
		options: ( item ) => {
			//console.log( item );
			let team = Session.getSelectedTeam();
			return {
				items: ( team && team.getFacilities ? team.getFacilities() : null ),
				view: FacilityListTile
			}
		},
	},

	request: {
		input: Select,
		label: "Work order",
		optional: true,
		description: "Document is related to request",
		type: "object",

		options: ( item ) => {
			if ( item.facility ) {
				let request = Requests.find( { "facility._id": item.facility._id } ).fetch();
				return {
					items: ( request.length ? request : null ),
					view: ContactCard
				}
			} else {
				return {
					items: ( null ),
				}
			}
		},
	},

	gst: {
		input: Currency,
		optional: true,
		label: "GST",
		size: 6,
		condition: function( item ) {
			return [
				"Quote",
				"Invoice",
			].indexOf( item.type ) > -1;
		},
	},
	totalValue: {
		input: Currency,
		label: "Total value",
		type: "number",
		optional: true,
		size: 6,
		condition: function( item ) {
			return [
				"Bank Guarantee",
				"Insurance",
				"Invoice",
				"Quote",
			].indexOf( item.type ) > -1;
		},

	},
	subjectAddress: {
		input: Text,
		type: "string",
		label: "Subject Address",
		optional: true,
		condition: function( item ) {
			return [
				"Bank Guarantee",
				"Contract",
				"Lease"
			].indexOf( item.type ) > -1;
		},
	},
	currentYear: {
		input: Text,
		label: "Current year value",
		optional: true,
		size: 6,
		condition: function( item ) {
			return [
				"Budget",
				"Contract",
				"Lease",
			].indexOf( item.type ) > -1;
		},

	},
	'currentYear+1': {
		input: Text,
		label: "Current year +1 value",
		optional: true,
		size: 6,
		condition: function( item ) {
			return [
				"Budget",
				"Contract",
				"Lease",
			].indexOf( item.type ) > -1;
		},

	},
	'currentYear+2': {
		input: Text,
		label: "Current year +2 value",
		optional: true,
		size: 6,
		condition: function( item ) {
			return [
				"Budget",
				"Contract",
				"Lease",
			].indexOf( item.type ) > -1;
		},

	},
	serviceType: {
		input:( props ) => {
				return <Select {...props}
								onChange={( value ) => {
										props.onChange(value);
								}}/>
		},
		label: "Service type",
		optional: true,
		type: "object",
		size: 6,
		condition: function( item ) {
			return [
				"Audit",
				"Contract",
				"Inspection",
				"Invoice",
				"MSDS",
				"Plan",
				"Management Plan",
				"Assessment",
			    "Confirmation",
			    "Certificate",
			    "Log",
				"Procedure",
				"Quote",
				"Register",
				"Registration",
				"Service Report",
				"SWMS",
			].indexOf( item.type ) > -1;
		},
		options: function( item ) {
			let selectedTeam = Session.getSelectedTeam(),
				teamType = null,
				items = null;
			if ( selectedTeam ) {
				teamType = selectedTeam.type;
			}

			if ( teamType == 'fm' && item.facility ) {
				items = item.facility.servicesRequired;
			} else if ( teamType == 'contractor' && team.getAvailableServices ) {
				items = team.getAvailableServices();
			}

			return {
				items: items,
				afterChange: ( doc ) => {
					doc.subServiceType = null;
				},
				afterChange: ( doc ) => {
                        if ( doc == null || Teams.isServiceTeam( selectedTeam ) ) {
                            return;
                        }
                        doc.supplier = null;
                        doc.subServiceType = null;
                        if ( doc.serviceType.data ) {
                            let supplier = doc.serviceType.data.supplier,
                                defaultSupplier = null;

                            if ( supplier ) {
                                if ( supplier._id ) {
                                    defaultSupplier = Teams.findOne( supplier._id );
                                }
                                if ( !defaultSupplier && supplier.name ) {
                                    defaultSupplier = Teams.findOne( { name: supplier.name } );
                                }
                                doc.supplier = defaultSupplier;
                                if( doc.supplier && onServiceChange ) {
                                    onServiceChange( doc.supplier );
                                }
                                if ( doc.serviceType.data.defaultContact && doc.serviceType.data.defaultContact.length ) {
                                    doc.supplierContacts = doc.serviceType.data.defaultContact;
                                } else if ( Teams.isFacilityTeam( defaultSupplier ) ) {
                                    doc.supplierContacts = defaultSupplier.getMembers( { role: 'portfolio manager' } );
                                } else {
                                    doc.supplierContacts = defaultSupplier.getMembers( { role: 'manager' } );
                                }
                            } else {
                                doc.supplier = null;
                                doc.subServiceType = null;
                            }
                        }
                    },
			}
		}
	},
	subServiceType: {
		input:( props ) => {
				return <Select {...props}
								onChange={( value ) => {
								//		props.serviceType.children = {};
										props.onChange(value);
								}}/>
		},
		label: "Sub Service type",
		optional: true,
		type: "object",
		size: 6,
		condition: function( item ) {
			if(item && item.serviceType){
				if(item.serviceType.children && item.serviceType.children.length > 0){
					return true
				}else{
					return false
				}
			}
		},
		options: function( item ) {
			let items ;
			if(item && item.serviceType){
				if(item.serviceType.children && item.serviceType.children.length > 0){
					items = item.serviceType.children
				}else{
					items = null;
				}
			}
			return {
				items: items
			}
		}
	},
	
	supplier: {
		input: Select,
		label: "Supplier",
		type: "object",
		optional: true,
		size: 6,
		condition: function( item ) {
			return [
				// "Audit",
				"Contract",
				/*"Emergency Management",
				"Induction",
				"Inspection",
				"Insurance",
				"Invoice",
				"MSDS",
				"Quote",
				"Register",
				"Registration",
				"Service Report",
				"SWMS",*/
			].indexOf( item.type ) > -1 && item.serviceType;
		},
		options: ( item ) => {
                let facility = null,
                    supplier = null,
                    role = Meteor.user().getRole();

                if ( item.facility && item.facility._id ) {
                    facility = Facilities.findOne( item.facility._id );
                    /*if( facility ) {
                        console.log( facility.getSuppliers() );
                    }*/
                }

                return {
                    items: facility && facility.getSuppliers ? facility.getSuppliers() : null,
                    view: ContactCard,
                    addNew: {
                        //Add new supplier to document and selected facility.
                        show: !_.contains( [ 'staff', 'resident', 'tenant' ], Meteor.user().getRole() ), //Meteor.user().getRole() != 'staff',
                        label: "Create New",
                        onAddNewItem: ( callback ) => {
                            import { TeamStepper } from '/modules/models/Teams';
                            Modal.show( {
                                content: <TeamStepper item = { supplier }
                                facility = { facility }
                                onChange = {
                                    ( supplier ) => {
                                        facility.addSupplier( supplier );
                                        callback( supplier );
                                    }
                                }
                                />
                            } )
                        }
                    }
                }
            },
	},
	
	issuer: {
		input: Text,
		label: "Insurer",
		optional: true,
		size: 6,
		condition: function( item ) {
			return [
				"Bank Guarantee",
				"Insurance",
			].indexOf( item.type ) > -1;
		},
	},
	insuranceType: {
		input: Select,
		label: "Insurance type",
		optional: true,
		options: {
			items:[
				'Public Liablity',
				'Professional Indemnity',
				'Worker\'s Compensation',
				'Other',
			],
		},
		size: 6,
		condition: function( item ) {
			return [
				"Insurance",
			].indexOf( item.type ) > -1;
		},
	},
	reportType: {
		input: Select,
		label: "Report type",
		optional: true,
		options: {
			items:[
				'Validation Report',
			],
		},
		size: 6,
		condition: function( item ) {
			return [
				"Report",
			].indexOf( item.type ) > -1;
		},
	},
	confirmationType: {
		input: Select,
		label: "Confirmation type",
		optional: true,
		options: {
			items:[
				'Bunding',
				'Manifest',
				'Signage',
				'Spill bins',
			],
		},
		size: 6,
		condition: function( item ) {
			return [
				"Confirmation",
			].indexOf( item.type ) > -1;
		},
	},
	logType:{
		input: Select,
		label: "Log type",
		optional: true,
		options: {
			items:[
				'Warden training',
				'Chief Warden training',
			],
		},
		size: 6,
		condition: function( item ) {
			return [
				"Log",
			].indexOf( item.type ) > -1;
		},
	},
	certificateType:{
		input: Select,
		label: "Certificate type",
		optional: true,
		options: {
			items:[
				'Certificate of Occupancy',
			],
		},
		size: 6,
		condition: function( item ) {
			return [
				"Certificate",
			].indexOf( item.type ) > -1;
		},
	},
	registerType:{
		input: Select,
		label: "Register type",
		optional: true,
		options: {
			items:[
				'Incident register',
			],
		},
		size: 6,
		condition: function( item ) {
			return [
				"Register",
			].indexOf( item.type ) > -1;
		},
	},
	registrationType:{
		input: Select,
		label: "Registration type",
		optional: true,
		options: {
			items:[
				'Testing & Tagging certificate',
			],
		},
		size: 6,
		condition: function( item ) {
			return [
				"Registration",
			].indexOf( item.type ) > -1;
		},
	},
	procedureType:{
		input: Select,
		label: "Procedure type",
		optional: true,
		options: {
			items:[
				'Restricted access',
			],
		},
		size: 6,
		condition: function( item ) {
			return [
				"Procedure",
			].indexOf( item.type ) > -1;
		},
	},
	applicablePeriodStartDate: {
		type: "date",
		condition: function( item ) {
			return [
				"Audit",
				"Budget",
				"Emergency Management",
				"House Rules",
				"Inspection",
				"Invoice",
				"Register",
				"Service Report",
			].indexOf( item.type ) > -1;
		},
		defaultValue: function( item ) {
			return new Date();
		},
		label: "Applicable period start",
		optional: true,
		size: 6,
		input: DateInput,
	},
	applicablePeriodEndDate: {
		type: "date",
		condition: function( item ) {
			return [
				"Audit",
				"Budget",
				"Emergency Management",
				"House Rules",
				"Inspection",
				"Invoice",
				"Register",
				"Service Report",
			].indexOf( item.type ) > -1;
		},
		defaultValue: function( item ) {
			return new Date();
		},
		label: "Applicable period end",
		optional: true,
		size: 6,
		input: DateInput,
	},
	tenantExecutedDate: {
		type: "date",
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		defaultValue: function( item ) {
			return new Date();
		},
		label: "Date tenant executed",
		optional: true,
		size: 6,
		input: DateInput
	},
	lessorExecutedDate: {
		type: "date",
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		defaultValue: function( item ) {
			return new Date();
		},
		label: "Date lessor executed",
		optional: true,
		size: 6,
		input: DateInput,
	},
	tenant: {
		input: Text,
		optional: true,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6
	},
	landlord: {
		input: Text,
		optional: true,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6
	},
	commencingRent: {
		input: Currency,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6,
		optional: true,
		label: "Commencing term rent pa (ex GST)"
	},
	commencementDate: {
		type: "date",
		condition: function( item ) {
			return [
				'Contract',
				'Insurance',
				'Lease',
				'Registration'
			].indexOf( item.type ) > -1;
		},
		defaultValue: function( item ) {
			return new Date();
		},
		label: "Commencement",
		optional: true,
		size: 6,
		input: DateInput,
	},
	expiryDate: {
		type: "date",
		condition: function( item ) {
			return [
				'Bank Guarantee',
				'Contract',
				'Emergency Management',
				'Insurance',
				'Lease',
				'Quote',
				'Register',
				'Registration'
			].indexOf( item.type ) > -1;
		},
		defaultValue: function( item ) {
			return new Date();
		},
		label: "Expiry",
		optional: true,
		size: 6,
		input: DateInput,
	},
	issueDate: {
		type: "date",
		condition: function( item ) {
			return [
				"Audit",
				"Bank Guarantee",
				"Emergency Management",
				"House Rules",
				"Induction",
				"Inspection",
				"Invoice",
				"Lease",
				"MSDS",
				"Plan",
				"Management Plan",
				"Assessment",
			    "Confirmation",
			    "Certificate",
			    "Log",
				"Procedure",
				"Quote",
				"Register",
				"Registration",
				"Service Report",
				"SWMS",
			].indexOf( item.type ) > -1;
		},
		defaultValue: function( item ) {
			return new Date();
		},
		label: "Issue date",
		optional: true,
		size: 6,
		input: DateInput,
	},
	clientExecutedDate: {
		type: "date",
		condition: function( item ) {
			return [ 'Contract' ].indexOf( item.type ) > -1;
		},
		defaultValue: function( item ) {
			return new Date();
		},
		label: "Date client executed",
		optional: true,
		size: 6,
		input: DateInput
	},
	supplierExecutedDate: {
		type: "date",
		condition: function( item ) {
			return [ 'Contract' ].indexOf( item.type ) > -1;
		},
		defaultValue: function( item ) {
			return new Date();
		},
		label: "Date supplier executed",
		optional: true,
		size: 6,
		input: DateInput,
	},
	annualReview: {
		type: "date",
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		defaultValue: function( item ) {
			return new Date();
		},
		label: "Annual review",
		optional: true,
		size: 6,
		input: DateInput,
	},
	reviewMethod: {
		input: Text,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6,
		optional: true,
		label: "Review method"
	},
	reviewAmount: {
		input: Text,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6,
		optional: true,
		label: "Review amount",
		options: {
			input: Text,
			optional: true,
			condition: function( item ) {
				return [ 'Lease' ].indexOf( item.type ) > -1;
			},
			size: 6
		},
	},
	optionExerciseFromDate: {
		type: "date",
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		defaultValue: function( item ) {
			return new Date();
		},
		label: "Option exercise from date",
		optional: true,
		size: 6,
		input: DateInput,
	},
	optionExerciseToDate: {
		type: "date",
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		defaultValue: function( item ) {
			return new Date();
		},
		label: "Option exercise to date",
		optional: true,
		size: 6,
		input: DateInput,
	},
	area: {
		input: Text,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6,
		optional: true,
		label: "Area (m2)"
	},
	private: {
		label: "Private document",
		description: "Turn switch on/off to make document public/private",
		input: Switch,
		defaultValue: () => false,
		condition: ( item ) =>  {
			return _.contains([ 'facility manager', 'fmc support', "portfolio manager" ], Meteor.user().getRole() );
		},
		size: 12,
		type: "boolean",
	},
	visibleTo:{
		label:'Visible to roles.',
		size: 12,
		type: "array",
		input(props){
			let roles = [
				"staff",
				"tenant",
				"manager",
				"resident",
				"caretaker",
				"property manager",
			];
			props.value = props.value || [];
			return(
				<div className="row">
					<div className="col-sm-12">
						<Select
							placeholder="Select role from the list"
							items={_.filter( roles,  r => props.value.indexOf(r) === -1 )}
							onChange={ ( selected ) => {
								if(props.value.indexOf(selected) < 0 ){
									props.value.push( selected );
									props.onChange(props.value);
								}
							}}/>
						<div style={{marginTop:"15px"}}>
							{props.value.length!=0?<h4>Document will be visible to the following role(s).</h4>:null}
							{_.map(
								props.value,
								( r, i ) => <div
										className={r.length > 13?"col-sm-3":"col-sm-2"}
										key={i}
										style={{
											paddingTop: '4px',
	    								paddingBottom: '4px',
	    								paddingLeft: '15px',
	    								backgroundColor: 'aliceblue',
	    								fontSize: '13px',
	    								fontWeight: '400',
											marginLeft: '5px',
											border: '1px solid transparent',
	    								borderRadius: '13px',
											margin: "2px",
										}}>
											{r}
											<span onClick={() => {
													let role = r;
													let newValue =	_.filter( props.value,  v => v !== role );
													props.onChange(newValue);
												}}
												style={{
													float: 'right',
	    										cursor: 'pointer',
	    										fontSize: '14px',
	    										fontWeight: 'bold',
													marginRight: '10px',
												}} title="Remove tag">&times;</span>
									</div>
							)}
						</div>
					</div>
				</div>
			);
		},
		condition(item){
			return(
				item.private && _.contains([ 'facility manager', 'fmc support', "portfolio manager" ], Meteor.user().getRole() )
			);
		}
	},
	attachments: {
		//type: "array",
		label: "Attachments",
		optional: true,
		input: FileExplorer
	},

}
