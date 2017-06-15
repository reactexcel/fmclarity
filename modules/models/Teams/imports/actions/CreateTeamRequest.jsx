import React from 'react';

import { Action } from '/modules/core/Actions';
import { Modal } from '/modules/ui/Modal';
import { Roles } from '/modules/mixins/Roles';
import { AutoForm } from '/modules/core/AutoForm';
import { Requests } from '/modules/models/Requests';
import { Teams } from '/modules/models/Teams';
import { DropFileContainer } from '/modules/ui/MaterialInputs';

// now that we are evaluating people based on their role in the request then we can perhaps actually
// have this located in request ( ie request.create ) rather than team.createRequest
const CreateTeamRequest = new Action( {
    name: "create team request",
    type: [ 'team' ],
    label: "Create new request",
    verb: "created a work order",
    icon: 'fa fa-plus',
    // action should return restult and that gets used in the notification
    action: ( team, callback, options ) => {
        let item = { team };
        if ( options ) {
            options.team = team;
            item = options
        }
        newItem = Requests.create( item );
        Modal.show( {
            content:

				<AutoForm
		            title = "Please tell us a little bit more about the work that is required."
		            model = { Requests }
		            form = { Teams.isFacilityTeam( team ) ? CreateRequestForm : SupplierCreateRequestForm }
		            item = { newItem }
		            submitText="Save"
		            onSubmit = {
		                ( newRequest ) => {
		                    if(newRequest.type == "Booking"){
		                        Meteor.call("Facilities.updateBookingForArea", newRequest.facility, newRequest.level, newRequest.area, newRequest.identifier, newRequest.bookingPeriod)
		                    }

		                    Modal.replace( {
		                        content: <DropFileContainer model = { Requests } request = { request }>
		                                <RequestPanel item = { newRequest } callback = { callback }/>
		                            </DropFileContainer>
		                    } );

		                    let owner = Meteor.user(),
		                    	method = 'Issues.create';

		                    newRequest.owner = {
		                        _id: owner._id,
		                        name: owner.profile ? owner.profile.name : owner.name
		                    };

		                    newRequest = Requests.collection._transform( newRequest );

		                    if( newRequest.canIssue( owner ) ) {
		                    	method = 'Issues.issue';
		                    }

		                    Meteor.call( method, newRequest );
		                    let request = Requests.findOne( { _id: newRequest._id } );
		                    request.markAsUnread();
		                    callback? callback( newRequest ): null;
		                }
		            }
		        />

        } )
    }
} )


export default CreateTeamRequest