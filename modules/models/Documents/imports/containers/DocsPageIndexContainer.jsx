import { createContainer } from 'meteor/react-meteor-data';
import DocsPageIndex from '../components/DocsPageIndex.jsx';

export default DocsPageIndexContainer = createContainer( ( params ) => {

	return {
		docs: Documents.find().fetch()
	}

}, DocsPageIndex );
