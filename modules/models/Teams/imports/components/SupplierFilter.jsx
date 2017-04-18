import React from 'react';
import { Teams, TeamStepper } from '/modules/models/Teams';
import { Facilities } from '/modules/models/Facilities';
import { Text, Select } from '/modules/ui/MaterialInputs';
import ReactDOM from 'react-dom'

export default class SupplierFilter extends React.Component {
    constructor(props) {
        super(props);
        let team = this.props.team || null;
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

    componentDidMount(){
        $(document).bind('click', function () {
            /*if($('#filter-box').css('display') == 'block'){
                $('#filter-box').css('display','none')
                $('#arrow-icon').css('display','none')
            }*/
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
        let totalSupplierFound = this.props.suppliers?this.props.suppliers.length:0
        let showTotalCountClass = totalSupplierFound > 0 ? 'col-lg-6' : 'col-lg-12'
        return (
            <div>
            <button onClick={()=>{
                if($('#filter-box').css('display') == 'none'){
                    $('#filter-box').css('display','block')
                    $('#arrow-icon').css('display','block')
                } else {
                    $('#filter-box').css('display','none')
                    $('#arrow-icon').css('display','none')
                }
            }} className="button" style={{'cursor':'pointer','borderRadius':'37px','padding':'10px','color':'white','backgroundColor':'#0152b5'}}><i className="fa fa-search" style={{'marginRight':'5px'}}></i>Find Supplier</button>
            <div id="arrow-icon" style={{'display':'none','height':'25px','width':'25px','backgroundColor':'transparent','marginLeft':'40px','borderBottom':'15px solid #E8EAF6','borderLeft':'15px solid transparent','borderRight':'15px solid transparent','marginTop':'-10px'}}></div>
            <div id="filter-box" style = { {'backgroundColor':'#E8EAF6','position':'absolute','width':'100%','display':'none','zIndex':'1000','paddingTop':"5px",paddingBottom:'0px',paddingLeft:'10px',paddingRight:'0px','boxShadow':'2px 11px 8px 1px rgba(0, 0, 0, 0.14), 2px 5px 13px 1px rgba(0, 0, 0, 0.2), 4px 5px 16px 0px rgba(0, 0, 0, 0.12)'} } className = "ibox search-box report-details">
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
                {this.state.selectedService?<div className="row" style={{backgroundColor:'#C5CAE9',marginTop:'20px'}}>
                        {totalSupplierFound > 0 ? <div className="col-lg-6" style={{paddingTop:'15px'}}>
                                <span style={{backgroundColor:'#9FA8DA',color:'#333',borderRadius:'6px',padding:'3px 5px',border:'1px solid rgba(0, 0, 0, 0.1)'}}>{'Found suppliers: '+totalSupplierFound}</span>
                            </div>:null}
                    <div className={showTotalCountClass}>
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
