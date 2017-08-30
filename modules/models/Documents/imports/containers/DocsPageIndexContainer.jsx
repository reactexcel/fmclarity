import { createContainer } from 'meteor/react-meteor-data';
import DocsPageIndex from '../components/DocsPageIndex.jsx';
import { Documents } from '/modules/models/Documents';

export default DocsPageIndexContainer = createContainer( ( params ) => {

	return {
		docs: Documents.find().fetch()
	}

}, DocsPageIndex );
