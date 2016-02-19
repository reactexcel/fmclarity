FacilityViewEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('users');
		var facility, schema, team, tenants, contacts, config;
		facility = this.props.item;
		schema = Facilities.getSchema();
		if(facility){
			team = facility.getTeam();
			//contacts = facility.getContacts();
			//tenants = facility.getTenants();

			contacts = facility.getMembers({role:"contact"});
			tenants = facility.getMembers({role:"tenant"});
			return {
				ready:true,
				facility:facility,
				schema:schema,
				contacts:contacts,
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

	addMember(ext,member) {
		this.data.facility.addMember(member,ext);
	},

	render() {
		var ready = this.data.ready;
		if(!ready) return (<div/>);

		var facility = this.data.facility;
		var tenants = this.data.tenants;
		var contacts = this.data.contacts;
		var members = this.data.members;
		var schema = this.data.schema;

		return (
		    <div className="ibox-form user-profile-card" style={{backgroundColor:"#fff"}}>
			    <h2><span>{facility.getName()}</span></h2>
				<CollapseBox title="Property Details">
				    <AutoForm item={facility} schema={schema} form={["name","address"]}/>
				</CollapseBox>
				<CollapseBox title="Documents & images">
					<AutoForm item={facility} schema={schema} form={["attachments"]}/>
				</CollapseBox>
				<CollapseBox title="Contacts">
			   		<ContactList 
			   			items={contacts}
			   			//items={members}
			   			role="contact"
			   			onAdd={this.addMember.bind(null,{role:"contact"})}
			   			onChange={facility.setContacts.bind(facility)}
			   		/>
				</CollapseBox>
				<CollapseBox title="Tenants">
			   		<ContactList 
			   			items={tenants} 
			   			//items={members}
			   			role="tenant"
			   			onAdd={this.addMember.bind(null,{role:"tenant"})}
			   			onChange={facility.setTenants.bind(facility)}
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
