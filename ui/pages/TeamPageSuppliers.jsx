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
            <div 
                className={
                    "suppliers-page animated fadeIn"+
                    (this.state.supplier?" second-selected":"")
                }
            >
                <div className="nav-col" >
                    <FacilityFilter />
                </div>
                <div className="nav-col">
                    <NavDropDownList 
                        items={this.data.suppliers}
                        selectedItem={this.state.supplier} 
                        tile={ContactCard}
                        onChange={(supplier)=>{
                            this.setState({
                                supplier:supplier
                            })
                        }}
                    />
                </div>
                <div className={"content-col"+(!this.state.supplier?" inactive":"")}> 
                    <div className="card-body ibox">
                        {this.state.supplier?
                        <TeamCard item={this.state.supplier}/>
                        :null}
                    </div>
                </div>
            </div>
		);
	}
})