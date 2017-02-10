
import { createContainer } from 'meteor/react-meteor-data';
import TeamGlobalSupplierPage from '../components/TeamGlobalSupplierPage.jsx';

export default TeamGlobalSupplierPageContainer = createContainer ( ( params ) =>
{

    return {
        team: Session.getSelectedTeam()
    }

}, TeamGlobalSupplierPage );
