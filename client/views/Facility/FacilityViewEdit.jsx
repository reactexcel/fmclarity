FacilityViewEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('users');
		var facility, schema, team, tenants, contacts, config;
		facility = this.props.item;
		schema = Facilities.schema();
		if(facility){
			team = facility.getTeam();
			//contacts = facility.getContacts();
			//tenants = facility.getTenants();

			contacts = facility.getMembers({role:"contact"});
			tenants = facility.getMembers({role:"tenant"});
			return {
				ready:true,
				facility:facility,
				team:facility.getTeam(),
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
		var team = this.data.team;

		if(!facility&&facility.canCreate()) {
			//show facility creation information
		}
		else if(!facility.canSave()) {
			return (
				<FacilityViewDetail item={facility} />
			)			
		}
		return (
		    <div className="ibox-form user-profile-card" style={{backgroundColor:"#fff"}}>
			    <h2><span>{facility.getName()}</span></h2>
				<CollapseBox title="Property Details">
					<div className="row">
						<div className="col-sm-7">
							<AutoForm item={facility} schema={schema} form={["name","address"]}/>
						</div>
			        	<div className="col-sm-5">
			        		<AutoInput.File item={facility.thumb} onChange={facility.setThumb.bind(facility)} />
			        	</div>
			        </div>
				</CollapseBox>
				<CollapseBox title="Documents & images">
					<AutoForm item={facility} schema={schema} form={["attachments"]}/>
				</CollapseBox>
				<CollapseBox title="Contacts">
			   		<ContactList 
			   			items={contacts}
			   			//items={members}
			   			facility={facility}
			   			role="contact"
			   			onAdd={team.canInviteMember()?this.addMember.bind(null,{role:"contact"}):null}
			   		/>
				</CollapseBox>
				<CollapseBox title="Tenants">
			   		<ContactList 
			   			items={tenants} 
			   			//items={members}
			   			facility={facility}
			   			role="tenant"
			   			onAdd={team.canInviteMember()?this.addMember.bind(null,{role:"tenant"}):null}
			   		/>
				</CollapseBox>
				<CollapseBox title="Lease particulars" collapsed={true}>
				    <AutoForm item={facility} schema={schema} form={['lease']}/>
				</CollapseBox>
				{/*
				<CollapseBox title="Building areas" collapsed={true}>
					<FacilityAreas item={facility}/>
				</CollapseBox>
				<CollapseBox title="Default services & suppliers" collapsed={true}>
					<ServicesSelector item={facility}/>
				</CollapseBox>
				*/}
			</div>
		)
	}
});
