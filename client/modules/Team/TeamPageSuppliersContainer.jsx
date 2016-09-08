
import { createContainer } from 'meteor/react-meteor-data';
import TeamPageSuppliers from './imports/TeamPageSuppliers.jsx';

TeamPageSuppliersContainer = createContainer ( ( params ) => 
{
    Meteor.subscribe('contractors');
    Meteor.subscribe('teamsAndFacilitiesForUser');

    let user = Meteor.user(),
    	facility = Session.getSelectedFacility(),
        team = Session.getSelectedTeam(),
    	facilities = null,
    	suppliers = null;

    if( team != null ) {
        facilities = team.facilities;
    }
    else if( user != null ) 
    {
        facilities = user.facilities;
    }

    if( facility != null ) {
        suppliers = facility.suppliers;
    }

    return {
    	user,
        team,
    	facility,
    	facilities,
    	suppliers
    }

}, TeamPageSuppliers );