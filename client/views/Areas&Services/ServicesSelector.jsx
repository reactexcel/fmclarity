import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

ServicesSelector = React.createClass({

	getInitialState() {
		var item,field,services;
		item = this.props.item;
		field = this.props.field||"servicesRequired";
		services = item&&field?item[field]:[];
		return {
			item:item,
			field:field,
			services:services,
			expanded:{}
		}
	},

	componentWillReceiveProps(props) {
		//only update if the item (facility) being displayed has changed
		//this means the item will fail to refresh if updated by another client
		//a deep comparison could prevent this (if it is deemed worthwhile)
		if(props.item._id!=this.state.item._id) {
			var item,field,services;
			item = props.item;
			field = props.field||"servicesRequired";
			services = item&&field?item[field]:[];
			this.setState({
				item:item,
				field:field,
				services:services,
				expanded:{}
			});
		}
	},

	componentDidMount(){
		this.save = _.debounce(this.save,1000);
	},

	save() {
		var item = this.state.item;
		var services = this.state.services;
		item.setServicesRequired(services);
		/* or???
		if(this.props.onChange) {
			this.props.onChange(this.state.services);
		}
		*/
	},

	updateService(idx,newValue) {
		var services = this.state.services;
		if(!newValue) {
			services.splice(idx,1);
		}
		else {
			services[idx] = newValue;
		}
		this.setState({
			services:services
		})
		this.save();
	},

	updateSubService(idx,subIdx,newValue) {
		var services = this.state.services;
		var service = services[idx];
		if(!newValue) {
			service.children.splice(subIdx,1);
		}
		else {
			service.children[subIdx] = newValue;
		}
		services[idx] = service;
		this.setState({
			services:services
		})
		this.save();
	},

	addService() {
		var services = this.state.services;
		var lastIndex = services.length-1;
		var lastService = services[lastIndex];
		if(!lastService||lastService.name.length) {
			services.push({name:""});
			this.setState({
				services:services
			})
			this.save();
		}
	},

	addSubService(idx) {
		var services = this.state.services;
		var service = services[idx];
		service.children = service.children||[];
		var lastIndex = service.children.length-1;
		var lastSubService = service.children[lastIndex];
		if(!lastSubService||lastSubService.name.length) {
			services[idx].children.push({name:""});
			this.setState({
				services:services
			})
			this.save();
		}
	},

	toggleExpanded(supplierName) {
		var expanded = this.state.expanded;
		expanded[supplierName] = expanded[supplierName]?false:true;
		this.setState({
			expanded:expanded
		})
	},

	render() {
		var component = this;
		var services = this.state.services;
		var Menu = AutoInput.MDDataTableMenu;
		var readOnly = false;
		return (
			<div className="services-editor">
				<div className="row services-editor-row services-editor-row-header">
					<div className="services-editor-col services-editor-col-header col-md-6">Service</div>
					<div className="services-editor-col services-editor-col-header col-md-6">Supplier</div>
				</div>
				{services?services.map(function(service,idx){
					var expanded = component.state.expanded[service.name];
					return (
						<div key={idx} className={expanded?"services-editor-service-expanded":""}>
							<div className="row services-editor-row">
								<ServiceSupplierRow
									service={service}
									readOnly={readOnly}
									clickExpand={component.toggleExpanded.bind(component,service.name)}
									onChange={component.updateService.bind(component,idx)}/>
							</div>

							<div className="services-editor-child-block">
								{expanded?
									<div>
										{service.children?service.children.map(function(subservice,subIdx){
											return (
												<div className="row services-editor-row services-editor-row-child" key={subIdx}>
													<ServiceSupplierRow
														service={subservice}
														readOnly={readOnly}
														onChange={component.updateSubService.bind(component,idx,subIdx)}/>
												</div>
											)
										}):null}
										{!readOnly?
									    	<div onClick={component.addSubService.bind(component,idx)} className="row services-editor-row services-editor-row-child" style={{fontSize:"smaller",fontStyle:"italic"}}>
												<span style={{position:"absolute",left:"15px",top:"15px"}}><i className="fa fa-plus"></i></span>
											    <span style={{position:"absolute",left:"48px",top:"15px"}} className="active-link">Add subservice</span>
										    </div>
										:null}
									</div>
								:null}
							</div>
						</div>
					)
				}):null}
				{!readOnly?
				    <div onClick={this.addService} className="row services-editor-row" style={{fontStyle:"italic"}}>
						<span style={{position:"absolute",left:"15px",top:"15px"}}><i className="fa fa-plus"></i></span>
					    <span style={{position:"absolute",left:"48px",top:"15px"}} className="active-link">Add service</span>
					</div>
				:null}
			</div>
		)
	}
})

