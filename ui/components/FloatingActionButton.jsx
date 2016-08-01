import React from "react";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FloatingActionButton = class FloatingActionButton extends React.Component {

	createNewRequest() {

	}

	componentDidMount() {
		$('.fab-panel button[rel=tooltip]').tooltip({
			container: 'body'
		});
	}

    createNewRequest() {
        var selectedFacility = Session.getSelectedFacility();
        var selectedTeam = Session.getSelectedTeam();
        var request = {
        	costThreshold:selectedTeam.defaultWorkOrderValue
        }
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
	    //console.log(request);
	    //Issues.doAction('create',function(request){
	    	//request.save({
	    		//all the things
	    	//})
	    //})
	    Meteor.call('Issues.create',request,function(err,response){
	    	if(err) {
	    		console.log(err);
	    	}
	    	if(response) {
	    		var newRequest = Issues.findOne(response._id);
	    		//console.log(newRequest);
				//Modal.show({
		    	//	content:<IssueDetail item={newRequest}/>,
		        //    size:"large"
		    	//})
		    	newRequest.doAction("create");
    		}
	    });
		//newItemCallback={team&&team.type=="fm"?this.createNewIssue:null}
	    //Issues.create(request,callback);
    }

    createNewFacility() {
    	var selectedTeam = Session.getSelectedTeam();
    	selectedTeam.addFacility(function(response){
    		var newItem = Facilities.findOne(response._id);
    		Modal.show({
            	content:<FacilityViewEdit item={newItem} />
            });
        })
    }

    createNewComplianceRule(newRule) {
        console.log(newRule);
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
                var copy = _.omit(newRule,'facility','service','event');
                if(newRule.facility) {
	                copy.facility = _.pick(newRule.facility,'name','_id');
	            }
                if(newRule.event) {
	                copy.event = _.pick(newRule.event,'name','_id');
	            }
	            if(newRule.service) {
	                copy.service = _.pick(newRule.service,'name');
	            }
                //console.log(copy);
                service.data.complianceRules.push(copy);
                services[idx] = service;
            }
            facility.setServicesRequired(services);
        }
        Modal.hide();
    }

    handleCreateComplianceRuleClick() {
        Modal.show({
            content:<AutoForm 
                item={{
                    facility:Session.getSelectedFacility()
                }}
                schema={ComplianceRuleSchema} 
                onSubmit={this.createNewComplianceRule}
            />
        })
    }    

	render() {
		return (
			<div className="fab-panel">
				<button 
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new work request"
					onClick={this.createNewRequest} 
					className="fab fab-1">
						+
				</button>
				<button 
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new facility"
					onClick={this.createNewFacility} 
					className="fab fab-2">
						<i className="fa fa-building"></i>
				</button>				
				<button 
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new compliance rule"
					onClick={()=>{this.handleCreateComplianceRuleClick()}} 
					className="fab fab-3">
						<i className="fa fa-check"></i>
				</button>				
			</div>
		)
	}	
}


