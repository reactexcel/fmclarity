import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import DocIcon from './DocIcon.jsx';
import DocIconHeader from './DocIconHeader.jsx';
import Documents from '../model/Documents.jsx';

export default DocsPageIndex = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {
		Meteor.subscribe( 'docs' );
		let docs = Documents.find().fetch();
		return {
			docs: docs
		}
	},

	createNew( callback ) {
		var selectedFacility = Meteor.user().getSelectedFacility();
		var selectedTeam = Session.getSelectedTeam();
		var issue = {
			costThreshold: selectedTeam.defaultWorkOrderValue
		}
		if ( selectedTeam ) {
			issue.team = {
				_id: selectedTeam._id,
				name: selectedTeam.name
			}
		}
		if ( selectedFacility ) {
			issue.facility = {
				_id: selectedFacility._id,
				name: selectedFacility.name
			}
		}
		Meteor.call( 'Issues.create', issue, function( err, response ) {
			if ( err ) {
				console.log( err );
			}
			if ( callback && response ) {
				var newItem = Issues.findOne( response._id );
				callback( newItem );
			}
		} );
		//Issues.create(issue,callback);
	},

	render() {
		return (
			<div>
				<div className="row wrapper page-heading">
				  <div className="col-lg-12">
					{/*<FacilityFilter title="Requests"/>*/}
				  </div>
				</div>
				{/*newItemCallback could be a collection helper - then we pass in the collection to the filterbox*/}
				<div className="issue-page wrapper wrapper-content animated fadeIn">
					<div className="ibox">
						<DocumentIconHeader/>
						<div>
						{ this.data.docs.map( ( doc ) => {
			 				return <DocumentIcon key={doc._id} item={doc}/>
						} ) }
						</div>
					</div>
				</div>
			</div>
		);
	}
} )
