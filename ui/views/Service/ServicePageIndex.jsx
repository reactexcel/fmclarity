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
	    	data.items = facility.servicesRequired;
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
			<div className="facility-page">

		        <div className="row wrapper page-heading">
		        	<div className="col-lg-12">
                		<FacilityFilter title="Services"/>
		        	</div>
		        </div>

                <div className="wrapper wrapper-content animated fadeIn">
                	{/* from fmc:filterbox */}
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