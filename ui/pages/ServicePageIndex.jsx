import React from "react";
import {mount} from 'react-mounter';
import {ReactMeteorData} from 'meteor/react-meteor-data';

// FacilityPageIndex
//
// Uses fmc:filterbox2 to create a layout with the users facilities in a left navigation panel
// and the detail view of the currently selected facility in the right navigation
//

if(Meteor.isClient) {
	loggedIn.route('/services',{
	  name:'services',
	  action(){
	    mount(MainLayout,{content:<ServicePageIndex/>})
	  }
	});
}



ServicePageIndex = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('teamsAndFacilitiesForUser');
    	var data = {};
	    var facility = Session.getSelectedFacility();
	    if(facility) {
	    	data.items = _.filter(facility.servicesRequired,(svc)=>{return svc.data&&svc.data.complianceRules&&svc.data.complianceRules.length});
	    }
	    return data;
    },

	render() {
		return <ServicePageIndexInner 
			items={this.data.items}
		/>
	}

});

class ServicePageIndexInner extends React.Component {

	render() {

		return(		        
			<div className="facility-page animated fadeIn">

		        <FacilityFilter/>
		        <div style={{paddingTop:"50px"}}>

					<FilterBox2 
						items={this.props.items}
						navWidth={3}
						itemView={{
							summary:ServiceListTile,
							detail:ServiceViewDetail
						}}
					/>
				</div>

			</div>
		);
	}

}