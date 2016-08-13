import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

SupplierIndexPage = React.createClass({

    mixins:[ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('contractors');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        var data = {};
        data.user = Meteor.user();
        facility = Session.getSelectedFacility();
        if(data.user) {
            data.facilities = data.user.getFacilities();
        }
        if(facility) {
            data.suppliers = facility.getSuppliers();
        }
        return data;
    },

    getInitialState() {
        return {
            supplier:null
        }
    },

    showModal(callback) {
        Modal.show({
            content:<TeamViewEdit facility={this.data.facility} onChange={callback} />
        })
    },

	render() {
		return(
            <div className="suppliers-page animated fadeIn">
                <FacilityFilter />
                <div className="row" style={{paddingTop:"50px"}}>
                    <div className="col-md-4">
                        <SupplierNavList 
                            selectedItem={this.state.supplier}
                            onChange={(supplier)=>{
                                this.setState({
                                    supplier:supplier
                                })
                            }}
                        />
                    </div>
                    <div className="col-md-8"> 
                        <div className="card-body ibox">
                            {this.state.supplier?
                            <TeamCard item={this.state.supplier}/>
                            :null}
                        </div>
                    </div>
                </div>
            </div>
		);
	}
})