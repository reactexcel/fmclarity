IssueActionButtons = React.createClass({

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
            else if(request.canIssue()||request.status==Issues.STATUS_NEW) {
            return 'Issue';
        }
        else if(request.status==Issues.STATUS_DRAFT) {
            return 'Create';
        }
    },

    getRegressVerb() {

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
    },

    handleStatusChange(err,response) {
        if(err) {
            console.log(err);
        }
        else if(this.props.onStatusChange) {
            this.props.onStatusChange(response);
        }
    },

    progress() {

        var request = this.props.item;

        if(request.canStartClosure()) {
            Meteor.call('Issues.startClosure',request,this.handleStatusChange);
        }
        else if(request.canIssue()) {
            Meteor.call('Issues.issue',request,this.handleStatusChange);
        }
        else if(request.canOpen()) {
            Meteor.call('Issues.open',request,this.handleStatusChange);
        }
    },

    regress() {

        var request = this.props.item;

        if(request.canDestroy()) {
            var message = confirm('Are you sure you want to cancel this work order?');
            if(message == true){
                Meteor.call('Issues.destroy',request,this.handleStatusChange);
            }
        }
        else if(request.canReverse()) {
            var message = confirm('Are you sure you want to reverse this work order?');
            if(message == true){
                Meteor.call('Issues.reverse',request,this.handleStatusChange);
            }
        }
    },

    render() {
        var request = this.props.item;
        var width = this.props.width||"100%";
        var progressVerb = this.getProgressVerb();
        var regressVerb = this.getRegressVerb();
        return (
            <div>
                {progressVerb?
                    <button 
                        onClick={this.progress} 
                        style={{margin:0,width:width,maxWidth:"400px"}} 
                        type="button" 
                        className={"btn btn-sm btn-"+(this.canProgress()?'Issued':'disabled')}>
                        {progressVerb}
                    </button>
                :null}
                {regressVerb?
                    <button 
                        onClick={this.regress} 
                        style={{width:width,maxWidth:"400px"}} 
                        type="button" 
                        className="btn btn-sm btn-Issued">
                        {regressVerb}
                    </button>
                :null}
            </div>
        )
    }
});