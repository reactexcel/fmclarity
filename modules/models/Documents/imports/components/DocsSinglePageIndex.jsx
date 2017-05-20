import React from "react";

import DocIcon from './DocIcon.jsx';
import DocIconHeader from './DocIconHeader.jsx';
import { Text } from '/modules/ui/MaterialInputs'
import { AutoForm } from '/modules/core/AutoForm';
import { Documents } from '/modules/models/Documents'
import { Select } from '/modules/ui/MaterialInputs';
import {Teams} from '/modules/models/Teams'
import { Facilities,FacilityListTile } from '/modules/models/Facilities';
import DocTypes from '../schemas/DocTypes.jsx';

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
            listSize: "10",
    	};
        this.query = {
            $and:[]
        };
    }

    componentDidMount( ){
        $(window).click(function(event) {
            $('#filter-box').css('display','none')
            $('#arrow-icon').css('display','none')
            //$('#filter-details').css('display','block')
       });
        if ( this.state.facilities && this.state.facilities.length ) {
            this.onPageChange();
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
            for(var idx in documents){
                if(documents[idx].facility && documents[idx].facility._id && documents[idx].type){
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
                        let docTypeAlreadyExist = facilityAlreadyExist[0].content.filter(function(obj){
                            return obj.name === documents[idx].type
                        })
                        let facilityIndex = folders.findIndex(fold => fold._id === facilityAlreadyExist[0]._id)
                        if(docTypeAlreadyExist.length == 0){
                            folders[facilityIndex].content.push({
                                facilityId: documents[idx].facility._id,
                                name: documents[idx].type,
                                folderType:'docType',
                                content: [documents[idx]]
                            })
                        }else{
                            let docIndex = folders[facilityIndex].content.findIndex(doc => doc.name === documents[idx].type)
                            folders[facilityIndex].content[docIndex].facilityId = documents[idx].facility._id;
                            folders[facilityIndex].content[docIndex].content.push(documents[idx]);
                        }
                    }
                }
            }

            let currentFolders = folders
            let path = {
                documents:{
                    name: 'Documents',
                    onClick:()=>{
                        let path = this.state.path;
                        path = _.omit(path,'facility')
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
        let docs = this.state.documents;
        docs[index] = newValue;
        if ( newValue ) {
            this.setState({
                documents: docs
            })
        }
        if ( !newValue ) {
            let newDocs = [];
            docs.map((doc,idx)=>{
                if(idx != index){
                    newDocs.push(doc)
                }
            })
            //Update the component when a document get deleted.
            this.setState( {
                documents: newDocs
            } );
        }
    }

    updateQuery( query, value, fieldName ){
        if(!query.$and){
            query.$and = []
        }
        if ( !query.$and.length) {
            query.$and.push( { [fieldName]: value } );
        } else {
            for ( var i in query.$and ) {
                if ( query.$and[i][fieldName] ) {
                    if( !value ){
                        query.$and.splice(i,1);
                    } else {
                        query.$and[i][fieldName] = value;
                    }
                    break;
                }
                if ( i == query.$and.length-1 && !query.$and[i][fieldName]){
                    query.$and.push( { [fieldName]: value } );
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

    onClickFolder( folder ){
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
                    path = _.omit(path,'docType')
                    if(this.state.path.docType){
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
    let role = Meteor.user()&&Meteor.user().getRole();
    let currentFolders = this.state.currentFolders;
    return (
			<div className='col-lg-12' style={{paddingTop:'10px'}}>
                <div className="row">
                    <div className="col-xs-12">
                        <button onClick={(event)=>{
                            event.stopPropagation();
                            if($('#filter-box').css('display') == 'none'){
                                $('#filter-box').css('display','block')
                                $('#arrow-icon').css('display','block')
                                //$('#filter-details').css('display','none')
                            } else {
                                $('#filter-box').css('display','none')
                                $('#arrow-icon').css('display','none')
                                //$('#filter-details').css('display','block')
                            }
                        }} className="button" style={{'cursor':'pointer','borderRadius':'37px','padding':'10px','color':'white','backgroundColor':'#0152b5'}}><i className="fa fa-filter" style={{'marginRight':'5px'}}></i>Filter Documents</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12" style={{textAlign:'center'}}>
                        <div onClick={(event)=>{ event.stopPropagation();}} id="arrow-icon" style={{'display':'none','height':'25px','width':'25px','backgroundColor':'transparent','borderBottom':'15px solid #d6e6fa','borderLeft':'15px solid transparent','borderRight':'15px solid transparent','margin':'0 45px','marginTop':'-10px'}}></div>
                    </div>
                </div>
                <div onClick={(event)=>{ event.stopPropagation();}} id="filter-box" style = { {'backgroundColor':'#d6e6fa','position':'absolute','width':'100%','display':'none','zIndex':'1000',padding:'10px',boxShadow:'2px 11px 8px 1px rgba(0, 0, 0, 0.14), 2px 5px 13px 1px rgba(0, 0, 0, 0.2), 4px 5px 16px 0px rgba(0, 0, 0, 0.12)'} } className = "ibox search-box report-details">
                    <div className="row" style={{marginLeft:"0px",minHeight:'210px'}}>
                        <div className="col-lg-12" style={{float:'right'}}>
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
                                            listSize: "10",
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
                        <div className="col-lg-12" style={{borderBottom:'1px solid #BDBDBD',paddingBottom:'10px'}}>
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
                        <div className="col-lg-12" style={{borderBottom:'1px solid #BDBDBD',paddingBottom:'10px'}}>
                            <div className="row">
                                <div className="col-lg-4" style={{padding:'10px'}}>
                                    <Text
                                        placeholder="Document Name"
                                        value={this.state.docName}
                                        onChange={( docName ) => {
                                            let stateToSet = {},
                                                self = this;
                                                stateToSet.docName = docName
                                            this.updateQuery( this.query, docName, 'name');
                                            this.query = this.query.$and && !this.query.$and.length ? _.omit(this.query, '$and') : this.query
                                            this.query =  _.omit(this.query, '$or')
                                            stateToSet.query = this.query
                                            this.setState(stateToSet,()=>self.onPageChange())
                                        }}
                                    />
                                </div>
                                <div className="col-lg-8" style={{paddingLeft:'10px',marginTop:'10px',borderLeft:'1px solid rgb(189, 189, 189)'}}>
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
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-3">
                                    <Select
                                        placeholder={"Select list size"}
                                        value={this.state.listSize}
                                        items={[ "10", "25", "50", "100" ]}
                                        onChange={ ( listSize ) => {
                                            let componet = this;
                                            this.setState({ listSize: listSize || "10" },() => componet.onPageChange())
                                        }}
                                        />
                                </div>
                                <div className="col-lg-9">
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
				<div className="row" style={{marginLeft:'0px',marginTop:'20px'}}>
                    {this.state.path?<div className={'col-xs-12'} style={{display:'inline',padding:'10px',backgroundColor:'#d6e6fa'}}>
                        {this.state.path && this.state.path.documents?<span style={{paddingRight:'10px'}}><a style={{color:'#0152b5',fontSize:'15px'}} onClick={this.state.path.documents.onClick}>{this.state.path.documents.name}</a><i style={{marginLeft:'8px',fontSize:'15px'}} className="fa fa-caret-right" aria-hidden="true"></i></span>:null}
                        {this.state.path && this.state.path.facility?<span style={{paddingRight:'10px'}}><a style={{color:'#0152b5',fontSize:'15px'}} onClick={this.state.path.facility.onClick}>{this.state.path.facility.name}</a><i style={{marginLeft:'8px',fontSize:'15px'}} className="fa fa-caret-right" aria-hidden="true"></i></span>:null}
                        {this.state.path && this.state.path.docType?<span style={{paddingRight:'10px'}}><a style={{color:'#0152b5',fontSize:'15px'}} onClick={this.state.path.docType.onClick}>{this.state.path.docType.name}</a><i style={{marginLeft:'8px',fontSize:'15px'}} className="fa fa-caret-right" aria-hidden="true"></i></span>:null}
                    </div>:null}
                    {currentFolders?_.map(currentFolders, ( folder, idx ) => {
                        if(folder.content){
                            let totalDoc = 0;
                            let content = folder.content;
                            _.map(content,(cont,i)=>{
                                if(cont.content){
                                    totalDoc = totalDoc + cont.content.length
                                }else{
                                    totalDoc = totalDoc + 1
                                }
                            })
                            return <div key={idx} className="col-xs-2" style={{marginTop:'20px',textAlign:'center'}}>
                                <i title = {"Total documents :"+totalDoc} onDoubleClick={()=>{
                                    this.onClickFolder(folder)
                                }} className="fa fa-folder" aria-hidden="true" style={{cursor:'pointer',color:'#fad95f',fontSize:'90px',textShadow:'1px 1px 1px black',marginLeft:'20px'}}></i>
                                <div className="folder-name" style={{marginLeft:'23px',maxWidth:'50%',minWidth:'150px',display:'inline-block'}}>{folder.name}</div>
                            </div>
                        }
                    }):null}
                    <div className="col-lg-12" style={currentFolders && currentFolders[0] && !currentFolders[0].content?{display:'block',paddingLeft:'0px'}:{display:'none',paddingLeft:'0px'}}>
                        <DocIconHeader />
                        <div style={{backgroundColor: "#fff"}}>
                            {currentFolders?_.map(currentFolders, ( doc, idx ) => {
                                return <DocIcon
                                    key = { idx }
                                    item = { doc }
                                    role = {role}
                                    model = {Teams}
                                    onChange = { (doc) => { this.handleChange( idx, doc ) } }
                                    />
                            }):null}
                        </div>
                    </div>
				</div>
			</div>
		);
  }
}
