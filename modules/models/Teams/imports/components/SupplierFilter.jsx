import React from 'react';
import { Teams, TeamStepper } from '/modules/models/Teams';
import { Facilities } from '/modules/models/Facilities';
import { Text, Select } from '/modules/ui/MaterialInputs';

export default class SupplierFilter extends React.Component {
    constructor(props) {
        super(props);
        let team = this.props.team || Session.getSelectedTeam();
        let facility = team && Facilities.findOne( { 'team._id': team._id } );
        this.state = {
            team: team,
            facility: facility,
            services: facility && facility.servicesRequired || [],
            suplierName:'',
        }
        this.query = {
            type: "contractor",
        }
    }
    componentWillReceiveProps(props){
        let facility = props.team && Facilities.findOne( { 'team._id': props.team._id } );
        this.setState({
            team: props.team,
            facility: facility,
            services: facility && facility.servicesRequired || [],
        });
    }
    search(){
        let suppliers = null
        suppliers = Teams.findAll( this.query, { sort: { name: 1 } } )
        if( this.props.onChange) this.props.onChange( suppliers );
    }
    updateQuery( query, fieldName, value ){
        if(!query.$or && value){
            query.$or = [ { [fieldName] : value } ];
            return;
        }
        if(query.$or && query.$or.length <= 1 && !value) {
            this.query = _.omit(query, "$or");
        }
        for (var i in query.$or) {
            if (query.$or[i][fieldName]){
                if(!value) {
                    query.$or.splice(i,1);
                }else{
                    query.$or[i][fieldName] = value;
                }
                break;
            }
            if ( i == query.$or.length-1 && value){
                query.$or.push({ [fieldName] : value});
            }
        }
    }
    render() {
        return (
            <div style = { {padding:"5px 15px 20px 15px"} } className = "ibox search-box report-details">
                <h2>Supplier Filter</h2>
                <div className="row" style={{marginLeft:"0px"}}>
                    <div className="col-lg-4">
                        <Select
                            placeholder="Select service"
                            items={this.state.services}
                            value={this.state.selectedService}
                            onChange={ ( service  ) => {
                                this.setState( {
                                    selectedService: service || this.state.service,
                                    subservice: service && service.children,
                                    selectedSubservice: null
                                } );
                                this.query["services"] = service && { $elemMatch: { name: service.name } };
                                this.updateQuery( this.query, "services", null );
                                if( this.props.onChange ) {
                                    this.props.onChange()
                                }
                            } }
                            />
                    </div>
                    <div className="col-lg-4">
                        <Select
                            placeholder="Select subservice (optional)"
                            items={this.state.selectedService && this.state.selectedService.children }
                            value={this.state.selectedSubservice}
                            onChange={ ( subservice  ) => {
                                this.setState( { selectedSubservice: subservice } );
                                this.updateQuery( this.query, "services", subservice?{$elemMatch:{"children":{$elemMatch:{ name: subservice.name}}}}:null );
                            } }
                            />
                    </div>
                    <div className="col-lg-4">
                        <Text
                            placeholder="supplier name (optional)"
                            value={this.state.suplierName}
                            onChange={ ( text ) => {
                                let value = text?{
                                    $regex: text,
                                    $options: 'i'
                                }:null
                                this.setState( { suplierName : text } );
                                this.updateQuery( this.query, "name", value );
                            } }/>
                    </div>
                </div>
                {this.state.selectedService?<div className="row">
                    <div className="col-lg-12">
                        <button
                            className="btn btn-flat btn-primary"
                            style={{float:'right'}}
                            onClick={ () => {
                                this.search()
                            } }>
                            Search Suplier <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>:''}
            </div>
        );
      }
}
/*
<form style={{padding:"15px"}} className="form-inline">
    <div className="form-group">
        <b>Lets search to see if this team already has an account.</b>
        <h2><input className="inline-form-control" ref="invitation" placeholder="Team name"/></h2>
        <button type = "submit" style = { { width:0, opacity:0} } onClick = { this.checkName.bind(this) }>Invite</button>
    </div>
</form>
*/
