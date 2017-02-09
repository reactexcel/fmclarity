import { Facilities } from '/modules/models/Facilities';
import { Requests } from '/modules/models/Requests';
import { Documents, DocViewEdit } from '/modules/models/Documents';
import React from 'react';
import moment from 'moment';

ComplianceEvaluationService = new function() {

  var defaultResult = {
    passed:false,
    message:{
      summary:"failed"
    },
    resolve() {
      alert('No resolution available');
    }
  }


  var docList1 = [
        "Audit",
        "Contract",
        "Inspection",
        "Invoice",
        "MSDS",
        "Plan",
        "Procedure",
        "Quote",
        "Register",
        "Registration",
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
    "Document exists":function(rule,facility,service){
    //  console.log({rule});

      var docCount = null,
      tomorrow = moment( moment().add(1,"days").format("MM-DD-YYYY")).toDate()
      query = rule.document&&rule.document.query ? JSON.parse( rule.document.query) : "";
      if (_.contains(docList1, rule.document.type)){
          query.$and.push({ 'serviceType.name': rule.service.name });
      }
      query && query.$and.push({ expiryDate: {$gte: tomorrow} });
      docCount = query && Documents.find( query ).count();
    //   console.log({count: docCount});
    //   console.log(query);
     if(docCount){
        return _.extend({},defaultResult,{
          passed:true,
          message:{
            summary:"passed",
            detail:docCount+ " "+(rule.docType?(rule.docType+" "):"")+"documents exists."
          },
        })
      }

      return _.extend({},defaultResult,{
        passed:false,
        message:{
          summary:"failed",
          detail:"Document does not exist."
        },
        resolve:function(){
          let type = "team",
            team = Session.getSelectedFacility(),
            _id = team._id,
            name = team.name,
            owner = Meteor.user();

          let newDocument = Documents.create( {
            team: { _id, name },
            owner: { type, _id, name },
            name: rule.docName,
          } );
          Modal.show( {
            content: <DocViewEdit item = { newDocument } model={Facilities} />
          } )
        }
      })
    },

    "Document is current":function(rule,facility,service){

      var docCount = null,
      query = rule.document ? JSON.parse( rule.document.query ) : "";
      if (_.contains(docList1, rule.document.type)){
          query.$and.push({ 'serviceType.name': rule.service.name });
      }
      if (_.contains(docList2, rule.document.type)){
          //format of timestamp should be as Jan 01 2017 00:00:00 GMT (IST).
          let yesterday = moment( moment().subtract(1,"days").format("MM-DD-YYYY")).toDate(),
            tomorrow = moment( moment().add(1,"days").format("MM-DD-YYYY")).toDate(),
            today = Object.assign({},{$gt: yesterday, $lt: tomorrow});
          query.$and.push({ expiryDate: today });
      }
      docCount = query && Documents.find( query ).count();
    //    console.log({count: docCount});
    //    console.log(query);
      if(docCount){
        return _.extend({},defaultResult,{
          passed:false,
          message:{
            summary:"passed",
            detail:docCount+ " "+(rule.docType?(rule.docType+" "):"")+"documents exists."
          },
          resolve:function(){
            let type = "team",
              team = Session.getSelectedFacility(),
        			_id = team._id,
        			name = team.name,
              owner = Meteor.user();

        		let newDocument = Documents.create( {
        			team: { _id, name },
        			owner: { type, _id, name },
              name: rule.docName
        		} );
            Modal.show( {
              content: <DocViewEdit item = { newDocument } model={Facilities} />
            } )
          }
        })
      }

      return _.extend({},defaultResult,{
        passed:false,
        message:{
          summary:"failed",
          detail:"Documents dose not exists."
        },
        resolve:function(){
          let type = "team",
            team = Session.getSelectedFacility(),
            _id = team._id,
            name = team.name,
            owner = Meteor.user();

          let newDocument = Documents.create( {
            team: { _id, name },
            owner: { type, _id, name }
          } );
          Modal.show( {
            content: <DocViewEdit item = { newDocument } model={Facilities} />
          } )
        }
      })
    },
    "PPM schedule established": function( rule, facility, service ) {
        //console.log(rule);
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
        var numEvents = Requests.find( { 'facility._id': facility._id, 'service.name': rule.service.name, type: "Preventative" } ).count();
        if ( numEvents ) {
            return _.extend( {}, defaultResult, {
                passed: true,
                message: {
                    summary: "passed",
                    detail: numEvents + " " + ( rule.service.name ? ( rule.service.name + " " ) : "" ) + "PMP events setup"
                }
            } )
        }
        return _.extend( {}, defaultResult, {
            passed: false,
            message: {
                summary: "failed",
                detail: "Set up " + ( rule.service.name ? ( rule.service.name + " " ) : "" ) + "PPM rules"
            },
            resolve: function() {
                console.log( 'attempting to resolve' );
                let id = Meteor.call('Issues.save', {
                    facility: {
                        _id: facility._id,
                        name: facility.name
                    },
                    type: 'Preventative',
                    priority: 'Scheduled',
                    status: 'PMP',
                    service: rule.service
                } );
                console.log ( id );
            }
        } )
    },
    "PPM event completed": function( rule, facility, service ) {
        var event;
        if ( rule.event ) {
            //event = Requests.findOne(rule.event._id);
            event = Requests.findOne( {
                'facility._id': rule.facility._id,
                name: rule.event
            } );
        }

        if ( event ) {
            return _.extend( {}, defaultResult, {
                passed: true,
                message: {
                    summary: "passed",
                    detail: "Last completed " + moment( event.dueDate ).format( 'ddd Do MMM' )
                },
                data: event
            } )
        }
        return _.extend( {}, defaultResult, {
            passed: false,
            message: {
                summary: "failed",
                detail: "PPM event not found"
            },
            resolve: function() {
                let team = Session.getSelectedTeam();
                Meteor.call('Issues.save', {
                    facility: {
                        _id: facility._id,
                        name: facility.name
                    },
                    type: 'Preventative',
                    priority: 'Scheduled',
                    status: 'PMP',
                    name: rule.event,
                    frequency: rule.frequency,
                    service: rule.service
                } );
            }
        } )
      }
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

    function evaluate( rules ) {
        var results = {
            passed: [],
            failed: []
        };
        if ( !_.isArray( rules ) ) {
            rules = [ rules ];
        }
        rules.map( ( r ) => {
            var result = evaluateRule( r );
            if ( result.passed ) {
                results.passed.push( result );
            } else {
                results.failed.push( result );
            }
        } )
        return results;
    }

    function evaluateService( service ) {
        var results = evaluate( service.data.complianceRules );
        var numRules = service.data.complianceRules.length;
        var numPassed = results.passed.length;
        var numFailed = results.failed.length;
        var percPassed = Math.ceil( ( numPassed / numRules ) * 100 );
        var passed = false;
        if ( percPassed == 100 ) {
            passed = true;
        }
        return {
            name: service.name,
            passed,
            percentPassed: percPassed,
            numPassed,
            numFailed,
            results
        }
    }

    function evaluateServices( services ) {
        var rules = [];
        results = { passed: [], failed: [] },
            overall = {},
            nulRules = 0,
            numPassed = 0,
            numFailed = 0,
            percPassed = 100,
            passed = false;

        services.map( ( s ) => {
            let result = evaluateService( s );
            if ( result.passed ) {
                results.passed.push( result );
            } else {
                results.failed.push( result );
            }
            rules = rules.concat( s.data.complianceRules );
        } )

        overall = evaluate( rules );
        numRules = rules.length;
        numPassed = overall.passed.length;
        numFailed = overall.failed.length;

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
            servicesFailed: results.failed.length
        }


    }

    return {
        evaluateRule,
        evaluate,
        evaluateServices
    }
}
