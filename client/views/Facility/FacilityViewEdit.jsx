import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FacilityViewEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('users');
		var facility, schema, team, suppliers;
		facility = this.props.item;
		schema = Facilities.schema();
		if(facility){
			team = facility.getTeam();
			suppliers = facility.getSuppliers();
			members = facility.getMembers();
			return {
				ready:true,
				facility:facility,
				team:team,
				schema:schema,
				members:members,
				suppliers:suppliers,
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

	addSupplier(ext,supplier) {
		this.data.facility.addSupplier(supplier,ext);
	},

	render() {
		var ready = this.data.ready;
		if(!ready) return (<div/>);

		var facility = this.data.facility;
		var members = this.data.members;
		var suppliers = this.data.suppliers;
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
							<AutoForm item={facility} schema={schema} form={["name","address","operatingTimes"]}/>
						</div>
			        	<div className="col-sm-5">
			        		<DocThumb.File item={facility.thumb} onChange={facility.setThumb.bind(facility)} />
			        	</div>
			        </div>
				</CollapseBox>
				<CollapseBox title="Files">
					<AutoForm item={facility} schema={schema} form={["attachments"]}/>
				</CollapseBox>
				<CollapseBox title="Members">
			   		<ContactList 
			   			items={members}
			   			facility={facility}
			   			onAdd={team.canInviteMember()?this.addMember.bind(null,{role:"staff"}):null}
			   		/>
				</CollapseBox>
				<CollapseBox title="Suppliers">
			   		<ContactList 
			   			items={suppliers}
			   			facility={facility}
			   			type="team"
			   			onAdd={team.canInviteSupplier()?this.addSupplier.bind(null,{role:"supplier"}):null}
			   		/>
				</CollapseBox>
				{/*
				<CollapseBox title="Lease particulars" collapsed={true}>
				    <AutoForm item={facility} schema={schema} form={['lease']}/>
				</CollapseBox>
				<CollapseBox title="Building areas" collapsed={true}>
					<FacilityAreas item={facility}/>
				</CollapseBox>
				*/}
				<CollapseBox title="Default services & suppliers" collapsed={true}>
					<ServicesSelector item={facility} field={"servicesRequired"}/>
				</CollapseBox>
			</div>
		)
	}
});
