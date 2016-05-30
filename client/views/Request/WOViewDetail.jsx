import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

IssueDetail = React.createClass({

    saveItem() {
        Meteor.call('Issues.save',this.props.item);
    },

    componentWillMount: function() {
        this.saveItem = _.debounce(this.saveItem,500);
    },

    render() {
        var issue=this.props.item;
        return (
            <div className="issue-detail">
                <IssueSpecArea item={issue} save={this.saveItem} closeCallback={this.props.closeCallback}>
                    <IssueDynamicArea item={issue} save={this.saveItem} closeCallback={this.props.closeCallback}/>
                </IssueSpecArea>
            </div>
        )
    }
})