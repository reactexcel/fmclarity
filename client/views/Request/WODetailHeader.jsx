


IssueSpecArea = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe("contractors");
        var issue = this.props.item;
        if(!issue) {
            return {
                ready:false
            }
        }
        else {
            var facility = issue.getFacility();
            var owner = issue.getOwner();
            var team = issue.getTeam();

            return {
                ready:true,
                issue:issue,
                team:team,
                owner:owner,
                facility:facility,
                notifications:issue.getNotifications(),
            }
        }
    },

    handleStatusChange(request){
        //console.log({'callback status change':request});
        if(!request) {
            //handleDestroy
        }
        else if(request.status=="Closing") {
            this.showModal();
        }
        else if(this.props.closeCallback) {
            this.props.closeCallback()
        }
    },

    save() {
        if(this.props.save){
            this.props.save();
        }
    },

    showModal() {
        var request = this.props.item;
        Modal.show({
            title:"All done? Great just need a few details to finalise the job.",
            onSubmit:function(){
                request.close();
            },
            //onCancel:this.regressOrder,
            content:
                <AutoForm 
                    item={this.props.item} 
                    schema={Issues.schema()} 
                    form={['closeDetails']}
                >
                    <h2>All done? Great! We just need a few details to finalise the job.</h2>
                </AutoForm>
        })
    },

    updateItem: function(field,value) {
        this.props.item[field] = value;
        this.save();
    },

    componentWillMount: function() {
        this.updateItem = _.debounce(this.updateItem,500);
    },

    render() {
        var request = this.props.item;
        var owner = this.data.owner;

        var selectedTeam = this.data.selectedTeam;
        var actionVerb = this.data.actionVerb;
        var regressVerb = this.data.regressVerb;

        return (
            <div className="issue-spec-area">

                <div className="row">
                    <div className="col-xs-12 col-sm-8 col-md-1">
                        <div style={{float:"left",clear:"both",width:"45px",height:"45px",paddingLeft:"4px",paddingTop:"3px"}}>
                            <ContactAvatarSmall item={owner} />
                        </div>
                        <div style={{float:"left",clear:"both",width:"45px",height:"45px",paddingTop:"15px",textAlign:"center"}}>
                            <span style={{display:"inline-block"}} className={"label dropdown-label label-"+request.status}>{request.status}</span>
                        </div>
                        <div style={{float:"left",clear:"both",width:"45px",height:"45px",paddingTop:"9px",textAlign:"center"}}>
                            <SuperSelect 
                                items={['Scheduled','Standard','Urgent','Critical']} 
                                readOnly={!request.canSetPriority()}
                                onChange={request.setPriority.bind(request)}
                            >
                                <IssuePriority issue={request} />
                            </SuperSelect>
                        </div>
                    </div>
                    <div className="visible-sm col-sm-4">
                        <IssueActionButtons
                            width="50%"
                            item={request}
                            onStatusChange={this.handleStatusChange}
                        />
                    </div>
                    <div className="col-xs-12 col-md-11">
                    	<div className="row">
	                    	<div className="col-md-10">
	                    		<div className="row">
	                    			<div className="col-md-12">
				                        <h2><AutoInput.Text
                                                readOnly={!request.canSetName()}
                                                value={request.name}
                                                placeholder="Work order title"
                                                onChange={this.updateItem.bind(this,'name')}
                                            />
                                        </h2>
				                    </div>
                                </div>
                                <div className="row" style={{marginBottom:"10px",paddingBottom:"10px",borderBottom:"1px solid #ddd"}}>
                                    <div className="col-md-3">
                                        <div style={{cursor:"default"}} className="issue-summary-facility-col">                                        
                                            <b>Order #</b>
                                            <span>{request.code}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <b>Cost $</b>
                                        <span style={{display:"inline-block",width:"40px"}}>
                                            <AutoInput.Text
                                                readOnly={!request.canSetCost()}
                                                value={request.costThreshold} 
                                                onChange={this.updateItem.bind(this,'costThreshold')}
                                            />
                                        </span>
                                    </div>

                                    <div className="col-md-3">
                                        <div style={{cursor:"default"}} className="issue-summary-facility-col">                                        
                                            <b>Due</b>&nbsp;
                                            <span style={{display:"inline-block",width:"40px"}}>
                                                <AutoInput.date
                                                    readOnly={!request.canSetDueDate()}
                                                    value={request.dueDate}
                                                    onChange={this.updateItem.bind(this,'dueDate')}
                                                />
                                            </span>
                                        </div>
                                    </div>

                                </div>
                                <div className="row" style={{marginBottom:"10px",paddingBottom:"10px",borderBottom:"1px solid #ddd"}}>
                                    <div className="col-md-12">
                                        <WOLocationSelector item={request}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <WOServiceSelector item={request}/>
                                    </div>
                                </div>
		                    </div>{/*col*/}
		                    <div className="col-xs-12 hidden-sm col-md-2">
                                <IssueActionButtons
                                    item={request}
                                    onStatusChange={this.handleStatusChange}
                                />
		                   	</div>
		                   	<div className="col-xs-12">
		                   		{this.props.children}
		                   	</div>
		                </div>{/*row*/}
		            </div>
	            </div>
            </div>
        )
    }
});
