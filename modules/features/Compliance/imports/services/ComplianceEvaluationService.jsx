import { Facilities } from '/modules/models/Facilities';
import { Requests, RequestPanel, RequestActions } from '/modules/models/Requests';
import { Documents, DocViewEdit } from '/modules/models/Documents';
import { TeamActions } from '/modules/models/Teams';
import React from 'react';
import moment from 'moment';

ComplianceEvaluationService = new function() {

    var defaultResult = {
        passed: false,
        message: {
            summary: "failed"
        },
        loader: false,
        resolve() {
            alert( 'No resolution available' );
        }
    }


    var docList1 = [
            "Audit",
            "Contract",
            "Inspection",
            "Invoice",
            "MSDS",
            "Plan",
            "Assessment",
            "Confirmation",
            "Certificate",
            "Log",
            "Management Plan",
            "Procedure",
            "Quote",
            "Registration",
            "Licence",
            "Report",
            "Service Report",
            "SWMS",
        ],
        docList2 = [
            'Bank Guarantee',
            'Contract',
            'Emergency Management',
            'Insurance',
            'Lease',
            'Quote',
            'Register',
            'Registration'
        ];

    var evaluators = {
        //can pass in facility and service for more efficient calculation
        "Document exists": function( rule, facility, service ) {
             let houseRule = false;
             let reqService
             let reqSubService
             if(rule.service.name === "House Rules"){
               houseRule = true;
               if(facility.hasOwnProperty("servicesRequired")){
                 reqService = facility.servicesRequired != undefined && facility.servicesRequired.length > 0 ? facility.servicesRequired.filter((service) => service != null && service.name === "WHS & Risk Management") : ''
                 reqSubService = reqService.length > 0 && reqService[0].children.length > 0 ? reqService[0].children.filter((sub)=> sub.name === "House Rules") : ''
               }
             }
            var docCount = null,
                docs = null,
                docName = null,
                docCurser = null,
                tomorrow = moment( moment().add( 1, "days" ).format( "MM-DD-YYYY" ), "MM-DD-YYYY" ).toDate(),
                query = rule.document && rule.document.query ?
                JSON.parse( rule.document.query ) : {
                    "facility._id": facility[ "_id" ],
                    $and: [
                        { type: rule.docType },
                        { name: { $regex: rule.docName || "", $options: "i" } }
                    ]
                };
                if(houseRule){
                  query = rule.document && rule.document.query ?
                  JSON.parse( rule.document.query ) : {
                      "facility._id": facility[ "_id" ],
                      $and: [
                          { type: "Confirmation" },
                          { 'serviceType.name': 'WHS & Risk Management'},
                          { 'subServiceType.name': 'House Rules'}
                      ]
                  };
                }

            //----- Solution for "370 Docklands Dve"
            while(_.isString(query)) {
                query = JSON.parse( query );
            }
            //------
            if ( !rule.document && rule.docSubType ) {
                query.$and.push( {
                    [ `${rule.docType.charAt(0).toLowerCase()+rule.docType.slice(1)}Type` ]: rule.docSubType
                } );
            }
            if ( _.contains( docList1, rule.docType ) ) {
                query.$and.push( { 'serviceType.name': rule.service.name } );
            }
            if ( _.contains( docList2, rule.docType ) ) {
                query && query.$and.push( { expiryDate: { $gte: tomorrow } } );
            }
            docCurser = query && Documents.find( query );
            docCount = docCurser.count();
            docs = docCurser.fetch();
            if ( docs && docs.length ) {
                let doc = docs[ docCount - 1 ];
                docName = doc.name;
            }
            if ( docCount ) {
                return _.extend( {}, defaultResult, {
                    passed: true,
                    message: {
                        summary: "passed",
                        detail: docCount + " " + ( docName ? ( docName + " " ) : "" ) + "documents exists."
                    },
                    resolve: function(r, callback ){
                        console.log('checking ---ONE ONE --debug--------')
                        let docForModal = false;
                        if( typeof doc != 'undefined' ){
                            docForModal = doc;
                        }else if( docs.length > 0 ){
                            docForModal = docs[0];
                        }
                        if( docForModal != false ){
                             Modal.show( {
                                content: <DocViewEdit
                                    item = { docForModal }
                                    onChange={ ( docForModal ) => {
                                        callback({});
                                    }}
                                />
                            })
                        }


                    }
                } )
            }

            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail: "Create document"
                },
                loader: true,
                resolve: function(r, callback) {
                    let type = "team",
                        team = Session.getSelectedFacility(),
                        _id = team._id,
                        name = team.name,
                        owner = Meteor.user(),
                        newDocument = Documents.create( {
                            team: { _id, name },
                            owner: { type, _id, name },
                            name: rule.docName,
                            type: houseRule ? "Confirmation" :rule.docType,
                            serviceType: houseRule ? reqService[0] : rule.service,
                            subServiceType: houseRule ? reqSubService[0] : ''
                        } );
                    if ( rule.docSubType ) {
                        if ( rule.docType == "Insurance" ) newDocument.insuranceType = rule.docSubType;
                        else if ( rule.docType == "Validation Report" ) newDocument.reportType = rule.docSubType;
                        else if ( rule.docType == "Confirmation" ) newDocument.confirmationType = rule.docSubType;
                        else if ( rule.docType == "Log" ) newDocument.logType = rule.docSubType;
                        else if ( rule.docType == "Certificate" ) newDocument.certificateType = rule.docSubType;
                        else if ( rule.docType == "Register" ) newDocument.registerType = rule.docSubType;
                        else if ( rule.docType == "Registration" ) newDocument.registrationType = rule.docSubType;
                        else if ( rule.docType == "Procedure" ) newDocument.procedureType = rule.docSubType;
                    }
                    Modal.show( {
                        content: <DocViewEdit
                                    item = { newDocument }
                                    model={Facilities}
                                    onChange={ ( doc ) => {
                                        callback({});
                                    }}
                                />
                    } )
                }
            } )
        },
        "Document is current": function( rule, facility, service ) {
            // if( !rule || !rule.document ) {
            //     return;
            // }
            var doc = null,
                yesterday, tomorrow, today,
                query = rule.document && rule.document.query ?
                JSON.parse( rule.document.query ) : {
                    "facility._id": facility[ "_id" ],
                    $and: [
                        { type: rule.docType },
                        { name: { $regex: rule.docName || "", $options: "i" } }
                    ]
                };
            //----- Solution for "370 Docklands Dve"
            while(_.isString(query)) {
                query = JSON.parse( query );
            }
            //-----
            if ( !rule.document && rule.docSubType ) {
                query.$and.push( {
                    [ `${rule.docType.charAt(0).toLowerCase()+rule.docType.slice(1)}Type` ]: rule.docSubType
                } );
            }
            if ( _.contains( docList1, rule.docType ) ) {
                query.$and.push( { 'serviceType.name': rule.service.name } );
            }
            if ( _.contains( docList2, rule.docType ) ) {
                //format of timestamp should be as Jan 01 2017 00:00:00 GMT (IST).
                yesterday = moment( moment().subtract( 1, "days" ).format( "MM-DD-YYYY", "MM-DD-YYYY" ) ).toDate();
                tomorrow = moment( moment().add( 1, "days" ).format( "MM-DD-YYYY" ), "MM-DD-YYYY" ).toDate();
                today = Object.assign( {}, { $gt: yesterday, $lt: tomorrow } );
                query.$and.push( { expiryDate: today } );
            }
            doc = query && Documents.findOne( query );
            if ( doc ) {
                return _.extend( {}, defaultResult, {
                    passed: true,
                    message: {
                        summary: "passed",
                        detail: ( doc.name ? ( doc.name + " " ) : "" )
                    },
                    resolve: function(r, callback ){
                        Modal.show( {
                            content: <DocViewEdit
                                item = { doc }
                                onChange={ ( doc ) => {
                                    callback({});
                                }}
                            />
                        })
                    }
                } )
            }

            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail: "Create document"
                },
                loader: true,
                resolve: function(r, callback) {
                    let type = "team",
                        team = Session.getSelectedFacility(),
                        _id = team._id,
                        name = team.name,
                        owner = Meteor.user();

                    let newDocument = Documents.create( {
                        team: { _id, name },
                        owner: { type, _id, name },
                        name: rule.docName,
                        type: rule.docType,
                        serviceType: rule.service,
                    } );
                    if ( rule.docSubType ) {
                        if ( rule.docType == "Insurance" ) newDocument.insuranceType = rule.docSubType;
                        else if ( rule.docType == "Validation Report" ) newDocument.reportType = rule.docSubType;
                        else if ( rule.docType == "Confirmation" ) newDocument.confirmationType = rule.docSubType;
                        else if ( rule.docType == "Log" ) newDocument.logType = rule.docSubType;
                        else if ( rule.docType == "Certificate" ) newDocument.certificateType = rule.docSubType;
                        else if ( rule.docType == "Register" ) newDocument.registerType = rule.docSubType;
                        else if ( rule.docType == "Registration" ) newDocument.registrationType = rule.docSubType;
                        else if ( rule.docType == "Procedure" ) rnewDocument.procedureType = rule.docSubType;
                    }
                    Modal.show( {
                        content: <DocViewEdit
                            item = { newDocument }
                            model={Facilities}
                            onChange={ ( doc ) => {
                                callback({});
                            }}
                        />
                    } )
                }
            } )
        },
        "PPM exists": function( rule, facility, service ) {
            if ( !facility ) {
                return _.extend( {}, defaultResult, {
                    passed: false,
                    message: {
                        summary: "failed",
                        detail: "Facility not specified"
                    }
                } )
            } else if ( !rule.service ) {
                return _.extend( {}, defaultResult, {
                    passed: false,
                    message: {
                        summary: "failed",
                        detail: "Service not specified"
                    }
                } )
            }
            let serviceReq ;
            if(facility && facility.hasOwnProperty("servicesRequired")){
              let allServices = _.filter(facility.servicesRequired, service => service != null);
              if(allServices.length > 0){
                serviceReq = allServices.filter((val) => rule.service.name === val.name)
              }
            }
            var requestCurser = Requests.find( { 'facility._id': facility._id,status: {$nin:["Deleted"]} , 'service.name': rule.service.name, type: "Preventative" } );
            var numEvents = requestCurser.count();
            var requests = requestCurser.fetch();
            if ( numEvents ) {
                return _.extend( {}, defaultResult, {
                    passed: true,
                    message: {
                        summary: "passed",
                        detail: numEvents + " " + ( rule.service.name ? ( rule.service.name + " " ) : "" ) + "PMP exists"
                    },
                    resolve: function() {
                        let establishedRequest = requests[ numEvents - 1 ];
                        RequestActions.view.bind( establishedRequest ).run();
                    }
                } )
            }
            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail: "Set up " + ( rule.service.name ? ( rule.service.name + " " ) : "" ) + "PPM"
                },
                loader: true,
                resolve: function(r,callback) {
                    let preSelectedFacility = Facilities.findOne({ _id: facility._id });
                    let team = Session.getSelectedTeam();
                    let newRequest = Requests.create( {
                        facility: preSelectedFacility,
                        team: team,
                        type: 'Preventative',
                        priority: 'Scheduled',
                        status: 'PPM',
                        name: rule.event,
                        frequency: rule.frequency,
                        service: serviceReq[0],
                        subservice: rule.subservice
                    } );
                    //Meteor.call( 'Issues.save', newRequest );
                    TeamActions.createRequest.bind( team, callback, newRequest ).run();
                }
            } )
        },
        "PPM event completed": function( rule, facility, service ) {
            var event, query;
            if ( rule.event ) {
                query = {
                    'facility._id': rule.facility._id,
                    name: rule.event,
                    "service.name": rule.service.name,
                    status: {$in:["PMP","PPM"]}
                }
                if (rule.subservice) query["subservice.name"] = rule.subservice.name;
                event = Requests.findOne( query );
            }

            let nextDate,
                previousDate,
                frequency,
                serviceReq;

            if(facility && facility.hasOwnProperty("servicesRequired")){
              let allServices = _.filter(facility.servicesRequired, service => service != null);
              if(allServices.length > 0){
                serviceReq = allServices.filter((val) => rule.service.name === val.name)
              }
            }
            if ( event ) {
                nextDate = event.getNextDate(),
                previousDate = event.getPreviousDate();
            }
            if ( event ) {
                let nextRequest = Requests.findOne( _.extend( query, {
                    type:"Ad-Hoc",
                    priority: {$in:["PPM","PMP","Scheduled"]},
                    status: "Complete",
                    dueDate:nextDate
                })),
                previousRequest = Requests.findOne( _.extend( query, {
                    type:"Ad-Hoc",
                    priority: {$in:["PPM","PMP","Scheduled"]},
                    status: "Complete",
                    dueDate:previousDate
                })),
                nextDateString = null,
                frequency = event.frequency || {},
                previousDateString = null;
               if( nextDate ) {
                   nextDateString = moment( nextDate ).format('ddd Do MMM YYYY');
               }
               if( previousDate ) {
                   previousDateString = moment( previousDate ).format('ddd Do MMM YYYY');
               }
               if (nextRequest || previousRequest) {
                   return _.extend( {}, defaultResult, {
                       passed: true,
                       message: {
                           summary: "passed",
                           detail: function(){
                               return (
                                   <div style={{width:"95%", marginTop:"-25px", marginLeft:"55px"}}>
                                       <div className = "issue-summary-col" style = {{width:"45%"}}
                                           onClick={(e) => {
                                                e.stopPropagation();
                                                if (previousRequest)
                                                    Modal.show( {
                                                        id: `viewRequest-${event._id}`,
                                                        content: <RequestPanel item = { previousRequest } />
                                                    } );
                                           }}
                                           >
                                           {( previousDateString && previousRequest) ?
                                               <div>
                                                   <span>Last Completed <b>{ previousDateString }</b> </span>
                                                   { previousRequest ?
                                                       <span className = {`label label-${previousRequest.status}`}>{ previousRequest.status } </span>
                                                   : "N/A" }
                                               </div>
                                           : <div>Last Completed N/A</div> }
                                       </div>
                                       <div className = "issue-summary-col" style = {{width:"45%"}}
                                           onClick={(e) => {
                                                e.stopPropagation();
                                                if (nextRequest)
                                                    Modal.show( {
                                                        id: `viewRequest-${event._id}`,
                                                        content: <RequestPanel item = { nextRequest }/>
                                                    } );
                                           }}
                                           >
                                           { (nextDateString && nextRequest) ?
                                               <div>
                                                   <span>Next Due <b>{ nextDateString }</b> </span>
                                                   { nextRequest ?
                                                       <span className = {`label label-${nextRequest.status}`}>{ nextRequest.status } </span>
                                                   : "N/A"}
                                               </div>
                                           : <div>Next Due N/A</div> }
                                       </div>
                                   </div>
                                );
                            }
                        },
                        data: event,
                        resolve: function(r, callback) {
                            Modal.show( {
                                id: `viewRequest-${event._id}`,
                                content: <RequestPanel item = { event } callback={callback}/>
                            } );
                        }
                    } )
               }

            }

            let q = {
                "facility._id": facility._id,
                status: {$in:["PMP","PPM"]},
                "service.name": rule.service.name,
                name: rule.event
            };
            if (rule.subservice){
                 q["subservice.name"] = rule.subservice.name;
            }
            let request = Requests.findOne( q );
            let message = {}
            let passed = false;
            let summary = "failed"
            if(request && previousDate && nextDate){
                let nextRequest = request.findCloneAt( nextDate ),
                    previousRequest = request.findCloneAt(previousDate),
                    nextDateString = moment( nextDate ).format('ddd Do MMM YYYY'),
                    previousDateString = moment( previousDate ).format('ddd Do MMM YYYY');
                if (nextRequest || previousRequest) {
                    summary = previousRequest ? "failed" : (nextRequest && nextRequest.status == "Issued" ? "passed" : "failed"),
                    passed = previousRequest ? false : (nextRequest && nextRequest.status == "Issued" ? true : false),
                    message = {
                        summary: summary,
                        //detail: 'Last completed '+moment( previousDate ).format( 'ddd Do MMM YYYY' )+' ➡️️ '+'Next due date is '+moment( nextDate ).format( 'ddd Do MMM YYYY' )
                        detail: (previousRequest? 'Last Overdue ➡️️ '+previousDateString+'':'')+(nextDate?'Next due '+nextDateString+'':'Next due '+nextDateString+'')
                    }
                }else{
                    message = {
                        summary: summary,
                        detail: "No PPM WO issued. Click here to issue "+( rule.service.name ? ( rule.service.name + " " )+" " : "" )+"PPM WO"
                    }
                }

                return _.extend( {}, defaultResult, {
                    passed: passed,
                    message: message,
                    loader: false,
                    resolve: function(r, callback) {
                        let team = Session.getSelectedTeam();
                        if(previousRequest){
                            Modal.show( {
                                id: `viewRequest-${event._id}`,
                                content: <RequestPanel item = { previousRequest } callback={callback}/>
                            } );
                        }else if(nextRequest){
                            if(nextRequest.status == "Issued"){
                                Modal.show( {
                                    id: `viewRequest-${event._id}`,
                                    content: <RequestPanel item = { nextRequest } callback={callback}/>
                                } );
                            }else{
                                Modal.show( {
                                    id: `viewRequest-${event._id}`,
                                    content: <RequestPanel item = { request } callback={callback}/>
                                } );
                            }
                        }else if(request){
                            Modal.show( {
                                id: `viewRequest-${request._id}`,
                                content: <RequestPanel item = { request } callback={callback}/>
                            } );
                        }
                    }
                } )
            }else if(!request){
                message = {
                    summary: summary,
                    detail: "No PPM exists. Click here to set up "+( rule.service.name ? ( rule.service.name + " " )+" " : "" )+"PPM"
                }
            }
            return _.extend( {}, defaultResult, {
                passed: passed,
                message: message,
                loader: false,
                resolve: function(r, callback) {
                    let team = Session.getSelectedTeam();
                    console.log('attempting to resolve' );
                    // If PPM event exists.
                    if ( request ) {
                        Modal.show( {
                            id: `viewRequest-${request._id}`,
                            content: <RequestPanel item = { request } callback={callback}/>
                        } );
                    } else if ( !request ) { // If no PPM event exists.
                        let preSelectedFacility = Facilities.findOne({ _id: facility._id });
                        let newRequest = Requests.create( {
                            facility: preSelectedFacility,
                            team: team,
                            type: 'Preventative',
                            priority: 'Scheduled',
                            status: 'PMP',
                            name: rule.event,
                            frequency: frequency,
                            service: serviceReq[0],
                            subservice: rule.subservice || {},
                        } );
                        TeamActions.createRequest.bind( team, callback, newRequest ).run();
                    }
                }
            } )
        },
        /*"PPM event completed": function( rule, facility, service ) {
            var event, query;
            if ( rule.event ) {
                query = {
                    'facility._id': rule.facility._id,
                    name: rule.event,
                    "service.name": rule.service.name,
                    status: {$in:["PMP","PPM"]}
                }
                if (rule.subservice) query["subservice.name"] = rule.subservice.name;
                event = Requests.findOne( query );
            }

            let nextDate,
                previousDate,
                frequency,
                serviceReq;

            if(facility && facility.hasOwnProperty("servicesRequired")){
              if(facility.servicesRequired.length > 0){
                serviceReq = facility.servicesRequired.filter((val) => rule.service.name === val.name)
              }
            }
            if ( event ) {
                nextDate = event.getNextDate(),
                previousDate = event.getPreviousDate();
            }
            console.log(event,"event 11111111");
            console.log(nextDate,"nextDate 111111");
            console.log(previousDate,"previousDate 111111");
            if ( event ) {
                let nextRequest = Requests.findOne( _.extend( query, {
                    type:"Preventative",
                    priority: {$in:["PPM","PMP","Scheduled"]},
                    status: {$in:["Complete","Issued"]},
                    dueDate:nextDate
                })),
                previousRequest = Requests.findOne( _.extend( query, {
                    type:"Preventative",
                    priority: {$in:["PPM","PMP","Scheduled"]},
                    status: {$in:["Complete","Issued"]},
                    dueDate:previousDate
                })),
                nextDateString = null,
                frequency = event.frequency || {},
                previousDateString = null;
               if( nextDate ) {
                   nextDateString = moment( nextDate ).format('ddd Do MMM YYYY');
               }
               if( previousDate ) {
                   previousDateString = moment( previousDate ).format('ddd Do MMM YYYY');
               }
               console.log(nextRequest,"nextRequest");
               console.log(previousRequest,"previousRequest");
               if (nextRequest || previousRequest) {
                   return _.extend( {}, defaultResult, {
                       passed: previousRequest ? (previousRequest.status == "Complete" ? true : false) : (nextRequest ? true : false),
                       message: {
                           summary: previousRequest ? (previousRequest.status == "Complete" ? "passed" : "failed") : (nextRequest ? "passed" : "failed"),
                           //detail: 'Last completed '+moment( previousDate ).format( 'ddd Do MMM YYYY' )+' ➡️️ '+'Next due date is '+moment( nextDate ).format( 'ddd Do MMM YYYY' ),
                           detail: (previousRequest ? (( previousRequest.status == "Complete"?'Last completed ':'Last overdue ')+previousDateString) : '')+' ➡️️ '+(nextRequest ? (nextRequest.status == "Complete"?"Next completed ":"Next due ")+nextDateString : '')
                           //summary: "passed",
                           //detail: `${previousRequest?'Last completed '+moment( previousDate ).format( 'ddd Do MMM' )+' ➡️️ ':""}Next due date is ${moment( nextDate ).format( 'ddd Do MMM' )}`
                        },
                        data: event,
                        resolve: function(r, callback) {
                            if (previousRequest){
                                if(previousRequest.status != "Complete"){
                                    Modal.show( {
                                        id: `viewRequest-${event._id}`,
                                        content: <RequestPanel item = { previousRequest } callback={callback}/>
                                    } );
                                }else{
                                    if(nextRequest){
                                        if(nextRequest.status == "Complete" || nextRequest.status == "Issued"){
                                            Modal.show( {
                                                id: `viewRequest-${event._id}`,
                                                content: <RequestPanel item = { nextRequest } callback={callback}/>
                                            } );
                                        }else{
                                            Modal.show( {
                                                id: `viewRequest-${event._id}`,
                                                content: <RequestPanel item = { event } callback={callback}/>
                                            } );
                                        }
                                    }
                                }
                            }else{
                                if(nextRequest){
                                    if(nextRequest.status == "Complete" || nextRequest.status == "Issued"){
                                        Modal.show( {
                                            id: `viewRequest-${event._id}`,
                                            content: <RequestPanel item = { nextRequest } callback={callback}/>
                                        } );
                                    }else{
                                        Modal.show( {
                                            id: `viewRequest-${event._id}`,
                                            content: <RequestPanel item = { event } callback={callback}/>
                                        } );
                                    }
                                }
                            }
                        }
                    } )
               }

            }
            console.log(event,"second");
            let q = {
                "facility._id": facility._id,
                status: {$in:["PMP","PPM"]},
                "service.name": rule.service.name,
                name: rule.event
            };
            if (rule.subservice){
                 q["subservice.name"] = rule.subservice.name;
            }
            let request = Requests.findOne( q );
            console.log(request,"request");
            console.log(previousDate,"previousDate");
            console.log(nextDate,"nextDate");
            let message = {}
            let passed = false;
            let summary = "failed"
            if(request && previousDate && nextDate){
                passed = false
                summary = "failed"
                message = {
                    summary: summary,
                    //detail: 'Last Overdue '+moment( previousDate ).format( 'ddd Do MMM YYYY' )+' ➡️️ '+'Next Due '+moment( nextDate ).format( 'ddd Do MMM YYYY' )
                    detail: "No PPM exists. Click here to set up "+( rule.service.name ? ( rule.service.name + " " )+" " : "" )+"PPM"
                }
            }else{
                    console.log("@@@@@@@@@@@@@");
                message = {
                    summary: summary,
                    detail: "No PPM exists. Click here to set up "+( rule.service.name ? ( rule.service.name + " " )+" " : "" )+"PPM"
                }
            }
                console.log(message,"message");
            return _.extend( {}, defaultResult, {
                passed: passed,
                message: message,
                loader: false,
                resolve: function(r, callback) {
                    let team = Session.getSelectedTeam();
                    console.log('attempting to resolve' );
                    // If PPM event exists.
                    if ( request ) {
                        Modal.show( {
                            id: `viewRequest-${request._id}`,
                            content: <RequestPanel item = { request } callback={callback}/>
                        } );
                    } else if ( !request ) { // If no PPM event exists.
                        let preSelectedFacility = Facilities.findOne({ _id: facility._id });
                        let newRequest = Requests.create( {
                            facility: preSelectedFacility,
                            team: team,
                            type: 'Preventative',
                            priority: 'Scheduled',
                            status: 'PMP',
                            name: rule.event,
                            frequency: frequency,
                            service: serviceReq[0],
                            subservice: rule.subservice || {},
                        } );
                        TeamActions.createRequest.bind( team, callback, newRequest ).run();
                    }
                    //    Meteor.call( 'Issues.save', newRequest );
                }
            } )
        },*/
        "Compliance level": function( rule, facility, service ){
            let allServices = Session.getSelectedFacility().servicesRequired
            let selectedService = _.filter(allServices, service => service != null);
            selectedService = _.filter(selectedService, service => service.name === rule.service.name);
            let query = {
                "facility._id": rule.facility._id,
                "service.name": rule.service.name,
                "priority": "Scheduled",
                "status": "Complete",
            },
            docQuery = {
                "facility._id": rule.facility._id,
                "serviceType.name": rule.service.name,
                'type': rule.docType
            },
            count = 0;
            if(rule.subservice){
              docQuery = {
                  "facility._id": rule.facility._id,
                  "serviceType.name": rule.service.name,
                  "subServiceType.name": rule.subservice.name,
                  'type': rule.docType
              }
            }
            if ( rule.docType == "Service Report"){
                for (let i=0; i<=12; i++  ) {
                    query["closeDetails.completionDate"] = {
                        "$gte": new moment().subtract(i, "months").startOf("months").toDate(),
                        "$lte": new moment().subtract(i, "months").endOf("months").toDate()
                    }
                    let request = Requests.findOne(query);
                    if (request) {
                        if (request.closeDetails && request.closeDetails.serviceReport && request.closeDetails.serviceReport._id){
                            count++;
                        }
                    }

                }
                for (let i=0; i<=12; i++  ) {
                    docQuery["applicablePeriodStartDate"] = {
                        "$gte": new moment().subtract(i, "months").startOf("months").toDate(),
                        "$lte": new moment().subtract(i, "months").endOf("months").toDate()
                    }
                    let test = Documents.find(docQuery).fetch();
                    if (test) {
                      if(test.length > 0){
                        count++;
                      }
                    }

                }
                //  console.log(Documents.find( {
                //   "facility._id": rule.facility._id,
                //   "serviceType.name": rule.service.name,
                //   'type': 'Service Report',
                //   'applicablePeriodStartDate':{
                //      "$gte": new moment().subtract(0, "months").startOf("months").toDate(),
                //      "$lte": new moment().subtract(0, "months").endOf("months").toDate()
                //  }} ).fetch());
                if (count == 12) {
                    return _.extend( {}, defaultResult, {
                        passed: true,
                        message: {
                            summary: "passed",
                            detail: count + " out of 12 service reports"
                        },
                    } )
                }
                  return _.extend( {}, defaultResult, {
                      passed: false,
                      message: {
                          summary: "failed",
                          detail: count + " out of 12 service reports"
                      },
                      resolve: function(r,update) {
                          let type = "team",
                              team = Session.getSelectedFacility(),
                              _id = team._id,
                              name = team.name,
                              owner = Meteor.user(),
                              newDocument = Documents.create( {
                                  team: { _id, name },
                                  owner: { type, _id, name },
                                  name: rule.docName,
                                  type: rule.docType,
                                  serviceType: selectedService[0],
                                  subServiceType:rule.subservice ? rule.subservice : ''
                              } );
                          Modal.show( {
                              content: <DocViewEdit item = { newDocument } model={Facilities} onChange={update} />
                          } )
                      },
                  } )
            }
            if ( rule.docType == "Invoice"){
                for (let i=0; i<12; i++  ) {
                    query["closeDetails.completionDate"] = {
                        "$gte": new moment().subtract(i, "months").startOf("months").toDate(),
                        "$lte": new moment().subtract(i, "months").endOf("months").toDate()
                    }
                    let request = Requests.findOne(query);
                    if (request) {
                        if (request.closeDetails && request.closeDetails.invoice && request.closeDetails.invoice._id){
                            count++;
                        }
                    }

                }
                for (let i=0; i<12; i++  ) {
                    docQuery["applicablePeriodStartDate"] = {
                        "$gte": new moment().subtract(i, "months").startOf("months").toDate(),
                        "$lte": new moment().subtract(i, "months").endOf("months").toDate()
                    }
                    let test = Documents.find(docQuery).fetch();
                    if (test) {
                      if(test.length > 0){
                        count++;
                      }
                    }

                }
                //  console.log(Documents.find( {
                //   "facility._id": rule.facility._id,
                //   "serviceType.name": rule.service.name,
                //   'type': 'Service Report',
                //   'applicablePeriodStartDate':{
                //      "$gte": new moment().subtract(0, "months").startOf("months").toDate(),
                //      "$lte": new moment().subtract(0, "months").endOf("months").toDate()
                //  }} ).fetch());
                if (count == 12) {
                    return _.extend( {}, defaultResult, {
                        passed: true,
                        message: {
                            summary: "passed",
                            detail: count + " out of 12 Invoices"
                        },
                    } )
                }
                  return _.extend( {}, defaultResult, {
                      passed: false,
                      message: {
                          summary: "failed",
                          detail: count + " out of 12 Invoices"
                      },
                      resolve: function(r,update) {
                          let type = "team",
                              team = Session.getSelectedFacility(),
                              _id = team._id,
                              name = team.name,
                              owner = Meteor.user(),
                              newDocument = Documents.create( {
                                  team: { _id, name },
                                  owner: { type, _id, name },
                                  name: rule.docName,
                                  type: rule.docType,
                                  serviceType: selectedService[0],
                                  subServiceType: rule.subservice ? rule.subservice : ''
                              } );
                          Modal.show( {
                              content: <DocViewEdit item = { newDocument } model={Facilities} onChange={update}/>
                          } )
                      },
                  } )
            }
            if ( rule.docType == "Confirmation"){
              // console.log(Session.getSelectedFacility());

                // for (let i=0; i<=12; i++  ) {
                    // docQuery["issueDate"] = {
                    //     "$gte": new moment().subtract(0, "months").startOf("months").toDate(),
                    //     "$lte": new moment().subtract(0, "months").endOf("months").toDate()
                    // }
                    let test = Documents.find(docQuery).fetch();
                    if (test) {
                      if(test.length > 0){
                        count++;
                      }
                    }

                if (count == 1) {
                    return _.extend( {}, defaultResult, {
                        passed: true,
                        message: {
                            summary: "passed",
                            detail: count + " out of 1 Confirmation"
                        },
                    } )
                }
                  return _.extend( {}, defaultResult, {
                      passed: false,
                      message: {
                          summary: "failed",
                          detail: count + " out of 1 Confirmation"
                      },
                      resolve: function(r,update) {
                          let type = "team",
                              team = Session.getSelectedFacility(),
                              _id = team._id,
                              name = team.name,
                              owner = Meteor.user(),
                              newDocument = Documents.create( {
                                  team: { _id, name },
                                  owner: { type, _id, name },
                                  name: rule.docName,
                                  type: rule.docType,
                                  serviceType: selectedService[0],
                                  subServiceType:rule.subservice ? rule.subservice : ''
                              } );
                          Modal.show( {
                              content: <DocViewEdit item = { newDocument } model={Facilities} onChange={update}/>
                          } )
                      },
                  } )
            }
            if ( rule.docType == "Induction"){
                for (let i=0; i<=12; i++  ) {
                    query["closeDetails.completionDate"] = {
                        "$gte": new moment().subtract(i, "months").startOf("months").toDate(),
                        "$lte": new moment().subtract(i, "months").endOf("months").toDate()
                    }
                    let request = Requests.findOne(query);
                    if (request) {
                        if (request.closeDetails && request.closeDetails.invoice && request.closeDetails.invoice._id){
                            count++;
                        }
                    }

                }
                for (let i=0; i<=12; i++  ) {
                    docQuery["issueDate"] = {
                        "$gte": new moment().subtract(i, "months").startOf("months").toDate(),
                        "$lte": new moment().subtract(i, "months").endOf("months").toDate()
                    }
                    let test = Documents.find(docQuery).fetch();
                    if (test) {
                      if(test.length > 0){
                        count++;
                      }
                    }

                }

                if (count == 12) {
                    return _.extend( {}, defaultResult, {
                        passed: true,
                        message: {
                            summary: "passed",
                            detail: count + " out of 12 induction"
                        },
                    } )
                }
                  return _.extend( {}, defaultResult, {
                      passed: false,
                      message: {
                          summary: "failed",
                          detail: count + " out of 12 induction"
                      },
                      resolve: function() {
                          let type = "team",
                              team = Session.getSelectedFacility(),
                              _id = team._id,
                              name = team.name,
                              owner = Meteor.user(),
                              newDocument = Documents.create( {
                                  team: { _id, name },
                                  owner: { type, _id, name },
                                  name: rule.docName,
                                  type: rule.docType,
                                  serviceType: rule.service,
                              } );
                          Modal.show( {
                              content: <DocViewEdit item = { newDocument } model={Facilities} />
                          } )
                      },
                  } )
            }
            if ( rule.docType == "Contract"){
                for (let i=0; i<=12; i++  ) {
                    query["closeDetails.completionDate"] = {
                        "$gte": new moment().subtract(i, "months").startOf("months").toDate(),
                        "$lte": new moment().subtract(i, "months").endOf("months").toDate()
                    }
                    let request = Requests.findOne(query);
                    if (request) {
                        if (request.closeDetails && request.closeDetails.invoice && request.closeDetails.invoice._id){
                            count++;
                        }
                    }

                }
                for (let i=0; i<=12; i++  ) {
                    docQuery["commencementDate"] = {
                        "$gte": new moment().subtract(i, "months").startOf("months").toDate(),
                        "$lte": new moment().subtract(i, "months").endOf("months").toDate()
                    }
                    let test = Documents.find(docQuery).fetch();
                    if (test) {
                      if(test.length > 0){
                        count++;
                      }
                    }

                }

                if (count == 12) {
                    return _.extend( {}, defaultResult, {
                        passed: true,
                        message: {
                            summary: "passed",
                            detail: count + " out of 12 contract"
                        },
                    } )
                }
                  return _.extend( {}, defaultResult, {
                      passed: false,
                      message: {
                          summary: "failed",
                          detail: count + " out of 12 contract"
                      },
                      resolve: function() {
                          let type = "team",
                              team = Session.getSelectedFacility(),
                              _id = team._id,
                              name = team.name,
                              owner = Meteor.user(),
                              newDocument = Documents.create( {
                                  team: { _id, name },
                                  owner: { type, _id, name },
                                  name: rule.docName,
                                  type: rule.docType,
                                  serviceType: rule.service,
                              } );
                          Modal.show( {
                              content: <DocViewEdit item = { newDocument } model={Facilities} />
                          } )
                      },
                  } )
            }
            facility = Facilities.findOne({_id: rule.facility._id});
            if (facility) {
                let suppliers = facility.getSuppliers();
                count = 0;
                _.forEach(suppliers, (supplier) =>{
                    query = {
                        $or:[
                            {"team._id": supplier._id},
                            {"facility._id": facility._id}
                        ],
                        "type": rule.docType,
                    }
                    if ( _.contains( docList2, rule.docType ) ) {
                        query["expiryDate"] = { $gte: moment().startOf("days").toDate() };
                    }
                    if( !rule.document && rule.docSubType ){
                        query[`${rule.docType.charAt(0).toLowerCase()+rule.docType.slice(1)}Type`] = rule.docSubType
                    }
                    if ( _.contains( docList1, rule.docType ) ) {
                        query['serviceType.name'] = rule.service.name ;
                    }
                    let doc = Documents.findOne( query );
                    if (doc) {
                        count++;
                    }
                })
                let per= ( ( count / suppliers.length ) * 100 );
                if ( per >= 50) {
                    return _.extend( {}, defaultResult, {
                        passed: true,
                        message: {
                            summary: "passed",
                            detail: per + "% completed"
                        },
                    } )
                } else {
                    return _.extend( {}, defaultResult, {
                        passed: false,
                        message: {
                            summary: "failed",
                            detail: per + "% completed"
                        },
                    } )
                }
            }
            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail:   ""
                },
            } )
        },
    }

    function evaluateRule( rule, facility, service ) {
        if ( !facility && rule.facility ) {
            facility = Facilities.findOne( rule.facility._id );
        }
        var func, result;
        func = evaluators[ rule.type ];
        if ( func ) {
            result = func( rule, facility, service );
        } else {
            console.log( "No " + rule.type + " evaluator" );
        }
        return result || {
            passed: false
        }
    }

    function evaluate( rules, facility ) {
        var results = {
            passed: 0,
            failed: 0,
            all:[]
        };
        if ( !_.isArray( rules ) ) {
            rules = [ rules ];
        }
        rules.map( ( r ) => {
            var result = evaluateRule( r, facility );
            if ( result.passed ) {
                //results.passed.push( result );
                results.passed++;
            } else {
                //results.failed.push( result );
                results.failed++;
            }
            results.all.push( result );
        } )
        return results;
    }

    function evaluateService( service, facility ) {
        if ( !service || !service.data || !service.data.complianceRules ) {
            return null;
        }
        var numRules = 0, numPassed = 0, numFailed = 0, percPassed = 0, passed = false;
        var results = evaluate( service.data.complianceRules );
        if ( service.children ) {
            let numSubservices = 0,
                totalPassed = 0,
                totalFailed = 0;

            let subservice = _.map(service.children, ( subservice, idx) => {
                let subResult = evaluateService( subservice, facility );
                if( subResult ) {
                    numSubservices += subResult.numRules;
                    totalPassed += subResult.numPassed;
                    totalFailed += subResult.numFailed;
                }
                return subResult;
            });
            numRules = service.data.complianceRules.length + numSubservices;
            numPassed = results.passed + totalPassed;
            numFailed = results.failed + totalFailed;
            percPassed = Math.ceil( ( numPassed / numRules ) * 100 );
            passed = false;
            if ( percPassed == 100 ) {
                passed = true;
            }
            return {
                name: service.name,
                passed,
                percentPassed: percPassed,
                numPassed,
                numFailed,
                numRules,
                results,
                subservice
            }
        } else {
            numRules = service.data.complianceRules.length;
            numPassed = results.passed;
            numFailed = results.failed;
            percPassed = Math.ceil( ( numPassed / numRules ) * 100 );
            passed = false;
            if ( percPassed == 100 ) {
                passed = true;
            }
            return {
                name: service.name,
                passed,
                percentPassed: percPassed,
                numPassed,
                numFailed,
                numRules,
                results,
            }
        }
        // return {
        //     name: service.name,
        //     passed,
        //     percentPassed: percPassed,
        //     numPassed,
        //     numFailed,
        //     results
        // }
    }

    /**
     * @function    evaluateServices
     * @param       {object} services
     *
     * Evaluates the rules embedded in the provided service object
     *
     */
    function evaluateServices( services ) {
        let rules = [],
            results = { passed: [], failed: [] },
            overall = {},
            nulRules = 0,
            numPassed = 0,
            numFailed = 0,
            numRules = 0,
            percPassed = 100,
            passed = false;
            overallServiceresults = [];
            facility = Session.getSelectedFacility();
        overallServiceresults = services.map( ( service, idx ) => {

            // if the service has no data don't include in calculations
            if( !service || !service.data || !service.data.complianceRules ) {
                return null;
            }
            let result = evaluateService( service, facility );

            if ( result.passed ) {
                results.passed.push( result );
            } else {
                results.failed.push( result );
            }
            //rules = rules.concat( service.data.complianceRules );
            numRules += result.numRules;
            numPassed += result.numPassed;
            numFailed += result.numFailed;
            return result;
        } )

        //overall = evaluate( rules );
        // numRules = rules.length;
        // numPassed = overall.passed.length;
        // numFailed = overall.failed.length;
        if ( numRules ) {
            percPassed = Math.ceil( ( numPassed / numRules ) * 100 );
        }
        if ( percPassed == 100 ) {
            passed = true;
        }
        return {
            passed,
            percentRulesPassed: percPassed,
            numRulesPassed: numPassed,
            numRulesFailed: numFailed,
            servicesPassed: results.passed.length,
            servicesFailed: results.failed.length,
            overallServiceresults,
        }

    }

    return {
        evaluateRule,
        evaluate,
        evaluateServices
    }
}
