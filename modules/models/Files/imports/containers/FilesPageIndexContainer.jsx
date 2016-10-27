import { createContainer } from 'meteor/react-meteor-data';

import Files from '../Files.jsx';
import FilesPageIndex from '../components/FilesPageIndex.jsx';


export default FilesPageIndexContainer = createContainer( ( params ) => {

	let files = Files.find().fetch();
	return {
		items: files
	}

}, FilesPageIndex );
