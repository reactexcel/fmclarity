import { createContainer } from 'meteor/react-meteor-data';

import Files from '../models/Files.jsx';
import FilesPageIndex from '../components/FilesPageIndex.jsx';


export default FilesPageIndexContainer = createContainer( ( params ) => {

	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Files' );

	let files = Files.find().fetch();
	console.log(files);
	return {
		items: files
	}

}, FilesPageIndex );
