import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


ServicesSelector = React.createClass({
	//this is stupid - save should be hosted here instead

	mixins:[ReactMeteorData],

	getMeteorData() {
        Meteor.subscribe('contractors');
		var team, suppliers;
		team = Session.getSelectedTeam();
		if(team) {
			suppliers = team.getSuppliers();
		}
		return {
			team:team,
			suppliers:suppliers,
			field:(this.props.field||"services")
		}
	},

	showModal() {
		var field = this.data.field;
		Modal.show({
	        content:<ConfigBlockModal 
	        	item={this.props.item}
	        	field={field}
	        	view={ServiceDetail}
	        />
	     })
	},

	updateSupplier(idx,newSupplier) {
		var field = this.data.field;
		var service = this.props.item[field][idx];
		service.data = service.data||{};
		if(newSupplier) {
			service.data.supplier = {
				_id:newSupplier._id,
				name:newSupplier.getName()
			}
		}
		else {
			service.data.supplier = {};
		}
		this.props.item.save();
		//this.props.onChange(service);
	},

	render() {
		var field = this.data.field;
		var services = this.props.item[field];
		var component = this;
		return (
			<div>
				<table className="table" style={{marginBottom:0}}>
					<tbody>
					<tr>
						<th style={{width:"50%"}}>Service</th>
						<th style={{width:"50%"}}>Default Supplier</th>
					</tr>
					{services?services.map(function(service,idx){
						if(service&&service.active) {
							return (
								<tr key={idx}>
									<td style={{padding:"10px"}}>{service.name}</td>
									<td style={{padding:0}}><AutoInput.MDSelect 
										items={component.data.suppliers} 
										selectedItem={service.data?service.data.supplier:null}
										itemView={ContactViewName}
										onChange={component.updateSupplier.bind(component,idx)}
										placeholder="Default Supplier"
									/></td>
									{/*<td>{service.data&&service.data.supplier?service.data.supplier.name:null}</td>*/}
								</tr>
							)
						}
					}):null}
					</tbody>
				</table>
				<span onClick={this.showModal} className="btn btn-primary">Edit services</span>
			</div>
		)
	}
})

ServiceDetail = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
        Meteor.subscribe('contractors');
		var team, suppliers;
		team = Session.getSelectedTeam();
		if(team) {
			suppliers = team.getSuppliers();
		}
		return {
			team:team,
			suppliers:suppliers
		}
	},

	updateField(field,value) {
		var service = this.props.item;
		service[field] = value;
		this.props.onChange(service);
	},

	updateSupplier(newSupplier) {
		if(newSupplier) {
			var service = this.props.item;
			service.data = service.data||{};
			service.data.supplier = {
				_id:newSupplier._id,
				name:newSupplier.getName()
			}
			this.props.onChange(service);
		}
		else this.props.onChange(null);
	},

	componentWillMount() {
		this.autoSelect = true;
	},

	render() {
		var item = this.props.item;
		var Switch = AutoInput.switch;
		var supplier = item&&item.data?item.data.supplier:null;
		var service = this.props.item;
		var autoSelect = this.autoSelect;
		this.autoSelect = false;
		return (
			<div>
				<div className="row">
					<div className="col-md-6">
						<AutoInput.mdtext
							placeholder="Service name"
					    	value={service.name} 
					    	autoSelect={autoSelect}
						    onChange={this.updateField.bind(this,'name')}
						/>
					</div>
					<div className="col-md-6">
						<AutoInput.MDSelect 
							items={this.data.suppliers} 
							selectedItem={service.data?service.data.supplier:null}
							itemView={ContactViewName}
							onChange={this.updateSupplier}
							placeholder="Default Supplier"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<Switch 
							value={item.active}
							onChange={this.updateField.bind(this,'active')}
						>
							<b>Active</b>
						</Switch>
					</div>
				</div>
				<div className="row" style={{backgroundColor:"#eee"}}>
					<div className="col-md-12">
						<Switch 
							value={item.hasChildren}
							onChange={this.updateField.bind(this,'hasChildren')}
						>
							<b>Show details</b>
						</Switch>
					</div>
				</div>
			</div>
		)
	}
})