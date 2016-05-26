import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


WOServiceSelector = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var request,team,facility,supplier,assignee,services;
    	request = this.props.item;
    	if(request) {
    		team = request.getTeam();
    		facility = request.getFacility();
    		supplier = request.getSupplier();
    		assignee = request.getAssignee();
    	}
        if(facility) {
            services = facility.getServices();
        }
        return {
        	request:request,
            facility:facility,

            team:team,
            supplier:supplier,
            assignee:assignee,

            services:services,
            subservices:(facility&&request.service)?facility.getServices(request.service):null,

           	suppliers:request.getPotentialSuppliers(),
           	allSuppliers:team?team.getSuppliers():null,
        }
    },

    handleChange(field,value) {
        this.props.issue[field] = value;
        this.props.issue.save();
    },

    render() {
    	var request = this.data.request;
    	var facility = this.data.facility;
    	var team = this.data.team;
        var services = this.data.services;
        var subservices = this.data.subservices;
        var suppliers = this.data.suppliers;
        var supplier = this.data.supplier;
        var assignee = this.data.assignee;
        return (
        <div id="supplier-region" className="row" style={{minHeight:"37px"}}>

            {facility&&request.level&&request.level.name?
				<div className="col-md-3">
				    <div className="row">
					    <div className="col-md-12">
					        <SuperSelect 
						        readOnly={!request.canSetService()}
						        itemView={ContactViewName}
						        items={services} 
						        onChange={request.setService.bind(request)}
						    >
						        <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!request.service?"Select":""} service type</span>
						    </SuperSelect>
						    {request.service?
						        <div style={{clear:"both"}}>{request.service.name}</div>
						    :null}
						</div>
    				</div>
	            </div>
            :null}

			{request.service&&subservices&&subservices.length?
                <div className="col-md-3">
					<div className="row">
				        <div className="col-md-12">
					        <SuperSelect 
					            readOnly={!request.canSetSubService()}
					            itemView={ContactViewName}
					            items={subservices} 
					            onChange={request.setSubService.bind(request)}
					        >
					        	<span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!request.subservice?"Select":""} subtype</span>
					        </SuperSelect>
					        {request.subservice?
					            <div style={{clear:"both"}}>{request.subservice.name}</div>
					        :null}
					    </div>
					</div>
				</div>
			:null}


            {request.status&&request.service&&(supplier||request.canSetSupplier())?
				<div className="col-md-3">
                    <div className="row">
                    	<div className="col-md-12">
	                        <SuperSelect 
	                            readOnly={!request.canSetSupplier()}
	                            itemView={ContactViewName}
	                            items={suppliers} 
	                            moreItems={this.data.allSuppliers}
	                            clearOption={{name:"None"}}
		                        onChange={request.setSupplier.bind(request)}
		                    >
		                        <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!supplier?"Select":""} Supplier</span>
	                        </SuperSelect>
	                        {!supplier?null:
	                            <div style={{clear:"both"}}>{supplier.name}</div>
	                        }
                        </div>
                    </div>
                </div>
            :null}

            {request.status&&supplier&&team&&(assignee||request.canSetAssignee())?
                <div className="col-md-3">
                    <div className="row">
                       	<div className="col-lg-12">
                            <SuperSelect 
                                readOnly={!request.canSetAssignee()}
                                itemView={ContactViewName}
                                items={supplier.getMembers()}
                                onChange={request.setAssignee.bind(request)}
                            >
                                <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!request.assignee?"":""} assignee</span>
                            </SuperSelect>
    	                    <div style={{clear:"both"}}>{assignee?assignee.getName():'-'}</div>
        	            </div>
            	    </div>
	            </div>
			:null}

			
        </div>
        )
    }
})
