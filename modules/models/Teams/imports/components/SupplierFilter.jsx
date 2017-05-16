import React from 'react';
import { Teams, TeamStepper } from '/modules/models/Teams';
import { Facilities } from '/modules/models/Facilities';
import { Text, Select,DateInput } from '/modules/ui/MaterialInputs';
import ReactDOM from 'react-dom'

export default class SupplierFilter extends React.Component {
    constructor(props) {
        super(props);
        let team = this.props.team || null;
        let facility = team && Facilities.findOne( { 'team._id': team._id } );
        this.areas = ['Adelaide','Brisbane','Canberra','Darwin','Hobart','Melbourne','Perth','Sydney']
        this.selectedAreas = []
        this.selectedServices = []
        this.state = {
            team: team,
            facility: facility,
            services: facility && facility.servicesRequired || [],
            suplierName:'',
            insuranceDetails:{
                expiry:'',
                insurer:'',
                policyNumber:''
            },
            selectedAreas:[],
            selectedServices:[],
            otherCity:''
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
        $(window).click(function(event) {
            $('#filter-box').css('display','none')
            $('#arrow-icon').css('display','none')
            $('#filter-details').css('display','block')
       });
    }
    componentWillMount(){
        this.search();
    }
    /*clearFilters(filter){
        let tags = this.state.tags;
        let stateToSet = {}

        if(filter == this.tags.clearAll){
            stateToSet = {
                selectedService:'',
                selectedSubservice:'',
                suplierName:'',
                insuranceDetails:{
                    expiry:'',
                    insurer:'',
                    policyNumber:''
                },
                tags:[],
                selectedAreas:[],
                otherCity:''
            }
            tags = []
            this.selectedAreas = []
            this.query = {
                type: "contractor",
            }
        } else if(filter == this.tags.service){
            stateToSet.selectedService = '';
            this.query = _.omit(this.query, "services");
            if(_.contains(tags, filter)){
                let index = tags.indexOf(filter);
                    tags.splice(index,1)
            }
        } else if(filter == this.tags.subService){
            stateToSet.selectedSubservice = '';
            if(_.contains(tags, filter)){
                let index = tags.indexOf(filter);
                    tags.splice(index,1)
            }
            this.updateQuery( this.query, "services", null );
        } else if(filter == this.tags.supplier){
            stateToSet.suplierName = '';
            if(_.contains(tags, filter)){
                let index = tags.indexOf(filter);
                    tags.splice(index,1)
            }
            this.updateQuery( this.query, "name", null );
        } else if(filter == this.tags.address){
            stateToSet.selectedAreas = []
            stateToSet.otherCity = ''
            if(_.contains(tags, filter)){
                let index = tags.indexOf(filter);
                    tags.splice(index,1)
            }
            this.selectedAreas = [];
            this.updateQueryForCity(this.query, "address.city", null)
        } else if(filter == this.tags.insurance){
            stateToSet.insuranceDetails = {
                expiry:'',
                insurer:'',
                policyNumber:''
            }
            if(_.contains(tags, filter)){
                let index = tags.indexOf(filter);
                    tags.splice(index,1)
            }
            this.updateQuery(this.query, "insuranceDetails.expiry", null)
            this.updateQuery(this.query, "insuranceDetails.insurer", null)
            this.updateQuery(this.query, "insuranceDetails.policyNumber", null)
        }
        if(tags.length == 1 && _.contains(tags, this.tags.clearAll)){
            let index = tags.indexOf(this.tags.clearAll);
                tags.splice(index,1)
        }
        this.search();
        stateToSet.tags = tags;
        this.setState( stateToSet )
    }*/
    search(){
        console.log(this.query,"search")
        let suppliers = null
        suppliers = Teams.findAll( this.query, { sort: { name: 1 } } )
        console.log(suppliers,"suppliers")
        if( this.props.onChange) this.props.onChange( suppliers );
        if($('#filter-box').css('display') == 'block'){
            $('#filter-box').css('display','none')
            $('#arrow-icon').css('display','none')
            $('#filter-details').css('display','block')
        }
    }
    /*updateQuery( query, fieldName, value ){
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
    }*/
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
        this.updateQueryForArea(this.query,this.selectedAreas,"address.city")
        this.search();
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
        if(name === null){
            this.search();
        }
    }
    /*updateQueryForCity( query, fieldName, value ){
        if(!query.$or && value){
            query.$or = [ { [fieldName] : value }, { [fieldName] : value.toLowerCase() } ];
            return;
        }
        for (var i in query.$or) {
            if (query.$or[i][fieldName]){
                if(!value) {
                    query.$or.splice(i,1);
                    query.$or.splice(i,1);
                }else{
                    query.$or[i][fieldName] = value;
                    query.$or[parseInt(i)+1][fieldName] = value.toLowerCase();
                }
                if(query.$or.length == 0){
                    this.query = _.omit(query, "$or");
                }
                break;
            }
            if ( i == query.$or.length-1 && value){
                query.$or.push({ [fieldName] : value});
                query.$or.push({ [fieldName] : value.toLowerCase()});
            }
        }
    }*/
    updateQueryForService(query,selectedServices,removeServiceTag){
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
        console.log(this.query,"this.query");
        if(removeServiceTag === true){
            this.search()
        }
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
        this.updateQueryForService(this.query,this.selectedServices,true)
        this.setState(stateToSet)
    }
    updateQuery( query, fieldName, value ){
        if(!query.$and && value){
            query.$and = [ { [fieldName] : value } ];
            return;
        }
        if(query.$and && query.$and.length <= 1 && !value) {
            this.query = _.omit(query, "$and");
            this.setState({
                address:{
                    city:'',
                    postcode:'',
                    state:'',
                    streetName:'',
                    streetNumber:''
                },
                insuranceDetails:{
                    expiry:'',
                    insurer:'',
                    policyNumber:''
                },
                tags:[this.tags.clearAll]
            })
        }
        for (var i in query.$and) {
            if (query.$and[i][fieldName]){
                if(!value) {
                    query.$and.splice(i,1);
                }else{
                    query.$and[i][fieldName] = value;
                }
                break;
            }
            if ( i == query.$and.length-1 && value){
                query.$and.push({ [fieldName] : value});
            }
        }
    }
    countNonEmptyFieldsForInsurance(){
        let count = (!_.isEmpty(this.state.insuranceDetails.expiry) ? 1 : 0 ) +
                    (!_.isEmpty(this.state.insuranceDetails.insurer) ? 1 : 0) +
                    (!_.isEmpty(this.state.insuranceDetails.policyNumber) ? 1 : 0)
        return count;
    }
    render() {
        console.log(this.state.services,"services");
        let totalSupplierFound = this.props.suppliers?this.props.suppliers.length:0
        let showSearchButton = !_.isEmpty(this.state.selectedServices) || !_.isEmpty(this.state.suplierName) || this.state.selectedAreas.length != 0  || !_.isEmpty(this.state.otherCity) ||
                               (!_.isEmpty(this.state.insuranceDetails.expiry) || !_.isEmpty(this.state.insuranceDetails.insurer) || !_.isEmpty(this.state.insuranceDetails.policyNumber))
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12" style={{textAlign:'center'}}>
                        <button onClick={(event)=>{
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
                        }} className="button" style={{'cursor':'pointer','borderRadius':'37px','padding':'10px','color':'white','backgroundColor':'#0152b5'}}><i className="fa fa-search" style={{'marginRight':'5px'}}></i>Find Supplier</button>
                    </div>
                </div>
                <div id="filter-details" style={{display:'block',marginTop:'20px',backgroundColor:'#C5CAE9',padding:'0px 10px 0px 10px'}}>
                        {this.state.selectedServices.length>0?<div style={{paddingTop:'-20px'}}><div className="row" style={{marginBottom:'-10px'}}>
                            <div className="col-xs-12">
                                    <h4 style={{fontWeight:'400'}}>Services:</h4>
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
                            </div>
                        </div>
                        <hr></hr></div>:null}
                        {!_.isEmpty(this.state.suplierName) || this.state.selectedAreas.length > 0 ?<div style={this.state.selectedServices.length>0?{marginTop:'-20px'}:{}}>
                            <div className="row" style={{marginBottom:'-10px'}}>
                            {!_.isEmpty(this.state.suplierName)?<div className="col-xs-4" style={{borderRight:'1px solid #f0f8ff',marginTop:'5px'}}>
                                <h4 style={{fontWeight:'400'}}>Supplier:</h4>
                                <div style={{marginTop:'8px',display:'inline'}}>
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
                                </div>
                            </div>:null}
                            {this.state.selectedAreas.length > 0?<div className="col-xs-4" style={{borderRight:'1px solid #f0f8ff',marginTop:'5px'}}>
                                <h4 style={{fontWeight:'400'}}>Geographical Area:</h4>
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
                            </div>:null}
                        </div>
                        <hr></hr></div>:null}
                        <div className="row">
                            <div className="col-lg-6" style={{paddingTop:'15px',paddingBottom:'15px'}}>
                                <span style={{marginLeft:'7px',backgroundColor:'#9FA8DA',color:'#333',borderRadius:'6px',padding:'3px 5px',border:'1px solid rgba(0, 0, 0, 0.1)'}}>{'Total Suppliers Found: '+(totalSupplierFound > 0 ? totalSupplierFound:0)}</span>
                            </div>
                        </div>
                </div>
                <div className="row">
                    <div className="col-xs-12" style={{textAlign:'center'}}>
                        <div onClick={(event)=>{ event.stopPropagation();}} id="arrow-icon" style={{'display':'none','height':'25px','width':'25px','backgroundColor':'transparent','borderBottom':'15px solid #E8EAF6','borderLeft':'15px solid transparent','borderRight':'15px solid transparent','margin':'0 auto','marginTop':'-10px'}}></div>
                    </div>
                </div>

            <div onClick={(event)=>{ event.stopPropagation();}} id="filter-box" style = { {'backgroundColor':'#E8EAF6','position':'absolute','width':'100%','display':'none','zIndex':'1000','paddingTop':"5px",paddingBottom:'0px',paddingLeft:'10px',paddingRight:'0px','boxShadow':'2px 11px 8px 1px rgba(0, 0, 0, 0.14), 2px 5px 13px 1px rgba(0, 0, 0, 0.2), 4px 5px 16px 0px rgba(0, 0, 0, 0.12)'} } className = "ibox search-box report-details">
                <h3 style={{textAlign:'center'}}>Supplier Filter</h3>
                <div className="row" style={{borderBottom:'1px solid #ddd',marginLeft:"0px",marginBottom:'5px',paddingBottom:'20px',marginRight:'20px'}}>
                    <div className="col-xs-12">
                        <h4 style={{fontSize:'15px',fontWeight:'300'}}>Services</h4>
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

                <div className="row" style={{marginLeft:"0px",marginBottom:'20px'}}>
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
                    <div className="col-lg-4" style={{paddingLeft:'20px',paddingRight:'20px',borderLeft:'1px solid #ddd'}}>
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
                    <div className="col-lg-4" style={{paddingLeft:'20px',paddingRight:'20px',borderLeft:'1px solid #ddd'}}>
                        <div className="row">
                            <div className="col-xs-12">
                                <h4 style={{fontSize:'15px',fontWeight:'300'}}>Current Insurance</h4>
                            </div>
                            <div className="col-xs-12">
                                <DateInput
                                    placeholder='Expiry Date'
                                    //items={props.items}
                                    //item={props.item}
                                    //view={props.view}
                                    value={this.state.insuranceDetails.expiry}
                                    fieldName='expiryDate'
                                    onChange={( expiryDate ) => {
                                        let value = expiryDate?{
                                            $regex: expiryDate,
                                            $options: 'i'
                                        }:null
                                        this.updateQuery(this.query, "insuranceDetails.expiry", expiryDate)
                                        let insuranceDetails = this.state.insuranceDetails
                                            insuranceDetails.expiry = expiryDate;
                                        let stateToSet = {insuranceDetails:insuranceDetails}
                                        let tags = this.state.tags
                                        if(!_.isEmpty(expiryDate)){
                                            if(!_.contains(tags, this.tags.insurance)){
                                                tags.push(this.tags.insurance)
                                            }
                                            if(!_.contains(tags, this.tags.clearAll)){
                                                tags.push(this.tags.clearAll)
                                            }
                                        }else{
                                            let count = this.countNonEmptyFieldsForInsurance()
                                            if(_.contains(tags, this.tags.insurance) && count == 0){
                                                let index = tags.indexOf(this.tags.insurance);
                                                tags.splice(index,1)
                                            }
                                            if(tags.length == 1 && _.contains(tags, this.tags.clearAll)){
                                                let index = tags.indexOf(this.tags.clearAll);
                                                tags.splice(index,1)
                                            }
                                        }
                                        stateToSet.tags = tags;
                                        this.setState( stateToSet )
                                    }}
                                />
                            </div>
                            <div className="col-xs-12">
                            <Text
                                placeholder="Insurer"
                                value={this.state.insuranceDetails.insurer}
                                onChange={ ( insurer ) => {
                                    let value = insurer?{
                                        $regex: insurer,
                                        $options: 'i'
                                    }:null
                                    this.updateQuery(this.query, "insuranceDetails.insurer", insurer)
                                    let insuranceDetails = this.state.insuranceDetails
                                        insuranceDetails.insurer = insurer;
                                    let stateToSet = {insuranceDetails:insuranceDetails}
                                    let tags = this.state.tags
                                    if(!_.isEmpty(insurer)){
                                        if(!_.contains(tags, this.tags.insurance)){
                                            tags.push(this.tags.insurance)
                                        }
                                        if(!_.contains(tags, this.tags.clearAll)){
                                            tags.push(this.tags.clearAll)
                                        }
                                    }else{
                                        let count = this.countNonEmptyFieldsForInsurance()
                                        if(_.contains(tags, this.tags.insurance) && count == 0){
                                            let index = tags.indexOf(this.tags.insurance);
                                            tags.splice(index,1)
                                        }
                                        if(tags.length == 1 && _.contains(tags, this.tags.clearAll)){
                                            let index = tags.indexOf(this.tags.clearAll);
                                            tags.splice(index,1)
                                        }
                                    }
                                    stateToSet.tags = tags;
                                    this.setState( stateToSet )
                            } }/>
                            </div>
                            <div className="col-xs-12">
                            <Text
                                placeholder="Policy Number"
                                value={this.state.insuranceDetails.policyNumber}
                                onChange={ ( policyNumber ) => {
                                    let value = policyNumber?{
                                        $regex: policyNumber,
                                        $options: 'i'
                                    }:null
                                    this.updateQuery(this.query, "insuranceDetails.policyNumber", policyNumber)
                                    let insuranceDetails = this.state.insuranceDetails
                                        insuranceDetails.policyNumber = policyNumber;
                                    let stateToSet = {insuranceDetails:insuranceDetails}
                                    let tags = this.state.tags
                                    if(!_.isEmpty(policyNumber)){
                                        if(!_.contains(tags, this.tags.insurance)){
                                            tags.push(this.tags.insurance)
                                        }
                                        if(!_.contains(tags, this.tags.clearAll)){
                                            tags.push(this.tags.clearAll)
                                        }
                                    }else{
                                        let count = this.countNonEmptyFieldsForInsurance()
                                        if(_.contains(tags, this.tags.insurance) && count == 0){
                                            let index = tags.indexOf(this.tags.insurance);
                                            tags.splice(index,1)
                                        }
                                        if(tags.length == 1 && _.contains(tags, this.tags.clearAll)){
                                            let index = tags.indexOf(this.tags.clearAll);
                                            tags.splice(index,1)
                                        }
                                    }
                                    stateToSet.tags = tags;
                                    this.setState( stateToSet )
                                } }/>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{backgroundColor:'#C5CAE9',marginLeft:'-10px'}}>
                    <div className="row">
                    <div className={'col-xs-12'}>
                        <button
                            className="btn btn-flat btn-primary"
                            style={{float:'right',marginRight:'10px'}}
                            onClick={ () => {
                                this.search()
                            } }>
                            Apply Filters <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
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
