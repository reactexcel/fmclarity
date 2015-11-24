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
                <div className="panel-body" style={{padding:0}}>
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
            var status = issue.status;

            return {
                ready:true,
                creator:issue.getCreator(),
                issue:issue,
                status:status,
                facility:issue.getFacility(),
                facilities : Facilities.find({},{sort:{name:1}}).fetch(),
                supplier:issue.getSupplier(),
                suppliers : Teams.find({type:"contractor"},{sort:{createdAt:-1}}).fetch(),
                services : Services.find({},{sort:{name:1}}).fetch(),
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
        alert('Sending work order...');
        this.item.status = "Issued";
        this.saveItem();
    },

    closeOrder() {
        this.item.status = "Closing...";
        this.saveItem();
    },

    reallyCloseOrder() {
        this.item.status = "Closed";
        this.saveItem();
    },

    componentWillMount: function() {
        // perhaps we could debounce it in the model???
        this.saveItem = _.debounce(this.saveItem,500);
    },

    componentDidMount: function() {
        $(this.refs.description).elastic();
    },

    render() {
        var issue = this.item = this.data.issue;
        var facility = this.data.facility;
        var creator = this.data.creator;
        var createdAt = moment(issue.createdAt).calendar();
        var supplier = this.data.supplier;
        var status = this.data.status;

        if(!this.data.ready) return <div />;

        return (
<div>
    <div className="row">
        <div className="col-lg-1">
            <div>
                <ContactAvatarSmall item={creator} />
            </div>
            <div>
                <span style={{top:"3px",position:"relative"}} className={"label dropdown-label label-"+issue.status}>{issue.status}</span>
            </div>
            <div style={{float:"left",clear:"both"}}>
                <SuperSelect 
                    items={['Scheduled','Standard','Urgent','Critical']} 
                    onChange={this.updateObjectField('priority')}
                >
                    <div style={{padding:"9px"}}>
                        <IssuePriority value={issue.priority} />
                    </div>
                </SuperSelect>
            </div>
        </div>
        <div className="col-lg-11" style={{marginLeft:"-25px",marginRight:"-25px",width:"95%"}}>
            <div className="row" style={{borderBottom:"1px solid #ddd",paddingBottom:"10px",marginBottom:"10px"}}>
                <div className="col-lg-6">
                    <h2 style={{margin:0}}>
                        <input 
                            placeholder="Type issue title here"
                            className="inline-form-control" 
                            defaultValue={issue.name} 
                            onChange={this.updateField('name')}
                        />
                    </h2>
                    <div style={{marginTop:"15px",marginBottom:"7px"}}>
                        <SuperSelect 
                            items={this.data.facilities} 
                            itemView={ContactViewName}
                            onChange={this.updateObjectField('facility')}
                        >
                            <span style={{fontWeight:"bold",marginLeft:"4px"}} className="issue-summary-facility-col">
                                {facility?(facility.name+' - '+facility.location):''}

                            </span>
                        </SuperSelect>
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
                            <div style={{position:"relative","top":"15px",fontSize:"11px",left:"1px"}}>
                                <Contact3Line item={supplier}/>
                            </div>
                        }

                    </div>
                    :null}
                </div>
                <div className="col-lg-2">
                    <div style={{float:"right"}}>
                        {!issue.status?
                            <button onClick={this.createOrder} style={{margin:0}} type="button" className={"btn btn-sm btn-"+((issue.name&&issue.description)?'New':'default')}>Create request</button>
                        :null}
                        {issue.status=='New'?
                            <button onClick={this.sendOrder} style={{margin:0}} type="button" className={"btn btn-sm btn-"+(supplier?'Issued':'default')}>Issue order</button>
                        :null}
                        {issue.status=='Issued'?
                            <button onClick={this.closeOrder} style={{margin:0}} type="button" className={"btn btn-sm btn-"+(supplier?'Closed':'default')}>Close order</button>
                        :null}
                    </div>
                </div>
            </div>

            <div className="row">
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
                        content:<div className="attachments">
                        <div className="ibox" style={{width:"170px",padding:"10px",margin:"0 10px 10px 0",float:"left", clear:"left"}}>
                            <img style={{width:"100%","borderRadius":"1px"}} alt="image" src={"img/issue-"+issue.thumb+".jpg"} />
                        </div>
                        <div className="ibox" style={{width:"170px",padding:"10px",margin:"0 10px 10px 0",float:"left", clear:"none"}}>
                            <img style={{width:"100%","borderRadius":"1px"}} alt="image" src={"img/issue-1.jpg"} />
                        </div>
                        <div className="ibox" style={{width:"170px",padding:"10px",margin:"0 10px 10px 0",float:"left", clear:"none"}}>
                            <img style={{width:"100%","borderRadius":"1px"}} alt="image" src={"img/issue-2.jpg"} />
                        </div>
                        </div>
                    },
                    {
                        tab:"Documents",
                        content:<FileBrowser />
                    },                    {
                        tab:"Conversation",
                        content:<IssueDiscussion issue={issue}/>
                    },
                    {
                        tab:"Work order log",
                        content:<IssueTrackerTable issue={issue}/>
                    },
                    ]} />
                </div>
            </div>
        </div>
    </div>
    {issue.status=='Closing...'?
        <img className="close-order-popup" src="img/close-order.PNG" onClick={this.reallyCloseOrder}/>
    :null}
</div>




)}
})