/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import PubSub from 'pubsub-js';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Menu } from '/modules/ui/MaterialNavigation';
import { DataTable } from '/modules/ui/DataTable';
import { download, print } from '/modules/ui/DataTable/source/DataSetActions.jsx';
import { DateTime, Select } from '/modules/ui/MaterialInputs';
import { Requests } from '/modules/models/Requests';
import { Documents } from '/modules/models/Documents';
import { DefaultComplianceRule } from '/modules/features/Compliance';
import { ContactCard } from '/modules/mixins/Members';
import { Facilities } from '/modules/models/Facilities';
import DocViewEdit from '../../../.././models/Documents/imports/components/DocViewEdit.jsx';

import moment from 'moment';

/**
 * @class 			RequestStatusReport
 * @memberOf 		module:features/Reports
 */
const RequestsStatusReport = React.createClass( {

	mixins: [ ReactMeteorData ],

	getInitialState() {
		return {
			service: null,
			showFacilityName: true,
			dataset:null,
			serverDoc:[],
			currentDoc:[],
			docString:''
		}
	},
	componentWillMount(){
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
		this.setState({currentDoc : docs , docString})
		$("#fab").hide();
	},
	componentWillUnmount(){
		$("#fab").show();
		PubSub.publish('stop', "test");
	},
	componentDidMount(){
		setTimeout(function(){
			$(".loader").hide();
		},2000)
	let update = setInterval(()=>{

			PubSub.subscribe( 'stop', (msg,data) => {
				clearInterval(update)
			});
			let serverDoc = Documents.find({"type":"Contract"}).fetch();
			let aa = serverDoc.filter((doc) => doc.serviceType.hasOwnProperty("name"));
			let updatedString = " "
			aa.map((d)=>{
				updatedString = updatedString + d.expiryDate + d.clientExecutedDate + d.supplierExecutedDate + d.totalValue + d.serviceType.name
				if(d.hasOwnProperty("subServiceType")){
					if(d.subServiceType.hasOwnProperty("name")){
						updatedString = updatedString + d.subServiceType.name
					}
				}
				if(d.hasOwnProperty("supplier")){
					if(d.supplier.hasOwnProperty("name")){
						updatedString = updatedString + d.supplier.name
					}
				}
				if(d.hasOwnProperty("comment")){
						updatedString = updatedString + d.comment
				}
			})
			if(updatedString != this.state.docString){
				this.setState({
					docString : updatedString
				})
			}
			if(serverDoc.length != this.state.currentDoc.length){
				this.setState({
					currentDoc : serverDoc
				})
			}
		},1000)
	},

	getMeteorData() {
		// console.log("&&&&&&&&&&&&&&&");
		var user, team, facility, requests, data = {};
		user = Meteor.user();
		if ( user ) {
			var rule = [];
            let dayStart = moment().startOf('day').toDate();
            let dayEnd = moment().endOf('day').toDate();
			team = user.getSelectedTeam();
			service = this.state.service;
            let docs = { };
			if ( team ) {
                facility = Session.getSelectedFacility();
				if ( facility ) {
                    let services = _.filter(facility.servicesRequired, s => ( s !== null ) );
                    data.services = services;
                    for (var i in services) {
						if( services[i] != null )
                        	rule.push(_.filter( DefaultComplianceRule[ services[i].name ], rule => rule.docType == "Contract" ));
                    }
                }
                let rules = _.flatten(rule, true);
                for (var i in rules) {
                    let rule = rules[i];
                    let query = {
                        "facility._id": facility["_id"],
                        $and: [
                            {'serviceType.name': rule.service.name},
                            { type: rule.docType },
                            { name: { $regex: rule.docName || "", $options: "i" } },
                            { expiryDate: { $gte: dayStart} },
                        ]
                    }
                    let doc = Documents.findOne(query);
                    if ( doc ){
                        doc.rule = rule;
                        docs[rule.service.name] = doc
                    }
                }
                for (var i in data.services) {
					if (data.services[i] !== null)
                    	data.services[i].doc = docs[ data.services[i].name]
                }
                // console.log({docs,"services":data.services});
			}
		}
		return {
			team: team,
			facility: facility,
			reportData: data,
			showFacilityName: this.state.showFacilityName,
		}
	},

	fields: {
        "Service Type": "name",
        "Contractor Name": ( item ) => {
					let query
					if(Object.keys(item).length > 3){
						query = {
							"facility._id" : Session.getSelectedFacility()._id,
							"type":"Contract",
							"serviceType.name":item.name
						}
					}else{
						query = {
							"facility._id" : Session.getSelectedFacility()._id,
							"type":"Contract",
							"subServiceType.name":item.name
						}
					}
					let docs = Documents.find(query).fetch();
					if(docs.length > 0){

						if(Object.keys(item).length > 3){
							docs = _.filter(docs,d => d.hasOwnProperty("subServiceType") ? !d.subServiceType.name : !d.subServiceType)
						}

						//console.log(docs);
						if(docs.length > 0 && docs[0].hasOwnProperty("supplier")){
							console.log(docs[0].supplier);
							let supplier = docs[0].supplier
							if( supplier != null ){
								let string = supplier.name
								if(string != undefined || null){
									supplier['name'] = string.length > 30 ? string.substring(0, 30) + "..." : string
								}
								// console.log(supplier);
								return {
									val: <ContactCard item={supplier} />,
									name: supplier.name
								}
							}
							return {
								val: <span/>
							}
						}
					}
		},
        "Annual Amount": ( item ) => {
					let query
					if(Object.keys(item).length > 3){
						query = {
							"facility._id" : Session.getSelectedFacility()._id,
							"type":"Contract",
							"serviceType.name":item.name
						}
					}else{
						query = {
							"facility._id" : Session.getSelectedFacility()._id,
							"type":"Contract",
							"subServiceType.name":item.name
						}
					}
					let docs = Documents.find(query).fetch();
					if(docs.length > 0){

						if(Object.keys(item).length > 3){
							// console.log(docs);
							docs = _.filter(docs,d => d.hasOwnProperty("subServiceType") ? !d.subServiceType.name : !d.subServiceType)
							// console.log(docs,"filtered");
						}
						let amount = null;
						if ( docs.length > 0) {
							amount = docs[docs.length - 1].totalValue;
							return {
								val: `$${amount}`
							};
						}
					}
					return {
						val: "--"
					};
        },
        "Comments": ( item ) => {
					let query
					if(Object.keys(item).length > 3){
						query = {
							"facility._id" : Session.getSelectedFacility()._id,
							"type":"Contract",
							"serviceType.name":item.name
						}
					}else{
						query = {
							"facility._id" : Session.getSelectedFacility()._id,
							"type":"Contract",
							"subServiceType.name":item.name
						}
					}
					let docs = Documents.find(query).fetch();
					if(docs.length > 0){

						if(Object.keys(item).length > 3){
							docs = _.filter(docs,d => d.hasOwnProperty("subServiceType") ? !d.subServiceType.name : !d.subServiceType)
						}

						//console.log(docs);
						if(docs.length > 0 && docs[docs.length - 1].hasOwnProperty("comment")){
							return {
								val : docs[docs.length - 1].comment
							}
						}
						return {
							val : '--'
						}
					}
        },
        "Status": ( item ) => {
					let query
					if(Object.keys(item).length > 3){
						query = {
							"facility._id" : Session.getSelectedFacility()._id,
							"type":"Contract",
							"serviceType.name":item.name
						}
					}else{
						query = {
							"facility._id" : Session.getSelectedFacility()._id,
							"type":"Contract",
							"subServiceType.name":item.name
						}
					}
					let docs = Documents.find(query).fetch();
					if(docs.length > 0){

						if(Object.keys(item).length > 3){
							docs = _.filter(docs,d => d.hasOwnProperty("subServiceType") ? !d.subServiceType.name : !d.subServiceType)
						}
						if (docs.length > 0) {
							let status = "Not Executed"
							if(docs[docs.length - 1].clientExecutedDate != '' && docs[docs.length - 1].supplierExecutedDate != ''){
								status = "Fully Executed"
							}else if(docs[docs.length - 1].clientExecutedDate != '' && docs[docs.length - 1].supplierExecutedDate == ''){
								status = "Client Executed"
							}else if (docs[docs.length - 1].clientExecutedDate == '' && docs[docs.length - 1].supplierExecutedDate != '') {
								status = "Supplier Executed"
							}
							// if ( moment(expiryDate).isBefore(moment().endOf("day")) ) {
								return {
									val: <span>{status}</span>
								}
							// }
						}
						return {
							val: '--'
						}
					}
        },
        "Expiry Date": ( item ) => {
					let query
					if(Object.keys(item).length > 3){
						query = {
							"facility._id" : Session.getSelectedFacility()._id,
							"type":"Contract",
							"serviceType.name":item.name
						}
					}else{
						query = {
							"facility._id" : Session.getSelectedFacility()._id,
							"type":"Contract",
							"subServiceType.name":item.name
						}
					}
					let docs = Documents.find(query).fetch();
					if(docs.length > 0){

						if(Object.keys(item).length > 3){
							docs = _.filter(docs,d => d.hasOwnProperty("subServiceType") ? !d.subServiceType.name : !d.subServiceType)
						}
						let expiryDate = null;
						if ( docs.length > 0) {
							expiryDate = docs[docs.length - 1].expiryDate;
							if(expiryDate){
								return {
									val: moment(expiryDate).format("DD-MMM-YY")
								}
							}
						}
						return {
							val: '--'
						}
					}
        }
	},
    setDataSet(newdata){
    	this.setState({
    		dataset:newdata,
    	});
    },
		onChange(data){
			this.setState({data : data})
		},
 		showFileDetailsModal(doc) {
				Modal.show( {
						content: <DocViewEdit
				item = {doc}
				onChange = { (data) => { this.onChange(data); }}
				model={Facilities}
				team = {Session.getSelectedTeam()}/>
				} )
		},
		handleClick(doc) {
			console.log(doc);
			if(doc != null){
				this.showFileDetailsModal(doc);
			}else{
				this.showFileDetailsModal({"type":"Contract"});
			}
    },

	render() {
		var data = this.data.reportData.services;

		if ( !data ) {
			return <div/>
		}
		let { team, showFacilityName } = this.data, { facility, service } = this.state;
		let fields = this.fields
		return (
			<div>
				<div id = "toggleButton2" style={{float:"right",marginRight:"1%",fontWeight:"600",color:"#0152b5",cursor:"pointer"}} onClick={()=>{
					this.handleClick(null);
				}}>+ Add Contract</div>
                <h3>Service Contract</h3>
				<div className = "ibox" ref="printable">
					<DataTable items={data||{}} fields={fields} includeActionMenu={true} MBMreport ={true} handleClick={this.handleClick} setDataSet={this.setDataSet}/>
				</div>
			</div>
		)
	}
} )

export default RequestsStatusReport;
