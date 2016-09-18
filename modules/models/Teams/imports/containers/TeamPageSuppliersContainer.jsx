import { createContainer } from 'meteor/react-meteor-data';
import TeamPageSuppliers from '../components/TeamPageSuppliers.jsx';

export default TeamPageSuppliersContainer = createContainer( ( params ) => {
    Meteor.subscribe( 'Teams' );
    Meteor.subscribe( 'Users' );
    Meteor.subscribe( 'Files' );
    Meteor.subscribe( 'Documents' );

    let user = Meteor.user(),
        facility = Session.getSelectedFacility(),
        team = Session.getSelectedTeam(),
        facilities = null,
        suppliers = null;

    console.log( facility );

    if ( team != null ) {
        facilities = team.facilities;
    } else if ( user != null ) {
        facilities = user.facilities;
    }

    if ( facility != null ) {
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
