FacilityAreaRow = React.createClass({
	render() {
		var area = this.props.area;
		var deleteArea = this.props.delete;
		var updateField = this.props.update;
		var Menu = AutoInput.menu;
		return (
			<tr>
				<td style={{width:"30px"}}>
					<input 
						type="text" 
						className="inline-form-control" 
						defaultValue={area.number}
						onChange={updateField.bind(null,'number')}
					/>
				</td>
				<td style={{padding:"3px",width:"60%"}}>
					<Menu 
						options={Config.areaNames} 
						onChange={updateField.bind(null,'name')}
						value={area.name}
					/>
				</td>
					<td style={{padding:"3px"}}>
					<Menu 
						options={["","North","South","East","West"]} 
						onChange={updateField.bind(null,'location')}
						value={area.location}
					/>
				</td>
				<td className="actions" style={{width:"30px"}}>
					<span 
						onClick={deleteArea}
					>
						<i className="fa fa-times"></i>
					</span>
				</td>
			</tr>
		)
	}
})


FacilityAreas = React.createClass({

	getInitialState() {
		return {
			areaGroups:this.props.item.areas
		}
	},

	save() {
		var item = this.props.item;
		item.areas = this.state.areaGroups;
		item.save();
	},

    componentWillMount: function() {
        this.save = _.debounce(this.save,2000);
    },

	updateGroupField(groupNum,field,event) {
		var value = event.target.value;
		var areaGroups = this.state.areaGroups;
		areaGroups[groupNum][field] = value;
		this.setState({
			areaGroups:areaGroups
		});
		this.save();
	},

	updateAreaField(groupNum,areaNum,field,event) {
		var value = event.target.value;
		var areaGroups = this.state.areaGroups;
		if(!areaGroups[groupNum].areas[areaNum]){
			areaGroups[groupNum].areas[areaNum] = {};
		}
		areaGroups[groupNum].areas[areaNum][field] = value;
		this.setState({
			areaGroups:areaGroups
		});
		this.save();
	},

	deleteArea(groupNum,areaNum) {
		var areaGroups = this.state.areaGroups;
		areaGroups[groupNum].areas.splice(areaNum,1);		
		this.setState({
			areaGroups:areaGroups
		});
		this.save();
	},

	render () {
		var deleteArea = this.deleteArea;
		var updateAreaField = this.updateAreaField;
		var updateGroupField = this.updateGroupField;
		var areaGroups = this.state.areaGroups;
		var Menu = AutoInput.menu;
		return (
			<div className="panel-group"> 
				{areaGroups.map(function(group,groupNum){
					return (<div key={groupNum} className="panel panel-default"> 
					<div className="panel-heading" role="tab">
						<h4 className="panel-title">
							<input 
								type="text" 
								className="inline-form-control" 
								style={{width:"50%"}}
								onChange={updateGroupField.bind(null,groupNum,'name')}
								value={group.name}
							/>
							<div style={{float:"right"}}>
								<b>Number like this</b>
								<input 
									type="text" 
									className="inline-form-control" 
									style={{width:"30px",paddingLeft:"10px"}} 
									onChange={updateGroupField.bind(null,groupNum,'number')}
									value={group.number}
								/>
							</div>
						</h4>
					</div>
					<div >
						<table className="table" style={{margin:0}}>
							<tbody>
							{group.areas.map(function(area,areaNum){
								return (
									<FacilityAreaRow
										key={areaNum}
										area={area}
										delete={deleteArea.bind(null,groupNum,areaNum)}
										update={updateAreaField.bind(null,groupNum,areaNum)}
									/>
								)
							})}
							<FacilityAreaRow
								key={group.areas.length}
								area={{}}
								delete={deleteArea.bind(null,groupNum,group.areas.length)}
								update={updateAreaField.bind(null,groupNum,group.areas.length)}
							/>
							</tbody>
						</table>
					</div>
				</div>)
				})}
			</div>
		)
	}
})


