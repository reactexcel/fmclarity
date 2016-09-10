import { createContainer } from 'meteor/react-meteor-data';
import DocsPageIndex from '../components/DocsPageIndex.jsx';

export default DocsPageIndexContainer = createContainer( ( params ) => {

	Meteor.subscribe( 'docs' );

	return {
		docs: Documents.find().fetch()
	}

}, DocsPageIndex );
