
import { createContainer } from 'meteor/react-meteor-data';
import TeamPageProfile from './imports/TeamPageProfile.jsx';

TeamPageProfileContainer = createContainer ( ( params ) => 
{
    return {
        team: Session.getSelectedTeam()
    }

}, TeamPageProfile );