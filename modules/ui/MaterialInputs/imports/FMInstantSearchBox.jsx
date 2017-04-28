/**
 * @author          Norbert Glen <norbertglen7@gmail.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";

import { Modal } from '/modules/ui/Modal';

import { Facilities } from '/modules/models/Facilities';
import { Requests } from '/modules/models/Requests';
import { Documents, DocViewEdit } from '/modules/models/Documents';

/**
 * @class           Text
 * @memberOf        module:ui/MaterialInputs
 */

 var SearchBox = React.createClass({
    doSearch(e){
        var query=e.target.value // this is the search text
        $('#search-results').show();
        this.props.doSearch(query);
    },
    handleBlur:function(e){
        e.target.value="";
        this.props.query="";
        if(this.props.mobileView == true){
            if($('#search-results').is(':visible')==false){
                this.props.blur()
            }
        } else {
            if($('#search-results').is(':visible')==true){
                $('#searchInput').focus();
            } else {
                $('#searchInput').animate({ width: '-=200' }, 'slow');
            }
        }
    },
    render:function(){
        return(
            <div>
            {this.props.mobileView==true?<div>
                <input style={{'borderBottom':'1px solid black'}} type="search" onBlur={(e)=>{this.handleBlur(e)}} id={this.props.mobileView?"searchInput1":"searchInput"} placeholder="Search FM" value={this.props.query} onChange={(e)=>{this.doSearch(e)}}/>
            </div>:<div style={{'marginRight':'20px'}}>
            <i className="fa fa-search" onClick={(e)=>{
                if($('#searchInput').width() >= 200 ){
                    $('#searchInput').animate({ width: '-=200' }, 'slow');
                    $('#search-results').hide();
                } else {
                    $('#searchInput').focus();
                    $('#searchInput').animate({ width: '+=200' }, 'slow');
                }
            }} style={{'marginRight':'10px','cursor':'pointer'}}/>
            <input style={{'width':'0px','borderBottom':'1px solid white'}} type="search" onBlur={(e)=>{this.handleBlur(e)}} id={this.props.mobileView?"searchInput1":"searchInput"} placeholder="Search FM" value={this.props.query} onChange={(e)=>{this.doSearch(e)}}/>
            </div>}
            </div>
        )
    }
});

var DisplayTable = React.createClass({
    handleClick: function(e) {
        e.preventDefault();
        //document.getElementById(this.props.mobileView?"searchInput1":"searchInput").value="";
        $('#search-results').hide();
        this.props.mobileView?$('#searchInput1').focus():$('#searchInput').focus();
    },
    render:function(){
        //making the rows to display
        var rows=[];
        var comp=this;
        if(this.props.data && this.props.data.length > 0){
            this.props.data.forEach(function(data, idx) {
                rows.push(<li key={idx} onClick={(e)=>{
                    //comp.props.mobileView==true?$('searchInput1').focus():$('searchInput').focus();
                    data.action ? data.action : comp.handleClick(e)
                }} ><a href={data.searchUrl ? data.searchUrl : ""}>{data.listText ? data.listText : data.name}</a></li>)
                });
        }
        //returning the table
        return(
             <ul id="search-results" className="searchResults" style = { {maxWidth:"250px", maxHeight: "500px", overflowY : "auto" } }>
                {rows}
            </ul>
        );
    }
});

const FMInstantSearchBox = React.createClass({
    doSearch:function(queryText){
        //get query result
        var queryResult=[];
        var facilities= Facilities.find().fetch();
        facilities.forEach(function(facility){
            if(facility.name.toLowerCase().indexOf(queryText)!=-1){
                facility.searchUrl="/portfolio";
                queryResult.push(facility);
                    }
        });

        var requests= Requests.find().fetch();
        requests.forEach(function(request){
            if(
                (request.name.toLowerCase().indexOf(queryText)!=-1) ||
                (request.code.toString().indexOf(queryText)!=-1)
            ){
                request.searchUrl="/requests/"+request._id;
                request.listText=request.code.toString().indexOf(queryText)!=-1 ? request.code+" - "+request.name : request.name;
                queryResult.push(request);
                        }
        });

        var documents= Documents.find().fetch();
        documents.forEach(function(document){
            var doc=Documents.findOne(document._id);
            var action=function () {
                return Modal.show( {
                content: <DocViewEdit item = { doc }/>
            } );
            }
            if(document.name && document.name.toLowerCase().indexOf(queryText)!=-1){
                document.action=action;
                queryResult.push(document);
            }
        });

        this.setState({
            query:queryText,
            filteredData: queryResult
        })
    },
    getInitialState:function(){
        return{
            query: '',
            filteredData: undefined
        }
    },

    renderResults: function() {
        if (this.state.filteredData && this.state.query.trim()!="") {
            return (
                <DisplayTable mobileView={this.props.mobileView} data={this.state.filteredData} query={ this.state.query }/>
            );
        }
    },
    render:function(){
        return (
            <div className="FMInstantSearchBox">
                <SearchBox blur={()=>{
                    this.props.blur()
                }} mobileView={this.props.mobileView} query={this.state.query} doSearch={this.doSearch}/>
                {this.renderResults()}
            </div>
        );
    }
});

export default FMInstantSearchBox;
