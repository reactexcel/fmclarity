FacilityEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('users');
    	Meteor.subscribe('config');
		var facility, schema, team, tenants, contacts, config;
		facility = this.props.item;
		schema = FM.schemas['Facility'];
		config = Config.findOne();
		if(config&&facility){
			team = facility.getTeam();
			contacts = facility.getContacts();
			if(team) {
				tenants = team.getMembers();
				return {
					ready:true,
					facility:facility,
					contacts:contacts,
					schema:schema,
					tenants:tenants.slice(0,3),
					config:config
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
	form3 : ["areas","buildingServices"],

	render() {
		var ready = this.data.ready;
		if(!ready) return (<div/>);

		var facility = this.data.facility;
		var tenants = this.data.tenants;
		var contacts = this.data.contacts;
		var schema = this.data.schema;
		var config = this.data.config;
		//console.log(config);

		return (
		    <div className="user-profile-card" style={{backgroundColor:"#fff"}}>
			    <div className="row">
				    <div className="col-lg-12">
			            <h2 className="background"><span>{facility.name}</span></h2>
			        </div>
			   	</div>
			   	<div className="row">
			   		<CollapseBox title="Property Details">
				        <div className="col-lg-12" style={{paddingTop:"20px"}}>
				        	<AutoForm item={facility} schema={schema} form={this.form1} save={this.save()} />
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
			   		<CollapseBox title="Facility holder" collapsed={true}>
				        <div className="col-lg-12" style={{paddingTop:"20px"}}>
				        	<AutoForm item={facility} schema={schema} form={['holder']} save={this.save()} />
				        </div>
					</CollapseBox>
			   		<CollapseBox title="Lease particulars" collapsed={true}>
				        <div className="col-lg-12" style={{paddingTop:"20px"}}>
				        	<AutoForm item={facility} schema={schema} form={['lease']} save={this.save()} />
				        </div>
					</CollapseBox>
			   		<CollapseBox title="Building areas" collapsed={true}>
<div className="col-lg-12">
	<div className="panel-group"> 
		{facility.areas.map(function(areaGroup,idx){
			return (<div key={idx} className="panel panel-default"> 
			<div className="panel-heading" role="tab">
				<h4 className="panel-title"> 
					<a>{areaGroup.name}</a>
				</h4>
			</div>
			<div >
				<table className="table">
					<tbody>
					{areaGroup.areas.map(function(area,idx){
						return (<tr key={idx}>
							<td>{area.number}</td>
							<td>{area.name}</td>
							<td>{area.location}</td>
						</tr>)
					})}
					<tr>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					</tbody>
				</table>
			</div>
		</div>)
		})}
	</div>
</div>
					</CollapseBox>
			   		<CollapseBox title="Default services & suppliers" collapsed={true}>
<div className="col-lg-12">
<div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true"> 
	{facility.services.map(function(service,idx){
		return (<div key={idx} className="panel panel-default"> 
		<div className="panel-heading" role="tab" id={"heading-"+idx}>
			<h4 className="panel-title"> 
				<a 
					role="button" 
					data-toggle="collapse" 
					data-parent="#accordion" 
					href={"#collapse-"+idx} 
					aria-expanded="false" 
					aria-controls={"collapse-"+idx} 
					className="collapsed"
				>{service.name}</a>
			</h4>
		</div>
		<div 
			id={"collapse-"+idx}
			className="panel-collapse collapse"
			role="tabpanel"
			aria-labelledby={"heading-"+idx}
			aria-expanded="false"
			style={{height:"0px"}}
		>
			<table className="table">
				<tbody>
				{service.subservices?service.subservices.map(function(ss,ssidx){
					return (<tr key={ssidx}>
						<td>{ss.name}</td>
						<td>{ss.cycle}</td>
						<td>Select contractor</td>
					</tr>)
				}):null}
				</tbody>
			</table>
		</div>
	</div>)
	})}
</div>
</div>
					</CollapseBox>
			   		<CollapseBox title="Documents & images" collapsed={true}>
			   			<div className="row" style={{margin:"15px"}}>
					        <div className="col-lg-4" style={{padding:0}}>
								<div className="contact-thumbnail">
									<img style={{width:"100%"}} alt="image" src={"img/"+facility.thumb}/>
								</div>
							</div>
					        <div className="col-lg-4" style={{padding:0}}>
								<div className="contact-thumbnail">
									<img style={{width:"100%"}} alt="image" src={"img/"+facility.thumb}/>
								</div>
							</div>
					        <div className="col-lg-4" style={{padding:0}}>
								<div className="contact-thumbnail">
									<img style={{width:"100%"}} alt="image" src={"img/"+facility.thumb}/>
								</div>
							</div>
					        <div className="col-lg-4" style={{padding:0}}>
								<div className="contact-thumbnail">
									<img style={{width:"100%"}} alt="image" src={"img/"+facility.thumb}/>
								</div>
							</div>
					        <div className="col-lg-4" style={{padding:0}}>
								<div className="contact-thumbnail">
									<img style={{width:"100%"}} alt="image" src={"img/"+facility.thumb}/>
								</div>
							</div>
					        <div className="col-lg-4" style={{padding:0}}>
								<div className="contact-thumbnail">
									<img style={{width:"100%"}} alt="image" src={"img/"+facility.thumb}/>
								</div>
							</div>
						</div>
					</CollapseBox>
				</div>
			</div>
		)
	}
});
