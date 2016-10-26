
import { createContainer } from 'meteor/react-meteor-data';
import TeamPageProfile from '../components/TeamPageProfile.jsx';

export default TeamPageProfileContainer = createContainer ( ( params ) => 
{

    return {
        team: Session.getSelectedTeam()
    }

}, TeamPageProfile );