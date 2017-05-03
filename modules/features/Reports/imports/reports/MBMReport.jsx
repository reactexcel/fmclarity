/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Menu } from '/modules/ui/MaterialNavigation';
import { DataTable } from '/modules/ui/DataTable';
import { download, print } from '/modules/ui/DataTable/source/DataSetActions.jsx';
import { DateTime, Select } from '/modules/ui/MaterialInputs';
import { Requests } from '/modules/models/Requests';
import { Documents } from '/modules/models/Documents';
import { DefaultComplianceRule } from '/modules/features/Compliance';
import { ContactCard } from '/modules/mixins/Members';

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
		}
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
			let supplier = item.data?item.data.supplier:item.supplier;
			if( supplier != null ){
				return {
					val: <ContactCard item={supplier} />
				}
			}
			return {
				val: <span/>
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

						if(docs.length > 1){
							docs = _.filter(docs,d => !d.subServiceType.name)
						}
						let amount = null;
						if ( docs[0] ) {
							amount = docs[0].totalValue;
							return {
								val: `$${amount}`
							};
						}
						return {
							val: ""
						};
					}
        },
        "Comments": ( item ) => {
					// console.log(item);
						if(item.data){
							if ( item.data.baseBuilding == ''){
	                return {
											val: "N/A"
	                };
	            }else{
								return {
									val: "Tenant Responsibility"
		            };
							}
						}
            return {
                val: "Tenant Responsibility"
            };
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

						if(docs.length > 1){
							docs = _.filter(docs,d => !d.subServiceType.name)
						}
						console.log(docs);
						if (docs[0]) {
							let status = (docs[0].clientExecutedDate != '' && docs[0].supplierExecutedDate != '') ? "Fully Executed" : "Supplier Executed"
							// if ( moment(expiryDate).isBefore(moment().endOf("day")) ) {
								return {
									val: <span>{status}</span>
								}
							// }
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

						if(docs.length > 1){
							docs = _.filter(docs,d => !d.subServiceType.name)
						}
						let expiryDate = null;
						if ( docs[0]) {
							expiryDate = docs[0].expiryDate;
						}
						if(expiryDate){
							return {
								val: moment(expiryDate).format("DD-MMM-YY")
							}
						}
					}
        }
	},
    setDataSet(newdata){
    	this.setState({
    		dataset:newdata,
    	});
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
                <h3>Service Contract</h3>
				<div className = "ibox" ref="printable">
					<DataTable items={data||{}} fields={fields} includeActionMenu={true} setDataSet={this.setDataSet}/>
				</div>
			</div>
		)
	}
} )

export default RequestsStatusReport;
