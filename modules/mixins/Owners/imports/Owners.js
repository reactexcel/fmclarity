export default Owners = { register }

// Have had to remove this because of dysfunctional implementation of es6 circular dependencies
//import { Users } from '/modules/models/Users';
import { Text } from '/modules/ui/MaterialInputs';

function register( collection, options ) {

	collection.save.before( ( doc ) => {
		if ( doc == null ) {
			console.log( 'no document' );
			return;
		}
		if ( !doc.owner ) {
			let user = Meteor.user();
			if ( user != null ) {
				doc.owner = {
					_id: user._id,
					name: user.getName(),
				};
			}
		}
	} )

	if ( !collection.schema.owner ) {
		collection.schema.owner = {
			label: "Owner",
			input: Text, //OwnerCard
			options: {
				readOnly: true
			},
			description: "The creator or owner",
			relation: {
				join: ( { owner } ) => {
					if ( owner && owner._id ) {
						if( owner.type == 'team' ) {
							import { Teams } from '/modules/models/Teams';
							return Teams.findOne( owner._id );
						}
						return Meteor.users.findOne( owner._id );
					}
				},
				unjoin: ( item ) => {
					if(_.isObject(item.owner)){
						return _.pick( item.owner, '_id', 'name', 'type' );
					}else{
						return item.owner
					}
				}
			},
		}

	}
	if ( collection.helpers == null ) {
		return;
	}
	collection.helpers( {
		getName: function() {
			return this.name;
		},
		getOwner: function() {
			if ( this.owner ) {
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
	} );
}
