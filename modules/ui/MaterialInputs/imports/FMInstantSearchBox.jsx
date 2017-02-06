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
    doSearch:function(){
        var query=document.getElementById('searchInput').value; // this is the search text
        this.props.doSearch(query);
    },
    handleBlur:function(){
        document.getElementById('searchInput').value="";
        this.props.query="";
    },
    render:function(){
        return <input type="search" onBlur={this.handleBlur} id="searchInput" placeholder="Search FM" value={this.props.query} onChange={this.doSearch}/>
    }
});

var DisplayTable = React.createClass({
    handleClick: function(e) {
        e.preventDefault();
        document.getElementById("searchInput").value="";
        // $('#searchInput').val()="";
    },
    render:function(){
        //making the rows to display
        var rows=[];
        var comp=this;
        if(this.props.data && this.props.data.length > 0){
            this.props.data.forEach(function(data, idx) {
                rows.push(<li key={idx} onClick={data.action ? data.action : comp.handleClick } ><a href={data.searchUrl ? data.searchUrl : ""}>{data.name}</a></li>)
                });
        }
        //returning the table
        return(
             <ul id="search-results" className="searchResults" style = { { maxHeight: "500px", overflowY : "auto" } }>
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
            if(request.name.toLowerCase().indexOf(queryText)!=-1){
                request.searchUrl="/requests/"+request._id;
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
                <DisplayTable data={this.state.filteredData} query={ this.state.query }/>
            );
        }
    },
    render:function(){
        return (
            <div className="FMInstantSearchBox">
                <SearchBox query={this.state.query} doSearch={this.doSearch}/>
                {this.renderResults()}
            </div>
        );
    }
});

export default FMInstantSearchBox;