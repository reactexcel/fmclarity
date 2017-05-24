import React from 'react';
import { Teams, TeamStepper } from '/modules/models/Teams';
import { Documents } from '/modules/models/Documents';
import { Facilities } from '/modules/models/Facilities';
import { Text, Select,DateInput } from '/modules/ui/MaterialInputs';
import { Switch } from '/modules/ui/MaterialInputs';
import ReactDOM from 'react-dom'
import moment from 'moment';

export default class SupplierFilter extends React.Component {
    constructor(props) {
        super(props);
        let team = this.props.team || Session.getSelectedTeam();
        let facility = team && Facilities.findOne( { 'team._id': team._id } );
        this.areas = ['Adelaide','Brisbane','Canberra','Darwin','Hobart','Melbourne','Perth','Sydney']
        this.selectedAreas = []
        this.selectedServices = []
        this.insurance = {
            publicLiablityInsurance:false,
            professionalIndemnity:false,
            workersCompensation:false
        }
        this.state = {
            team: team,
            facility: facility,
            services: facility && facility.servicesRequired || [],
            suplierName:'',
            selectedAreas:[],
            selectedServices:[],
            otherCity:'',
            publicLiablityInsurance:false,
            professionalIndemnity:false,
            workersCompensation:false
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
        window.addEventListener('scroll', this.handleScroll);
        $(window).click(function(event) {
            $('#filter-box').css('display','none')
            $('#arrow-icon').css('display','none')
            $('#filter-details').css('display','block')
       });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    componentWillMount(){
        this.search();
    }

    handleScroll(event) {
    let scrollTop = event.srcElement.body.scrollTop,
        itemTranslate = Math.min(0, scrollTop/3 - 60);
        if(itemTranslate > -20){
            $('#arrow-icon').hide('slow');
            $('#filter-box').hide('slow');
            $('#filter-details').css('display','block')
        }
    }
    search(){
        if(this.insurance.publicLiablityInsurance === true || this.insurance.professionalIndemnity === true || this.insurance.workersCompensation === true){
            let insuranceTypes = []
            if(this.insurance.professionalIndemnity === true){
                insuranceTypes.push({'insuranceType':'Professional Indemnity'})
            }
            if(this.insurance.publicLiablityInsurance === true){
                insuranceTypes.push({'insuranceType':'Public Liablity'})
            }
            if(this.insurance.workersCompensation === true){
                insuranceTypes.push({'insuranceType':"Worker's Compensation"})
            }
            let docs = Documents.find({$or:insuranceTypes,expiryDate:{"$gt": new moment().toDate()}}).fetch();
            let team = _.pluck(docs, 'team');
            let teamIds = _.pluck(team, '_id');
            this.query._id = {
                $in:teamIds
            }
        }else{
            this.query = _.omit(this.query, "_id");
        }
        let suppliers = null
        suppliers = Teams.findAll( this.query, { sort: { name: 1 } } )
        if(this.query.services && this.query.services.$elemMatch && this.query.services.$elemMatch.$or && this.query.services.$elemMatch.$or.length ){
            suppliers = this.filterForServices(suppliers);
        }
        if( this.props.onChange) this.props.onChange( suppliers );
    }
    filterForServices(suppliers){
        let searchFor = this.query.services.$elemMatch.$or;
        let newSuplierList = []
        _.map(suppliers,(supplier,i)=>{
            if(supplier.getAvailableServices){
                let availableServices = supplier.getAvailableServices();
                _.map(searchFor,(obj,i)=>{
                    let serviceExist = availableServices.filter(function(ser){
                            return ser.name == obj.name
                        })
                    if(serviceExist && serviceExist.length > 0){
                        let alreadyContainThisSupplier = newSuplierList.filter(function(list){
                            return list._id == supplier._id
                        })
                        if(alreadyContainThisSupplier && alreadyContainThisSupplier.length>0){
                        }else{
                            newSuplierList.push(supplier)
                        }
                    }
                })
            }else{
            }
        })
        return newSuplierList;
    }
    updateQueryForArea(query,selectedAreas,fieldName){
        this.query = _.omit(query, "$or");
        this.query.$or = [];
        _.map(selectedAreas,( area, i ) => {
            this.query.$or.push({ [fieldName] : area })
            this.query.$or.push({ [fieldName] : area.toLowerCase() })
        })
        if(this.query.$or.length == 0){
            this.query = _.omit(query, "$or");
        }
        this.search()
    }
    removeAreaTag(area){
        let stateToSet = {}
        let selectedAreas = this.state.selectedAreas;
        if(_.contains(selectedAreas, area)){
            let stateIndex = selectedAreas.indexOf(area);
                selectedAreas.splice(stateIndex,1)
                stateToSet.selectedAreas = selectedAreas
            let varIndex = this.selectedAreas.indexOf(area);
                this.selectedAreas.splice(varIndex,1)
        }
        if(!_.contains(this.areas,area)){
            stateToSet.otherCity = ''
        }
        this.updateQueryForArea(this.query,this.selectedAreas,"address.city")
        this.setState(stateToSet)
    }
    updateOtherCity(city){
        let otherCity = city === null ? city : this.state.otherCity;
        let selectedAreas = this.state.selectedAreas;
        let stateToSet = {};

        for(var i in selectedAreas){
            if(!_.contains(this.areas, selectedAreas[i])){
                let stateIndex = selectedAreas.indexOf(selectedAreas[i]);
                    selectedAreas.splice(stateIndex,1)
                let varIndex = this.selectedAreas.indexOf(selectedAreas[i])
                    this.selectedAreas.splice(varIndex,1)
                break;
            }
        }

        if(!_.isEmpty(otherCity)){
            selectedAreas.push(otherCity)
            stateToSet.selectedAreas = selectedAreas
            this.selectedAreas.push(otherCity)
        }
        this.updateQueryForArea(this.query,this.selectedAreas,"address.city")
        this.setState(stateToSet)
    }
    updateSuplierName(name){
        this.query = _.omit(this.query,"name")
        if(!_.isEmpty(name)){
            this.query.name = name
        }
        this.search();
    }
    updateQueryForService(query,selectedServices){
        this.query = _.omit(query, "service");
        let services = {
            $elemMatch:{
                $or:[]
            }
        }
        _.map(selectedServices,( serviceName, i ) => {
            services.$elemMatch.$or.push({ 'name' : serviceName })
        })
        this.query.services = services;
        if(selectedServices.length == 0){
            this.query = _.omit(this.query, "services");
        }
        this.search()
    }
    removeServiceTag(service){
        let stateToSet = {}
        let selectedServices = this.state.selectedServices;
        if(_.contains(selectedServices, service)){
            let stateIndex = selectedServices.indexOf(service);
                selectedServices.splice(stateIndex,1)
                stateToSet.selectedServices = selectedServices
            let varIndex = this.selectedServices.indexOf(service);
                this.selectedServices.splice(varIndex,1)
        }
        this.updateQueryForService(this.query,this.selectedServices)
        this.setState(stateToSet)
    }

    removeInsuranceTag(insurance){
        if(insurance == "1"){
            this.insurance.publicLiablityInsurance = false;
            this.setState({
                publicLiablityInsurance:false
            })
        }
        if(insurance == "2"){
            this.insurance.professionalIndemnity = false;
            this.setState({
                professionalIndemnity:false
            })
        }
        if(insurance == "3"){
            this.insurance.workersCompensation = false;
            this.setState({
                workersCompensation:false
            })
        }
        this.search()
    }

    render() {
        let totalSupplierFound = this.props.suppliers?this.props.suppliers.length:0
        let showTags = this.state.selectedServices.length>0 || !_.isEmpty(this.state.suplierName) || this.state.selectedAreas.length > 0 || (this.state.publicLiablityInsurance==true || this.state.professionalIndemnity==true || this.state.workersCompensation==true) ? true : false;
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12" style={{float:"left"}}>
                        <span style={{float: "left"}}>
    						<button className="btn btn-flat" onClick={(event)=>{
                                event.stopPropagation();
                                if($('#filter-box').css('display') == 'none'){
                                    $('#filter-box').css('display','block')
                                    $('#arrow-icon').css('display','block')
                                    $('#filter-details').css('display','none')
                                } else {
                                    $('#filter-box').css('display','none')
                                    $('#arrow-icon').css('display','none')
                                    $('#filter-details').css('display','block')
                                }
                            }}>
    							<i className="fa fa-filter" style={{'marginRight':'7px',fontSize:'16px'}}></i>Filter Suppliers
    						</button>
    					</span>
                    </div>
                </div>
                <div id="filter-details" style={{display:'block',marginTop:'20px',backgroundColor:'#d6e6fa',padding:'0px 10px 0px 10px'}}>
                        {showTags === true?<div style={{paddingTop:'-20px'}}><div className="row" style={{marginBottom:'-10px'}}>
                            <div className="col-xs-12">
                                    <h4 style={{fontWeight:'400'}}>Tags:</h4>
                                    {_.map(this.state.selectedServices,( service, i ) => {
                                        return <div key={i} style={{marginTop:'8px',display:'inline'}}>
                                            <button style={{marginTop:'4px',marginRight:'4px','borderRadius':'37px','padding':'5px 10px 5px 10px','color':'black','backgroundColor':'aliceblue'}}>
                                                {service}
                                                <span
                                                onClick={() => {
                                                   this.removeServiceTag(service)
                                                }}
                                                style={{
                                                    float: 'right',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    marginLeft: '10px',
                                                }}
                                                title={'Remove Service'}
                                            >&times;</span></button>
                                        </div>
                                    })}
                                    {!_.isEmpty(this.state.suplierName)?<div style={{marginTop:'8px',display:'inline'}}>
                                        <button style={{marginTop:'4px',marginRight:'4px','borderRadius':'37px','padding':'5px 10px 5px 10px','color':'black','backgroundColor':'aliceblue'}}>
                                            {this.state.suplierName}
                                            <span
                                            onClick={() => {
                                               this.updateSuplierName(null)
                                               this.setState({
                                                   suplierName:''
                                               })
                                            }}
                                            style={{
                                                float: 'right',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                marginLeft: '10px',
                                            }}
                                            title={'Remove supplier'}
                                        >&times;</span></button>
                                    </div>:null}
                                    {_.map(this.state.selectedAreas,( area, i ) => {
                                        return <div key={i} style={{marginTop:'8px',display:'inline'}}>
                                            <button style={{marginTop:'4px',marginRight:'4px','borderRadius':'37px','padding':'5px 10px 5px 10px','color':'black','backgroundColor':'aliceblue'}}>
                                                {area}
                                                <span
                                                onClick={() => {
                                                   this.removeAreaTag(area)
                                                }}
                                                style={{
                                                    float: 'right',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    marginLeft: '10px',
                                                }}
                                                title={'Remove Area'}
                                            >&times;</span></button>
                                        </div>
                                    })}
                                    {this.state.publicLiablityInsurance==true?<div style={{marginTop:'8px',display:'inline'}}>
                                            <button style={{marginTop:'4px',marginRight:'4px','borderRadius':'37px','padding':'5px 10px 5px 10px','color':'black','backgroundColor':'aliceblue'}}>
                                                {"Public Liablity Insurance"}
                                                <span
                                                onClick={() => {
                                                    this.removeInsuranceTag('1')
                                                }}
                                                style={{
                                                    float: 'right',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    marginLeft: '10px',
                                                }}
                                                title={'Remove Insurance'}
                                            >&times;</span></button>
                                        </div>:null}
                                        {this.state.professionalIndemnity==true?<div style={{marginTop:'8px',display:'inline'}}>
                                                <button style={{marginTop:'4px',marginRight:'4px','borderRadius':'37px','padding':'5px 10px 5px 10px','color':'black','backgroundColor':'aliceblue'}}>
                                                    {"Professional Indemnity"}
                                                    <span
                                                    onClick={() => {
                                                        this.removeInsuranceTag('2')
                                                    }}
                                                    style={{
                                                        float: 'right',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '10px',
                                                    }}
                                                    title={'Remove Insurance'}
                                                >&times;</span></button>
                                            </div>:null}
                                            {this.state.workersCompensation==true?<div style={{marginTop:'8px',display:'inline'}}>
                                                    <button style={{marginTop:'4px',marginRight:'4px','borderRadius':'37px','padding':'5px 10px 5px 10px','color':'black','backgroundColor':'aliceblue'}}>
                                                        {"Workers Compensation"}
                                                        <span
                                                        onClick={() => {
                                                            this.removeInsuranceTag('3')
                                                        }}
                                                        style={{
                                                            float: 'right',
                                                            cursor: 'pointer',
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                            marginLeft: '10px',
                                                        }}
                                                        title={'Remove Insurance'}
                                                    >&times;</span></button>
                                                </div>:null}
                            </div>
                        </div>
                        <hr></hr></div>:null}
                        <div className="row">
                            <div className="col-lg-6" style={{paddingTop:'15px',paddingBottom:'15px'}}>
                                <span style={{marginLeft:'7px',backgroundColor:'#75aaee',color:'#333',borderRadius:'6px',padding:'3px 5px',border:'1px solid rgba(0, 0, 0, 0.1)'}}>{'Total Suppliers Found: '+(totalSupplierFound > 0 ? totalSupplierFound:0)}</span>
                            </div>
                        </div>
                </div>
                <div className="filter-container">
                <div className="row">
                    <div className="col-xs-12">
                        <div onClick={(event)=>{ event.stopPropagation();}} id="arrow-icon" style={{'display':'none','height':'25px','width':'25px','backgroundColor':'transparent','borderBottom':'15px solid #d6e6fa','borderLeft':'15px solid transparent','borderRight':'15px solid transparent','margin':'0 42px','marginTop':'-10px'}}></div>
                    </div>
                </div>

            <div onClick={(event)=>{ event.stopPropagation();}} id="filter-box" style = { {'backgroundColor':'#d6e6fa','position':'absolute','width':'100%','display':'none','zIndex':'1000','paddingTop':"5px",paddingBottom:'0px',paddingLeft:'10px',paddingRight:'0px','boxShadow':'2px 11px 8px 1px rgba(0, 0, 0, 0.14), 2px 5px 13px 1px rgba(0, 0, 0, 0.2), 4px 5px 16px 0px rgba(0, 0, 0, 0.12)'} } className = "ibox search-box report-details">
                <div className="row" style={{borderBottom:'1px solid #BDBDBD',marginLeft:"0px",marginBottom:'5px',paddingBottom:'20px',marginRight:'20px'}}>
                    <div className="col-xs-11">
                        <h4 style={{fontSize:'15px',fontWeight:'300'}}>Services</h4>
                    </div>
                    <div className="col-xs-1">
                        <span style={{float:"right"}}>
                            <button className="btn btn-flat btn-primary" onClick={() => {
                                    let self = this;
                                    self.query = {
                                        type: "contractor",
                                    }
                                    self.selectedAreas = []
                                    self.selectedServices = []
                                    self.insurance = {
                                        publicLiablityInsurance:false,
                                        professionalIndemnity:false,
                                        workersCompensation:false
                                    }
                                    self.setState({
                                        suplierName:'',
                                        selectedAreas:[],
                                        selectedServices:[],
                                        otherCity:'',
                                        publicLiablityInsurance:false,
                                        professionalIndemnity:false,
                                        workersCompensation:false
                                    }, () => self.search() );
                                }}  title="Reset supplier filter">
                                <i className="fa fa-refresh"></i>
                            </button>
                        </span>
                    </div>
                    <div className="col-xs-12">
                        {_.map(this.state.services,( service, idx ) => {
                            return <div key={idx} style={{marginTop:'8px',display:'inline'}}>
                                <button onClick={(event)=>{
                                    let stateToSet = {}
                                    let selectedServices = this.state.selectedServices;
                                    if(_.contains(selectedServices, service.name)){
                                        let stateIndex = selectedServices.indexOf(service.name);
                                            selectedServices.splice(stateIndex,1)
                                            stateToSet.selectedServices = selectedServices
                                        let varIndex = this.selectedServices.indexOf(service);
                                            this.selectedServices.splice(varIndex,1)
                                    } else {
                                        selectedServices.push(service.name)
                                        stateToSet.selectedServices = selectedServices
                                        this.selectedServices.push(service.name)
                                    }
                                    this.updateQueryForService(this.query,this.selectedServices)
                                    this.setState(stateToSet)
                                }} style={{marginTop:'4px',marginRight:'4px','cursor':'pointer','borderRadius':'37px','padding':'5px 10px 5px 10px','color':'black','backgroundColor':'#CFD8DC'}}>{service.name}{_.contains(this.state.selectedServices, service.name) ?<i className="fa fa-check" style={{color:'#2196F3',marginLeft:'5px'}}></i>:null}</button>
                            </div>
                        })}
                    </div>
                </div>

                <div className="row" style={{marginLeft:"0px",marginBottom:'20px',minHeight:'210px'}}>
                    <div className="col-lg-4" style={{paddingRight:'20px'}}>
                        <div className="row">
                            <div className="col-xs-12">
                                <h4 style={{fontSize:'15px',fontWeight:'300'}}>Supplier</h4>
                            </div>
                            <div className="col-xs-12">
                                <Text
                                    placeholder="Supplier Name"
                                    value={this.state.suplierName}
                                    onChange={ ( name ) => {
                                        let value = name?{
                                            $regex: name,
                                            $options: 'i'
                                        }:''
                                        let stateToSet = { suplierName : name }
                                        this.setState( stateToSet );
                                        this.updateSuplierName( value );
                                } }/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4" style={{paddingLeft:'20px',paddingRight:'20px',borderLeft:'1px solid #BDBDBD',minHeight:'210px'}}>
                        <div className="row">
                            <div className="col-xs-12">
                                <h4 style={{fontSize:'15px',fontWeight:'300'}}>Geographical Area</h4>
                            </div>
                            <div className="col-xs-12">
                                <div className="row">
                                    {_.map(this.areas,( area, idx ) => {
                                        return <div key={idx} className="col-xs-4" style={idx>2?{marginTop:'8px'}:{}}>
                                            <button onClick={(event)=>{
                                                let stateToSet = {}
                                                let selectedAreas = this.state.selectedAreas;
                                                if(_.contains(selectedAreas, area)){
                                                    let stateIndex = selectedAreas.indexOf(area);
                                                        selectedAreas.splice(stateIndex,1)
                                                        stateToSet.selectedAreas = selectedAreas
                                                    let varIndex = this.selectedAreas.indexOf(area);
                                                        this.selectedAreas.splice(varIndex,1)
                                                } else {
                                                    selectedAreas.push(area)
                                                    stateToSet.selectedAreas = selectedAreas
                                                    this.selectedAreas.push(area)
                                                }
                                                this.updateQueryForArea(this.query,this.selectedAreas,"address.city")
                                                this.setState(stateToSet)
                                            }} style={{'cursor':'pointer','borderRadius':'37px','padding':'5px 10px 5px 10px','color':'black','backgroundColor':'#CFD8DC'}}>{area}{_.contains(this.state.selectedAreas, area) ?<i className="fa fa-check" style={{color:'#2196F3',marginLeft:'5px'}}></i>:null}</button>
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <Text
                                    placeholder="Other City"
                                    value={this.state.otherCity}
                                    onBlur={()=>{
                                        this.updateOtherCity()
                                    }}
                                    onChange={ ( city ) => {
                                        this.setState({
                                            otherCity:city
                                        })
                                        if(city === null){
                                            this.updateOtherCity(city)
                                        }
                                } }/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4" style={{paddingLeft:'20px',paddingRight:'20px',borderLeft:'1px solid #BDBDBD',minHeight:'210px'}}>
                        <div className="row">
                            <div className="col-xs-12">
                                <h4 style={{fontSize:'15px',fontWeight:'300'}}>Compliance</h4>
                            </div>
                            <div className="col-xs-12">
                                <Switch
                                    placeholder = {"Public Liablity Insurance"}
                					value = { this.state.publicLiablityInsurance }
                					onChange = { (value)=>{
                                        this.insurance.publicLiablityInsurance = value
                                        this.search()
                                        this.setState({
                                            publicLiablityInsurance:value
                                        })
                                    } }
                				/>
                            </div>
                            <div className="col-xs-12">
                                <Switch
                                    placeholder = {"Professional Indemnity Insurance"}
                					value = { this.state.professionalIndemnity }
                					onChange = { (value)=>{
                                        this.insurance.professionalIndemnity = value
                                        this.search()
                                        this.setState({
                                            professionalIndemnity:value
                                        })
                                    } }
                				/>
                            </div>
                            <div className="col-xs-12">
                                <Switch
                                    placeholder = {"Workcover Insurance"}
                					value = { this.state.workersCompensation }
                					onChange = { (value)=>{
                                        this.insurance.workersCompensation = value
                                        this.search()
                                        this.setState({
                                            workersCompensation:value
                                        })
                                    } }
                				/>
                            </div>
                            <div className="col-xs-12">
                                <Switch
                                    placeholder = {"Responsive Insurance"}
                					value = {false }
                					onChange = { (value)=>{
                                    } }
                                    disabled={true}
                				/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" style={{padding:'10px 10px 10px 0px',backgroundColor:'#c5cae9'}}>
                    <div className="col-lg-6">
                        <span style={{marginLeft:'7px',backgroundColor:'#75aaee',color:'#333',borderRadius:'6px',padding:'3px 5px',border:'1px solid rgba(0, 0, 0, 0.1)'}}>{'Total Suppliers Found: '+(totalSupplierFound > 0 ? totalSupplierFound:0)}</span>
                    </div>
                </div>
            </div>
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
