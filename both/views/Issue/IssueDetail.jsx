IpsoTabso = React.createClass({
    getInitialState() {
        return {
            active:0
        }
    },

    selectTab(activeIndex) {
        this.setState({
            active:activeIndex
        });
    },

    render() {
        var active = this.state.active;
        var selectTab = this.selectTab;
        var tabs = this.props.tabs;
        var content = tabs[active]?tabs[active].content:null;
        return (
            <div className="panel blank-panel">
                <div className="panel-heading">
                    {tabs.map(function(i,idx){
                        return (
                            <div 
                                onClick={selectTab.bind(null,idx)} 
                                className={idx==active?"issue-tab active":"issue-tab"}
                                key={idx}
                            >
                                <div className="btn btn-sm btn-flat issue-nav-btn">{i.tab}</div>
                                <div className="highlight"/>
                            </div>
                        )
                    })}
                </div>
                <div className="panel-body" style={{padding:"0 0 10px 0"}}>
                    <div className="tab-content">
                        <div className="tab-pane active">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

});

IssueDetail = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var issue = this.props.item;
        if(!issue) {
            return {
                ready:false
            }
        }
        else {
            var facility, areas, facilityContacts, facilityContact;
            facility = issue.getFacility();
            if(facility) {
                areas = facility.getAreas();
                facilityContacts = facility.getContacts();
                facilityContact = facilityContacts?facilityContacts[0]:null;
            }

            return {
                ready:true,

                suppliers : Teams.find({type:"contractor"},{sort:{createdAt:-1}}).fetch(),
                facilities:Facilities.find({},{sort:{name:1}}).fetch(),

                issue:issue,
                facility:facility,

                creator:issue.getCreator(),
                supplier:issue.getSupplier(),
                assignee:issue.getAssignee(),
                facilityContact:facilityContact,
                areas:areas,

                notifications:issue.getNotifications(),
                services:Config.services,
            }
        }
    },

    saveItem() {
        this.item.save();
        //Meteor.call("Issue.save",this.issue);
    },

    updateField(field) {
        var $this = this;
        // returns a function that modifies 'field'
        return function(event) {
            $this.item[field] = event.target.value;
            $this.saveItem();
        }
    },

    updateObjectField(field) {
        var $this = this;
        return function(obj) {
            $this.item[field] = obj;
            $this.item.save();
        }
    },

    updateService(service) {
        this.item.service = service;
        this.item.subservice = 0;
        this.item.save();
    },

    createOrder() {
        this.item.status = "New";
        this.item.isNewItem = false;
        this.saveItem();
    },

    sendOrder() {
        //alert('Sending work order...');
        this.item.status = "Issued";
        this.saveItem();
        if(this.props.closeCallback) {
            this.props.closeCallback()
        }
    },

    closeOrder() {
        this.showModal();
    },

    reallyCloseOrder() {
        this.hideModal();
        this.item.status = "Closed";
        this.item.priority = "Closed";
        this.saveItem();
        if(this.props.closeCallback) {
            this.props.closeCallback()
        }
    },

    componentWillMount: function() {
        // perhaps we could debounce it in the model???
        this.saveItem = _.debounce(this.saveItem,500);
    },

    componentDidMount: function() {
        $(this.refs.description).elastic();
        $(this.refs.modal).modal('hide');
    },

    showModal() {
        $(this.refs.modal).modal('show');
    },

    hideModal() {
        $(this.refs.modal).modal('hide');
    },

    render() {
        var data = this.data;
        if(!data.ready) return <div />;

        var issue, facility, status, notifications;

        issue = this.item = data.issue;
        facility = data.facility;
        status = issue.status;
        notifications = data.notifications;

        var creator,supplier,assignee,facilityContact,contacts;

        creator = data.creator;
        supplier = data.supplier;
        assignee = data.assignee;
        facilityContact = data.facilityContact;
        contacts = [];
        ['creator','supplier','assignee','facilityContact'].map(function(item){
            if(data[item]) {
                contacts.push(data[item]);
            }
        })

        var createdAt = moment(issue.createdAt).calendar();
        var schema = FM.schemas['Issue'];

        //console.log(notifications);

        return (
<div className="issue-detail">

<div ref="modal" className="modal fade" tabIndex="-1" role="dialog" style={{display:"none"}}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 className="modal-title">All done? Great just need a few details to finalise the job.</h4>
      </div>
      <div className="modal-body">
        <AutoForm item={issue} schema={schema} form={['closeDetails']} save={this.saveItem}/>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" onClick={this.reallyCloseOrder} className="btn btn-primary">Complete</button>
      </div>
    </div>
  </div>
</div>

    <div className="row">
        <div className="col-lg-1 issue-icon-col">
            <div>
                <ContactAvatarSmall item={creator} />
            </div>
            <div>
                <span style={{top:"3px",position:"relative"}} className={"label dropdown-label label-"+issue.status}>{issue.status}</span>
            </div>
            <div>
                <SuperSelect 
                    items={['Scheduled','Standard','Urgent','Critical']} 
                    onChange={this.updateObjectField('priority')}
                >
                    <div style={{padding:"9px"}}>
                        <IssuePriority issue={issue} />
                    </div>
                </SuperSelect>
            </div>
        </div>
        <div className="col-lg-11" style={{marginLeft:"-25px",marginRight:"-25px",width:"95%"}}>
            <div className="issue-spec-area row">
                <div className="col-lg-6" style={{paddingLeft:"10px"}}>
                    <h2 style={{margin:0}}>
                        <input 
                            placeholder="Type issue title here"
                            className="inline-form-control" 
                            defaultValue={issue.name} 
                            onChange={this.updateField('name')}
                        />
                    </h2>
                    <div style={{marginTop:"7px",marginBottom:"7px"}}>
                        <SuperSelect 
                            items={this.data.facilities} 
                            itemView={ContactViewName}
                            onChange={this.updateObjectField('_facility')}
                        >
                            <span style={{marginLeft:"4px"}} className="issue-summary-facility-col">
                                {facility?(<span>{facility.getName()} -</span>):(<span style={{color:"#999"}}>Select facility</span>)}
                            </span>
                        </SuperSelect>
                        {facility?
                        <SuperSelect 
                            items={this.data.areas} 
                            itemView={ContactViewName}
                            onChange={this.updateObjectField('area')}
                        >
                            <span style={{marginLeft:"4px"}} className="issue-summary-facility-col">
                                {issue.area?(<span>{issue.area.name}</span>):(<span style={{color:"#999"}}>Select area</span>)}
                            </span>
                        </SuperSelect>
                        :null}
                        <div style={{marginLeft:"4px"}} className="issue-summary-facility-col">
                            <b>Order #</b>
                            <span>{issue.code}</span>&nbsp;
                            <b>Cost $</b>
                            <span style={{display:"inline-block"}}><input 
                                className="inline-form-control" 
                                defaultValue={issue.costThreshold} 
                                onChange={this.updateField('costThreshold')}
                            /></span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2">
                    <div>
                        <SuperSelect 
                            itemView={ContactViewName}
                            items={this.data.services} 
                            classes="absolute"
                            onChange={this.updateService}
                        >
                            <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!issue.service?"Select":""} service type</span>
                        </SuperSelect>
                        {issue.service?
                            <span style={{position:"relative","top":"15px",fontSize:"11px",left:"1px"}}>{issue.service.name}</span>
                        :null}
                    </div>
                    {issue.service&&issue.service.subservices&&issue.service.subservices.length?
                        <div style={{position:"relative",top:"15px"}}>
                            <SuperSelect 
                                itemView={ContactViewName}
                                items={issue.service.subservices}
                                classes="absolute"
                                onChange={this.updateObjectField('subservice')}
                            >
                                <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!issue.subservice?"Select":""} subtype</span>
                            </SuperSelect>
                            {issue.subservice?
                                <span style={{position:"relative","top":"15px",fontSize:"11px",left:"1px"}}>{issue.subservice.name}</span>
                            :null}
                        </div>
                    :null}
                </div>
                <div className="col-lg-2">
                    {issue.status?
                    <div>

                        <SuperSelect 
                            itemView={ContactViewName}
                            items={this.data.suppliers} 
                            classes="absolute"
                            onChange={this.updateObjectField('_supplier')}
                        >
                            <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!supplier?"Select":""} Supplier</span>

                        </SuperSelect>

                        {!supplier?null:
                            <span style={{position:"relative","top":"15px",fontSize:"11px",left:"1px"}}>{supplier.name}</span>
                        }

                    </div>
                    :null}
                    {issue.status&&supplier?
                        <div style={{position:"relative",top:"15px"}}>
                            <SuperSelect 
                                itemView={ContactViewName}
                                items={supplier.getMembers()}
                                classes="absolute"
                                onChange={this.updateObjectField('_assignee')}
                            >
                                <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!issue._assignee?"":""} assignee</span>
                            </SuperSelect>
                            <span style={{position:"relative","top":"15px",fontSize:"11px",left:"1px"}}>{assignee?assignee.getName():'-'}</span>
                        </div>
                    :null}
                </div>
                <div className="col-lg-2">
                    <div style={{float:"right"}}>
                        {!issue.status?
                            <button onClick={this.createOrder} style={{margin:0}} type="button" className={"btn btn-sm btn-"+((issue.name&&issue.description)?'Issued':'default')}>Create request</button>
                        :null}
                        {issue.status=='New'?
                            <button onClick={this.sendOrder} style={{margin:0}} type="button" className={"btn btn-sm btn-"+(supplier?'Issued':'default')}>Issue order</button>
                        :null}
                        {issue.status=='Issued'?
                            <button onClick={this.closeOrder} style={{margin:0}} type="button" className={"btn btn-sm btn-"+(supplier?'Issued':'default')}>Close order</button>
                        :null}
                    </div>
                </div>
            </div>

            <div className="issue-dynamic-area row">
                <div className="col-lg-12">
                    <span style={{paddingLeft:0}} className="btn btn-sm btn-flat issue-nav-btn">Description</span><br/>
                    <textarea 
                        ref="description"
                        placeholder="Type issue description here"
                        className="issue-description-textarea inline-form-control" 
                        defaultValue={issue.description} 
                        onChange={this.updateField('description')}
                    />
                </div>
                <div className="col-lg-12">
                    <IpsoTabso tabs={[
                    {
                        tab:<span><span>Images</span><span className="label label-notification">3</span></span>,
                        content:<AttachmentGrid items={issue.thumb} />
                    },{
                        tab:"Documents",
                        content:<FileBrowser />
                    },{
                        tab:<span><span>Updates</span>{notifications.length?<span className="label label-notification">{notifications.length}</span>:null}</span>,
                        content:<IssueDiscussion items={notifications}/>
                    },{
                        tab:<span>Contacts</span>,
                        content:<ContactList items={contacts} />
                    }
                    ]} />
                </div>
            </div>
        </div>
    </div>
</div>




)}
})