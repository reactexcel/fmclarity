import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

DocOwnerCard = React.createClass(
{

    mixins: [ ReactMeteorData ],

    getMeteorData()
    {
        var q, owner, type, target;
        target = this.props.item;
        q = this.props.item.owner;
        if ( q )
        {
            type = q.type;
            if ( type == "team" )
            {
                owner = Teams.findOne( q._id );
            }
            else
            {
                owner = Users.findOne( q._id );
            }
        }
        return {
            owner: owner,
            target: target,
            type: type
        }
    },

    showModal( selectedUser )
    {
        var type = this.data.type;
        if ( type == "team" )
        {
            Modal.show(
            {
                content: <TeamCard 
                    item={this.data.owner} />
            } )
        }
        else
        {
            Modal.show(
            {
                content: <UserCard 
                    item={this.data.owner} 
                    team={this.data.target}/>
            } )
        }
    },

    render()
    {
        if ( !this.data.owner )
        {
            return <div/>
        }
        return (
            <div className="active-link" onClick={this.showModal}> 
                <ContactCard item={this.data.owner} team={this.data.target}/>
            </div>
        )
    }
} )
