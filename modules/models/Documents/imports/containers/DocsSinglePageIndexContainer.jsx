import { createContainer } from 'meteor/react-meteor-data';
import DocsSinglePageIndex from '../components/DocsSinglePageIndex.jsx';
import { Documents } from '/modules/models/Documents'
import { Roles } from '/modules/mixins/Roles';

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
    if(!_.contains(['fmc support','portfolio manager'],user.getRole())){
        let newFacilityList = []
        _.map(facilities,( fac, i ) => {
            let facilityMembers = fac.getMembers({'_id':user._id});
            if(facilityMembers.length){
                newFacilityList.push(fac)
            }
        })
        facilities = newFacilityList
    }

    return {
        documents,
        facilities,
        facility,
        team,
        user,
    }

}, DocsSinglePageIndex );
