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
export class SearchBox extends React.Component {
    constructor(props) {
      super(props);
    }

    doSearch(e){
        var query=e.target.value // this is the search text
        $('#search-results').show();
        this.props.doSearch(query);
    }

    componentDidMount(){
        let self = this;
        $(document).bind('click', function () {
            if($('#searchInput').width() >= 200 ){
                //e.target.value="";

                self.props.query="";

                    if($('#search-results').is(':visible')==true){
                        //$('#searchInput').focus();
                        //this.props.doSearch('')
                        $('#searchInput').val('');
                        $('#search-results').hide();
                        $('#searchInput').animate({ width: '-=200' }, 'slow');
                    } else {
                        $('#searchInput').animate({ width: '-=200' }, 'slow');
                    }
            }

            if($("#search-icon").hasClass("open") == true){
                    $('#search-results').hide();
                    $("#search-icon").removeClass("open")
                    $('#searchInput1').val('');
            }
        });
    }

    render(){
        return(
            <div>
            {this.props.mobileView==true?<div>
                <input style={{'borderBottom':'1px solid black'}} type="search" id={this.props.mobileView?"searchInput1":"searchInput"} ref={this.props.mobileView?"searchInput1":"searchInput"} placeholder="Search FMC" value={this.props.query} onChange={(e)=>{this.doSearch(e)}}/>
            </div>:<div style={{'marginRight':'20px'}}>
            <i className="fa fa-search" onClick={(event)=>{
                event.stopPropagation();
                if($('#searchInput').width() >= 200 ){
                    $('#searchInput').animate({ width: '-=200' }, 'slow');
                    $('#search-results').hide();
                } else {
                    $('#searchInput').focus();
                    $('#searchInput').animate({ width: '+=200' }, 'slow');
                }
            }} style={{'marginRight':'10px','cursor':'pointer'}}/>
            <input style={{'width':'0px','borderBottom':'1px solid white'}} type="search" id={this.props.mobileView?"searchInput1":"searchInput"} ref={this.props.mobileView?"searchInput1":"searchInput"} placeholder="Search FMC" value={this.props.query} onChange={(e)=>{this.doSearch(e)}}/>
            </div>}
            </div>
        )
    }
}


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
                    event.stopPropagation();
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
        let self =this;
        return (
            <div className="FMInstantSearchBox">
                <SearchBox mobileView={self.props.mobileView} query={self.state.query} doSearch={self.doSearch}/>
                {self.renderResults()}
            </div>
        );
    }
});

export default FMInstantSearchBox;
