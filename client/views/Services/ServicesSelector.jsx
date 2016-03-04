ServicesSelector = React.createClass({

	showModal() {
		Modal.show({
	        content:<ServicesSelectorModal item={this.props.item}/>
	     })
	},

	render() {
		return <span onClick={this.showModal} className="btn btn-primary">Edit services</span>
	}

})

ServicesSelectorTable = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
        Meteor.subscribe('contractors');
		var team, suppliers;
		team = Session.getSelectedTeam();
		if(team) {
			suppliers = team.getSuppliers();
			console.log(suppliers);
		}
		return {
			team:team,
			suppliers:suppliers
		}
	},


	updateServiceField(field,value) {
		var service = this.props.service;
		service[field] = value;
		this.handleServiceChange();
	},

	updateSubServiceField(subServiceNum,field,value) {
		var service = this.props.service;
		if(!service.children[subServiceNum]){
			service.children[subServiceNum] = {};
		}
		service.children[subServiceNum][field] = value;
		this.handleServiceChange();
	},

	handleServiceChange() {
		this.props.onServiceChange(this.props.service);
	},

	updateServiceName(e) {
		console.log(e);
	},

	updateSupplier(newSupplier) {
		var service = this.props.service;
		service.data = service.data||{};
		service.data.supplier = newSupplier;
		this.handleServiceChange();
	},

	render() {

		var component = this;
		var service = this.props.service;
		var Switch = AutoInput.switch;

		return (
			<table className="table">
				<tbody>
					<tr>
						<td>
							<AutoInput.mdtext
								placeholder="Service name"
    	                        value={service.name} 
	                            onChange={this.updateServiceName}
							/><br/>
							<SuperSelect 
					            items={this.data.suppliers} 
								itemView={ContactViewName}
					            onChange={this.updateSupplier}
					        >
					            <span>Default supplier</span>
					        </SuperSelect>
					        {!service.data||!service.data.supplier?null:
					            <div style={{clear:"both"}}>{service.data.supplier.name}</div>
					        }
						</td>

					</tr>
					<tr style={{backgroundColor:"#eee"}}>
						<td style={{padding:"0 0 0 5px",width:"220px",fontWeight:"bold"}}>
							<Switch 
								placeholder="Show Sub-Services"
								value={service.hasChildren}
								onChange={component.updateServiceField.bind(component,'hasChildren')}
							/>
						</td>
						{/*<td style={{width:"130px",padding:"8px"}}>{
							(service.available&&service.children)?<span>Service cycle</span>:null
						}</td>
						<td style={{padding:"8px"}}>Select contractor</td>*/}
					</tr>
					{(service.hasChildren&&service.children)?service.children.map(function(subService,subIndex){
					return (<tr key={subIndex}>
						<td style={{padding:"0 0 0 5px",width:"220px",fontWeight:"normal"}}>
							<Switch 
								placeholder={subService.name} 
								value={subService.active}
								onChange={component.updateSubServiceField.bind(component,subIndex,'active')}
							/>
						</td>
						{/*<td style={{width:"130px",padding:"5px"}}>
							<Menu 
								options={Config.cycleNames} 
								onChange={updateSubServiceField.bind(null,serviceIndex,subIndex,'cycle')}
								value={subService.cycle}
							/>
						</td>
						<td style={{padding:"8px"}}></td>*/}
					</tr>)
				}):null}
				</tbody>
			</table>
		)
	}

})

ServicesSelectorModal = React.createClass({

	getInitialState() {
		var services = this.props.item.services||JSON.parse(JSON.stringify(Config.services));
		return {
			services:services
		}
	},

	componentWillReceiveProps(newProps) {
		var services = newProps.item.services||JSON.parse(JSON.stringify(Config.services));
		this.setState({
			services:services
		});
	},

	handleServiceChange(index,service) {
		var services = this.state.services;
		services[index] = service;
		this.setState({
			services:services
		});
		this.props.item.save({
			services:services
		});
	},

	/*
    componentWillMount: function() {
        this.save = _.debounce(this.save,2000);
    },
	*/

	removeService(index) {
		var services = this.state.services;
		services.splice(index,1);
		this.setState({
			services:services
		});
	},

	render() {
		var component = this;
		var updateSubServiceField = this.updateSubServiceField;
		var updateServiceField= this.updateServiceField;
		var Switch = AutoInput.switch;
		var Menu = AutoInput.menu;
		var save = this.save;
		var tabs = [];
		this.state.services.map(function(service,index){
			tabs.push({
				tab:<span className="services-selector-tab">
					<span>{service.name}</span>
					<span className="services-selector-close" onClick={component.removeService.bind(component,index)}>&times;</span>
				</span>,
				content:<ServicesSelectorTable 
					service={service} 
					onServiceChange={component.handleServiceChange.bind(component,index)}
				/>
			})
		});
		return(
			<div className="services-selector">
				<IpsoTabso tabs={tabs}/>
			</div>
		)
	}
})