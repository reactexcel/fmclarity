FacilityAreaRow = React.createClass({
	render() {
		var area = this.props.area;
		var deleteArea = this.props.delete;
		var updateField = this.props.update;
		var Menu = AutoInput.menu;
		return (
			<tr>
				<td style={{width:"30px"}}>
					<AutoInput.Text 
						value={area.number}
						onChange={updateField.bind(null,'number')}
					/>
				</td>
				<td style={{padding:"5px 0",width:"60%"}}>
					<Menu 
						options={Config.areaNames} 
						onChange={updateField.bind(null,'name')}
						value={area.name}
					/>
				</td>
				<td style={{padding:"5px"}}>
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

	componentWillReceiveProps(newProps) {
		this.setState({
			areaGroups:newProps.item.areas
		});
	},

	save() {
		var item = this.props.item;
		item.areas = this.state.areaGroups;
		item.save();
	},

    componentWillMount: function() {
        this.save = _.debounce(this.save,2000);
    },

	updateGroupField(groupNum,field,value) {
		var areaGroups = this.state.areaGroups;
		areaGroups[groupNum][field] = value;
		this.setState({
			areaGroups:areaGroups
		});
		this.save();
	},

	updateAreaField(groupNum,areaNum,field,value) {
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
							<span style={{width:"70%",display:"inline-block"}}>
								<AutoInput.Text 
									onChange={updateGroupField.bind(null,groupNum,'name')}
									value={group.name}
								/>
							</span>
							<span style={{float:"right",width:"30px",paddingLeft:"10px"}}>
								<AutoInput.Text
									onChange={updateGroupField.bind(null,groupNum,'number')}
									value={group.number}
								/>
							</span>
							<b>Number like this</b>
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
			tenants = facility.getTenants();
			return {
				ready:true,
				facility:facility,
				contacts:contacts,
				schema:schema,
				tenants:tenants
			}
		}
		return {
			ready:false
		}

    },

	updateField(field,value) {
		this.props.item[field] = value;
		this.props.item.save();
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
		    <div className="ibox-form user-profile-card" style={{backgroundColor:"#fff"}}>
			    <h2><span>{facility.getName()}</span></h2>
				<CollapseBox title="Property Details">
				    <AutoForm item={facility} schema={schema} form={this.form1}/>
				</CollapseBox>
				<CollapseBox title="Documents & images">
					<AutoForm item={facility} schema={schema} form={['attachments']}/>
				</CollapseBox>
				<CollapseBox title="Contacts">
			   		<ContactList 
			   			items={contacts} 
			   			onChange={this.updateField.bind(null,'contacts')}
			   		/>
				</CollapseBox>
				<CollapseBox title="Tenants">
			   		<ContactList 
			   			items={tenants} 
			   			onChange={this.updateField.bind(null,'tenants')}
			   		/>
				</CollapseBox>
				<CollapseBox title="Lease particulars" collapsed={true}>
				    <AutoForm item={facility} schema={schema} form={['lease']}/>
				</CollapseBox>
				<CollapseBox title="Building areas" collapsed={true}>
					<FacilityAreas item={facility}/>
				</CollapseBox>
				<CollapseBox title="Default services & suppliers" collapsed={true}>
					<ServicesSelector item={facility}/>
				</CollapseBox>
			</div>
		)
	}
});
