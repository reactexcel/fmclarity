UserProfile = React.createClass({

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
	            $this.user.profile[field][subfield] = event.target.value;
        	}
        	else {
	            $this.user.profile[field] = event.target.value;
	        }
            $this.saveItem();
        }
    },

	render() {
		var user, profile;
		this.user = this.props.item;
		user = this.user;
		if(user) {
			profile = user.profile;
		}
		if(!user||!profile) {
			return (<div/>)
		}
		return (
		    <div className="user-profile-card">
			            	<div className="row" style={{borderTop:"1px solid #ddd"}}>
			            		<div className="col-lg-12">
		            				<h2 style={{float:"left",backgroundColor:"#fff","margin":0,"position":"relative",top:"-17px",padding:"3px"}}>{profile.name}</h2>
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
					                            value={profile.name} 
					                            onChange={this.updateField('name')}
					                        />
					                    </dd>
			            				<dt>Email</dt>
			            				<dd>{user.emails[0].address}</dd>
			            				<dt>Phone</dt>
			            				<dd>
						                        <input 
						                            placeholder="Enter work phone"
						                            className="inline-form-control" 
						                            value={profile.phone.business} 
						                            onChange={this.updateField('phone','business')}
						                        />
						                        <input 
						                            placeholder="Enter mobile"
						                            className="inline-form-control" 
						                            value={profile.phone.mobile} 
						                            onChange={this.updateField('phone','mobile')}
						                        />
			            				</dd>
			            				<dt>ABN</dt>
			            				<dd>
						                    <input 
						                        placeholder="Enter ABN"
						                        className="inline-form-control" 
						                        value={profile.abn} 
						                        onChange={this.updateField('abn')}
						                    />
			            				</dd>
			            			</dl>
			            		</div>
			            		<div className="col-lg-5">
									<div className="contact-thumbnail">
										<img style={{width:"100%"}} alt="image" src={"img/"+profile.thumb}/>
									</div>
								</div>
							</div>
			</div>
		)
	}
});

UserProfilePage = React.createClass({

	render() {
		return (
		    <div className="wrapper wrapper-content animated fadeIn">
		        <div className="row">
		            <div className="col-lg-6 col-md-6 col-sm-6">
			            <Box title="User Profile">
			            	<UserProfile item={Meteor.user()}/>
			            </Box>
					</div>
				</div>
			</div>
		)
	}
})

UserProfilePageMD = React.createClass({
	render() {
		var user = this.props.user||Meteor.user();
		var profile = user.profile;
		return (
		    <div className="wrapper wrapper-content animated fadeIn">
		        <div className="row">
		            <div className="col-lg-12 col-md-12 col-sm-12">
			            <Box title="User Profile">
			            	<div className="row">
			            		<div className="col-lg-3">
									<div className="contact-thumbnail">
										<img style={{width:"100%"}} alt="image" src={"img/"+profile.thumb}/>
									</div>
								</div>
								<div className="col-lg-9">
									<div className="row">
										<div className="col-lg-12">
											<div className="row">
												<div className="col-lg-6">
													<MDInput label="First name" value={profile.firstname}/>
												</div>
												<div className="col-lg-6">
													<MDInput label="Last name" value={profile.lastname}/>
												</div>
											</div>
										</div>
										<div className="col-lg-12">
											<div className="row">
												<div className="col-lg-6" value={profile.email}>
													<MDInput label="Email"/>
												</div>
												<div className="col-lg-6">
													<MDInput label="ABN" value={profile.abn}/>
												</div>
											</div>
										</div>
										<div className="col-lg-12">
											<div className="row">
												<div className="col-lg-6">
													<MDInput label="Phone BH" value={profile.phone.work}/>
												</div>
												<div className="col-lg-6">											
													<MDInput label="Mobile" value={profile.phone.mobile}/>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-12">
									<div className="col-lg-6">
										<MDInput label="Address line 1" value={profile.address.line1}/>
									</div>
									<div className="col-lg-6">
										<MDInput label="Address line 2" value={profile.address.line2}/>
									</div>
								</div>
								<div className="col-lg-12">
									<div className="row">
										<div className="col-lg-3">
											<MDInput label="Suburb/City" value={profile.address.city}/>
										</div>
										<div className="col-lg-3">
											<MDInput label="State" value={profile.address.state}/>
										</div>
										<div className="col-lg-3">
											<MDInput label="Country" value={profile.address.country}/>
										</div>
										<div className="col-lg-3">
											<MDInput label="Postcode/Zip" value={profile.address.zip}/>
										</div>
									</div>
								</div>
							</div>
			            </Box>
					</div>
				</div>
			</div>
		)
	}
})