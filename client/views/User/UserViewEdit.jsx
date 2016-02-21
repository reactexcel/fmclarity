UserProfile = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	return {
    		user:this.state.item,
    		selectedTeam:this.props.team||FM.getSelectedTeam(),
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

	save() {
		Meteor.call('User.save',this.state.item);
	},

	form1 : {
		firstName:{
			label:"First name",
			size:6
		},
		lastName:{
			label:"Last name",
			size:6
		},
		name:{
			label:"Display name",
		},
		email:{
			label:"Email address",
		},
		phone:{
			label:"Phone number",
		}
	},

	handleInvite(event) {
    	event.preventDefault();
    	var team,input,email,regex,component;
    	component = this;
		team = this.data.selectedTeam;
    	input = this.refs.invitationEmail;
    	email = input.value;
    	regex = /.+@.+\..+/i
    	if(!regex.test(email)) {
    		alert('Please enter a valid email address');
    	}
    	else {
            input.value = '';
            team.inviteMember(email, {role:component.props.role}, function(user){
            	component.setItem(user);
            	if(component.props.onChange) {
            		component.props.onChange(user);
            	}
            });
            this.setState({
            	shouldShowMessage:true
            });	    
        }
    },

    handleThumbChange(newThumb) {
		var user, profile;
		user = this.state.item;
		if(user) {
			profile = user.profile;
		}
		profile.thumb = newThumb;
		this.save();
    },

	removeMember(team,user) {
		var message = confirm("Remove "+user.getName()+" from "+team.getName()+"?");
    	if(message == true){
    		team.removeMember(user);
     	}
	},


	render() {
		var user, profile, team;
		user = this.state.item;
		team = this.data.selectedTeam;
		if(user) {
			profile = user.profile;
		}
		if(!user||!profile||!team) {
			return (
                <form className="form-inline">
                    <div className="form-group">
                        <b>Let's search to see if this user already has an account.</b>
                        <h2><input type="email" className="inline-form-control" ref="invitationEmail" placeholder="Email address"/></h2>
                        <button type="submit" style={{width:0,opacity:0}} onClick={this.handleInvite}>Invite</button>
                    </div>
                </form>
            )
		}
		return (
		    <div className="ibox-form user-profile-card">
		    	<div className="row">
		    		<div className="col-sm-12">
                        {this.state.shouldShowMessage?<b>User not found, please enter the details to add to your contact.</b>:null}
		           		<h2><span>{profile.name}</span></h2>
				   	</div>
				    <div className="col-sm-7">
			        	<AutoForm item={profile} schema={this.form1} save={this.save} />
			        </div>
			   		<div className="col-sm-5">
				        <AutoInput.File item={profile.thumb} onChange={this.handleThumbChange} />
				    </div>
		        </div>
			</div>
		)
	}
});