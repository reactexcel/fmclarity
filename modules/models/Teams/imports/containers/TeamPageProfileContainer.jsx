
import { createContainer } from 'meteor/react-meteor-data';
import TeamPageProfile from '../components/TeamPageProfile.jsx';

export default TeamPageProfileContainer = createContainer ( ( params ) => 
{
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Users' );

    return {
        team: Session.getSelectedTeam()
    }

}, TeamPageProfile );