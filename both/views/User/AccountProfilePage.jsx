AccountProfile = React.createClass({

	save() {
		var team = this.props.item;
		return function() {
			team.save();
		}
	},

	form1 : [
		{
			key:"name",
			type:"mdtext"
		},
		{
			key:"abn",
			type:"mdtext"
		},
		{
			key:"contactName",
			type:"mdtext"
		},
		{
			key:"email",
			type:"mdtext"
		}
	],

	form2 : [
		{
			key:"website",
			type:"mdtext",
			cols:6
		},
		{
			key:"facebook",
			type:"mdtext",
			cols:6
		},
		{
			key:"addressLine1",
			type:"mdtext",
			cols:6
		},
		{
			key:"addressLine2",
			type:"mdtext",
			cols:6
		},
		{
			key:"city",
			type:"mdtext",
			cols:3
		},
		{
			key:"state",
			type:"mdtext",
			cols:3
		},
		{
			key:"country",
			type:"mdtext",
			cols:3
		},
		{
			key:"postcode",
			type:"mdtext",
			cols:3
		},
		{
			key:"headline",
			type:"textarea",
		},
		{
			key:"bio",
			type:"textarea",
		},
		{
			key:"references",
			type:"textarea",
		},
		{
			key:"services",
			type:"select"
		},
		{
			key:"areasServiced",
			type:"select"
		},
		{
			key:"defaultWorkOrderValue",
			type:"dltext"
		},
		{
			key:"modules",
			type:"switchbank",
		}
	],

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
			        <div className="col-lg-7" style={{paddingTop:"20px"}}>
			        	<AutoForm item={profile} schema={schema} form={this.form1} save={this.save()} />
			        </div>
			        <div className="col-lg-5">
						<div className="contact-thumbnail">
							<img style={{width:"93%"}} alt="image" src={profile.thumb}/>
						</div>
					</div>
				</div>
				<div className="row">
			        <div className="col-lg-12">
			        	<AutoForm item={profile} schema={schema} form={this.form2} save={this.save()} />
		            </div>
				</div>
			</div>
		)
	}
});

AccountProfileWidget= React.createClass({
	render() {
		return (
			<FlipWidget
				front={AccountView}
				back={AccountProfile}
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
							front={AccountProfile}
							back={AccountView}
							item={this.data.team}
						/>
					</div>
				</div>
			</div>
		)
	}
})
