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
    	var supplier,members;
    	supplier = this.state.item;

		var form1 = [
			"name",
			"abn",
			"email",
			"phone",
			"phone2"
		];
		var form2 = [];

    	if(supplier) {
    		members = supplier.getMembers();
    		if(supplier.type=="fm") {
    			form2.push("address")
    			form2.push("defaultWorkOrderValue");
    		}
    		else {
    			form2.push("description");
    		}
    	}
    	return {
    		team:this.props.team||Session.getSelectedTeam(),
    		facility:this.props.facility,
    		supplier:supplier,
    		members:members,
    		form1:form1,
    		form2:form2
    	}
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

	componentDidMount() {
		var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
		elems.forEach(function(html) {
		  var switchery = new Switchery(html, {size:'small',color:'#db4437'});
		});
	},

	handleInvite(event) {
    	event.preventDefault();
    	var component = this;
		var team = this.data.team;
		var facility = this.data.facility;
    	var input = this.refs.invitationEmail;
    	var email = input.value;
    	var regex = /.+@.+\..+/i
    	if(!regex.test(email)) {
    		alert('Please enter a valid email address');
    	}
    	else {
            input.value = '';
            team.inviteSupplier(email, null, function(supplier){
            	//console.log(supplier);
            	supplier = Teams._transform(supplier);
            	if(facility) {
            		facility.addSupplier(supplier);
            	}
            	//is not being found
            	//is a subscription issue??
            	//supplier = Teams.findOne(supplier._id);
            	//console.log(supplier);
            	component.setItem(supplier);
            	if(component.props.onChange) {
            		component.props.onChange(supplier);
            	}
            });
            this.setState({
            	shouldShowMessage:true
            });            		
	    }
    },

	render() {
    	var team,supplier,members,schema;
    	supplier = this.state.item;
    	members = this.data.members;
    	team = this.data.team;
		schema = Teams.schema();
		if(!supplier) {
			return (
                <form className="form-inline">
                    <div className="form-group">
                        <b>Let's search to see if this team already has an account.</b>
                        <h2><input type="email" className="inline-form-control" ref="invitationEmail" placeholder="Email address"/></h2>
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
            	<h2><span>{supplier.getName()}</span></h2>
		   		<CollapseBox title="Basic Info">
		   			<div className="row">
		   				<div className="col-sm-7">
			        		<AutoForm item={supplier} schema={schema} form={this.data.form1} />
			        	</div>
			        	<div className="col-sm-5">
			        		<DocThumb.File item={supplier.thumb} onChange={supplier.setThumb.bind(supplier)} />
			        	</div>
			        	<div className="col-sm-12">
				        	<AutoForm item={supplier} schema={schema} form={this.data.form2} />
				        </div>
			        </div>
		        </CollapseBox>
				<CollapseBox title="Company Documents">
					<AutoForm item={supplier} schema={schema} form={["documents"]}/>
				</CollapseBox>
				<CollapseBox title="Quick Files">
					<AutoForm item={supplier} schema={schema} form={["attachments"]}/>
				</CollapseBox>
				<CollapseBox title="Members">
			   		<ContactList 
			   			items={members}
			   			team={supplier}
			   			onAdd={supplier.canInviteMember()?supplier.addMember.bind(supplier):null}
			   		/>
				</CollapseBox>
				{supplier.type=="fm"?
				<CollapseBox title="Services Consumed" collapsed={true}>
					<ServicesSelector item={supplier} field={"servicesRequired"}/>
				</CollapseBox>
				:null}
				{
			   	<CollapseBox title="Services Provided" collapsed={supplier.type=="fm"}>
			      	<ServicesSelector item={supplier} save={supplier.set.bind(supplier,"services")}/>
				</CollapseBox>
				}
			</div>
		)
	}
});