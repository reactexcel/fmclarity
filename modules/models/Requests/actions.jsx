import React from 'react';

import { Modal } from '/modules/ui/Modal';
import { Action } from '/modules/core/Actions';
import { AutoForm } from '/modules/core/AutoForm';

import { Requests, CreateRequestForm, CreatePPMRequestForm, PPM_Schedulers } from '/modules/models/Requests';
import {Facilities} from '/modules/models/Facilities';

import RequestPanel from './imports/components/RequestPanel.jsx';

import { Teams } from '/modules/models/Teams';
import { Files } from '/modules/models/Files';

import { getDefaultDueDate } from '/modules/models/Requests/imports/schemas/PPMSchema'

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
        })
        callback( request );
        if(isRequestPPM(request)){
          request = PPM_Schedulers.collection._transform( request );
        }else{
          request = Requests.collection._transform( request );
        }
        request.markRecipentAsRead();
    }
} )

const edit = new Action( {
    name: "edit request",
    type: 'request',
    label: "Edit",
    action: ( preRequest, callback ) => {
        let previousRequest = Object.assign( {}, preRequest );
        let oldRequest = Object.assign( {}, preRequest );
        let isPPM = isRequestPPM(preRequest);

        Modal.show( {
            content:
                <AutoForm
            title = "Edit Request"
            edit = {true}
            model = { isPPM ? PPM_Schedulers : Requests }
            item = { previousRequest }
            form = { isPPM ? CreatePPMRequestForm : CreateRequestForm }
            onSubmit = {
                ( request ) => {
                    // this should really be in a Request action called 'update' or something
                    // that's where the create and issue code is located

                    // if we have a request description use it to add a comment to the request
                    //  then delete it so it doesn't save
                    let comment = request.description;
                    request.description = null;

                    request.costThreshold = request.costThreshold == '' ? 0 : request.costThreshold;
                    if (isPPM) {
                        PPM_Schedulers.save.call(request);
                        request = PPM_Schedulers.collection._transform(request);
                    } else {
                        Requests.save.call(request);
                        request = Requests.collection._transform(request);
                    }
                    Modal.hide();

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
        let isPPM = isRequestPPM(request);

        if(request.status == "Booking"){
            let facility = Facilities.findOne({'_id':request.facility._id})
            let areas = facility.areas;
            	for(var i in areas){
                    if(areas[i].totalBooking && areas[i].totalBooking.length>0){
                        let bookingToRemove = areas[i].totalBooking.map(function(o) { return o.bookingId; }).indexOf(request._id);
                        if(bookingToRemove>=0){
                            areas[i].totalBooking.splice( bookingToRemove, 1 );
                            break;
                        }
                    }
                    if(areas[i].children && areas[i].children.length>0){
                        for(var j in areas[i].children){
                            if(areas[i].children[j].totalBooking && areas[i].children[j].totalBooking.length>0){
                                let bookingToRemove = areas[i].children[j].totalBooking.map(function(o) { return o.bookingId; }).indexOf(request._id);
                                if(bookingToRemove>=0){
                                    areas[i].children[j].totalBooking.splice( bookingToRemove, 1 );
                                    break;
                                }
                            }
                            if(areas[i].children[j].children && areas[i].children[j].children.length>0){
                                for(var k in areas[i].children[j].children){
                                    if(areas[i].children[j].children[k].totalBooking && areas[i].children[j].children[k].totalBooking.length>0){
                                        let bookingToRemove = areas[i].children[j].children[k].totalBooking.map(function(o) { return o.bookingId; }).indexOf(request._id);
                                        if(bookingToRemove>=0){
                                            areas[i].children[j].children[k].totalBooking.splice( bookingToRemove, 1 );
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
                Facilities.update( { _id: facility._id }, { $set: { "areas": areas } } );
        }
        if (isPPM) {
            PPM_Schedulers.update( request._id, { $set: { status: 'Deleted' } } );
            request = PPM_Schedulers.collection._transform( request );
        } else {
            Requests.update( request._id, { $set: { status: 'Deleted' } } );
            request = Requests.collection._transform( request );
        }
        Modal.hide();
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
        let isPPM = isRequestPPM(request);

        Modal.show( {
            content: <AutoForm
            model = { isPPM ? PPM_Schedulers : Requests }
            item = { request }
            form = {
                [ 'rejectComment' ]
            }
            onSubmit = {
                ( request ) => {
                    if (isPPM) {
                        PPM_Schedulers.update( request._id, { $set: { status: 'Cancelled' } } );
                        request = PPM_Schedulers.collection._transform( request );
                    } else {
                        Requests.update( request._id, { $set: { status: 'Cancelled' } } );
                        request = Requests.collection._transform( request );
                    }

                    Modal.hide();

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
        let isPPM = isRequestPPM(request);
        if (isPPM) {
            Meteor.call( 'PPM_Schedulers.issue', request );
        } else {
            Meteor.call( 'Issues.issue', request );
        }
        callback( request );
        request.markAsUnread();
    }
});

// issues an invoice
const issueInvoice = new Action( {
    name: "issue invoice",
    type: 'request',
    verb: "issued an invoice",
    label: "Issue",
    action: ( request, callback ) => {
        // I think this is quite a good model for how these actions should be structured
        // we might even reach a point where it can be action: 'Issues.issue'?
        if (isRequestPPM(request)) {
            Meteor.call( 'PPM_Schedulers.issue', request );
        } else {
            Meteor.call( 'Issues.issue', request );
        }
        callback( request );
        request.markAsUnread();
    }
} )

// reissues an invoice
const reissueInvoice = new Action( {
    name: "reissue invoice",
    type: 'request',
    verb: "reissued an invoice",
    label: "ReIssue",
    action: ( request, callback ) => {
        // I think this is quite a good model for how these actions should be structured
        // we might even reach a point where it can be action: 'Issues.issue'?
        if (isRequestPPM(request)) {
            Meteor.call( 'Issues.issue', request );
        } else {
            Meteor.call( 'PPM_Schedulers.issue', request );
        }
        callback(request);
        request.markAsUnread();
    }
})

const accept = new Action( {
    name: "accept request",
    type: 'request',
    verb: "accepted a work order",
    label: "Assign",
    action: ( request, callback ) => {
        let isPPM = isRequestPPM(request);
        Modal.show( {
            content: <AutoForm
            title = "Please provide eta and, if appropriate, an assignee."
            model = { isPPM ? PPM_Schedulers : Requests }
            item = { request }
            form = {
                ['eta','assignee','acceptComment']
            }
            onSubmit = {
                ( request ) => {
                    //Requests.update( request._id, { $set: { status: 'In Progress' } } );
                    let updateModifier = {
                      $set: {
                        eta: request.eta,
                        acceptComment: request.acceptComment
                      }
                    };
                    if (isPPM) {
                        PPM_Schedulers.update(request._id, updateModifier);
                        request = PPM_Schedulers.collection._transform(request);
                    } else {
                        Requests.update(request._id, updateModifier);
                        request = Requests.collection._transform(request);
                    }

                    Modal.hide();

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
        let isPPM = isRequestPPM(request);
        Modal.show( {
            content: <AutoForm
              title="What is your reason for rejecting this request?"
              model={ isPPM ? PPM_Schedulers : Requests }
              item={ request }
              form={
                ['rejectComment']
              }
              onSubmit={
                (request) => {
                  let updateModifier = {$set: {status: 'Rejected'}};

                  if (isPPM) {
                    PPM_Schedulers.update(request._id, updateModifier);
                    request = PPM_Schedulers.collection._transform(request);
                  } else {
                    Requests.update(request._id, updateModifier);
                    request = Requests.collection._transform(request);
                  }
                  Modal.hide();

                  request.distributeMessage({
                    message: {
                      verb: "rejected",
                      subject: `Work order ${request.code} has been rejected`,
                      body: request.rejectComment
                    }
                  });
                  request.markAsUnread();
                  callback(request);
                }
              }
            />
        } )
    }
});

const getQuote = new Action( {
    name: "get request quote",
    type: 'request',
    label: "Get quote",
    action: ( request, callback ) => {
        let isPPM = isRequestPPM(request);
        Modal.show( {
            content: <AutoForm
            model = { isPPM ? PPM_Schedulers : Requests }
            item = { request }
            form = { isPPM ? CreatePPMRequestForm : CreateRequestForm }
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
        let isPPM = isRequestPPM(request);
        Modal.show( {
            content: <AutoForm
            model = { isPPM ? PPM_Schedulers : Requests }
            item = { request }
            form = { isPPM ? CreatePPMRequestForm : CreateRequestForm}
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
    action: ( request ) => {
        if(request.callback && !_.isEmpty(request.callback)){
            var callback = request.callback;
            request = _.omit(request,'callback');
        }
        let isPPM = isRequestPPM(request);

        Modal.show( {
            content: <AutoForm
            title = "All done? Great! We just need a few details to finalise the job."
            model = { isPPM ? PPM_Schedulers : Requests }
            item = { request }
            form = {
                [ 'closeDetails' ]
            }
            onSubmit = {
                ( request ) => {
                    Modal.hide();
                    if (isPPM) {
                      Meteor.call( 'PPM_Schedulers.complete', request );
                    } else {
                      Meteor.call( 'Issues.complete', request );
                    }
                    if(callback){
                        callback( request );
                    }
                    request.markAsUnread();
                }
            }
            />
        } )
    }
} )

const invoice = new Action( {
    name: 'invoice request',
    type: 'request',
    verb: "invoiced a work order",
    label: "Invoice",
    action: ( request ) => {
        if(request.callback && !_.isEmpty(request.callback)){
            var callback = request.callback;
            request = _.omit(request,'callback');
        }

        let isPPM = isRequestPPM(request);

        var invoiceNumber = "";
        request.invoiceDetails = {};
        request.invoiceDetails.details = request.name ? request.name : "";
        if ( request.supplier ) {
            let supplier = Teams.findOne( {
                _id: request.supplier._id
            } );
            invoiceNumber = supplier.getNextInvoiceNumber();
            request.invoiceDetails.invoiceNumber = invoiceNumber;
            }
            request.invoiceDetails.invoiceDate = new Date();
        Modal.show( {
            content: <AutoForm
            title = "Create an Invoice for the completed work order."
            model = { isPPM ? PPM_Schedulers : Requests }
            item = { request }
            form = {
                [ 'invoiceDetails' ]
            }
            onSubmit = {
                ( request ) => {
                    Modal.hide();
                    if (isPPM) {
                        Meteor.call( 'PPM_Schedulers.invoice', request );
                    } else {
                        Meteor.call( 'Issues.invoice', request );
                    }
                    if(callback){
                        callback( request );
                    }
                    request.markAsUnread();
                }
            }
            />
        } )
    }
} )

const editInvoice = new Action( {
    name: 'edit invoice',
    type: 'request',
    verb: "editted an invoice",
    label: "Edit",
    action: ( request, callback ) => {
        let oldRequest = Object.assign( {}, request );
        Modal.show( {
            content:
                <AutoForm
            title = "Edit Invoice"
            model = { Requests }
            item = { request }
            form = { ['invoiceDetails'] }
            submitText="Save"
            onSubmit = {
                ( request ) => {
                    if ( request.invoiceDetails.invoice ) {
                        $.each( request.invoiceDetails.invoice, function( key, value ) {
                          //request.attachments.push( value );
                          let file = Files.findOne({_id:value._id}),
                              filename = file && file.original && file.original.name,
                              fileExists = false;
                          $.each(request.attachments, function(k, v){
                            let f = Files.findOne({_id:v._id});
                            fname = f && f.original && f.original.name;
                            if (filename == fname) {
                                fileExists =  true;
                            }
                          });
                          if (!fileExists) {
                            request.attachments.push( value );
                          }

                        });
                    }
                    Requests.save.call( request ).then((request)=>{
                        Modal.hide();
                    });
                }
            }
            />
        } )
    }
} )

const deleteInvoice = new Action( {
    name: "delete invoice",
    type: 'request',
    label: "Delete",
    shouldConfirm: true,
    verb: 'deleted invoice',
    action: ( request, callback ) => {
        var invoice = request.invoiceDetails;
        Requests.update( request._id, { $set: { invoiceDetails: null } } );
        Modal.hide();
        request = Requests.collection._transform( request );
        request.distributeMessage( {
            message: {
                verb: "deleted",
                subject: `Invoice number ${invoice.invoiceNumber} has been deleted`,
                body: invoice.details
            }
        } );
        callback( request );
    }
} )

const close = new Action({
  name: "close request",
  type: 'request',
  verb: "closed a work order",
  label: "close",
  action: (request, callback) => {
    let isPPM = isRequestPPM(request);
    Modal.show({
      content: <AutoForm
        title="Please leave a comment about the work for the suppliers record"
        model={ isPPM ? PPM_Schedulers : Requests }
        item={ request }
        form={
          ['closeComment']
        }
        onSubmit={
          (request) => {
            if (isPPM) {
              PPM_Schedulers.update( request._id, { $set: { status: 'Closed' } } );
              request = PPM_Schedulers.collection._transform( request );
            } else {
              Requests.update(request._id, {$set: {status: 'Closed'}});
              request = Requests.collection._transform(request);
            }
            request.distributeMessage({
              message: {
                verb: "closed",
                subject: `Work order ${request.code} has been closed`,
                body: request.closeComment
              }
            });
            request.markAsUnread();
            Modal.hide();
            callback(request);
          }
        }
      />
    })
  }
})

const reopen = new Action({
  name: "reopen request",
  type: 'request',
  label: "Reopen",
  action: (request, callback) => {
    let isPPM = isRequestPPM(request);
    Modal.show({
      content: <AutoForm
        model={ isPPM ? PPM_Schedulers : Requests }
        item={ request }
        form={
          ['reopenComment']
        }
        onSubmit={
          (request) => {
            if (isPPM) {
              PPM_Schedulers.update(request._id, {$set: {status: 'Issued'}});
              request = PPM_Schedulers.collection._transform(request);
            } else {
              Requests.update(request._id, {$set: {status: 'Issued'}});
              request = Requests.collection._transform(request);
            }
            Modal.hide();

            request.distributeMessage({
              message: {
                verb: "reopened",
                subject: `Work order ${request.code} has been reopened`,
                body: request.reopenComment
              }
            });
            request.markAsUnread();
            callback(request);
          }
        }
      />
    })
  }
})

const reverse = new Action( {
    name: "reverse request",
    type: 'request',
    label: "Reverse",
    action: ( request ) => {
        let isPPM = isRequestPPM(request);
        Modal.show( {
            content: <AutoForm
            model = { isPPM ? PPM_Schedulers : Requests }
            item = { request }
            form = {
                [ 'reverseComment' ]
            }
            onSubmit = {
                ( request ) => {
                    if (isPPM) {
                      PPM_Schedulers.update( request._id, { $set: { status: 'Reversed' } } )
                    } else {
                      Requests.update( request._id, { $set: { status: 'Reversed' } } )
                    }
                    Modal.hide();
                }
            }
            />
        } )
    }
});

const clone = new Action({
  name: "clone request",
  type: 'request',
  label: "Issue",
  action: (request) => {
    request = Requests.collection._transform(request);
    if (request.code) {
      let team = Teams.findOne( {
        _id: request.team._id
      });
      request.code = team.getNextWOCode();
    }
    let dueDate = request.getNextDate();
    let newRequest = Object.assign({}, request, {
      _id: Random.id(),
      incidenceDate: getDefaultDueDate(request),
      createdAt: new Date(),
      dueDate: dueDate,
      status: 'Issued',
      type: 'Preventative'
    });

    Modal.replace({
      content: //<DropFileContainer request={newRequest} model={Requests}>
        <RequestPanel item={ newRequest }/>
      //</DropFileContainer>
    });
    Meteor.call('Issues.issue', newRequest);
  }
});

function isRequestPPM(request) {
    return [
        'Schedular',
        'Scheduler',
        // 'Preventative' // Preventative is a WO and not a PPM Scheduler
    ].indexOf(request.type) > -1
}


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
    invoice,
    issueInvoice,
    reissueInvoice,
    editInvoice,
    deleteInvoice,
    //close,
    reopen,
    //reverse,
    clone
}
