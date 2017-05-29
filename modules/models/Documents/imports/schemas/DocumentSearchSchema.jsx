import { Text, TextArea, Select, DateInput, Currency, Switch } from '/modules/ui/MaterialInputs';
import { Facilities, FacilityListTile } from '/modules/models/Facilities';
import DocTypes from './DocTypes.jsx';
import React from 'react';

function updateQuery( query, value, fieldName ){
    if ( !query.$and.length) {
        query.$and.push( { [fieldName]: value } );
    } else {
        for ( var i in query.$and ) {
            if ( query.$and[i][fieldName] ) {
                if( !value ){
                    query.$and.splice(i,1);
                } else {
                    query.$and[i][fieldName] = value;
                }
                break;
            }
            if ( i == query.$and.length-1 && !query.$and[i][fieldName]){
                query.$and.push( { [fieldName]: value } );
            }
        }
    }
}

const issueDateConditionList = [
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
    "Procedure",
    "Quote",
    "Register",
    "Registration",
    "Service Report",
    "SWMS",
];

const expiryDateConditionList = [
    'Bank Guarantee',
    'Contract',
    'Emergency Management',
    'Insurance',
    'Lease',
    'Quote',
    'Register',
    'Registration'
];


DocumentSearchSchema = {
    'facility':{
        label: "Select facility",
        input(props){
            return(
                <Select
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    fieldName={props.fieldName}
                    value={props.value}
                    onChange={props.onChange}
                    />
            )
        },
        size: 4,
        options( item ) {
            let team = Session.getSelectedTeam();
            return {
                items:  team ? team.getFacilities( { 'team._id': team._id } ) : null,
                view: FacilityListTile,
                afterChange( item ) {
                    if ( !item.facility ) {
                        item.query = _.omit(item.query, "facility._id");
                        item.query = _.omit(item.query, "team._id");
                    } else {
                        item.query["facility._id"] = item.facility._id;
                    }
                }
            }
        },
    },
    'name': {
        label: "Name",
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
        size: 4,
        defaultValue: "",
    },
    type:{
        label: "Document type",
        input(props){
            return(
                <Select
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        },
        size: 4,
        options:{
            items: DocTypes,
        }
    },
    insuranceType: {
        label: "Insurance type",
        size: 4,
        input(props){
            return(
                <Select
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        },
		options: {
			items:[
				'Public Liablity',
				'Professional Indemnity',
				'Worker\'s Compensation',
				'Other',
			],
		},
		condition: "Insurance",
	},
    issueDateFrom:{
        label:'Issue date from',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: value, $lte: props.item.issueDateTo || new Date() }, 'issueDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: issueDateConditionList,
    },
    issueDateTo:{
        label:'Issue date to',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: props.item.issueDateFrom || new Date(), $lte: value }, 'issueDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: issueDateConditionList,
    },
    expiryDateFrom:{
        label:'Expiry date from',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: value, $lte: props.item.expiryDateTo || new Date() }, 'expiryDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: expiryDateConditionList,
    },
    expiryDateTo:{
        label:'Expiry date to',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: props.item.expiryDateFrom || new Date(), $lte: value }, 'expiryDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: expiryDateConditionList,
    },
    documentNumber: {
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		label: "Document #",
		optional: true,
		type: "string",
		size: 4,
		condition: [
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
		],
	},
	gst: {
		iinput( props ){
            return (
                <Currency
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		optional: true,
		label: "GST",
		size: 4,
		condition: [
			"Quote",
			"Invoice",
		],
	},
	totalValue: {
        input( props ){
            return (
                <Currency
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		label: "Total value",
		type: "number",
		optional: true,
		size: 4,
		condition: [
			"Bank Guarantee",
			"Insurance",
			"Invoice",
			"Quote",
		],

	},
	subjectAddress: {
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		type: "string",
		label: "Subject Address",
		optional: true,
        size: 4,
		condition: [
			"Bank Guarantee",
			"Contract",
			"Lease"
		],
	},
	currentYear: {
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		label: "Current year value",
		optional: true,
		size: 4,
		condition: [
			"Budget",
			"Contract",
			"Lease",
		],

	},
	'currentYear+1': {
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		label: "Current year +1 value",
		optional: true,
		size: 4,
		condition: [
			"Budget",
			"Contract",
			"Lease",
		],

	},
	'currentYear+2': {
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		label: "Current year +2 value",
		optional: true,
		size: 4,
		condition: [
			"Budget",
			"Contract",
			"Lease",
		],
	},
	serviceType: {
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		label: "Service type",
		optional: true,
		size: 4,
		condition: [
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
		],
	},
	issuer: {
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		label: "Insurer",
		optional: true,
		size: 4,
		condition: [
			"Bank Guarantee",
			"Insurance",
		],
	},
    applicablePeriodStartDateFrom:{
        label:'Applicable period start from',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: value, $lte: props.item.applicablePeriodStartDateTo || new Date() }, 'applicablePeriodStartDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [
			"Audit",
			"Budget",
			"Emergency Management",
			"House Rules",
			"Inspection",
			"Invoice",
			"Register",
			"Service Report",
		],
    },
    applicablePeriodStartDateTo:{
        label:'Applicable period start to',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: props.item.applicablePeriodStartDateFrom || new Date(), $lte: value }, 'applicablePeriodStartDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [
			"Audit",
			"Budget",
			"Emergency Management",
			"House Rules",
			"Inspection",
			"Invoice",
			"Register",
			"Service Report",
		],
    },
    applicablePeriodEndDateFrom:{
        label:'Applicable period end from',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: value, $lte: props.item.applicablePeriodEndDateTo || new Date() }, 'applicablePeriodEndDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [
			"Audit",
			"Budget",
			"Emergency Management",
			"House Rules",
			"Inspection",
			"Invoice",
			"Register",
			"Service Report",
		],
    },
    applicablePeriodEndDateTo:{
        label:'Applicable period end to',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: props.item.applicablePeriodEndDateFrom || new Date(), $lte: value }, 'applicablePeriodEndDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [
			"Audit",
			"Budget",
			"Emergency Management",
			"House Rules",
			"Inspection",
			"Invoice",
			"Register",
			"Service Report",
		],
    },
    tenantExecutedDateFrom:{
        label:'Date tenant executed from',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: value, $lte: props.item.tenantExecutedDateTo || new Date() }, 'tenantExecutedDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Lease' ],
    },
    tenantExecutedDateTo:{
        label:'Date tenant executed to',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: props.item.tenantExecutedDateFrom || new Date(), $lte: value }, 'tenantExecutedDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Lease' ],
    },
	lessorExecutedDateFrom:{
        label:'Date lessor executed from',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: value, $lte: props.item.lessorExecutedDateTo || new Date() }, 'lessorExecutedDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Lease' ],
    },
    lessorExecutedDateTo:{
        label:'Date tenant executed to',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: lessorExecutedDateFrom || new Date(), $lte: value }, 'lessorExecutedDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Lease' ],
    },
	tenant: {
        label: "Tenant",
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		optional: true,
		condition: [ 'Lease' ],
		size: 4
	},
	landlord: {
        label: "Landlord",
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		optional: true,
		condition: [ 'Lease' ],
		size: 4
	},
	commencingRent: {
        input( props ){
            return (
                <Currency
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		condition: [ 'Lease' ],
		size: 4,
		optional: true,
		label: "Commencing term rent pa (ex GST)"
	},
	commencementDateFrom:{
        label:'Commencement from',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: value, $lte: props.item.commencementDateTo || new Date() }, 'commencementDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [
			'Contract',
			'Insurance',
			'Lease',
			'Registration'
		],
    },
    commencementDateTo:{
        label:'Commencement to',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: commencementDateFrom || new Date(), $lte: value }, 'commencementDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [
			'Contract',
			'Insurance',
			'Lease',
			'Registration'
		],
    },
    clientExecutedDateFrom:{
        label:'Date client executed from',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: value, $lte: props.item.clientExecutedDateTo || new Date() }, 'clientExecutedDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Contract' ],
    },
    clientExecutedDateTo:{
        label:'Date client executed to',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: clientExecutedDateFrom || new Date(), $lte: value }, 'clientExecutedDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Contract' ],
    },
	supplierExecutedDateFrom:{
        label:'Date supplier executed from',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: value, $lte: props.item.supplierExecutedDateTo || new Date() }, 'supplierExecutedDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Contract' ],
    },
    supplierExecutedDateTo:{
        label:'Date supplier executed to',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: supplierExecutedDateFrom || new Date(), $lte: value }, 'supplierExecutedDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Contract' ],
    },
	annualReviewFrom:{
        label:'Annual review from',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: value, $lte: props.item.annualReviewTo || new Date() }, 'annualReview');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Lease' ],
    },
    annualReviewTo:{
        label:'Annual review to',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: annualReviewFrom || new Date(), $lte: value }, 'annualReview');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Lease' ],
    },
	reviewMethod: {
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		condition: [ 'Lease' ],
		size: 4,
		optional: true,
		label: "Review method"
	},
	reviewAmount: {
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		condition: [ 'Lease' ],
		size: 4,
		optional: true,
		label: "Review amount",
		// options: {
		// 	input: Text,
		// 	optional: true,
		// 	condition: [ 'Lease' ],
		// 	size: 4
		// },
	},
    optionExerciseFromDateFrom:{
        label:'Option exercise from date from',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: value, $lte: props.item.optionExerciseFromDateTo || new Date() }, 'optionExerciseFromDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Lease' ],
    },
    optionExerciseFromDateTo:{
        label:'Option exercise from date to',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: props.item.optionExerciseFromDateFrom || new Date(), $lte: value }, 'optionExerciseFromDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Lease' ],
    },
    optionExerciseToDateFrom:{
        label:'Option exercise to date from',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: value, $lte: props.item.optionExerciseToDateTo || new Date() }, 'optionExerciseToDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Lease' ],
    },
    optionExerciseToDateTo:{
        label:'Option exercise to date to',
        size: 2,
        type: 'date',
        input(props){
            return(
                <DateInput
                    placeholder={props.placeholder}
                    items={props.items}
                    item={props.item}
                    view={props.view}
                    value={props.value}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, { $gte: props.item.optionExerciseToDateFrom || new Date(), $lte: value }, 'optionExerciseToDate');
                        props.onChange(value || new Date());
                    }}
                    />
            )
        },
        condition: [ 'Lease' ],
    },


	area: {
        input( props ){
            return (
                <Text
                    placeholder={props.placeholder}
                    item={props.item}
                    value={props.value}
                    model={props.model}
                    fieldName={props.fieldName}
                    onChange={( value ) => {
                        updateQuery( props.item.query, value, props.fieldName);
                        props.onChange(value);
                    }}
                    />
            )
        } ,
		condition: [ 'Lease' ],
		size: 4,
		optional: true,
		label: "Area (m2)"
	},
}