ServiceSupplierRow = React.createClass({

	mixins: [ReactMeteorData],

    getMeteorData() {
    	var service,supplier;
    	service = this.props.service;
    	if(service.data&&service.data.supplier) {
    		var q = service.data.supplier;
    		if(q._id) {
    			supplier = Teams.findOne(q._id);
    		}
    		else if(q.name) {
    			supplier = Teams.findOne({name:q.name});
    		}
    	}
    	return {
    		service:service,
    		supplier:supplier
    	}
    },

	updateSupplier(supplier,event) {
		if(event) {
			event.stopPropagation();
		}
		var service = this.data.service;
		if(supplier) {
			//I tend to think this would be better as
			//facility.setServiceSupplier(service,supplier)
			//called through the callback below
			service.data = service.data||{};
			service.data.supplier = {
				_id:supplier._id,
				name:supplier.name
			}
		}
		else {
			service.data.supplier = null;
		}
		if(this.props.onChange) {
			this.props.onChange(service);
		}
	},

	updateServiceName(event) {
		var service = this.data.service;
		var newValue = event.target.value;
		service.name = newValue;
		if(this.props.onChange) {
			this.props.onChange(service);
		}
	},

    showSupplierModal(supplier) {
    	var facility = Session.getSelectedFacility();
        Modal.show({
            content:<TeamViewEdit item={supplier} facility={facility} onChange={this.updateSupplier}/>
        })
    },

	render() {
		service = this.data.service;
		supplier = this.data.supplier;
		clickExpand = this.props.clickExpand;
		var onChange = this.props.onChange;
		readOnly = this.props.readOnly;
		return (
			<div>
				<div className="services-editor-col services-editor-col-service col-md-6">
					{clickExpand?<span onClick={clickExpand} className="services-editor-expand-icon"><i className="fa fmc-fa-icon-expand"></i></span>:null}

		    		<input
		    			defaultValue={service.name||undefined}
		    			readOnly={readOnly}
		    			onChange={this.updateServiceName}/>

			    	{!readOnly?<span className="services-editor-delete-icon" onClick={onChange.bind(null,null)}>&times;</span>:null}
				</div>
				<div className="services-editor-col services-editor-col-supplier col-md-6" onClick={this.showSupplierModal.bind(this,supplier)}>
					{supplier?
						<ContactCard item={supplier}/>
					:
						null
					}
			    	{!readOnly?<span className="services-editor-delete-icon" onClick={this.updateSupplier.bind(this,null)}>&times;</span>:null}
				</div>
			</div>
		)
	}
})

OldServicesSelector = React.createClass({
	//this is stupid - save should be hosted here instead

	mixins:[ReactMeteorData],

	getMeteorData() {
        Meteor.subscribe('contractors');
		var suppliers, item;
		item = this.props.item;
		if(item&&item.getSuppliers) {
			suppliers = item.getSuppliers();
		}
		return {
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
	        	view={ServiceDetail}/>
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
				<div style={{textAlign:"left"}}>
					<span onClick={this.showModal} className="btn btn-flat btn-primary">Edit services</span>
				</div>
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