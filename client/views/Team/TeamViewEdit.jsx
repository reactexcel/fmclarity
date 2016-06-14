import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

/*
Tracker.autorun(function(computation) {
   var docs = Posts.find({}); // and also try with opts
   console.log('collection changed', docs);
});
*/
TeamViewEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        //supplier is the team shown in the form
        // terminology is a little confusing because they may in reality be a fm
        // team is the team of the viewer (which may no the same as the team being viewed)

    	var team, facility, supplier,members;
        team = this.props.team?Teams.findOne(this.props.team._id):Session.getSelectedTeam();
        facility = this.props.facility?Facilities.findOne(this.props.facility._id):null;
    	supplier = this.state.item?Teams.findOne(this.state.item._id):null;

		var form1, form2;

        form1 = [
			"name",
			"abn",
			"email",
			"phone",
			"phone2"
		];

        //add relevant fields to form 2 depending on whether type is fm or contractor
        // would a switch statement be more readable?
		form2 = [];
    	if(supplier) {
    		members = supplier.getMembers();
    		if(supplier.type=="fm") {
    			form2.push("address")
    			form2.push("defaultWorkOrderValue");
    		}
    		else if(supplier.type=="contractor") {
    			form2.push("description");
    		}
    	}

    	return {
    		viewer:Meteor.user(),
    		team:team,
    		facility:facility,
    		supplier:supplier,
    		members:members,
    		form1:form1,
    		form2:form2
    	}
    },

    tour:{
      id:"team-edit-page",
      steps: [{
        title: "This is your team profile.",
        content: "In FM Clarity all suppliers are part of a team. This is the team settings page where you can check that your client has entered your details correctly, and update company files such as insurance documents, SWMS, references, etc",
        target: "fm-logo",
        arrowOffset:"center",
        onShow:function(){
          $('.hopscotch-bubble-arrow-container').css('visibility', 'hidden');
        },
        placement: "bottom"
      },{
        title: "Company documents",
        content: "This is where you can upload your company specific documents. Clients may request documents such as insurance policies or compliance info and that can be uploaded here",
        target: "company-documents",
        placement: "bottom"
      },{
        title: "Members",
        content: "Adding staff members will enable you to assign jobs to members of your team. New members will be given the role of staff meaning they can only view requests assigned to them. If you want them to see all jobs you can promote them to manager by selecting the member and clicking promote from the tool icon at the top right of their profile. You can also invite them to use FMC from this same menu",
        target: "members",
        placement: "bottom"
      },{
        title: "Services",
        content: "Jobs will be matched to suppliers based on the services profile which can be configured here. Consumed services are those that you employ suppliers to complete, provided services are those that you can perform as a supplier.",
        target: "services-provided",
        placement: "bottom"
      }]
    },

	getInitialState() {
		return {
			item:this.props.item
		}
	},

	componentWillReceiveProps(newProps) {
		this.setItem(newProps.item);
	},

	setItem(newItem) {
		this.setState({
			item:newItem
		});
	},

    startTour(tour) {
        var selectedTeam = Session.getSelectedTeam();
        var viewer = this.data.viewer;
        var team = this.data.supplier;
        if(team&&!this.tourStarted&&viewer&&team._id==selectedTeam._id) {
            this.tourStarted = true;
            setTimeout(function(){
                viewer.startTour(tour);
            },1000);
        }
    },

    componentDidUpdate(){
      this.startTour(this.tour);
    },

    componentWillUnmount() {
      hopscotch.endTour();
    },

	componentDidMount() {
		var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
		elems.forEach(function(html) {
		  var switchery = new Switchery(html, {size:'small',color:'#db4437'});
		});
        this.startTour(this.tour);
	},

	handleInvite(event) {
    	event.preventDefault();
    	var component = this;
		var team = this.data.team;
		var facility = this.data.facility;
    	var input = this.refs.invitation;
    	var searchName = input.value;
        if(!searchName) {
            alert('Please enter a valid name.');
        }
    	else {
            input.value = '';
            team.inviteSupplier({name:searchName}, null, function(supplier){
            	supplier = Teams._transform(supplier);
            	if(facility) {
            		facility.addSupplier(supplier);
            	}
            	component.setItem(supplier);
            	if(component.props.onChange) {
            		component.props.onChange(supplier);
            	}
                if(!supplier.email) {
                    component.setState({
                        shouldShowMessage:true
                    });
                }
                else {
                    Modal.hide();
                }
            });
	    }
    },

    setThumb(thumb) {
        var supplier = this.state.item;
        supplier.setThumb(thumb);
        supplier.thumb = thumb;
        this.setState({
            item:supplier
        });
    },

	render() {
    	var team,supplier,owner,members,schema;
    	supplier = this.state.item;
    	members = this.data.members;
    	team = this.data.team;
		schema = Teams.schema();
		if(!supplier) {
			return (
                <form style={{padding:"15px"}} className="form-inline">
                    <div className="form-group">
                        <b>Lets search to see if this team already has an account.</b>
                        <h2><input className="inline-form-control" ref="invitation" placeholder="Supplier name"/></h2>
                        <button type="submit" style={{width:0,opacity:0}} onClick={this.handleInvite}>Invite</button>
                    </div>
                </form>
            )
		}
		else if(!supplier.canSave()) {
			return (
				<TeamViewDetail item={supplier} />
			)
		}
		return (
		    <div className="ibox-form user-profile-card" style={{backgroundColor:"#fff"}}>
                {this.state.shouldShowMessage?<b>Team not found, please enter the details to add to your contact.</b>:null}
            	<h2 style={{marginTop:"0px"}}>Edit team</h2>
                {supplier.owner?<div>
                    <b>Team owner:</b>
                    <DocOwnerCard owner={supplier.owner} of={supplier}/>
                </div>
                :
                null
                }
                <Stepper tabs={[
                    {
                        tab:<span id="discussion-tab">Basic Details</span>,
                        content:
                            <div className="row">
                                <div className="col-sm-7">
                                    <AutoForm item={supplier} schema={schema} form={this.data.form1} />
                                </div>
                                <div className="col-sm-5">
                                    <DocThumb.File item={supplier.thumb} onChange={this.setThumb} />
                                </div>
                                <div className="col-sm-12">
                                    <AutoForm item={supplier} schema={schema} form={this.data.form2} />
                                </div>
                            </div>,
                        instructions:
                            <div>Enter the basic account info here including your teams name, address and image.</div>
                    },{
                        tab:<span id="documents-tab">Documents</span>,
                        content:
                            <AutoForm item={supplier} schema={schema} form={["documents"]}/>,
                        instructions:
                            <div>Formal documentation related to the team can be added here. This typically includes insurance and professional registrations.</div>
                    },{
                        tab:<span id="members-tab">Members</span>,
                        content:
                            <ContactList 
                                items={members}
                                team={supplier}
                                group={supplier}
                                onAdd={supplier.canInviteMember()?supplier.addMember.bind(supplier):null}/>,
                        instructions:
                            <div>In this section invite members to your team. Be sure to give them the relevant role in your organisation so that their access permissions are accurate.</div>
                    },{
                        tab:<span id="services-required-tab">Services required</span>,
                        content:
                            <div id="services-consumed" title="Services Consumed" collapsed={true}>
                                <ServicesSelector item={supplier} field={"servicesRequired"}/>
                            </div>,
                        instructions:
                            <div>In this section invite members to your team. Be sure to give them the relevant role in your organisation so that their access permissions are accurate.</div>
                    },{
                        tab:<span id="services-provided-tab">Services provided</span>,
                        content:
                            <div id="services-provided" title="Services Provided" collapsed={true}>
                                <ServicesSelector item={supplier} save={supplier.set.bind(supplier,"services")}/>
                            </div>,
                        instructions:
                            <div>In this section invite members to your team. Be sure to give them the relevant role in your organisation so that their access permissions are accurate.</div>
                    }]}/>
                {/*
		   		<CollapseBox id="basic-info" title="Basic Info">
		   			<div className="row">
		   				<div className="col-sm-7">
			        		<AutoForm item={supplier} schema={schema} form={this.data.form1} />
			        	</div>
			        	<div className="col-sm-5">
			        		<DocThumb.File item={supplier.thumb} onChange={this.setThumb} />
			        	</div>
			        	<div className="col-sm-12">
				        	<AutoForm item={supplier} schema={schema} form={this.data.form2} />
				        </div>
			        </div>
		        </CollapseBox>
				<CollapseBox id="company-documents" title="Company Documents" collapsed={true}>
					<AutoForm item={supplier} schema={schema} form={["documents"]}/>
				</CollapseBox>
				<CollapseBox id="members" title="Members" collapsed={true}>
			   		<ContactList 
			   			items={members}
			   			team={supplier}
			   			onAdd={supplier.canInviteMember()?supplier.addMember.bind(supplier):null}
			   		/>
				</CollapseBox>
				{supplier.type=="fm"?
				<CollapseBox id="services-consumed" title="Services Consumed" collapsed={true}>
					<ServicesSelector item={supplier} field={"servicesRequired"}/>
				</CollapseBox>
				:null}
				{
			   	<CollapseBox id="services-provided" title="Services Provided" collapsed={true}>
			      	<ServicesSelector item={supplier} save={supplier.set.bind(supplier,"services")}/>
				</CollapseBox>
				}

                */}
			</div>
		)
	}
});