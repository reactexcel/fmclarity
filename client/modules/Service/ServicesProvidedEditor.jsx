import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Switch } from 'meteor/fmc:material-inputs';

ServicesProvidedEditor = React.createClass(
{

	getInitialState()
	{
		var item, field, services;
		item = this.props.item;
		field = this.props.field || "services";
		services = item && field ? item[ field ] : [];
		return {
			item: item,
			field: field,
			services: services || [],
			expanded:
			{}
		}
	},

	componentWillReceiveProps( props )
	{
		//only update if the item (facility) being displayed has changed
		//this means the item will fail to refresh if updated by another client
		//a deep comparison could prevent this (if it is deemed worthwhile)
		if ( props.item._id != this.state.item._id )
		{
			var item, field, services;
			item = props.item;
			field = props.field || "services";
			services = item && field ? item[ field ] : [];
			this.setState(
			{
				item: item,
				field: field,
				services: services || [],
				expanded:
				{}
			} );
		}
	},

	componentDidMount()
	{
		this.save = _.debounce( this.save, 1000 );
	},

	save()
	{
		var item = this.state.item;
		var services = this.state.services;
		item.setServicesProvided( services );
		/* or???
		if(this.props.onChange) {
			this.props.onChange(this.state.services);
		}
		*/
	},

	updateService( idx, newValue )
	{
		var services = this.state.services;
		if ( !newValue )
		{
			services.splice( idx, 1 );
		}
		else
		{
			services[ idx ] = newValue;
		}
		this.setState(
		{
			services: services
		} )
		this.save();
	},

	updateSubService( idx, subIdx, newValue )
	{
		var services = this.state.services;
		var service = services[ idx ];
		if ( !newValue )
		{
			service.children.splice( subIdx, 1 );
		}
		else
		{
			service.children[ subIdx ] = newValue;
		}
		services[ idx ] = service;
		this.setState(
		{
			services: services
		} )
		this.save();
	},

	addService()
	{
		var services = this.state.services;
		var lastIndex = services.length - 1;
		var lastService = services[ lastIndex ];
		if ( !lastService || lastService.name.length )
		{
			services.push(
			{
				name: ""
			} );
			this.setState(
			{
				services: services
			} )
			this.save();
		}
	},

	addSubService( idx )
	{
		var services = this.state.services;
		var service = services[ idx ];
		service.children = service.children || [];
		var lastIndex = service.children.length - 1;
		var lastSubService = service.children[ lastIndex ];
		if ( !lastSubService || lastSubService.name.length )
		{
			services[ idx ].children.push(
			{
				name: ""
			} );
			this.setState(
			{
				services: services
			} )
			this.save();
		}
	},

	toggleExpanded( supplierName )
	{
		var expanded = this.state.expanded;
		expanded[ supplierName ] = expanded[ supplierName ] ? false : true;
		this.setState(
		{
			expanded: expanded
		} )
	},

	render()
	{
		var component = this;
		var services = this.state.services;
		var readOnly = false;
		return (
			<div className="services-editor">
				<div className="services-editor-row services-editor-row-header">
					<div className="services-editor-col services-editor-col-header">Service</div>
					<div className="services-editor-col services-editor-col-header"></div>
				</div>
				{services?services.map(function(service,idx){
					var expanded = component.state.expanded[service.name];
					var size = services.length;
					var key = size+'-'+idx;
					return (
						<div key={key} className={expanded?"services-editor-service-expanded":""}>
							<div className="services-editor-row">
								<ServicesProvidedEditorRow
									service={service}
									readOnly={readOnly}
									clickExpand={component.toggleExpanded.bind(component,service.name)}
									onChange={component.updateService.bind(component,idx)}/>
							</div>

							<div className="services-editor-child-block">
								{expanded?
									<div>
										{service.children?service.children.map( (subservice,subIdx) => {
											var size=service.children.length;
											var key = size+'-'+subIdx;
											return (
												<div key={key} className="services-editor-row services-editor-row-child">
													<ServicesProvidedEditorRow
														service={subservice}
														readOnly={readOnly}
														onChange={component.updateSubService.bind(component,idx,subIdx)}/>
												</div>
											)
										}):null}
										{!readOnly?
									    	<div onClick={component.addSubService.bind(component,idx)} className="services-editor-row services-editor-row-child" style={{fontSize:"smaller",fontStyle:"italic"}}>
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
				    <div onClick={this.addService} className="services-editor-row" style={{fontStyle:"italic"}}>
						<span style={{position:"absolute",left:"15px",top:"15px"}}><i className="fa fa-plus"></i></span>
					    <span style={{position:"absolute",left:"48px",top:"15px"}} className="active-link">Add service</span>
					</div>
				:null}
			</div>
		)
	}
} )

ServicesProvidedEditorRow = React.createClass(
{

	updateServiceName( event )
	{
		var service = this.props.service;
		var newValue = event.target.value;
		service.name = newValue;
		if ( this.props.onChange )
		{
			this.props.onChange( service );
		}
	},

	toggleActive( value )
	{
		var service = this.props.service;
		var newValue = value;
		service.active = newValue;
		if ( this.props.onChange )
		{
			this.props.onChange( service );
		}
	},

	render()
	{
		service = this.props.service;
		clickExpand = this.props.clickExpand;
		var onChange = this.props.onChange;
		readOnly = this.props.readOnly;
		return (
			<div>
				<div className="services-editor-col services-editor-col-service">
					{clickExpand?<span onClick={clickExpand} className="services-editor-expand-icon"><i className="fa fmc-fa-icon-expand"></i></span>:null}

		    		<input
		    			defaultValue={service.name||undefined}
		    			readOnly={readOnly}
		    			onChange={this.updateServiceName}/>

			    	{!readOnly?<span className="services-editor-delete-icon" onClick={onChange.bind(null,null)}>&times;</span>:null}
				</div>
				<div className="services-editor-col services-editor-col-supplier" style={{padding:"10px"}}>
					<Switch value={service.active} onChange={this.toggleActive}>
						<b>Active</b>
					</Switch>
				</div>
			</div>
		)
	}
} )
