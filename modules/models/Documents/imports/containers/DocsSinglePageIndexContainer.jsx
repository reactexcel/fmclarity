import { createContainer } from 'meteor/react-meteor-data';
import DocsSinglePageIndex from '../components/DocsSinglePageIndex.jsx';
import { Documents } from '/modules/models/Documents'

export default DocsSinglePageIndexContainer = createContainer( ( params ) => {
    Meteor.subscribe( 'User: Facilities, Requests' );
    let team = Session.getSelectedTeam(),
        facility = Session.getSelectedFacility(),
        documents = null,
        user = Meteor.user(),
        facilities = null,
        query = { $or: [] };

    // if ( facility ){
    //   query.$or.push( { 'facility._id': facility._id } );
    // }
    if ( team ) {
        facilities = team.getFacilities( { 'team._id': team._id } )
    }

    //  console.log( { query, documents } );

    return {
        documents,
        facilities,
        facility,
        team,
        user,
    }

}, DocsSinglePageIndex );
