export default CreatedByUser = { register }

// Have had to remove this because of dysfunctional implementation of es6 circular dependencies
//import { Users } from '/modules/models/Users';
import { Text, Select } from '/modules/ui/MaterialInputs';

function register( collection, options ) {

	collection.save.before( ( doc ) => {
		if ( doc == null ) {
			console.log( 'no document' );
			return;
		}
		if ( !doc.createdByUser ) {
			let user = Meteor.user();
			if ( user != null ) {
                import { Facilities } from '/modules/models/Facilities';
                let facId = doc.facility._id;
                let docFacility = Facilities.findOne( facId  );
                let facilityMember = docFacility.members && docFacility.members.length ? _.find(docFacility.members, function(memb){ return memb._id === Meteor.user()._id; }) : undefined;
                let createdByUser_role = facilityMember ? (facilityMember.role ? facilityMember.role : 'manager' ) : 'manager'
                doc.createdByUser = {
                    _id: Meteor.user()._id,
                    role: createdByUser_role
                }
			}
		}
	} )

	/*collection.schema.createdByUser = Object.assign( {
		label: "CreatedByUser",
		type: "object",
		input: Select,
		description: "The creator of document",
		defaultValue: () => {
			if ( Meteor.isClient ) {
                let user = Meteor.user();
    			if ( user != null ) {
                    import { Facilities } from '/modules/models/Facilities';
                    let facId = doc.facility._id;
                    let docFacility = Facilities.findOne( facId  );
                    let facilityMember = docFacility.members && docFacility.members.length ? _.find(docFacility.members, function(memb){ return memb._id === Meteor.user()._id; }) : undefined;
                    let createdByUser_role = facilityMember ? (facilityMember.role ? facilityMember.role : 'manager' ) : 'manager'
                    return {
                        _id: Meteor.user()._id,
                        role: createdByUser_role
                    }
    			}
			}
		},
		relation: {
		},
	}, collection.schema.createdByUser );*/

	/*if ( collection.helpers == null ) {
		return;
	}
	collection.helpers( {
		getName: function() {
			return this.name;
		},
		getOwner: function() {
			if ( this.owner ) {
				if ( this.owner.type == 'team' ) {
					import { Teams } from '/modules/models/Teams';
					return Teams.findOne( this.owner._id );
				}
				return Meteor.users.findOne( this.owner._id );
			}
		},
		setOwner: function( owner ) {
			this.save( {
				owner: {
					_id: owner._id,
					name: owner.getName()
				}
			} );
		},
		ownerIs: function( member ) {
			if ( this.owner && member ) {
				return this.owner._id == member._id;
			}
		},
		clearOwner: function() {
			this.save( {
				owner: null
			} );
		}
	} );*/
}
