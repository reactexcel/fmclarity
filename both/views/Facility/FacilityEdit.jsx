FacilityEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('users');
		var facility, schema, team, tenants, contacts;
		facility = this.props.item;
		schema = FM.schemas['Facility'];
		if(facility){
			team = facility.getTeam();
			contacts = facility.getContacts();
			if(team) {
				tenants = team.getMembers();
				return {
					ready:true,
					facility:facility,
					contacts:contacts,
					schema:schema,
					tenants:tenants.slice(0,3)
				}
			}
		}
		return {
			ready:false
		}

    },

	save() {
		var item = this.props.item;
		return function() {
			item.save();
		}
	},

	form1 : ["name","type","size","description","address"],
	form3 : ["buildingAreas","buildingServices"],

	render() {
		var ready = this.data.ready;
		if(!ready) return (<div/>);

		var item = this.data.facility;
		var tenants = this.data.tenants;
		var contacts = this.data.contacts;
		var schema = this.data.schema;

		return (
		    <div className="user-profile-card" style={{backgroundColor:"#fff"}}>
			    <div className="row">
				    <div className="col-lg-12">
			            <h2 className="background"><span>{item.name}</span></h2>
			        </div>
			   	</div>
			   	<div className="row">
			   		<CollapseBox title="Property Details">
				        <div className="col-lg-12" style={{paddingTop:"20px"}}>
				        	<AutoForm item={item} schema={schema} form={this.form1} save={this.save()} />
				        </div>
					</CollapseBox>
			   		<CollapseBox title="Contacts">
			            <div className="row" style={{margin:"15px 30px"}}>
			              	{contacts.map(function(contact){
			                	return (
			                  		<div 
			                    		key={contact._id}
			                    		style={{padding:0}}
			                    		className={"table-row col-lg-12"}
			                  		>
				                    	<ContactCard item={contact}/>
			                  		</div>	
		                	)
			              	})}
			            </div>
					</CollapseBox>
			   		<CollapseBox title="Tenants">
			            <div className="row" style={{margin:"15px 30px"}}>
			              	{tenants.map(function(tenant){
			                	return (
			                  		<div 
			                    		key={tenant._id}
			                    		style={{padding:0}}
			                    		className={"table-row col-lg-12"}
			                  		>
				                    	<ContactCard item={tenant}/>
			                  		</div>	
		                	)
			              	})}
			            </div>
					</CollapseBox>
			   		<CollapseBox title="Facility Holder" collapsed={true}>
				        <div className="col-lg-12" style={{paddingTop:"20px"}}>
				        	<AutoForm item={item} schema={schema} form={['holder']} save={this.save()} />
				        </div>
					</CollapseBox>
			   		<CollapseBox title="Lease Particulars" collapsed={true}>
				        <div className="col-lg-12" style={{paddingTop:"20px"}}>
				        	<AutoForm item={item} schema={schema} form={['lease']} save={this.save()} />
				        </div>
					</CollapseBox>
			   		<CollapseBox title="Building areas & services" collapsed={true}>
					</CollapseBox>
			   		<CollapseBox title="Documents & images" collapsed={true}>
			   			<div className="row" style={{margin:"15px"}}>
					        <div className="col-lg-4" style={{padding:0}}>
								<div className="contact-thumbnail">
									<img style={{width:"100%"}} alt="image" src={"img/"+item.thumb}/>
								</div>
							</div>
					        <div className="col-lg-4" style={{padding:0}}>
								<div className="contact-thumbnail">
									<img style={{width:"100%"}} alt="image" src={"img/"+item.thumb}/>
								</div>
							</div>
					        <div className="col-lg-4" style={{padding:0}}>
								<div className="contact-thumbnail">
									<img style={{width:"100%"}} alt="image" src={"img/"+item.thumb}/>
								</div>
							</div>
					        <div className="col-lg-4" style={{padding:0}}>
								<div className="contact-thumbnail">
									<img style={{width:"100%"}} alt="image" src={"img/"+item.thumb}/>
								</div>
							</div>
					        <div className="col-lg-4" style={{padding:0}}>
								<div className="contact-thumbnail">
									<img style={{width:"100%"}} alt="image" src={"img/"+item.thumb}/>
								</div>
							</div>
					        <div className="col-lg-4" style={{padding:0}}>
								<div className="contact-thumbnail">
									<img style={{width:"100%"}} alt="image" src={"img/"+item.thumb}/>
								</div>
							</div>
						</div>
					</CollapseBox>
				</div>
			</div>
		)
	}
});
