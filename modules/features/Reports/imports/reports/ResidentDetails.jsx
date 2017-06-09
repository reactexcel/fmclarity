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
import { Facilities } from '/modules/models/Facilities';


import { ContactCard } from '/modules/mixins/Members';

import moment from 'moment';

/**
 * @class 			RequestStatusReport
 * @memberOf 		module:features/Reports
 */
const ResidentDetails = React.createClass( {

	mixins: [ ReactMeteorData ],

	getInitialState() {
		return {
			facility:'',
            dataset:null,
		}
	},

	getMeteorData() {
		var user, team, facility = {},
            residents = [];
		user = Meteor.user();
		if ( user ) {
            let role = {role:'resident'};
			team = user.getSelectedTeam();
			facility = Session.getSelectedFacility()
			if ( facility ) {
				residents = facility.getMembers( role );
			} else {
                let facilities = Facilities.find({}).fetch()
                facilities.map( ( facility,idx ) => {
					let resid = facility.getMembers( role );
					    resid.map( ( obj,idx ) => {
							resid[idx].facilityResident = {
								_id:facility._id,
								name:facility.name
							}
						})
                    residents = residents.concat(resid)
                })
            }
		}
		residents.map( ( obj,idx ) => {
			residents[idx].apartmentAddress = (residents[idx].level && residents[idx].level.name ? residents[idx].level.name : '')+(residents[idx].apartment && residents[idx].apartment.name ? ' - ' +  residents[idx].apartment.name : '')+(residents[idx].identifier && residents[idx].identifier.name ? ' - ' +  residents[idx].identifier.name : '')
			residents[idx]['owner/tenant'] = residents[idx].status && residents[idx].status == true ? 'Tenant' : 'Owner';
			residents[idx].keys = (obj.keys? (obj.keys.key_1 ? obj.keys.key_1 : '')+(obj.keys.key_1 && obj.keys.key_2 ? ', ' : '')+(obj.keys.key_2 ? obj.keys.key_2 : '') : '')
			residents[idx].remoteNumbers = (obj.remoteNumbers? (obj.remoteNumbers.remoteNumber_1 ? obj.remoteNumbers.remoteNumber_1 : '')+(obj.remoteNumbers.remoteNumber_1 && obj.remoteNumbers.remoteNumber_2 ? ', ' : '')+(obj.remoteNumbers.remoteNumber_2 ? obj.remoteNumbers.remoteNumber_2 : '') : '')
			residents[idx].phoneNumber = (obj.profile? (obj.profile.phone ? obj.profile.phone :'')+(obj.profile.phone && obj.profile.phone2 ? ', ' :'')+(obj.profile.phone2 ? obj.profile.phone2 :'') :'')
		})
		return {
			team: team,
			facility: facility,
			residents: residents,
		}
	},

	fields: {
	    Facility: 'facilityResident.name',
		Apartment:'apartmentAddress',
		"Owner/Tenant": 'owner/tenant',
        /*Name: (item) => {
			if( item != null ){
				return {
					val: <div style={{minWidth:'100px'}}><ContactCard item={item} removeEmail={true}/></div>
				}
			}
			return {
				val: <span/>
			}
		},*/
		Name:"profile.name",
        "Email Address": "profile.email",
        "Phone Number": "phoneNumber",
		"Keys": "keys",
		"Remotes": "remoteNumbers"
	},
    setDataSet(newdata){
    	this.setState({
    		dataset:newdata,
    	});
    },

	sortObject(arr) {
 		let sortedList = arr.sort(function(a, b){
			if(a != null && a.apartmentAddress != null && b != null && b.apartmentAddress != null){
	 			var textA = a.apartmentAddress.toUpperCase();
    			var textB = b.apartmentAddress.toUpperCase();
    			return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
			} else {
				return 0;
			}
		});
 		return sortedList
	},

	render() {
		if ( this.data.residents.length == 0 ) {
			return <div/>
		}

		let { team, facility, residents } = this.data;
		let fields = this.data.facility ? _.omit( this.fields, "Facility" ) : this.fields;
		let styleForPDF = '<style type="text/css" media="print"> .table {border-top: 2px solid black;border-bottom: 2px solid black;border-left: 2px solid black;border-right: 2px solid black;} #pre-head {border-right:2px solid black;border-bottom: 2px solid black;} #last-head {border-bottom: 2px solid black;} #pre-col {border-right:1px solid black; border-bottom:1px solid black} #last-col {border-bottom:1px solid black}</style>';
		let pdfTitle = "Resident List of "+ (this.data.facility && this.data.facility.name ? this.data.facility.name : "all facility")
		let pdfDetails = {
 			styleForPDF:styleForPDF,
 			pdfTitle:pdfTitle,
			pdfName: 'Resident_List-'+(this.data.facility && this.data.facility.name ? this.data.facility.name : "all facility")+'-'
 		}
		return (
			<div>
				<h2>Resident list of {facility && facility.name?facility.name:"all facility"}</h2>
	            {this.state.dataset ? <div>
					<Menu items = { [ download(this.state.dataset, pdfDetails), print(this.state.dataset, this.refs.printable, pdfDetails) ] } />
				</div>:null}
				<div className = "ibox" ref="printable">
					<DataTable items={this.sortObject(residents)} fields={fields} includeActionMenu={true} setDataSet={this.setDataSet}/>
				</div>
			</div>
		)
	}
} )

export default ResidentDetails;
