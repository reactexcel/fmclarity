import React, { Component } from 'react';
import { Select, Text } from '/modules/ui/MaterialInputs';
import { Teams, TeamActions } from '/modules/models/Teams';
import { Facilities } from '/modules/models/Facilities';
import { Documents } from '/modules/models/Documents';
import { Modal } from '/modules/ui/Modal';

export default class SearchSuppliersWithinNetwork extends Component {
    constructor(props){
        super(props);
        let facility = this.props.facility || Session.getSelectedFacility();
        this.state= {
            suppliers: [],
            subservice: [],
            showMsg: false,
            supplierName: "",
            facility: facility,
            selectedSubservice: null,
            selectedSubservice: null,
            team: Session.getSelectedTeam(),
            services: facility?facility.servicesRequired:[],
        }
    }
    search(){
        const { facility, selectedService, selectedSubservice, supplierName } = this.state;
        let {team} = this.state,
            facilities = team.getFacilities();
        let supplierIds = [],
            supplierNames = [];
        let teamSupplier = team.suppliers;
        teamSupplier = _.uniq(teamSupplier, s => s._id);
        supplierIds = _.pluck(teamSupplier, "_id");
        supplierNames = _.pluck(teamSupplier, "name");
        facilities.map((facility) => {
            let facilitySupplier = _.uniq(facility.supplier, s => s._id);
            supplierIds.concat(_.pluck(facilitySupplier, "_id"));
            supplierNames.concat(_.pluck(facilitySupplier, "name"));
            let services = facility.servicesRequired || [];
            services.map((service) => {
                if (service) {
                    if (service.data && service.data.supplier) {
                        supplierIds.push(service.data.supplier._id);
                        supplierNames.push(service.data.supplier.name);
                    }
                    if (service.children) {
                        service.children.map((subservice) => {
                            if (subservice.data && subservice.data.supplier) {
                                supplierIds.push(subservice.data.supplier._id);
                                supplierNames.push(subservice.data.supplier.name);
                            }
                        });
                    }
                }
            });
        });
        supplierIds = _.filter(_.uniq(supplierIds), s => s);
        supplierNames = _.filter(_.uniq(supplierNames), s => s);
        let query = [{
            _id: { $in: supplierIds } ,
            name: { $in: supplierNames } ,
            }, {
                sort: {
                    name: 1
                }
            }];
        if (selectedService) query[0]["services"] = { $elemMatch: { name: selectedService.name } };
        if (selectedSubservice) query[0]["services"] = {$elemMatch:{"children":{$elemMatch:{ name: selectedSubservice.name } } } };
        if (supplierName) query[0][name] = supplierName;
        let suppliers = Teams.find( ...query ).fetch();
        suppliers = _.uniq( suppliers, s => s._id );
        if (suppliers.length )
            this.setState({suppliers, showMsg: false});
        else
            this.setState({suppliers, showMsg: true});
    }
    getAttachments( supplier ){
        let attachments = [],
            documentList = supplier? Documents.find( {"team._id":supplier._id,"type":'Image'}).fetch():[];
            documentList.map((doc,i)=>{
            	doc.attachments.map((obj,j)=>{
                	attachments.push(<div className="col-sm-2" key={i+"-"+j}><ThumbView item={obj} readOnly={true}/></div>)
            	})
        	})
        return attachments;
    }
    setSupplier(supplier){
        let { facility, selectedService } = this.state;
        Meteor.call("Facilities.setDefaultSupplier", facility, supplier, selectedService, (err, data) => {
            if (data) {
                //console.log(data);
                toastr.success(
                    "Supplier '" + data.supplier.name + "' has been added to service '" + data.service.name + "'",
                    "Default supplier added"
                );
                Modal.hide();
            }
        })
    }
    addSupplier(){
        let { team } = this.state;
        TeamActions.create.bind(team, false).run();
    }
    render(){
        let idList = []
		let { suppliers, facility, showMsg } = this.state;
		idList = _.pluck(facility.suppliers, '_id');
        return (
            <div>
                <div style = { {padding:"5px 15px 20px 15px"} } >
                    <div className="row">
                        <div className="col-sm-4">
                            <Select
                                placeholder="Service"
                                items={this.state.services}
                                value={this.state.selectedService}
                                onChange={ ( service  ) => {
                                    this.setState( {
                                        selectedService: service,
                                        subservice: service && service.children || [],
                                        selectedSubservice: null
                                    } );
                                } }
                            />
                        </div>
                        <div className="col-sm-4">
                            <Select
                                placeholder="Subservice (optional)"
                                items={this.state.subservice}
                                value={this.state.selectedSubservice}
                                onChange={ ( subservice  ) => {
                                    this.setState( { selectedSubservice: subservice } );
                                } }
                            />
                        </div>
                        <div className="col-sm-4">
                            <Text
                                placeholder="supplier name (optional)"
                                value={this.state.supplierName}
                                onChange={ ( text ) => {
                                    this.setState( { supplierName : text } );
                                } }
                            />
                        </div>
                    </div>
                    {this.state.selectedService?<div className="row">
                        <div className="col-lg-12">
                            <span style={{'float':'right','marginRight':'1%'}}>
                                <button
                                    className="btn btn-flat btn-primary"
                                    style={{float:'right'}}
                                    onClick={ () => {
                                        this.search()
                                    } }>
                                    Search <i className="fa fa-search" aria-hidden="true"></i>
                                </button>
                            </span>
                            <span style={{'float':'right','marginRight':'1%'}}>
                                <button
                                    title={"Click to save supplier in your team."}
                                    className="btn btn-flat btn-primary" onClick={this.addSupplier.bind(this)}
                                >
                                    Add new
                                </button>
                            </span>
                        </div>
                    </div>:''}
                </div>
                <div className ="row" style={{'marginLeft':'0px'}}>
    	            { suppliers && suppliers.length ? suppliers.map( ( supplier, idx ) => {
    					let contactName = supplier.contact ? supplier.contact.name : null,
    					    availableServices = null;
    				    if ( supplier.getAvailableServices ) {
    					    availableServices = supplier.getAvailableServices();
    				    }
    					let attachments = this.getAttachments( supplier )
    	        	    return (
    						<div className="col-xs-12" key={idx}
                                style={{
                                    'backgroundColor':'white',
                                    'marginBottom':'1%',
                                    'padding':'0px',
                                }} className = "ibox search-box report-details">
                                <div className="business-card">
    								<div className="contact-thumbnail pull-left">
    									{supplier.thumbUrl?
    										<img alt="image" src={supplier.thumbUrl} />
    									:null}
    								 </div>
    								 <div className="contact-info">
    									<h2>{supplier.name}</h2>
    									<i style={{color:"#999",display:"block",padding:"3px"}}>{ contactName ? contactName : null }<br/></i>
    									<b>Email</b> { supplier.email }<br/>
    									{ supplier.phone ? <span><b>Phone</b> { supplier.phone }<br/></span> :null }
    									{ supplier.phone2 ? <span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> { supplier.phone2 }<br/></span> :null }
    									<div style={{margin:"10px 0 10px 70px",borderBottom:"1px solid #ccc"}}></div>
    									{availableServices && availableServices.length?
    									availableServices.map( (service,index) => {
    										return <span key = { service.name }>{ index?' | ':'' }{ service.name }</span>
    									})
    									:null}
    									<br />
    								</div>
    								<div className="row">
    									{attachments}
    									<div className="col-sm-12">
    										<span style={{'float':'right','marginRight':'1%'}}>
                                                <button
        											title={"Click to save supplier in your team."}
        											className="btn btn-flat btn-primary"
                                                    onClick={() => {
        												this.setSupplier( supplier )
        											}}
        											disabled={_.contains(idList, supplier._id) == true?true:false}
        											style={{'cursor':_.contains(idList, supplier._id) == true?"not-allowed":"pointer"}}
        										>
        											{_.contains(idList, supplier._id) == true?"Saved":"Save supplier"}
        										</button>
    									    </span>
    								    </div>
    							    </div>
    						    </div>
    					    </div>
                        )
    	            } ) : (showMsg?<div className="col-xs-12"
                            style={{
                                'backgroundColor':'white',
                                'marginBottom':'1%',
                                'padding':'0px',
                            }}
                            className = "search-box report-details"
                            >
                                <p style={{
                                    "textAling":"center",
                                    'borderTop': '1px solid #e3e3e3',
                                    padding: '15px',
                                }}>
                                    Sorry! no suppliers found...  You can add a new supplier by pressing the  <em>ADD NEW</em> button.
                                </p>
                        </div>:null)
                    }
    	        </div>
            </div>
        )
    }
}
