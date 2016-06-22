import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

ClientFilter = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var user = Meteor.user();
        if(user) {
            var team = Session.getSelectedTeam();
            if(team) {
                return {
                    user : user,
                    team : team,
                    client : Session.getSelectedClient(),
                    clients : team.getSuppliers()
                }
            }
        }
        return {}
    },

    selectClient(client) {
        Session.set("selectedClient",client);
    },

    render() {
        var client = this.data.client;
        return (
            <SuperSelect 
                items={this.data.clients} 
                itemView={NameCard}
                onChange={this.selectClient}
                clearOption={{name:"All clients"}}
            >
            {
                client?
                <div style={{whiteSpace:"nowrap"}}>
                	{this.props.title?<span style={{color:"#333",fontWeight:"bold",fontSize:"16px",lineHeight:"40px",marginLeft:"20px"}}>{this.props.title} for </span>:null}
                    <span style={{fontSize:"16px",lineHeight:"40px"}} className="nav-label">{client.getName()} <i className="fa fa-caret-down"></i></span>
                </div>
                :
                <div style={{whiteSpace:"nowrap"}}>
                	{this.props.title?<span style={{color:"#333",fontWeight:"bold",fontSize:"16px",lineHeight:"40px",marginLeft:"20px"}}>{this.props.title} for </span>:null}
                    <span style={{fontSize:"16px",lineHeight:"40px"}} className="nav-label">all clients <i className="fa fa-caret-down"></i></span>
                </div>
            }
            </SuperSelect>
        )}
})