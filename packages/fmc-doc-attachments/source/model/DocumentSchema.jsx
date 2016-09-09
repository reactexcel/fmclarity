import FileExplorer from '../views/FileExplorer.jsx';

import { Text, TextArea, Select, DateInput } from 'meteor/fmc:material-inputs';

export default DocumentSchema = {
    name: {
        label: "Name",
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
        input: TextArea
    },
    documentNumber: {
        label: "Document #",
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
        condition: function( item ) {
            return [ 'Lease' ].indexOf( item.type ) > -1;
        },
        size: 6
    },
    landlord: {
        condition: function( item ) {
            return [ 'Lease' ].indexOf( item.type ) > -1;
        },
        size: 6
    },
    commencingRent: {
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
        condition: function( item ) {
            return [ 'Lease' ].indexOf( item.type ) > -1;
        },
        size: 6,
        label: "Review method"
    },
    reviewAmount: {
        condition: function( item ) {
            return [ 'Lease' ].indexOf( item.type ) > -1;
        },
        size: 6,
        label: "Review amount"
    },
    options: {
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
