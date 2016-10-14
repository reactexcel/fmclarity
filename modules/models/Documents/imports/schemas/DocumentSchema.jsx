import { FileExplorer } from '/modules/models/Files';
import DocTypes from './DocTypes.jsx';

import { Text, TextArea, Select, DateInput } from '/modules/ui/MaterialInputs';
import { Facilities, FacilityListTile } from '/modules/models/Facilities';


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

	facility: {
		label: "Facility",
		description: "The site for this job",
		type: "object",
		size: 6,
		relation: {
			join: ( item ) => {
				if( item.facility && item.facility._id ) {
					return Facilities.findOne( item.facility._id );
				}
			},
			unjoin: ( item ) => {
				if( item.facility && item.facility._id ) {
					return _.pick( item.facility, '_id', 'name' );
				}
			}
		},
		input: Select,

		options: ( item ) => {
			//console.log( item );
			let team = Session.getSelectedTeam();
			return {
				items: ( team ? team.facilities : null ),
				view: FacilityListTile
			}
		},
	},

	description: {
		label: "Description",
        type: "string",
		input: TextArea
	},

	documentNumber: {
		input: Text,
		label: "Document #",
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
				"Procedure",
				"Quote",
				"Register",
				"Registration",
				"Service Report",
			].indexOf( item.type ) > -1;
		},
	},
	gst: {
		input: Text,
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
		input: Text,
		label: "Total value",
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
		label: "Subject Address",
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
		input: Text,
		label: "Service type",
		size: 6,
		condition: function( item ) {
			return [
				"Audit",
				"Contract",
				"Inspection",
				"Invoice",
				"MSDS",
				"Plan",
				"Procedure",
				"Quote",
				"Register",
				"Registration",
				"Service Report",
				"SWMS",
			].indexOf( item.type ) > -1;
		},
	},
	supplier: {
		input: Text,
		label: "Supplier",
		size: 6,
		condition: function( item ) {
			return [
				"Audit",
				"Contract",
				"Emergency Management",
				"Induction",
				"Inspection",
				"Insurance",
				"Invoice",
				"MSDS",
				"Quote",
				"Register",
				"Registration",
				"Service Report",
				"SWMS",
			].indexOf( item.type ) > -1;
		},
	},
	issuer: {
		input: Text,
		label: "Issuer",
		size: 6,
		condition: function( item ) {
			return [
				"Bank Guarantee",
				"Insurance",
			].indexOf( item.type ) > -1;
		},
	},
	insuranceType: {
		input: Text,
		label: "Insurance type",
		size: 6,
		condition: function( item ) {
			return [
				"Insurance",
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
		size: 6,
		input: DateInput,
	},
	tenant: {
		input: Text,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6
	},
	landlord: {
		input: Text,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6
	},
	commencingRent: {
		input: Text,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6,
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
				"Insurance",
				"Invoice",
				"Lease",
				"MSDS",
				"Plan",
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
		size: 6,
		input: DateInput,
	},
	reviewMethod: {
		input: Text,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6,
		label: "Review method"
	},
	reviewAmount: {
		input: Text,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6,
		label: "Review amount"
	},
	options: {
		input: Text,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6
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
		size: 6,
		input: DateInput,
	},
	area: {
		input: Text,
		condition: function( item ) {
			return [ 'Lease' ].indexOf( item.type ) > -1;
		},
		size: 6,
		label: "Area (m2)"
	},

	attachments: {
		type: [ Object ],
		label: "Attachments",
		input: FileExplorer
	},

}
