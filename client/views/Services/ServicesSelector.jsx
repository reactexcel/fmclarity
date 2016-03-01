ServicesSelector = React.createClass({

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

	save() {
		var item = this.props.item;
		item.services = this.state.services;
		item.save();
	},

	/*
    componentWillMount: function() {
        this.save = _.debounce(this.save,2000);
    },
	*/
	updateServiceField(serviceNum,field,value) {
		var services = this.state.services;
		services[serviceNum][field] = value;
		this.setState({
			services:services
		});
		this.save();
	},

	updateSubServiceField(serviceNum,subServiceNum,field,value) {
		var services = this.state.services;
		if(!services[serviceNum].children[subServiceNum]){
			services[serviceNum].children[subServiceNum] = {};
		}
		services[serviceNum].children[subServiceNum][field] = value;
		this.setState({
			services:services
		});
		this.save();
	},

	render() {
		var updateSubServiceField = this.updateSubServiceField;
		var updateServiceField= this.updateServiceField;
		var Switch = AutoInput.switch;
		var Menu = AutoInput.menu;
		var save = this.save;
		return(
			<div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true"> 
				{this.state.services.map(function(service,serviceIndex){
					return (<div key={serviceIndex} className="panel panel-default"> 
						<table className="table">
							<tbody>
								<tr style={{backgroundColor:"#eee"}}>
									<td style={{padding:"0 0 0 5px",width:"220px",fontWeight:"bold"}}>
										<Switch 
											placeholder={service.name} 
											value={service.available}
											onChange={updateServiceField.bind(null,serviceIndex,'available')}
										/>
									</td>
									{/*<td style={{width:"130px",padding:"8px"}}>{
										(service.available&&service.children)?<span>Service cycle</span>:null
									}</td>
									<td style={{padding:"8px"}}>Select contractor</td>*/}
								</tr>
								{(service.available&&service.children)?service.children.map(function(subService,subIndex){
								return (<tr key={subIndex}>
									<td style={{padding:"0 0 0 5px",width:"220px",fontWeight:"normal"}}>
										<Switch 
											placeholder={subService.name} 
											value={subService.available}
											onChange={updateSubServiceField.bind(null,serviceIndex,subIndex,'available')}
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
					</div>)
				})}
			</div>
		)
	}
})