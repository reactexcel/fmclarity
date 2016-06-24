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
			services:services||[],
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
				services:services||[],
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
		var facility = this.state.item;
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
					var size = services.length;
					var key = size+'-'+idx;
					return (
						<div key={key} className={expanded?"services-editor-service-expanded":""}>
							<div className="row services-editor-row">
								<ServiceSupplierRow
									facility={facility}
									service={service}
									readOnly={readOnly}
									clickExpand={component.toggleExpanded.bind(component,service.name)}
									onChange={component.updateService.bind(component,idx)}/>
							</div>

							<div className="services-editor-child-block">
								{expanded?
									<div>
										{service.children?service.children.map(function(subservice,subIdx){
											var size=service.children.length;
											var key = size+'-'+subIdx;
											return (
												<div key={key} className="row services-editor-row services-editor-row-child">
													<ServiceSupplierRow
														facility={facility}
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
			//should be this.props.facility.addSupplier(supplier,{service:foo,subservice:bar})
			this.props.facility.addSupplier(supplier); 
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

