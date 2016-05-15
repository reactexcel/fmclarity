import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

DocumentSchema = {
	file:{
		type:[Object],
		condition:function(){
			return false;
		}
	},
    name: {
     	label:"Name",
     	input:"mdtext",
		size:6,
    },
	type: {
		label:"Document type",
		size:6,
		type:String,
		input:"MDSelect",
		options:{
			items:[
				"Audit",
                "Bank Guarantee",
				"Budget",
				"Contract",
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
			]
		}
	},
    description: {
     	label:"Description",
     	input:"mdtextarea"
    },
    documentNumber:{
        label:"Document #",
        size:6,
        condition:function(item){
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
            ].indexOf(item.type)>-1;
        },
    },
    gst:{
        label:"GST",
        size:6,
        condition:function(item){
            return [
                "Quote",
                "Invoice",
            ].indexOf(item.type)>-1;
        },
    },
    totalValue:{
        label:"Total value",
        size:6,
        condition:function(item){
            return [
                "Bank Guarantee",
                "Insurance",
                "Invoice",
                "Quote",
            ].indexOf(item.type)>-1;
        },

    },
    currentYear:{
        label:"Current year value",
        size:6,
        condition:function(item){
            return [
                "Budget",
                "Contract",
                "Lease",
            ].indexOf(item.type)>-1;
        },

    },
    'currentYear+1':{
        label:"Current year +1 value",
        size:6,
        condition:function(item){
            return [
                "Budget",
                "Contract",
                "Lease",
            ].indexOf(item.type)>-1;
        },

    },
    'currentYear+2':{
        label:"Current year +2 value",
        size:6,
        condition:function(item){
            return [
                "Budget",
                "Contract",
                "Lease",
            ].indexOf(item.type)>-1;
        },

    },
    serviceType:{
        label:"Service type",
        size:6,
        condition:function(item){
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
            ].indexOf(item.type)>-1;
        },
    },
    supplier:{
        label:"Supplier",
        size:6,
        condition:function(item){
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
            ].indexOf(item.type)>-1;
        },
    },
    issuer:{
        label:"Issuer",
        size:6,
        condition:function(item){
            return [
                "Bank Guarantee",
                "Insurance",
            ].indexOf(item.type)>-1;
        },
    },    
    location:{
        label:"Location",
        condition:function(item){
            return [
                "Bank Guarantee",
                "Contract",
                "Lease"
            ].indexOf(item.type)>-1;
        },
    },    
    'Insurance type':{
        label:"Insurance type",
        size:6,
        condition:function(item){
            return [
                "Insurance",
            ].indexOf(item.type)>-1;
        },
    },    
    applicablePeriodStartDate:{
    	type:Date,
    	condition:function(item){
    		return [
				"Audit",
				"Budget",
				"Emergency Management",
				"House Rules",
				"Inspection",
                "Invoice",
				"Register",
				"Service Report",
    		].indexOf(item.type)>-1;
    	},
    	defaultValue:function(item) {
    		return new Date();
    	},
     	label:"Applicable period start",
        size:6,
        input:"MDDate",
    },
    applicablePeriodEndDate:{
    	type:Date,
    	condition:function(item){
    		return [
                "Audit",
                "Budget",
                "Emergency Management",
                "House Rules",
                "Inspection",
                "Invoice",
                "Register",
                "Service Report",
    		].indexOf(item.type)>-1;
    	},
    	defaultValue:function(item) {
    		return new Date();
    	},
     	label:"Applicable period end",
        size:6,
        input:"MDDate",
    },
    commencementDate:{
    	type:Date,
    	condition:function(item){
    		return ['Contract','Insurance','Lease','Registration'].indexOf(item.type)>-1;
    	},
    	defaultValue:function(item) {
    		return new Date();
    	},
     	label:"Commencement",
        size:6,
        input:"MDDate",
    },
    expiryDate: {
    	type:Date,
    	condition:function(item){
    		return [
                'Bank Guarantee',
                'Contract',
                'Emergency Management',
                'Insurance',
                'Lease',
                'Quote',
                'Register',
                'Registration'
            ].indexOf(item.type)>-1;
    	},
    	defaultValue:function(item) {
    		return new Date();
    	},
     	label:"Expiry",
        size:6,
        input:"MDDate",
    },
    issueDate:{
    	type:Date,
    	condition:function(item){
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
    		].indexOf(item.type)>-1;
    	},
    	defaultValue:function(item) {
    		return new Date();
    	},
     	label:"Issue date",
        size:6,
        input:"MDDate",
    },
    clientExecutedDate:{
        type:Date,
        condition:function(item){
            return ['Contract','Lease'].indexOf(item.type)>-1;
        },
        defaultValue:function(item) {
            return new Date();
        },
        label:"Date client executed",
        input:"MDDate"
    },    
    supplierExecutedDate:{
    	type:Date,
    	condition:function(item){
    		return ['Contract',''].indexOf(item.type)>-1;
    	},
    	defaultValue:function(item) {
    		return new Date();
    	},
     	label:"Date supplier executed",
        size:6,
        input:"MDDate",
    },
    attachments: {
    	type:[Object],
    	label:"Attachments",
        input:FileExplorer
    }
}