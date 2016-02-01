
TeamViewEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var team,members;
    	team = this.state.item;
    	if(team) {
    		members = team.getMembers();
    	}
    	return {
    		selectedTeam:FM.getSelectedTeam(),
    		team:this.state.team,
    		members:members
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

	form1 : [
		"name",
		"abn",
		"contactName",
		"email"
	],
	form2 : [
		"addressLine1",
		"addressLine2",
		"city",
		"state",
		"country",
		"postcode",
	],
	form3: [
		"defaultWorkOrderValue",
		"modules",
	],

	componentDidMount() {
		var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
		elems.forEach(function(html) {
		  var switchery = new Switchery(html, {size:'small',color:'#db4437'});
		});
	},

	handleInvite(event) {
    	event.preventDefault();
    	var selectedTeam,input,email,regex,component;
    	component = this;
		selectedTeam = this.data.selectedTeam;
    	input = this.refs.invitationEmail;
    	email = input.value;
    	regex = /.+@.+\..+/i
    	if(!regex.test(email)) {
    		alert('Please enter a valid email address');
    	}
    	else {
            input.value = '';
            selectedTeam.inviteSupplier(email, function(err,supplier){
            	supplier = Teams.findOne(supplier._id);
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
    	var selectedTeam,team,members,schema;
    	team = this.state.item;
    	members = this.data.members;
    	selectedTeam = this.data.selectedTeam;
		schema = FM.schemas['Team'];
		if(!team) {
			return (
                <form className="form-inline">
                    <div className="form-group">
                        <b>Let's search to see if this contractor already has an account.</b>
                        <h2><input type="email" className="inline-form-control" ref="invitationEmail" placeholder="Email address"/></h2>
                        <button type="submit" style={{width:0,opacity:0}} onClick={this.handleInvite}>Invite</button>
                    </div>
                </form>
            )
		}
		return (
		    <div className="ibox-form user-profile-card" style={{backgroundColor:"#fff"}}>
                {this.state.shouldShowMessage?<b>Contractor not found, please enter the details to add to your contact.</b>:null}
            	<h2><span>{team.getName()}</span></h2>
		   		<CollapseBox title="Basic Info">
		   			<div className="row">
		   				<div className="col-sm-7">
			        		<AutoForm item={team} schema={schema} form={this.form1} />
			        	</div>
			        	<div className="col-sm-5">
			        		<AutoInput.File item={team.thumb} onChange={team.set.bind(team,"thumb")} />
			        	</div>
			        	<div className="col-sm-12">
				        	<AutoForm item={team} schema={schema} form={this.form2} />
				        </div>
			        </div>
		        </CollapseBox>
				<CollapseBox title="Members">
			   		<ContactList 
			   			items={members}
			   			team={team}
			   			onChange={team.setMembers.bind(team)}
			   		/>
				</CollapseBox>
			   	<CollapseBox title="Config" collapsed={true}>
			       	<AutoForm item={team} schema={schema} form={this.form3}/>
			    </CollapseBox>
			   	<CollapseBox title="Services Provided" collapsed={true}>
			      	<ServicesSelector item={team} save={team.set.bind(team,"services")}/>
				</CollapseBox>
			</div>
		)
	}
});