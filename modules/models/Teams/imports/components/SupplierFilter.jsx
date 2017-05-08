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
        this.tags = {
            clearAll:'Clear All',
            service:'Service',
            subService:'Sub service',
            supplier:'Supplier',
            address:'Geo Location',
            insurance:'Insurance'
        }
        this.state = {
            team: team,
            facility: facility,
            services: facility && facility.servicesRequired || [],
            suplierName:'',
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
        }
        this.query = {
            type: "contractor",
        }
        this.states = ['ACT','NSW','NT','QLD','SA','TAS','VIC','WA']

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
        $(window).click(function(event) {
            $('#filter-box').css('display','none')
            $('#arrow-icon').css('display','none')
       });
    }
    clearFilters(filter){
        let tags = this.state.tags;
        let stateToSet = {}

        if(filter == this.tags.clearAll){
            stateToSet = {
                selectedService:'',
                selectedSubservice:'',
                suplierName:'',
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
                tags:['Clear All']
            }
            tags = [this.tags.clearAll]
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
            stateToSet.address = {
                city:'',
                postcode:'',
                state:'',
                streetName:'',
                streetNumber:''
            }
            if(_.contains(tags, filter)){
                let index = tags.indexOf(filter);
                    tags.splice(index,1)
            }
            this.updateQuery(this.query, "address.streetNumber", null)
            this.updateQuery(this.query, "address.streetName", null)
            this.updateQuery(this.query, "address.city", null)
            this.updateQuery(this.query, "address.state", null)
            this.updateQuery(this.query, "address.postcode", null)
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
        stateToSet.tags = tags;
        this.setState( stateToSet )
        /*if(filter != this.tags.clearAll){
            this.search();
        }*/

    }
    search(){
        let suppliers = null
        suppliers = Teams.findAll( this.query, { sort: { name: 1 } } )
        if( this.props.onChange) this.props.onChange( suppliers );
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
    countNonEmptyFieldsForAddress(){
        let count = (!_.isEmpty(this.state.address.city) ? 1 : 0 ) +
                    (!_.isEmpty(this.state.address.postcode) ? 1 : 0) +
                    (!_.isEmpty(this.state.address.state) ? 1 : 0) +
                    (!_.isEmpty(this.state.address.streetName) ? 1 : 0)+
                    (!_.isEmpty(this.state.address.streetNumber) ? 1 : 0)
        return count;
    }
    countNonEmptyFieldsForInsurance(){
        let count = (!_.isEmpty(this.state.insuranceDetails.expiry) ? 1 : 0 ) +
                    (!_.isEmpty(this.state.insuranceDetails.insurer) ? 1 : 0) +
                    (!_.isEmpty(this.state.insuranceDetails.policyNumber) ? 1 : 0)
        return count;
    }
    render() {
        let totalSupplierFound = this.props.suppliers?this.props.suppliers.length:0
        let showTotalCountClass = totalSupplierFound > 0 ? 'col-lg-6' : 'col-lg-12'
        let showSearchButton = !_.isEmpty(this.state.selectedService) ||
                               (!_.isEmpty(this.state.address.city) || !_.isEmpty(this.state.address.postcode) || !_.isEmpty(this.state.address.state) || !_.isEmpty(this.state.address.streetName)  || !_.isEmpty(this.state.address.streetNumber)) ||
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
                            } else {
                                $('#filter-box').css('display','none')
                                $('#arrow-icon').css('display','none')
                            }
                        }} className="button" style={{'cursor':'pointer','borderRadius':'37px','padding':'10px','color':'white','backgroundColor':'#0152b5'}}><i className="fa fa-search" style={{'marginRight':'5px'}}></i>Find Supplier</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12" style={{textAlign:'center'}}>
                        <div onClick={(event)=>{ event.stopPropagation();}} id="arrow-icon" style={{'display':'none','height':'25px','width':'25px','backgroundColor':'transparent','borderBottom':'15px solid #E8EAF6','borderLeft':'15px solid transparent','borderRight':'15px solid transparent','margin':'0 auto','marginTop':'-10px'}}></div>
                    </div>
                </div>

            <div onClick={(event)=>{ event.stopPropagation();}} id="filter-box" style = { {'backgroundColor':'#E8EAF6','position':'absolute','width':'100%','display':'none','zIndex':'1000','paddingTop':"5px",paddingBottom:'0px',paddingLeft:'10px',paddingRight:'0px','boxShadow':'2px 11px 8px 1px rgba(0, 0, 0, 0.14), 2px 5px 13px 1px rgba(0, 0, 0, 0.2), 4px 5px 16px 0px rgba(0, 0, 0, 0.12)'} } className = "ibox search-box report-details">
                <h3 style={{textAlign:'center'}}>Supplier Filter</h3>
                <div className="row" style={{marginLeft:"0px",marginBottom:'20px'}}>
                    <div className="col-lg-4" style={{paddingRight:'20px'}}>
                        <div className="row">
                            <div className="col-xs-12">
                                <h4 style={{fontSize:'15px',fontWeight:'300'}}>Services & Supplier</h4>
                            </div>
                            <div className="col-xs-12">
                                <Select
                                    placeholder="Select service"
                                    items={this.state.services}
                                    value={this.state.selectedService}
                                    onChange={ ( service  ) => {
                                        let tags = this.state.tags
                                        let stateToSet = {
                                            selectedService: service || this.state.service,
                                            subservice: service && service.children,
                                            selectedSubservice: null,
                                        }
                                        let query = this.query
                                        if(!_.isEmpty(service)){
                                            this.query["services"] = service && { $elemMatch: { name: service.name } };
                                            this.updateQuery( this.query, "services", null );
                                            if(!_.contains(tags, this.tags.service)){
                                                tags.push(this.tags.service)
                                            }
                                        } else {
                                            this.query = _.omit(this.query, "services");
                                            if(_.contains(tags, this.tags.service)){
                                                let index = tags.indexOf(this.tags.service);
                                                tags.splice(index,1)
                                            }
                                        }
                                        stateToSet.tags = tags;
                                        if(query.$and && query.$and.length <= 1) {
                                            stateToSet.tags = [this.tags.clearAll, this.tags.service]
                                        }
                                        this.setState( stateToSet );
                                        if( this.props.onChange ) {
                                            this.props.onChange()
                                        }
                                    } }
                                />
                            </div>
                            <div className="col-xs-12">
                                <Select
                                    placeholder="Select subservice (optional)"
                                    items={this.state.selectedService && this.state.selectedService.children }
                                    value={this.state.selectedSubservice}
                                    onChange={ ( subservice  ) => {
                                        let tags = this.state.tags
                                        let stateToSet = { selectedSubservice: subservice }
                                        if(!_.isEmpty(subservice)){
                                            if(!_.contains(tags, this.tags.subService)){
                                                tags.push(this.tags.subService)
                                            }
                                        }else{
                                            if(_.contains(tags, this.tags.subService)){
                                                let index = tags.indexOf(this.tags.subService);
                                                tags.splice(index,1)
                                            }
                                        }
                                        stateToSet.tags = tags;
                                        this.setState( stateToSet );
                                        this.updateQuery( this.query, "services", subservice?{$elemMatch:{"children":{$elemMatch:{ name: subservice.name}}}}:null );

                                    } }
                                />
                            </div>
                            <div className="col-xs-12">
                                <Text
                                    placeholder="supplier name (optional)"
                                    value={this.state.suplierName}
                                    onChange={ ( text ) => {
                                        let value = text?{
                                            $regex: text,
                                            $options: 'i'
                                        }:null
                                        let tags = this.state.tags;
                                        let stateToSet = { suplierName : text }
                                        if(!_.isEmpty(text)){
                                            if(!_.contains(tags, this.tags.supplier)){
                                                tags.push(this.tags.supplier)
                                            }
                                        }else{
                                            if(_.contains(tags, this.tags.supplier)){
                                                let index = tags.indexOf(this.tags.supplier);
                                                tags.splice(index,1)
                                            }
                                        }
                                        stateToSet.tags = tags;
                                        this.setState( stateToSet );
                                        this.updateQuery( this.query, "name", value );
                                } }/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4" style={{paddingLeft:'20px',paddingRight:'20px',borderLeft:'1px solid #ddd'}}>
                        <div className="row">
                            <div className="col-xs-12">
                                <h4 style={{fontSize:'15px',fontWeight:'300'}}>Geographical Area</h4>
                            </div>
                            <div className="col-xs-6">
                                <Text
                                    placeholder="Street Number"
                                    value={this.state.address.streetNumber}
                                    onChange={ ( streetNumber ) => {
                                        let value = streetNumber?{
                                            $regex: streetNumber,
                                            $options: 'i'
                                        }:null
                                        this.updateQuery(this.query, "address.streetNumber", streetNumber)
                                        let address = this.state.address
                                            address.streetNumber = streetNumber;
                                        let stateToSet = {address:address}
                                        let tags = this.state.tags
                                        if(!_.isEmpty(streetNumber)){
                                            if(!_.contains(tags, this.tags.address)){
                                                tags.push(this.tags.address)
                                            }
                                        }else{
                                            let count = this.countNonEmptyFieldsForAddress()
                                            if(_.contains(tags, this.tags.address) && count == 0){
                                                let index = tags.indexOf(this.tags.address);
                                                tags.splice(index,1)
                                            }
                                        }
                                        stateToSet.tags = tags;
                                        this.setState( stateToSet )
                                } }/>
                            </div>
                            <div className="col-xs-6">
                                <Text
                                    placeholder="Street Name"
                                    value={this.state.address.streetName}
                                    onChange={ ( streetName ) => {
                                        let value = streetName?{
                                            $regex: streetName,
                                            $options: 'i'
                                        }:null
                                        this.updateQuery(this.query, "address.streetName", streetName)
                                        let address = this.state.address
                                            address.streetName = streetName;
                                        let stateToSet = {address:address}
                                        let tags = this.state.tags
                                        if(!_.isEmpty(streetName)){
                                            if(!_.contains(tags, this.tags.address)){
                                                tags.push(this.tags.address)
                                            }
                                        }else{
                                            let count = this.countNonEmptyFieldsForAddress()
                                            if(_.contains(tags, this.tags.address) && count == 0){
                                                let index = tags.indexOf(this.tags.address);
                                                tags.splice(index,1)
                                            }
                                        }
                                        stateToSet.tags = tags;
                                        this.setState( stateToSet )
                                } }/>
                            </div>
                            <div className="col-xs-6">
                                <Text
                                    placeholder="City"
                                    value={this.state.address.city}
                                    onChange={ ( city ) => {
                                        let value = city?{
                                            $regex: city,
                                            $options: 'i'
                                        }:null
                                        this.updateQuery(this.query, "address.city", city)
                                        let address = this.state.address
                                            address.city = city;
                                        let stateToSet = {address:address}
                                        let tags = this.state.tags
                                        if(!_.isEmpty(city)){
                                            if(!_.contains(tags, this.tags.address)){
                                                tags.push(this.tags.address)
                                            }
                                        }else{
                                            let count = this.countNonEmptyFieldsForAddress()
                                            if(_.contains(tags, this.tags.address) && count == 0){
                                                let index = tags.indexOf(this.tags.address);
                                                tags.splice(index,1)
                                            }
                                        }
                                        stateToSet.tags = tags;
                                        this.setState( stateToSet )
                                } }/>
                            </div>
                            <div className="col-xs-6">
                                <Select
                                    placeholder="State"
                                    items={this.states}
                                    value={this.state.address.state}
                                    onChange={ ( state  ) => {
                                        let value = state?{
                                            $regex: state,
                                            $options: 'i'
                                        }:null
                                        this.updateQuery(this.query, "address.state", state)
                                        let address = this.state.address
                                            address.state = state;
                                        let stateToSet = {address:address}
                                        let tags = this.state.tags
                                        if(!_.isEmpty(state)){
                                            if(!_.contains(tags, this.tags.address)){
                                                tags.push('Geo Location')
                                            }
                                        }else{
                                            let count = this.countNonEmptyFieldsForAddress()
                                            if(_.contains(tags, this.tags.address) && count == 0){
                                                let index = tags.indexOf(this.tags.address);
                                                tags.splice(index,1)
                                            }
                                        }
                                        stateToSet.tags = tags;
                                        this.setState( stateToSet )
                                    } }
                                />
                            </div>
                            <div className="col-xs-6">
                                <Text
                                    placeholder="Postal Code"
                                    value={this.state.address.postcode}
                                    onChange={ ( postcode ) => {
                                        let value = postcode?{
                                            $regex: postcode,
                                            $options: 'i'
                                        }:null
                                        this.updateQuery(this.query, "address.postcode", postcode)
                                        let address = this.state.address
                                            address.postcode = postcode;
                                        let stateToSet = {address:address}
                                        let tags = this.state.tags
                                        if(!_.isEmpty(postcode)){
                                            if(!_.contains(tags, this.tags.address)){
                                                tags.push('Geo Location')
                                            }
                                        }else{
                                            let count = this.countNonEmptyFieldsForAddress()
                                            if(_.contains(tags, this.tags.address) && count == 0){
                                                let index = tags.indexOf(this.tags.address);
                                                tags.splice(index,1)
                                            }
                                        }
                                        stateToSet.tags = tags;
                                        this.setState( stateToSet )
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
                                        }else{
                                            let count = this.countNonEmptyFieldsForInsurance()
                                            if(_.contains(tags, this.tags.insurance) && count == 0){
                                                let index = tags.indexOf(this.tags.insurance);
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
                                    }else{
                                        let count = this.countNonEmptyFieldsForInsurance()
                                        if(_.contains(tags, this.tags.insurance) && count == 0){
                                            let index = tags.indexOf(this.tags.insurance);
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
                                    }else{
                                        let count = this.countNonEmptyFieldsForInsurance()
                                        if(_.contains(tags, this.tags.insurance) && count == 0){
                                            let index = tags.indexOf(this.tags.insurance);
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
                {showSearchButton?<div style={{backgroundColor:'#C5CAE9',marginLeft:'-10px'}}>
                    {this.state.tags.length > 0 ?<div style={{padding:'10px'}}><div className="row" style={{marginBottom:'-10px'}}>
                        <div className="col-xs-12">
                            {_.map(this.state.tags,( filter, i ) => {
                                let color = 'aliceblue'
                                let tolTip;
                                if(filter == this.tags.clearAll){
                                    color = '#e91e63'
                                    tolTip = 'Remove all filters'
                                }
                                return <div
										className={filter.length > 9 ? "col-xs-2": "col-xs-1"}
										key={i}
										style={{
											paddingTop: '4px',
	    								    paddingBottom: '4px',
	    								    //paddingLeft: '15px',
	    								    backgroundColor: color,
	    								    fontSize: '13px',
	    								    fontWeight: '400',
											//marginLeft: '7px',
                                            //marginTop:'7px',
                                            marginRight:'5px',
											border: '1px solid transparent',
	    								    borderRadius: '13px',
											//margin: "2px",
										}}>
											{filter}
											<span onClick={() => {
													this.clearFilters(filter)
												}}
												style={{
													float: 'right',
	    										    cursor: 'pointer',
	    										    fontSize: '14px',
	    										    fontWeight: 'bold',
													marginRight: '10px',
												}} title={tolTip?tolTip:'Remove Filter'}>&times;</span>
									</div>}
							)}
                        </div>
                    </div><hr></hr></div>:null}

                    <div className="row" style={{marginTop:'-30px'}}>
                        {totalSupplierFound > 0 ? <div className="col-lg-6" style={{paddingTop:'15px'}}>
                                <span style={{marginLeft:'7px',backgroundColor:'#9FA8DA',color:'#333',borderRadius:'6px',padding:'3px 5px',border:'1px solid rgba(0, 0, 0, 0.1)'}}>{'Found suppliers: '+totalSupplierFound}</span>
                            </div>:null}
                    <div className={showTotalCountClass}>
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
