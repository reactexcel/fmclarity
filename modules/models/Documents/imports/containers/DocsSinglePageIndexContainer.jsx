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

    if ( team ) {
        facilities = team.getFacilities( { 'team._id': team._id } )
    }
    /*if(_.contains(['caretaker', 'facility manager', 'portfolio manager', 'property manager', 'manager'],Meteor.user().getRole())){
        let newFacilityList = []
        let logedUser = Meteor.user();
        _.map(facilities,( fac, i ) => {
            let facilityMembers = fac.getMembers({'_id':logedUser._id});
            if(facilityMembers.length){
                newFacilityList.push(fac)
            }
        })
        facilities = newFacilityList
    }*/

    return {
        documents,
        facilities,
        facility,
        team,
        user,
    }

}, DocsSinglePageIndex );
