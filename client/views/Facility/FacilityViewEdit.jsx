FacilityViewEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('users');
		var facility, schema, team, tenants, contacts, config;
		facility = this.props.item;
		schema = Facilities.getSchema();
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

	render() {
		var ready = this.data.ready;
		if(!ready) return (<div/>);

		var facility = this.data.facility;
		var tenants = this.data.tenants;
		var contacts = this.data.contacts;
		//so why not just send the collection to the react component and autoform can do the schema
		// Answer: because not every scema has a collection
		var schema = this.data.schema;
		//console.log(config);

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
