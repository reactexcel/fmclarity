import React from "react";

export default React.createClass({

    // all of this should be moved into controller
    // -- or rather, into a new subcontroller called RequestWorkflow

    canProgress() {

        var request = this.props.item;

        return (
            (request.isNew()&&request.canOpen())||
            ((request.isNew()||request.status==Issues.STATUS_NEW)&&request.canIssue())||
            (request.status==Issues.STATUS_ISSUED&&request.canStartClosure())
        ) 
    },

    getProgressVerb() {

        var request = this.props.item;

        if(request.status==Issues.STATUS_CLOSED) {
            return;
        }
        if(request.status==Issues.STATUS_ISSUED) {
            return 'Close';
        }
            else if(/*request.canIssue()||*/request.status==Issues.STATUS_NEW) {
            return 'Issue';
        }
        else if(request.status==Issues.STATUS_DRAFT) {
            return 'Create';
        }
    },

    getRegressVerb() {
        /*
        var request = this.props.item;

        if(request.status==Issues.STATUS_DRAFT||request.status==Issues.STATUS_NEW) {
            if(request.canDestroy()){
                return "Cancel";
            }
        }
        else if(request.status==Issues.STATUS_ISSUED||request.status==Issues.STATUS_CLOSING) {
            if(request.exported&&request.canReverse()) {
                return "Reverse";
            }
            else if(request.canDestroy()){
                return "Delete";
            }
        }
        */
    },

    handleStatusChange(response) {
        if(this.props.onStatusChange) {
            this.props.onStatusChange(response);
        }
        //Modal.hide();
    },

    progress() {

        var request = this.props.item;

        if(request.canStartClosure()) {
            Meteor.call('Issues.startClosure',request,this.handleStatusChange);
        }
        else if(request.canIssue()) {
            Meteor.call('Issues.issue',request,this.handleStatusChange);
            Modal.hide();
        }
        else if(request.canOpen()) {
            Meteor.call('Issues.open',request,this.handleStatusChange);
            Modal.hide();
        }
    },

    regress() {

        var request = this.props.item;

        if(request.canDestroy()) {
            var message = confirm('Are you sure you want to cancel this work order?');
            if(message == true){
                Meteor.call('Issues.destroy',request,this.handleStatusChange);
            }
            Modal.hide();
        }
        else if(request.canReverse()) {
            var message = confirm('Are you sure you want to reverse this work order?');
            if(message == true){
                Meteor.call('Issues.reverse',request,this.handleStatusChange);
            }
            Modal.hide();
        }
    },

    render() {
        var request = this.props.item;
        var width = this.props.width||"100%";
        var progressVerb = this.getProgressVerb();
        var regressVerb = this.getRegressVerb();
        var actions = request.getActions();
        return (
            <div>
                {actions&&actions.length?actions.map((action)=>{
                    if(request.canDoAction(action)) {
                        return <button 
                            key={action}
                            onClick={()=>{request.doAction(action,this.handleStatusChange)}}
                            style={{margin:0,width:width,maxWidth:"400px"}} 
                            type="button" 
                            className={"btn btn-sm btn-"+(request.checkDoAction(action)?'Issued':'disabled')}>
                            {action}
                        </button>
                    }
                }):null}
            </div>
        )
    }
});