FacilityServices = React.createClass({

	getInitialState() {
		return {
			services:this.props.item.services
		}
	},

	save() {
		var item = this.props.item;
		item.services = this.state.services;
		item.save();
	},

    componentWillMount: function() {
        this.save = _.debounce(this.save,2000);
    },

	updateSubServiceField(serviceNum,subServiceNum,field,event) {
		var value = event.target.value;
		var services = this.state.services;
		if(!services[serviceNum].subservices[subServiceNum]){
			services[serviceNum].subservices[subServiceNum] = {};
		}
		services[serviceNum].subservices[subServiceNum][field] = value;
		this.setState({
			services:services
		});
		this.save();
	},

	render() {
		var updateSubServiceField = this.updateSubServiceField;
		var updateServiceField= this.updateServiceField;
		var facility = this.props.item;
		var Switch = AutoInput.switch;
		var Menu = AutoInput.menu;
		var save = this.save;
		return(
			<div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true"> 
				{facility.services.map(function(service,serviceIndex){
					return (<div key={serviceIndex} className="panel panel-default"> 
					<div className="panel-heading" role="tab" id={"heading-"+serviceIndex}>
						<h4 className="panel-title"> 
							<a 
								role="button" 
								data-toggle="collapse" 
								data-parent="#accordion" 
								href={"#collapse-"+serviceIndex} 
								aria-expanded="false" 
								aria-controls={"collapse-"+serviceIndex} 
								className="collapsed"
							>{service.name}</a>
						</h4>
					</div>
					<div 
						id={"collapse-"+serviceIndex}
						className="panel-collapse collapse"
						role="tabpanel"
						aria-labelledby={"heading-"+serviceIndex}
						aria-expanded="false"
						style={{height:"0px"}}
					>
						<table className="table">
							<tbody>
							{service.subservices?service.subservices.map(function(subService,subIndex){
								return (<tr key={subIndex}>
									<td style={{padding:"0 0 0 5px"}}>
										<Switch 
											placeholder={subService.name} 
											value={subService.available}
											onChange={updateSubServiceField.bind(null,serviceIndex,subIndex,'available')}
										/>
									</td>
									<td style={{padding:"3px"}}>
										<Menu 
											options={Config.cycleNames} 
											onChange={updateSubServiceField.bind(null,serviceIndex,subIndex,'cycle')}
											value={subService.cycle}
										/>
									</td>
									<td style={{padding:"8px"}}>Select contractor</td>
								</tr>)
							}):null}
							</tbody>
						</table>
					</div>
				</div>)
				})}
			</div>
		)
	}
})


FacilityEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('users');
		var facility, schema, team, tenants, contacts, config;
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
					tenants:tenants.slice(0,3),
				}
			}
		}
		return {
			ready:false
		}

    },

    // debounce here and remove debounce from AutoForm, FacilityAreas and FacilityServices
	save() {
		var item = this.props.item;
		return function() {
			item.save();
		}
	},

	updateField(field,event) {
		var item = this.props.item;
		item[field] = event.target.value;
		item.save();
	},

	form1 : ["name","address"],
	form3 : ["areas","buildingServices"],

	render() {
		var ready = this.data.ready;
		if(!ready) return (<div/>);

		var facility = this.data.facility;
		var tenants = this.data.tenants;
		var contacts = this.data.contacts;
		var schema = FM.schemas['Facility'];
		//console.log(config);

		return (
		    <div className="user-profile-card" style={{backgroundColor:"#fff"}}>
			    <div className="row">
				    <div className="col-lg-12">
			            <h2 className="background"><span>{facility.getName()}</span></h2>
			        </div>
			   	</div>
			   	<div className="row">
			   		<CollapseBox title="Property Details">
				        <div className="col-lg-12" style={{paddingTop:"20px"}}>
				        	<AutoForm item={facility} schema={schema} form={this.form1} save={this.save()} />
				        </div>
					</CollapseBox>
			   		<CollapseBox title="Documents & images">
				        <AutoForm item={facility} schema={schema} form={['_attachments']} save={this.save()} />
					</CollapseBox>
			   		<CollapseBox title="Contacts">
			   			<ContactList 
			   				items={contacts} 
			   				onChange={this.updateField.bind(null,'_contacts')}
			   			/>
					</CollapseBox>
			   		<CollapseBox title="Tenants">
			   			<ContactList 
			   				items={tenants} 
			   				onChange={this.updateField.bind(null,'_tenants')}
			   			/>
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
							<FacilityAreas item={facility} save={this.save()}/>
						</div>
					</CollapseBox>
			   		<CollapseBox title="Default services & suppliers" collapsed={true}>
						<div className="col-lg-12">
							<FacilityServices item={facility} save={this.save()} />
						</div>
					</CollapseBox>
				</div>
			</div>
		)
	}
});
