IssueActionButtons = React.createClass({
    render() {
        var issue = this.props.issue;
        var progressVerb = this.props.progressVerb;
        var regressVerb = this.props.regressVerb;
        var progressAction = this.props.progressAction;
        var regressAction = this.props.regressAction;
        var width = this.props.width||"100%";
        return (
            <div>
                {progressVerb?
                    <button 
                        onClick={progressAction} 
                        style={{margin:0,width:width,maxWidth:"400px"}} 
                        type="button" 
                        className={"btn btn-sm btn-"+(issue.canCreate()?'Issued':'disabled')}>
                        {progressVerb}
                    </button>
                :null}
                {regressVerb?
                    <button 
                        onClick={regressAction} 
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