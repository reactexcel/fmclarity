AccountProfile = React.createClass({

	save() {
		var team = this.props.item;
		return function() {
			team.save();
		}
	},

	getForm() {
		return [
			{
				key:"name",
				type:"text"
			},
			{
				key:"email",
				type:"text"
			},
			{
				key:"phone",
				type:"text"
			},
			{
				key:"abn",
				type:"text"
			},
			{
				key:"type",
				type:"text"
			}
		]
	},

	componentDidMount() {
		var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

		elems.forEach(function(html) {
		  var switchery = new Switchery(html, {size:'small',color:'#db4437'});
		});
	},

	render() {
		var team,profile,schema;
		team = this.props.item;
		if(team) {
			profile = team.getProfile();
			schema = Schema.TeamProfile;
		}
		if(!team||!profile) {
			return <div/>
		}
		return (
		    <div className="user-profile-card" style={{backgroundColor:"#fff"}}>
			    <div className="row">
			        <div className="col-lg-12">
		            	<h2 className="background"><span>{profile.name}</span></h2>
		            </div>
			   	</div>
			   	<div className="row">
			        <div className="col-lg-7">
			        	<AutoForm item={profile} schema={schema} form={this.getForm()} save={this.save()} />
			        </div>
			        <div className="col-lg-5">
						<div className="contact-thumbnail">
							<img style={{width:"100%"}} alt="image" src={"img/"+profile.thumb}/>
						</div>
					</div>
				</div>
				<div className="row">
			        <div className="col-lg-12">
		            	<h4 className="background"><span>About {team.name}</span></h4>
		            	<textarea className="inline-form-control" defaultValue={profile.bio} onChange={this.save()}></textarea>
		            </div>
				</div>
				<div className="row">
			        <div className="col-lg-12">
		            	<h4 className="background"><span>Change Password</span></h4>
		            	<dl className="dl-horizontal">
		            		<dt>Old password</dt>
		            		<dd><input type="password" className="inline-form-control"/></dd>
		            		<dt>New password</dt>
		            		<dd><input type="password" className="inline-form-control"/></dd>
		            		<dt>Confirm new password</dt>
		            		<dd><input type="password" className="inline-form-control"/></dd>
		            	</dl>
		            </div>
				</div>
				<div className="row">
			        <div className="col-lg-12">
		            	<h4 className="background"><span>Options</span></h4>
						<label>Something</label><input type="checkbox" defaultChecked={true} className="js-switch" /><br/>
						<label>Something</label><input type="checkbox" defaultChecked={false} className="js-switch" /><br/>
						<label>Something</label><input type="checkbox" defaultChecked={true} className="js-switch" /><br/>
						<label>Something</label><input type="checkbox" defaultChecked={false} className="js-switch" /><br/>
						<label>Something</label><input type="checkbox" defaultChecked={true} className="js-switch" /><br/>
						<label>Something</label><input type="checkbox" defaultChecked={false} className="js-switch" /><br/>
		            </div>
				</div>
			</div>
		)
	}
});

AccountProfileWidget= React.createClass({
	getInitialState() {
		return {
			edit:false
		}
	},

	toggleEdit() {
		this.refs.card.classList.toggle("flip");
	},

	render() {
		var team = this.props.item;
		return (
			<div ref="card" className="flip-container">
				<div className="flipper">
					<div className="front">
			            <div className="ibox" style={{backgroundColor:"#fff",padding:"10px"}}>
							<ContactSummary item={team}/>
							<a onClick={this.toggleEdit} style={{
								position:"absolute",
								right:"5px",
								top:0,
								fontSize:"15px",
								color:"#ddd"
							}} onClick={this.toggleEdit}>
								<i className="fa fa-cog"></i> Edit
							</a>
			            </div>
		            </div>
					<div className="back">
			            <div className="ibox" style={{backgroundColor:"#eee",padding:"20px"}}>
							<AccountProfile item={team}/>
							<a onClick={this.toggleEdit} style={{
								position:"absolute",
								right:"5px",
								top:0,
								fontSize:"15px",
								color:"#ddd"
							}} onClick={this.toggleEdit}>
								<i className="fa fa-eye"></i> View
							</a>
			            </div>
		            </div>
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
		            	<AccountProfileWidget item={this.data.team}/>
					</div>
				</div>
			</div>
		)
	}
})
