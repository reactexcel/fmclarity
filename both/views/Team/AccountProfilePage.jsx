
BaseProfilePageMixin = {

    mixins: [ReactMeteorData],

    getMeteorData() {
    	return {
    		selectedTeam:FM.getSelectedTeam()
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


};

AccountEdit = React.createClass({

    mixins: [BaseProfilePageMixin],

	form1 : [
		"name",
		"abn",
		"contactName",
		"email"
	],
	form2 : [
		"website",
		"facebook",
		"addressLine1",
		"addressLine2",
		"city",
		"state",
		"country",
		"postcode",
		"headline",
		"bio",
		"references"
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
	    }
    },

	render() {
    	var selectedTeam,team,schema;
    	team = this.state.item;
    	selectedTeam = this.data.selectedTeam;
		schema = FM.schemas['Team'];
		if(!team) {
			return (
                <form className="form-inline">
                    <div className="form-group">
                        <b>Search for supplier:</b>
                        <h2><input type="email" className="inline-form-control" ref="invitationEmail" placeholder="Email address"/></h2>
                        <button type="submit" style={{width:0,opacity:0}} onClick={this.handleInvite}>Invite</button>
                    </div>
                </form>
            )
		}
		return (
		    <div className="user-profile-card" style={{backgroundColor:"#fff"}}>
			    <div className="row">
			        <div className="col-lg-12">
		            	<h2 className="background"><span>{team.getName()}</span></h2>
		            </div>
			   	</div>
			   	<div className="row">
			   		<div className="col-lg-12" style={{marginLeft:"15px"}}>
			   			<span onClick={selectedTeam.removeSupplier.bind(selectedTeam,team)}>Remove from team: <b>{selectedTeam.getName()}</b></span>
			   		</div>
			   		<CollapseBox title="Basic Info">
				        <div className="col-lg-7" style={{paddingTop:"20px"}}>
				        	<AutoForm item={team} schema={schema} form={this.form1} save={team.save.bind(team)} />
				        </div>
				        <div className="col-lg-5">
				        	<AutoInput.File item={team.thumb} onChange={team.set.bind(team,"thumb")} />
						</div>
				        <div className="col-lg-12">
				        	<AutoForm item={team} schema={schema} form={this.form2} save={team.save.bind(team)} />
			            </div>
			        </CollapseBox>
				   	<CollapseBox title="Config" collapsed={true}>
					    <div className="col-lg-12">
					       	<AutoForm item={team} schema={schema} form={this.form3} save={team.save.bind(team)} />
				        </div>
				    </CollapseBox>
				   	<CollapseBox title="Services Provided" collapsed={true}>
					    <div className="col-lg-12">
					      	<ServicesSelector item={team} save={team.set.bind(team,"services")}/>
				        </div>		            
					</CollapseBox>
				</div>
			</div>
		)
	}
});

AccountFlipWidget= React.createClass({
	render() {
		return (
			<FlipWidget
				front={AccountView}
				back={AccountEdit}
				item={this.props.item}
			/>
		)
	}
});

AccountView = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('users');
    	var team, orders;
    	team = this.props.item;
    	// would be nice to have a mixin to deal with this pattern
    	// would dry up the code alot
    	if(team) {
    		orders = Issues.find({"_supplier._id":team._id,status:"Closed"}).fetch();
	    }
    	return {
    		team:team,
    		reviews:orders||[]
    	}
    },

	render() {
		var team = this.data.team;
		var reviews = this.data.reviews;
		return (
			<div>
				<ContactSummary item={team} />
				<hr/>
				<div style={{padding:"10px"}}>
				{reviews.map(function(i,idx){
					return (
						<div className="row" key={idx}>
							<div className="col-md-12">
								<Message item={i} />
							</div>
						</div>
					)
				})}
				</div>
			</div>
		)
	}
});

AccountProfilePage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var user, team;
    	user = Meteor.user();
    	if(user) {
    		team = user.getSelectedTeam();
    	}
		return {
			team:team
		}
	},

	render() {
		return (
		    <div className="wrapper wrapper-content animated fadeIn">
		        <div className="row">
		            <div className="col-lg-6 col-md-6 col-sm-6">
						<FlipWidget
							front={AccountEdit}
							back={AccountView}
							item={this.data.team}
						/>
					</div>
				</div>
			</div>
		)
	}
})
