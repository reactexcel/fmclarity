import React from 'react';

import { Modal } from '/modules/ui/Modal';
import { Action } from '/modules/core/Actions';
import { AutoForm } from '/modules/core/AutoForm';

import { Requests, CreateRequestForm } from '/modules/models/Requests';

import RequestPanel from './imports/components/RequestPanel.jsx';

import { Teams } from '/modules/models/Teams';

import { DropFileContainer } from '/modules/ui/MaterialInputs';


const view = new Action( {
    name: "view request",
    type: 'request',
    /*
    path: ( request ) => {
       return `/requests/${request._id}`;
    },
    */
    label: "View",
    action: ( request, callback ) => {
        if( !request ) {
            throw new Meteor.Error('view request: request is null', "Tried to view null request");
        }
        Modal.show( {
            id: `viewRequest-${request._id}`,
            content: //<DropFileContainer request={request} model={Requests}>
                <RequestPanel item = { request } callback={callback}/>
                //</DropFileContainer>
        } )
        callback( request );
        request = Requests.collection._transform( request );
        request.markRecipentAsRead();
    }
} )

const edit = new Action( {
    name: "edit request",
    type: 'request',
    label: "Edit",
    action: ( request ) => {
        let oldRequest = Object.assign( {}, request );
        Modal.show( {
            content:
                <AutoForm
            title = "Edit Request"
            model = { Requests }
            item = { request }
            form = { CreateRequestForm }
            onSubmit = {
                ( request ) => {
                    // this should really be in a Request action called 'update' or something
                    // that's where the create and issue code is located

                    // if we have a request description use it to add a comment to the request
                    //  then delete it so it doesn't save
                    let comment = request.description;
                    request.description = null;

                    request.costThreshold = request.costThreshold == '' ? 0 : request.costThreshold;

                    Requests.save.call( request );

                    Modal.hide();
                    request = Requests.collection._transform( request );

                    let notificationBody = "",
                        keys = [ 'costThreshold', 'priority', 'type', 'name' ];

                    for ( let i in keys ) {
                        let key = keys[ i ];

                        if ( request[ key ] != oldRequest[ key ] ) {

                            let oldValue = key == 'costThreshold' ? "$" + oldRequest[ key ] : oldRequest[ key ],
                                newValue = key == 'costThreshold' ? "$" + request[ key ] : request[ key ];

                            if( key == 'costThreshold' ) {
                                key = 'value';
                            }
                            notificationBody += `-> ${key.toUpperCase()}: changed from "${oldValue}" to "${newValue}".\n`;
                        }
                    }

                    if( notificationBody.length ) {
                        notificationBody += "\n";
                    }
                    if( comment ) {
                        notificationBody += comment;
                    }

                    request.distributeMessage( {
                        message: {
                            verb: "edited",
                            subject: `Work order ${request.code} has been edited`,
                            body: notificationBody
                        }
                    } );
                    request.markAsUnread()
                }
            }
            />
        } )
    }
} )

const destroy = new Action( {
    name: "destroy request",
    type: 'request',
    label: "Delete",
    action: ( request ) => {
        //Facilities.destroy( request );
        request.destroy();
        Modal.hide();
    }
} )

const deleteFunction = new Action( {
    name: "delete request",
    type: 'request',
    label: "Delete",
    shouldConfirm: true,
    verb: 'deleted request',
    action: ( request, callback ) => {
        Requests.update( request._id, { $set: { status: 'Deleted' } } );
        Modal.hide();
        request = Requests.collection._transform( request );
        request.distributeMessage( {
            message: {
                verb: "deleted",
                subject: `Work order ${request.code} has been deleted`,
                body: request.name
            }
        } );
        callback( request );
    }
} )

const cancel = new Action( {
    name: "cancel request",
    type: 'request',
    verb: "cancelled a work order",
    label: "Cancel",
    action: ( request, callback ) => {
        Modal.show( {
            content: <AutoForm
            model = { Requests }
            item = { request }
            form = {
                [ 'rejectComment' ]
            }
            onSubmit = {
                ( request ) => {
                    Requests.update( request._id, { $set: { status: 'Cancelled' } } );
                    Modal.hide();
                    request = Requests.collection._transform( request );
                    request.distributeMessage( {
                        message: {
                            verb: "cancelled",
                            subject: `Work order ${request.code} has been cancelled`,
                            body: request.rejectComment
                        }
                    } );
                    callback( request );
                }
            }
            />
        } )
    }
} )

// issues are request
const issue = new Action( {
    name: "issue request",
    type: 'request',
    verb: "issued a work order",
    label: "Issue",
    action: ( request, callback ) => {
        // I think this is quite a good model for how these actions should be structured
        // we might even reach a point where it can be action: 'Issues.issue'?
        Meteor.call( 'Issues.issue', request );
        callback( request );
        request.markAsUnread();
    }
} )

const accept = new Action( {
    name: "accept request",
    type: 'request',
    verb: "accepted a work order",
    label: "Assign",
    action: ( request, callback ) => {
        Modal.show( {
            content: <AutoForm
            title = "Please provide eta and, if appropriate, an assignee."
            model = { Requests }
            item = { request }
            form = {
                ['eta','assignee','acceptComment']
            }
            onSubmit = {
                ( request ) => {
                    //Requests.update( request._id, { $set: { status: 'In Progress' } } );
                    Requests.update( request._id, {
                        $set: {
                            eta: request.eta,
                            acceptComment: request.acceptComment
                        }
                    } );
                    Modal.hide();
                    request = Requests.collection._transform( request );
                    request.setAssignee( request.assignee );
                    request.distributeMessage( {
                        message: {
                            verb: "accepted",
                            subject: `Work order ${request.code} has been accepted`,
                            body: request.acceptComment
                        }
                    } );
                    request.markAsUnread();

                    callback( request );
                }
            }
            />
        } )
    }
} )

