AccountProfile = React.createClass({

    componentWillMount: function() {
        this.saveItem = _.debounce(this.saveItem,500);
    },

    saveItem() {
        this.user.save();
    },

    updateField(field,subfield) {
        var $this = this;
        // returns a function that modifies 'field'
        return function(event) {
        	if(subfield) {
	            $this.team[field][subfield] = event.target.value;
        	}
        	else {
	            $this.team[field] = event.target.value;
	        }
            $this.saveItem();
        }
    },

	render() {
		var team = this.team = this.props.item;
		if(!team) {
			return (<div/>)
		}
		return (
		    <div className="user-profile-card">
			            	<div className="row" style={{borderTop:"1px solid #ddd"}}>
			            		<div className="col-lg-12">
		            				<h2 style={{float:"left",backgroundColor:"#fff","margin":0,"position":"relative",top:"-17px",padding:"3px"}}>{team.name}</h2>
		            			</div>
			            	</div>
			            	<div className="row">
			            		<div className="col-lg-7">
			            			<dl className="dl-horizontal">
			            				<dt>Name</dt>
			            				<dd>
					                        <input 
					                            placeholder="Enter display name"
					                            className="inline-form-control" 
					                            value={team.name} 
					                            onChange={this.updateField('name')}
					                        />
					                    </dd>
			            				<dt>Email</dt>
			            				<dd>{team.email}</dd>
			            				<dt>Phone</dt>
			            				<dd>
						                        <input 
						                            placeholder="Enter work phone"
						                            className="inline-form-control" 
						                            value={team.phone} 
						                            onChange={this.updateField('phone','business')}
						                        />
						                        <input 
						                            placeholder="Enter mobile"
						                            className="inline-form-control" 
						                            value={team.phone} 
						                            onChange={this.updateField('phone','mobile')}
						                        />
			            				</dd>
			            				<dt>ABN</dt>
			            				<dd>
						                    <input 
						                        placeholder="Enter ABN"
						                        className="inline-form-control" 
						                        value={team.abn} 
						                        onChange={this.updateField('abn')}
						                    />
			            				</dd>
			            			</dl>
			            		</div>
			            		<div className="col-lg-5">
									<div className="contact-thumbnail">
										<img style={{width:"100%"}} alt="image" src={"img/"+team.thumb}/>
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
		if(!this.data.team) {
			return <div/>
		}
		return (
		    <div className="wrapper wrapper-content animated fadeIn">
		        <div className="row">
		            <div className="col-lg-6 col-md-6 col-sm-6">
			            <Box title="Account Profile">
			            	<AccountProfile item={this.data.team}/>
			            </Box>
					</div>
				</div>
			</div>
		)
	}
})
