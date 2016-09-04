
import { createContainer } from 'meteor/react-meteor-data';
import TeamPageSuppliers from './imports/TeamPageSuppliers.jsx';

TeamPageSuppliersContainer = createContainer ( ( params ) => 
{
    Meteor.subscribe('contractors');
    Meteor.subscribe('teamsAndFacilitiesForUser');

    let user = Meteor.user(),
    	facility = Session.getSelectedFacility(),
    	facilities = null,
    	suppliers = null;

    if( user != null ) 
    {
        facilities = user.getFacilities();
    }

    if( facility != null ) {
        suppliers = facility.getSuppliers();
    }

    return {
    	user,
    	facility,
    	facilities,
    	suppliers
    }

}, TeamPageSuppliers );