import React from "react";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FABActions = new function() {

	function viewRequest(request) {
		Modal.show({
    		content:<IssueDetail item={request}/>
    	})
	}

	function editTeam(team) {
		Modal.show({
			content:<TeamViewEdit item={team}/>
		})
	}

    function createRequest(template={}) {
    	//look below at new compliance rule created with AutoForm, that is the way to do this...
        var selectedFacility = Session.getSelectedFacility();
        var selectedTeam = Session.getSelectedTeam();
        var request = Object.assign({
        	type:'Ad Hoc',
        	priority:'Standard',
        	dueDate:new Date(),
        	costThreshold:selectedTeam.defaultWorkOrderValue
        },template);
        if(selectedTeam) {
    		request.team = {
    			_id:selectedTeam._id,
	    		name:selectedTeam.name
	    	}
        }
        if(selectedFacility) {
	    	request.facility = {
	    		_id:selectedFacility._id,
	    		name:selectedFacility.name
	    	}
	    }

		Modal.show({
            content:<AutoForm 
                item={request}//do we need to call 'createNewItemUsingSchema' on this item?
                form={Issues.forms.create}
                schema={IssueSchema} 
                onSubmit={(r)=>{
                	if(r.location) {
				        r.level = r.location.area;
				        r.area = r.location.subarea;
				    }
                	Meteor.call('Issues.create',r,{},(err,response)=>{
	                	//Modal.hide();
	                	Modal.replace({
    						content:<IssueDetail item={response}/>
    					})
                	});
                }}
            />
        })

	    //request = Issues._transform(request);
		//request.doAction("create");	    
		/*
	    Meteor.call('Issues.create',request,function(err,response){
	    	if(err) {
	    		console.log(err);
	    	}
	    	if(response) {
	    		var newRequest = Issues.findOne(response._id);
		    	newRequest.doAction("create");
    		}
	    });
	    */
    }

    function createFacility() {
    	var selectedTeam = Session.getSelectedTeam();
    	selectedTeam.addFacility(function(response){
    		var newItem = Facilities.findOne(response._id);
    		newItem.setupCompliance(Config.compliance);
    		Modal.show({
            	content:<FacilityViewEdit item={newItem} />
            });
        })
    }

    function createNewComplianceRule(newRule) {
        var facility = newRule.facility;
        if(facility) {
            var services = facility.servicesRequired;
            //get index of the selected service
            var idx=-1;
            for(var i in services) {
                if(services[i].name==newRule.service.name) {
                    idx = i;
                    break;
                }
            }
            if(idx>=0) {
                var service = services[idx];
                console.log({service,idx});
                if(!service.data) {
                    service.data = {};
                }
                if(!service.data.complianceRules) {
                    service.data.complianceRules = [];
                }
                //to avoid circular search remove facility and then add with just name and _id
                var copy = _.omit(newRule,'facility','service'/*,'event'*/);
                if(newRule.facility) {
	                copy.facility = _.pick(newRule.facility,'name','_id');
	            }
                /*if(newRule.event) {
	                copy.event = _.pick(newRule.event,'name','_id');
	            }*/
	            if(newRule.service) {
	                copy.service = _.pick(newRule.service,'name');
	            }
                service.data.complianceRules.push(copy);
                services[idx] = service;
            }
            facility.setServicesRequired(services);
        }
        Modal.hide();
    }

    function createComplianceRule() {
        Modal.show({
            content:<AutoForm 
                item={{
                    facility:Session.getSelectedFacility()
                }}
                schema={ComplianceRuleSchema} 
                onSubmit={createNewComplianceRule}
            />
        })
    }

    return {
    	viewRequest,
    	editTeam,
    	createRequest,
    	createFacility,
    	createComplianceRule
    }
}

FloatingActionButton = class FloatingActionButton extends React.Component {

	createNewRequest() {

	}

	componentDidMount() {
		$('.fab-panel button[rel=tooltip]').tooltip({
			container: 'body'
		});
	}

	render() {
		return (
			<div className="fab-panel">
				<button 
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new work request"
					onClick={()=>{FABActions.createRequest()}} 
					className="fab fab-1">
						+
				</button>
				<button 
					style={{backgroundColor:"red",color:"#fff"}}
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new facility"
					onClick={FABActions.createFacility} 
					className="fab fab-2">
						<i className="fa fa-building"></i>
				</button>				
				<button 
					style={{backgroundColor:"orange",color:"#fff"}}
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new compliance rule"
					onClick={FABActions.createComplianceRule} 
					className="fab fab-3">
						<i className="fa fa-check"></i>
				</button>
				<button 
					style={{backgroundColor:"yellow",color:"#333"}}
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new preventative maintenence event"
					onClick={()=>{FABActions.createRequest({
						type:"Preventative",
						priority:"Scheduled",
						status:"PMP"
					})}} 
					className="fab fab-4">
						<i className="fa fa-recycle"></i>
				</button>				
				<button 
					style={{backgroundColor:"green",color:"#fff"}}
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new document"
					onClick={()=>{FABActions.createRequest()}} 
					className="fab fab-5">
						<i className="fa fa-file"></i>
				</button>				
			</div>
		)
	}	
}


