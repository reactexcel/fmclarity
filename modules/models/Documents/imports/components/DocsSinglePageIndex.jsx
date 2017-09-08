import React from "react";

import DocDirectory from './DocDirectory.jsx';
import DocViewEdit from './DocViewEdit.jsx';
import DocIconHeader from './DocIconHeader.jsx';
import { Text } from '/modules/ui/MaterialInputs'
import { AutoForm } from '/modules/core/AutoForm';
import { Documents } from '/modules/models/Documents'
import { Select } from '/modules/ui/MaterialInputs';
import {Teams} from '/modules/models/Teams';
import { Facilities,FacilityListTile } from '/modules/models/Facilities';
import RaisedButton from 'material-ui/RaisedButton';
import DocTypes from '../schemas/DocTypes.jsx';
import DocumentSchema from '../schemas/DocumentSchema.jsx';
import moment from 'moment';


export default class DocsSinglePageIndex extends React.Component {
    constructor(props) {
        super(props);
    	this.state = {
    		documents: props.documents || [],
    		facility: props.facility,
            selectedFacilities:[],
            docName:'',
            docTypes:[],
            facilities: props.facilities,
            team: props.team,
    		keyword: "",
            currentPage: 0,
            nextPage: 2,
            previousPage: -1,
            listSize: "400",
    	};
        this.query = {
            $and:[]
        };
    }

    componentDidMount( ){
        window.addEventListener('scroll', this.handleScroll);
        $(window).click(function(event) {
            $('#filter-box').css('display','none')
            $('#arrow-icon').css('display','none')
            $('#document-container').css('margin-top','20px')
            //$('#filter-details').css('display','block')
       });
        if ( this.state.facilities && this.state.facilities.length ) {
            this.onPageChange();
        }
    }

    componentWillMount(){
    }
    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(event) {
        let scrollTop = event.srcElement.body.scrollTop,
        itemTranslate = Math.min(0, scrollTop/3 - 60);
        if(itemTranslate > -20){
            $('#arrow-icon').hide('slow');
            $('#filter-box').hide('slow');
            $('#filter-details').css('display','block')
            $('#document-container').css('margin-top','20px')
        }
    }

