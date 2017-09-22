import React, { Component } from 'react';
import { Select, Text } from '/modules/ui/MaterialInputs';
import { Teams, TeamActions } from '/modules/models/Teams';
import { Facilities } from '/modules/models/Facilities';
import { Documents } from '/modules/models/Documents';
import { Modal } from '/modules/ui/Modal';
import { ThumbView } from '/modules/mixins/Thumbs';
import { ContactCard } from '/modules/mixins/Members';

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
            selectedService: JSON.parse(localStorage.getItem('defaultService')),
            searchTeams:[]
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
        //if (supplierName) query[0].name = supplierName;
        let suppliers = Teams.find( ...query ).fetch();

        if(supplierName){
            let newSupplierList = []
            suppliers.map((supplier,id)=>{
                if (supplier.name.toLowerCase().indexOf(supplierName.toLowerCase()) >= 0){
                    newSupplierList.push(supplier)
                }
            })
            suppliers = newSupplierList;
            suppliers = _.uniq( suppliers, s => s._id );
        } else {
          suppliers = [];
        }
        if (suppliers.length ){
            if(this.state.selectedService){
                this.setState({suppliers, showMsg: false});
            }else{
                this.setState({suppliers:[], showMsg: false});
            }
        }else{
            this.setState({suppliers, showMsg: true});
        }
    }
    checkName() {
        var inputName = this.state.supplierName?this.state.supplierName:'';
        let query = {
            name: {
                $regex: inputName,
                $options: 'i'
            }
        };
        searchTeams = Teams.findAll( query, { sort: { name: 1 } } );
        this.setState({
            searchTeams: searchTeams,
        })
        if ( searchTeams.length > 0 ) {
            this.setState( { searchTeams: searchTeams } );

        } else {
            this.setState( { searchTeams: '' } );

        }
    }
    handleTeamChange(supplier = {}){
        var viewersTeam = Session.getSelectedTeam();
        var searchName = supplier.name ? supplier.name : this.state.supplierName;
        if ( !searchName ) {
            alert( 'Please enter a valid name.' );
        } else {
            this.setState( { supplierName: supplier.name }, () => {
                let supplierId = supplier._id || Random.id();
                viewersTeam.inviteSupplier( searchName, supplierId, ( invitee ) => {
                    invitee = Teams.collection._transform( invitee );
                    if(!supplier._id){
                        if(this.state.selectedService){
                            invitee.preActiveService = this.state.selectedService
                        }
                        TeamActions.edit.bind(invitee).run();
                    }

                        if(this.props.onSaveSupplier){
                            this.props.onSaveSupplier(invitee)
                        }
                        Modal.hide();

                }, null );
            } );
        }
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
      this.setState({
        supplierName: supplier.name,
        searchTeams: []
      })
        let { facility, selectedService } = this.state;
        Meteor.call("Facilities.setDefaultSupplier", facility, supplier, selectedService, this.state.team, (err, data) => {
            if (data) {
                toastr.success(
                    "Supplier '" + data.supplier.name + "' has been added to service '" + data.service.name + "'",
                    "Default supplier added"
                );
                if(this.props.onSaveSupplier){
                    this.props.onSaveSupplier(supplier)
                }
                Modal.hide();
            }
        })
    }
    /*addSupplier(){
        let { team } = this.state;
        TeamActions.create.bind(team, false).run();
    }*/
    selectSupplier(supplier) {
      let {facility} = this.state;
      idList = facility ? _.pluck(facility.suppliers, '_id') : [];
      if(_.find(this.state.suppliers, obj=> obj._id === supplier._id ) && !_.contains(idList, supplier._id)){
        this.setSupplier(supplier);
      } else {
        this.handleTeamChange(supplier);
      }
    }
    render(){
        let idList = []
  		let { searchTeams, suppliers, facility, showMsg } = this.state;
  		idList = facility ? _.pluck(facility.suppliers, '_id') : [];
        return (
            <div style={{minWidth:'800px'}}>
                <div style = { {padding:"5px 15px 20px 15px"} } >
                    <div className="row">
                        <div className="col-sm-12">
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
                        <div className="col-sm-12">
                            <Select
                                placeholder="Subservice (optional)"
                                items={this.state.subservice}
                                value={this.state.selectedSubservice}
                                onChange={ ( subservice  ) => {
                                    this.setState( { selectedSubservice: subservice } );
                                } }
                            />
                        </div>
                        <div className="col-sm-12">
                            <Text
                                placeholder="Supplier name (optional)"
                                value={this.state.supplierName}
                                onChange={ ( text ) => {
                                    this.setState( { supplierName : text }, ()=>{
                                      this.checkName()
                                      this.search();
                                    });

                                } }
                            />
                          <div className="filter-supplier-container">
                          {
                            _.map(searchTeams, ( supplier, idx ) => {
                                return <div key={idx} onClick={()=>this.selectSupplier(supplier)} className="filter-supplier-item">
                                  <ContactCard item={supplier} />
                                </div>
                            })
                          }
                          </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <span style={{'float':'right','marginRight':'1%'}}>
                                <button
                                    title={"Click to add new supplier."}
                                    className="btn btn-flat btn-primary" onClick={(event)=>{
                                        // this.addSupplier(event)
                                        // this.checkName(event)
                                        this.handleTeamChange()
                                    }}
                                >
                                    Add new
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