const reject = new Action( {
    name: "reject request",
    type: 'request',
    verb: "rejected a work order",
    label: "Reject",
    action: ( request, callback ) => {
        Modal.show( {
            content: <AutoForm
            title = "What is your reason for rejecting this request?"
            model = { Requests }
            item = { request }
            form = {
                [ 'rejectComment' ]
            }
            onSubmit = {
                ( request ) => {
                    Requests.update( request._id, { $set: { status: 'Rejected' } } );
                    Modal.hide();
                    request = Requests.collection._transform( request );
                    request.distributeMessage( {
                        message: {
                            verb: "rejected",
                            subject: `Work order ${request.code} has been rejected`,
                            body: request.rejectComment
                        }
                    } );
                    request.markAsUnread();
                    callback( request );
                }
            }
            />
        } )
    }
} )

const getQuote = new Action( {
    name: "get request quote",
    type: 'request',
    label: "Get quote",
    action: ( request, callback ) => {
        Modal.show( {
            content: <AutoForm
            model = { Requests }
            item = { request }
            form = { CreateRequestForm }
            onSubmit = {
                ( request ) => {
                    //Requests.update( request._id, { $set: { status: 'In Progress' } } );
                    Modal.hide();
                    callback( request );
                }
            }
            />
        } )
    }
} )

const sendQuote = new Action( {
    name: "send request quote",
    type: 'request',
    label: "Quote",
    action: ( request ) => {
        Modal.show( {
            content: <AutoForm
            model = { Requests }
            item = { request }
            form = { CreateRequestForm }
            onSubmit = {
                ( request ) => {
                    //Requests.update( request._id, { $set: { status: 'In Progress' } } );
                    Modal.hide();
                }
            }
            />
        } )
    }
} )

const complete = new Action( {
    name: 'complete request',
    type: 'request',
    verb: "completed a work order",
    label: "Complete",
    action: ( request, callback ) => {
        Modal.show( {
            content: <AutoForm
            title = "All done? Great! We just need a few details to finalise the job."
            model = { Requests }
            item = { request }
            form = {
                [ 'closeDetails' ]
            }
            onSubmit = {
                ( request ) => {
                    Modal.hide();
                    Meteor.call( 'Issues.complete', request );
                    callback( request );
                    request.markAsUnread();
                }
            }
            />
        } )
    }
} )

const close = new Action( {
    name: "close request",
    type: 'request',
    verb: "closed a work order",
    label: "close",
    action: ( request, callback ) => {
        Modal.show( {
            content: <AutoForm
            title = "Please leave a comment about the work for the suppliers record"
            model = { Requests }
            item = { request }
            form = {
                [ 'closeComment' ]
            }
            onSubmit = {
                ( request ) => {
                    Requests.update( request._id, { $set: { status: 'Closed' } } );
                    request = Requests.collection._transform( request );
                    request.distributeMessage( {
                        message: {
                            verb: "closed",
                            subject: `Work order ${request.code} has been closed`,
                            body: request.closeComment
                        }
                    } );
                    request.markAsUnread();
                    Modal.hide();
                    callback( request );
                }
            }
            />
        } )
    }
} )

const reopen = new Action( {
    name: "reopen request",
    type: 'request',
    label: "Reopen",
    action: ( request ) => {
        Modal.show( {
            content: <AutoForm
            model = { Requests }
            item = { request }
            form = {
                [ 'reopenComment' ]
            }
            onSubmit = {
                ( request ) => {
                    Requests.update( request._id, { $set: { status: 'Issued' } } )
                    Modal.hide();
                    request = Requests.collection._transform( request );
                    request.distributeMessage( {
                        message: {
                            verb: "reopened",
                            subject: `Work order ${request.code} has been reopened`,
                            body: request.reopenComment
                        }
                    } );
                    request.markAsUnread();
                }
            }
            />
        } )
    }
} )

const reverse = new Action( {
    name: "reverse request",
    type: 'request',
    label: "Reverse",
    action: ( request ) => {
        Modal.show( {
            content: <AutoForm
            model = { Requests }
            item = { request }
            form = {
                [ 'reverseComment' ]
            }
            onSubmit = {
                ( request ) => {
                    Requests.update( request._id, { $set: { status: 'Reversed' } } )
                    Modal.hide();
                }
            }
            />
        } )
    }
} )

const clone = new Action( {
    name: "clone request",
    type: 'request',
    label: "Issue",
    action: ( request ) => {
        request = Requests.collection._transform( request );
        let dueDate = request.getNextDate();

        let newRequest = Object.assign( {}, request, {
            _id: Random.id(),
            dueDate: dueDate,
            status: 'Issued',
            type: 'Ad-Hoc'
        } );

        Modal.replace( {
            content: //<DropFileContainer request={newRequest} model={Requests}>
                <RequestPanel item = { newRequest } />
                //</DropFileContainer>
        } );

        Meteor.call( 'Issues.issue', newRequest );
    }
} )

export {
    view,
    edit,
    destroy,
    cancel, //delete
    issue, //approve
    accept,
    //reject,
    getQuote,
    sendQuote,
    complete,
    //close,
    reopen,
    //reverse,
    clone
}