    // Get the list of document which have to be shown
    onPageChange(){
        let  { query, facilityIds, listSize, currentPage, previousPage, nextPage, facilities, team } = this.state;
        if ( facilities && facilities.length ) {
            let ids = facilityIds || _.map(facilities, f => f._id),
            q = query || {
                $or:[
                    { "team._id" : team._id },
                    {
                        "facility._id": {
                            $in: ids
                        }
                    }
                ]
            };
            q = _.isEmpty(q) ? {
                $or:[
                    { "team._id" : team._id },
                    {
                        "facility._id": {
                            $in: ids
                        }
                    }
                ]
            } : q
            totalPage = Math.ceil( Documents.find(q).count() /  parseInt( listSize ) );
            let documents = Documents.findAll( q,
                {
                    limit: parseInt( listSize ),
                    skip: (currentPage * parseInt( listSize )),
                }
            );
            let folders = [];
            if( _.isEmpty(this.state.selectedFacilities) && _.isEmpty(this.state.docName) && _.isEmpty(this.state.docTypes) ){
                for(var idx in documents){
                    if(documents[idx].facility && documents[idx].facility._id && _.contains(ids,documents[idx].facility._id) && documents[idx].type){
                        let facilityAlreadyExist = folders.filter(function(obj){
                            return obj._id == documents[idx].facility._id
                        })
                        if(facilityAlreadyExist.length == 0){
                            folders.push({
                                _id: documents[idx].facility._id,
                                name: documents[idx].facility.name,
                                folderType:'facility',
                                content:[]
                            })
                            facilityAlreadyExist.push({
                                _id: documents[idx].facility._id,
                                name: documents[idx].facility.name,
                                folderType:'facility',
                                content:[]
                            })
                        }
                        if(facilityAlreadyExist.length != 0){
                            if(documents[idx].serviceType && documents[idx].serviceType.name){
                                let serviceTypeAlreadyExist = facilityAlreadyExist[0].content.filter(function(obj){
                                    return obj.name === documents[idx].serviceType.name
                                })
                                let facilityIndex = folders.findIndex(fold => fold._id === facilityAlreadyExist[0]._id);
                                if(serviceTypeAlreadyExist.length == 0){
                                    folders[facilityIndex].content.push({
                                        facilityId: documents[idx].facility._id,
                                        name: documents[idx].serviceType.name,
                                        folderType:'service',
                                        content:[]
                                    })
                                    serviceTypeAlreadyExist.push({
                                        facilityId: documents[idx].facility._id,
                                        name: documents[idx].serviceType.name,
                                        folderType:'service',
                                        content:[]
                                    })
                                }
                                if(serviceTypeAlreadyExist.length != 0){
                                    if(documents[idx].subServiceType && documents[idx].subServiceType.name){
                                        let subServiceTypeAlreadyExist = serviceTypeAlreadyExist[0].content.filter(function(obj){
                                            return obj.name === documents[idx].subServiceType.name
                                        })
                                        //let docIndex = folders[facilityIndex].content.findIndex(doc => doc.name === documents[idx].type)
                                        let serviceIndex = folders[facilityIndex].content.findIndex(serv => serv.name === documents[idx].serviceType.name);
                                        if(subServiceTypeAlreadyExist.length == 0){
                                            folders[facilityIndex].content[serviceIndex].content.push({
                                                facilityyId:documents[idx].facility._id,
                                                name:documents[idx].subServiceType.name,
                                                folderType: 'subService',
                                                content:[]
                                            })
                                            subServiceTypeAlreadyExist.push({
                                                facilityyId:documents[idx].facility._id,
                                                name:documents[idx].subServiceType.name,
                                                folderType: 'subService',
                                                content:[]
                                            })
                                        }
                                        if(subServiceTypeAlreadyExist.length != 0){
                                            let docTypeAlreadyExist = subServiceTypeAlreadyExist[0].content.filter(function(obj){
                                                return obj.name === documents[idx].type
                                            })
                                            let subServiceIndex = folders[facilityIndex].content[serviceIndex].content.findIndex(subServ => subServ.name === documents[idx].subServiceType.name);
                                            if(docTypeAlreadyExist.length == 0){
                                                folders[facilityIndex].content[serviceIndex].content[subServiceIndex].content.push({
                                                    facilityId: documents[idx].facility._id,
                                                    name: documents[idx].type,
                                                    folderType:'docType',
                                                    content: [documents[idx]],
                                                    folderColor:'#d6e6fa'
                                                })
                                            }else{
                                                let docIndex = folders[facilityIndex].content[serviceIndex].content[subServiceIndex].content.findIndex(doc => doc.name === documents[idx].type)
                                                folders[facilityIndex].content[serviceIndex].content[subServiceIndex].facilityId = documents[idx].facility._id;
                                                folders[facilityIndex].content[serviceIndex].content[subServiceIndex].content.push(documents[idx]);
                                            }
                                        }
                                    }else{
                                        let docTypeAlreadyExist = serviceTypeAlreadyExist[0].content.filter(function(obj){
                                            return (obj.folderType == 'docType' && obj.name == documents[idx].type)
                                        })
                                        let serviceIndex = folders[facilityIndex].content.findIndex(serv => serv.name === documents[idx].serviceType.name);
                                        if(docTypeAlreadyExist.length == 0){
                                            folders[facilityIndex].content[serviceIndex].content.push({
                                                facilityId: documents[idx].facility._id,
                                                name: documents[idx].type,
                                                folderType:'docType',
                                                content: [documents[idx]],
                                                folderColor:'#d6e6fa'
                                            })
                                        }else{
                                            let docIndex = folders[facilityIndex].content[serviceIndex].content.findIndex(doc => (doc.name == documents[idx].type && doc.folderType == 'docType'))
                                            folders[facilityIndex].content[serviceIndex].content[docIndex].facilityId = documents[idx].facility._id;
                                            folders[facilityIndex].content[serviceIndex].content[docIndex].content.push(documents[idx]);
                                        }
                                    }
                                }
                            }else{
                                let buildingDocAlreadyExist = facilityAlreadyExist[0].content.filter(function(obj){
                                    return obj.folderType === 'buildingDocs'
                                })
                                let facilityIndex = folders.findIndex(fold => fold._id === facilityAlreadyExist[0]._id)
                                if(buildingDocAlreadyExist.length == 0){
                                    folders[facilityIndex].content.push({
                                        facilityId: documents[idx].facility._id,
                                        name:'Building Documents',
                                        folderType:'buildingDocs',
                                        content:[]
                                    })
                                    buildingDocAlreadyExist.push({
                                        facilityId: documents[idx].facility._id,
                                        name:'Building Documents',
                                        folderType:'buildingDocs',
                                        content:[]
                                    })
                                }
                                if(buildingDocAlreadyExist.length != 0){
                                    let docTypeAlreadyExist = buildingDocAlreadyExist[0].content.filter(function(obj){
                                        return obj.name === documents[idx].type
                                    })
                                    let buildingDocIndex = folders[facilityIndex].content.findIndex(fold => fold.folderType === 'buildingDocs')
                                    if(docTypeAlreadyExist.length == 0){
                                        folders[facilityIndex].content[buildingDocIndex].content.push({
                                            facilityId: documents[idx].facility._id,
                                            name: documents[idx].type,
                                            folderType:'docType',
                                            content: [documents[idx]],
                                            folderColor:'#d6e6fa'
                                        })
                                    }else{
                                        let docIndex = folders[facilityIndex].content[buildingDocIndex].content.findIndex(doc => doc.name === documents[idx].type)
                                        folders[facilityIndex].content[buildingDocIndex].content[docIndex].facilityId = documents[idx].facility._id;
                                        folders[facilityIndex].content[buildingDocIndex].content[docIndex].content.push(documents[idx]);
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                for(var idx in documents){
                    folders.push(documents[idx])
                }
            }

            let currentFolders = folders
            let path = {
                documents:{
                    name: 'Documents',
                    onClick:()=>{
                        let path = this.state.path;
                        path = _.omit(path,'facility')
                        path = _.omit(path,'service')
                        path = _.omit(path,'buildingDocType')
                        path = _.omit(path,'subService')
                        path = _.omit(path,'docType')
                        this.setState({
                            path:path,
                            currentFolders: folders
                        })
                    }
                }
            }
            this.setState({
                path,
                folders,
                currentFolders,
                documents,
                totalPage,
                facilityIds
            })
        }
    }
	componentWillReceiveProps( props ) {
        let componet = this;
        this.setState({
            documents: props.documents,
            facility: props.facility,
            team: props.team,
            facilities: props.facilities,
        },() =>{
            if ( props.facilities && props.facilities.length ) {
                componet.onPageChange();
            }
        });
        if( props.team ){
            //this.query["team._id"] = props.team._id;
        }
	}

    handleChange( index, newValue ) {
        let docs = this.state.currentFolders;
        docs[index] = newValue;
        if(newValue){
            this.setState({
                currentFolders:docs
            })
            this.onPageChange()
        }
        if(!newValue){
            let newDocs=[];
            docs.map((doc,idx)=>{
                if(idx != index && !_.isEmpty(doc)){
                    newDocs.push(doc)
                }
            })
            this.setState({
                currentFolders:newDocs
            })
        }
    }

    updateQuery( query, value, fieldName ){
        if(!query.$and){
            query.$and = []
        }
        if ( !query.$and.length) {
            if(!_.isEmpty(value)){
                query.$and.push( { [fieldName]: value } );
            }
        } else {
            for ( var i in query.$and ) {
                if ( query.$and[i][fieldName] ) {
                    if( _.isEmpty(value) ){
                        query.$and.splice(i,1);
                    } else {
                        query.$and[i][fieldName] = value;
                    }
                    break;
                }
                if ( i == query.$and.length-1 && !query.$and[i][fieldName]){
                    if(!_.isEmpty(value)){
                        query.$and.push( { [fieldName]: value } );
                    }
                }
            }
        }
        this.query = query;
    }

    updateQueryForDocType(query,docTypes,fildName){
        this.query = _.omit(query, fildName);
        let type = {
            $in:[]
        }
        _.map(docTypes,( docType, i ) => {
            type.$in.push( docType )
        })
        if(this.state.selectedFacilities.length === 0){
            let  { facilityIds, facilities, team } = this.state;
            if ( facilities && facilities.length ) {
                let ids = facilityIds || _.map(facilities, f => f._id)
                this.query.$or = [
                    { "team._id" : team._id },
                    {
                        "facility._id": {
                            $in: ids
                        }
                    }
                ]
            }
        }
        this.query.type = type;
        if(docTypes.length == 0){
            this.query = _.omit(this.query, "type");
        }
    }

    updateQueryForFacility(query,selectedFacilities,fildName){
        this.query = _.omit(query, fildName);
        let facility = {
            $in:[]
        }
        _.map(selectedFacilities,( facilityId, i ) => {
            facility.$in.push(facilityId )
        })
        this.query['facility._id'] = facility;
        if(selectedFacilities.length == 0){
            this.query = _.omit(this.query, "facility._id");
            if(this.query['team._id']){
                this.query = _.omit(this.query, "team._id");
            }
        }
    }

    onClickFolder( folder,currentFolders ){
        let openingFile = folder.content ? false : true;
        if(openingFile){
            let folderIndex = currentFolders.findIndex(fold => fold._id === folder._id);
            Modal.show( {
                content: <DocViewEdit
    				item = { folder }
    				onChange = { (data) => { this.handleChange( folderIndex, data ) }}
    				model={Teams}
    				selectedItem={this.props.selectedItem}
                    role={Meteor.user()&&Meteor.user().getRole()}
    				team = {Session.getSelectedTeam()}/>
            } )
        }else{
            this.openFolder( folder,currentFolders )
        }
    }

    openFolder( folder,currentFolders ){
        let newContent = []
        _.map(folder.content,( cont, i ) => {
            if(cont != undefined){
                newContent.push(cont)
            }
        })
        folder.content = newContent
        let stateToSet = {
            currentFolders:folder.content
        }
        stateToSet.path = this.state.path;
        if(folder.folderType == 'facility'){
            stateToSet.path.facility = {
                name: folder.name,
                onClick:()=>{
                    let path = this.state.path;
                    let newFolder = this.state.currentFolders
                    path = _.omit(path,'service')
                    path = _.omit(path,'buildingDocType')
                    path = _.omit(path,'subService')
                    path = _.omit(path,'docType')
                    if(this.state.path.facility || this.state.path.service || this.state.path.buildingDocType || this.state.path.subService || this.state.path.docType){
                        newFolder = folder.content;
                    }
                    this.setState({
                        path: path,
                        currentFolders: newFolder
                    })
                }
            }
        } else if(folder.folderType == 'service'){
            stateToSet.path.service = {
                name: folder.name,
                onClick:()=>{
                    let path = this.state.path;
                    let newFolder = this.state.currentFolders
                    path = _.omit(path,'buildingDocType')
                    path = _.omit(path,'subService')
                    path = _.omit(path,'docType')
                    if(this.state.path.facility || this.state.path.service || this.state.path.buildingDocType || this.state.path.subService || this.state.path.docType){
                        newFolder = folder.content;
                    }
                    this.setState({
                        path: path,
                        currentFolders: newFolder
                    })
                }
            }

        } else if(folder.folderType == 'subService'){
            stateToSet.path.subService = {
                name: folder.name,
                onClick:()=>{
                    let path = this.state.path;
                    let newFolder = this.state.currentFolders
                    path = _.omit(path,'docType')
                    if(this.state.path.facility || this.state.path.service || this.state.path.buildingDocType || this.state.path.subService || this.state.path.docType){
                        newFolder = folder.content;
                    }
                    this.setState({
                        path: path,
                        currentFolders: newFolder
                    })
                }
            }

        } else if(folder.folderType == 'buildingDocs'){
            stateToSet.path.buildingDocType = {
                name: folder.name,
                onClick:()=>{
                    let path = this.state.path;
                    let newFolder = this.state.currentFolders
                    path = _.omit(path,'docType')
                    if(this.state.path.facility || this.state.path.service || this.state.path.buildingDocType || this.state.path.subService || this.state.path.docType){
                        newFolder = folder.content;
                    }
                    this.setState({
                        path: path,
                        currentFolders: newFolder
                    })
                }
            }

        } else if(folder.folderType == 'docType'){
            stateToSet.path = this.state.path;
            stateToSet.path.docType = {
                name: folder.name,
                onClick:()=>{
                }
            }
        }
        this.setState( stateToSet )
    }
  render() {
    let facilityID = this.state.query && this.state.query['facility._id'] ? this.state.query['facility._id'] : null;
    let role = Meteor.user()&&Meteor.user().getRole();
    let currentFolders = this.state.currentFolders;
    return (
			<div className='col-xs-12' style={{paddingTop:'10px'}}>
                <div className="row">
                    <div className="col-xs-12">
                        <RaisedButton
                            label="Filter Documents"
                            backgroundColor={"#b8e986"}
                            labelStyle={{fontSize:'12px',paddingLeft:'10px',paddingRight:'10px'}}
                            icon={<i className="fa fa-filter" style={{'marginLeft':'12px',fontSize:'16px',marginTop:"-5px"}}></i>}
                            onClick={(event)=>{
                                event.stopPropagation();
                                if($('#filter-box').css('display') == 'none'){
                                    $('#filter-box').css('display','block')
                                    $('#arrow-icon').css('display','block')
                                    let filterBoxHeight = $('#filter-box').height() + 20 + 'px';
                                    $('#document-container').css('margin-top',filterBoxHeight)
                                    //$('#filter-details').css('display','none')
                                } else {
                                    $('#filter-box').css('display','none')
                                    $('#arrow-icon').css('display','none')
                                    $('#document-container').css('margin-top','20px')
                                    //$('#filter-details').css('display','block')
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12" style={{textAlign:'center'}}>
                        <div onClick={(event)=>{ event.stopPropagation();}} id="arrow-icon" style={{'display':'none','height':'25px','width':'25px','backgroundColor':'transparent','borderBottom':'15px solid #d6e6fa','borderLeft':'15px solid transparent','borderRight':'15px solid transparent','margin':'0 45px','marginTop':'-10px'}}></div>
                    </div>
                </div>
                <div onClick={(event)=>{ event.stopPropagation();}} id="filter-box" style = { {'backgroundColor':'#d6e6fa','position':'absolute','width':'100%','display':'none','zIndex':'1000',padding:'10px',boxShadow:'2px 11px 8px 1px rgba(0, 0, 0, 0.14), 2px 5px 13px 1px rgba(0, 0, 0, 0.2), 4px 5px 16px 0px rgba(0, 0, 0, 0.12)'} } className = "ibox search-box report-details">
                    <div className="row" style={{marginLeft:"0px",minHeight:'210px'}}>
                        <div className="col-xs-12" style={{float:'right'}}>
                            <span style={{float:"right"}}>
                                <button className="btn btn-flat btn-primary" onClick={() => {
                                        let componet = this;
                                        this.setState({
                                            'query': null,
                                            'currentPage': 0,
                                            'nextPage': 2,
                                            'previousPage': -1,
                                            selectedFacilities:[],
                                            docName:'',
                                            docTypes:[],
                                            listSize: "400",
                                        }, () => componet.onPageChange() );
                                        this.query = {
                                            $and: [],
                                            //'team._id': this.state.team._id,
                                        }
                                    }}>
                                    <i className="fa fa-refresh"></i>
                                </button>
                            </span>
                        </div>
                        <div className="col-xs-12" style={{borderBottom:'1px solid #BDBDBD',paddingBottom:'10px'}}>
                            <div className="row">
                                {_.map(this.state.facilities,( facility, idx ) => {
                                    return <div key={idx} className="col-xs-3" style={idx>3?{marginTop:'8px',paddingRight:'10px'}:{paddingRight:'10px'}}>
                                        <div style={_.contains(this.state.selectedFacilities, facility._id)?{backgroundColor:'rgb(33, 150, 243)',cursor:'pointer'}:{backgroundColor:'#CFD8DC',cursor:'pointer'}} onClick={()=>{
                                            let stateToSet = {},
                                                self = this;
                                                selectedFacilities = this.state.selectedFacilities
                                                if(_.contains(selectedFacilities, facility._id)){
                                                    let index = selectedFacilities.indexOf(facility._id);
                                                        selectedFacilities.splice(index,1)
                                                        stateToSet.selectedFacilities = selectedFacilities
                                                } else {
                                                    selectedFacilities.push(facility._id)
                                                    stateToSet.selectedFacilities = selectedFacilities
                                                }
                                                this.query =  _.omit(this.query, '$or')
                                                this.updateQueryForFacility(this.query,selectedFacilities,"facility")
                                                this.query = this.query.$and && !this.query.$and.length ? _.omit(this.query, '$and') : this.query;
                                                stateToSet.query = this.query
                                                this.setState(stateToSet,()=>self.onPageChange())
                                        }}>
                                        {FacilityListTile({item:facility})}
                                    </div>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="col-xs-12" style={{borderBottom:'1px solid #BDBDBD',paddingBottom:'10px'}}>
                            <div className="row">
                                <div className="col-xs-4" style={{padding:'10px'}}>
                                    <Text
                                        placeholder="Document Name"
                                        value={this.state.docName}
                                        onChange={( docName ) => {
                                            let stateToSet = {},
                                                self = this;
                                                stateToSet.docName = docName
                                            let value = docName?{
                                                    $regex: docName,
                                                    $options: 'i'
                                                }:''
                                            this.updateQuery( this.query, value, 'name');
                                            this.query = this.query.$and && !this.query.$and.length ? _.omit(this.query, '$and') : this.query
                                            this.query =  _.omit(this.query, '$or')
                                            stateToSet.query = this.query
                                            this.setState(stateToSet,()=>self.onPageChange())
                                        }}
                                    />
                                </div>
                                <div className="col-xs-8" style={{paddingLeft:'10px',marginTop:'10px',borderLeft:'1px solid rgb(189, 189, 189)'}}>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <h4 style={{fontSize:'15px',fontWeight:'300'}}>Document Type</h4>
                                        </div>
                                        <div className="col-xs-12">
                                            {_.map(DocTypes,( docType, idx ) => {
                                                return <div key={idx} style={{marginTop:'8px',display:'inline'}}>
                                                    <button onClick={(event)=>{
                                                        let stateToSet = {},
                                                            self = this,
                                                            docTypes = this.state.docTypes;
                                                        if(_.contains(docTypes, docType)){
                                                            let index = docTypes.indexOf(docType);
                                                                docTypes.splice(index,1)
                                                                stateToSet.docTypes = docTypes
                                                        } else {
                                                            docTypes.push(docType)
                                                            stateToSet.docTypes = docTypes
                                                        }
                                                        this.query =  _.omit(this.query, '$or')
                                                        this.updateQueryForDocType(this.query,docTypes,"type")
                                                        this.query = this.query.$and && !this.query.$and.length ? _.omit(this.query, '$and') : this.query
                                                        stateToSet.query = this.query
                                                        this.setState(stateToSet,()=>self.onPageChange())
                                                    }} style={{marginTop:'4px',marginRight:'4px','cursor':'pointer','borderRadius':'37px','padding':'5px 10px 5px 10px','color':'black','backgroundColor':'#CFD8DC'}}>{docType}{_.contains(this.state.docTypes, docType) ?<i className="fa fa-check" style={{color:'#2196F3',marginLeft:'5px'}}></i>:null}</button>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-xs-3">
                                    <Select
                                        placeholder={"Select list size"}
                                        value={this.state.listSize}
                                        items={[ "10", "25", "50", "100", "200", "400" ]}
                                        onChange={ ( listSize ) => {
                                            let componet = this;
                                            this.setState({ listSize: listSize || "400" },() => componet.onPageChange())
                                        }}
                                        />
                                </div>
                                <div className="col-xs-9">
                                    <span style={{float: "right"}}>
                                        { this.state.previousPage != -1?
                                            <button
                                                title="Go to previous page"
                                                className="btn btn-flat btn-primary"
                                                onClick={() => {
                                                    let componet = this,
                                                        nextPage = this.state.currentPage,
                                                        currentPage = this.state.previousPage,
                                                        previousPage = this.state.previousPage -1;
                                                    componet.setState({
                                                        currentPage,
                                                        previousPage,
                                                        nextPage,
                                                    },() => componet.onPageChange())
                                                }}>
                                                <i className="fa fa-backward"></i>
                                                 <span> Previous</span>
                                            </button>:
                                        null }
                                        {this.state.nextPage-1 != this.state.totalPage?
                                            <button
                                                title="Go to next page"
                                                className="btn btn-flat btn-primary"
                                                onClick={() => {
                                                    let componet = this
                                                        previousPage = this.state.currentPage;
                                                        currentPage = this.state.nextPage,
                                                        nextPage = this.state.nextPage + 1,
                                                    componet.setState({
                                                        currentPage,
                                                        previousPage,
                                                        nextPage,
                                                    },() => componet.onPageChange())
                                                }}>
                                                <i className="fa fa-forward"></i>
                                                <span> Next</span>
                                            </button>:
                                        null}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
				<div id="document-container" className="row" style={{marginLeft:'0px',marginTop:'20px'}}>
                    {this.state.path?<div className={'col-xs-12'} style={{display:'inline',padding:'10px 10px 10px 0px'}}>
                        {this.state.path && this.state.path.documents?<span><a title="Root directory" style={{color:'#424242',fontSize:'15px'}} onClick={this.state.path.documents.onClick}>{this.state.path.documents.name}</a></span>:null}
                        {this.state.path && this.state.path.facility?<span><i style={{marginLeft:'8px',marginRight:'8px',fontSize:'15px'}} className="fa fa-caret-right" aria-hidden="true"></i><a title="Facility" style={{color:'#424242',fontSize:'15px'}} onClick={this.state.path.facility.onClick}>{this.state.path.facility.name}</a></span>:null}
                        {this.state.path && this.state.path.service?<span><i style={{marginLeft:'8px',marginRight:'8px',fontSize:'15px'}} className="fa fa-caret-right" aria-hidden="true"></i><a title="Service" style={{color:'#424242',fontSize:'15px'}} onClick={this.state.path.service.onClick}>{this.state.path.service.name}</a></span>:null}
                        {this.state.path && this.state.path.buildingDocType?<span><i style={{marginLeft:'8px',marginRight:'8px',fontSize:'15px'}} className="fa fa-caret-right" aria-hidden="true"></i><a title="Building Documents" style={{color:'#424242',fontSize:'15px'}} onClick={this.state.path.buildingDocType.onClick}>{this.state.path.buildingDocType.name}</a></span>:null}
                        {this.state.path && this.state.path.subService?<span><i style={{marginLeft:'8px',marginRight:'8px',fontSize:'15px'}} className="fa fa-caret-right" aria-hidden="true"></i><a title="Sub-service" style={{color:'#424242',fontSize:'15px'}} onClick={this.state.path.subService.onClick}>{this.state.path.subService.name}</a></span>:null}
                        {this.state.path && this.state.path.docType?<span><i style={{marginLeft:'8px',marginRight:'8px',fontSize:'15px'}} className="fa fa-caret-right" aria-hidden="true"></i><a title="Doc-type" style={{color:'#424242',fontSize:'15px'}} onClick={this.state.path.docType.onClick}>{this.state.path.docType.name}</a></span>:null}
                    </div>:null}
                    {currentFolders && currentFolders.length>0?<div className="col-xs-12" style={{display:'block',paddingLeft:'0px'}}>
                            {!currentFolders[0].content?<div style={{marginBottom:'10px'}}><DocIconHeader onlyTags={true}/></div>:null}
                            <div style={{padding:"14px 24px 14px 24px",borderBottom:"1px solid #ddd",backgroundColor:"#eee",fontWeight:"bold"}}>
                                <span style={{display:"inline-block",minWidth:"18px",paddingRight:"30px"}}>&nbsp;</span>
                                <span style={{display:"inline-block",width:"20%",minWidth:"20px"}}>Name</span>
                                <span style={{display:"inline-block",width:"1%",minWidth:"20px",paddingLeft:"10px"}}></span>
                            </div>
                            <div style={{backgroundColor:"#fff"}}>
                                {currentFolders?_.map(currentFolders, ( folder, idx ) => {
                                        return (<div key={idx}>
                                            <DocDirectory
                                                idx={idx}
                                                folder={folder}
                                                currentFolders={currentFolders}
                                                role={role}
                                                onClickFolder={(folder,currentFolders)=>{
                                                    this.onClickFolder(folder,currentFolders)
                                                }}
                                                onChange={()=>{
                                                    this.handleChange(idx)
                                                }}
                                            />
                                        </div>)
                                }):null}
                            </div>
                        </div>:<div className="col-xs-12" style={{display:'block',marginLeft:'-10px'}}><h4>No documents.</h4></div>}
				</div>
			</div>
		);
  }
}
