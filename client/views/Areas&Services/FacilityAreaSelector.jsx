FacilityAreas = React.createClass({
	//this is stupid - save should be hosted here instead
	showModal() {
		Modal.show({
	        content:<ConfigBlockModal 
	        	item={this.props.item}
	        	field="areas"
	        	view={AreaDetail}
	        />
	     })
	},

	render() {
		var services = this.props.item.services;
		return (
			<div onClick={this.showModal}>
				{/*}
				<table className="table" style={{marginBottom:0}}>
					<tbody>
					{services?services.map(function(service,idx){
						if(service.active) {
							return (
								<tr key={idx}>
									<th>{service.name}</th>
									<td>{service.data&&service.data.supplier?service.data.supplier.name:null}</td>
								</tr>
							)
						}
					}):null}
					</tbody>
				</table>*/}
				<span className="btn btn-primary">Edit areas</span>
			</div>
		)
		
	}

})

AreaDetail = React.createClass({

	updateField(field,value) {
		var item = this.props.item;
		item[field] = value;
		this.props.onChange(item);
	},

	componentWillMount() {
		this.autoSelect = true;
	},

	render() {
		var item = this.props.item;
		var autoSelect = this.autoSelect;
		this.autoSelect = false;
		return (
			<div>
				<div className="row">
					<div className="col-md-6">
						<AutoInput.mdtext
							placeholder="Area name"
					    	value={item.name} 
					    	autoSelect={autoSelect}
						    onChange={this.updateField.bind(this,'name')}
						/>
					</div>
				</div>
			</div>
		)
	}
})

FacilityAreaRow = React.createClass({
	render() {
		var area = this.props.area;
		var deleteArea = this.props.delete;
		var updateField = this.props.update;
		var Menu = AutoInput.menu;
		return (
			<tr>
				<td style={{width:"30px"}}>
					<AutoInput.Text 
						value={area.number}
						onChange={updateField.bind(null,'number')}
					/>
				</td>
				<td style={{padding:"5px 0",width:"60%"}}>
					<Menu 
						options={Config.areaNames} 
						onChange={updateField.bind(null,'name')}
						value={area.name}
					/>
				</td>
				<td style={{padding:"5px"}}>
					<Menu 
						options={["","North","South","East","West"]} 
						onChange={updateField.bind(null,'location')}
						value={area.location}
					/>
				</td>
				<td className="actions" style={{width:"30px"}}>
					<span 
						onClick={deleteArea}
					>
						<i className="fa fa-times"></i>
					</span>
				</td>
			</tr>
		)
	}
})


FacilityAreasOld = React.createClass({

	getInitialState() {
		return {
			areaGroups:this.props.item.areas
		}
	},

	componentWillReceiveProps(newProps) {
		this.setState({
			areaGroups:newProps.item.areas
		});
	},

	save() {
		var item = this.props.item;
		item.areas = this.state.areaGroups;
		item.save();
	},

    componentWillMount: function() {
        this.save = _.debounce(this.save,2000);
    },

	updateGroupField(groupNum,field,value) {
		var areaGroups = this.state.areaGroups;
		areaGroups[groupNum][field] = value;
		this.setState({
			areaGroups:areaGroups
		});
		this.save();
	},

	updateAreaField(groupNum,areaNum,field,value) {
		var areaGroups = this.state.areaGroups;
		if(!areaGroups[groupNum].areas[areaNum]){
			areaGroups[groupNum].areas[areaNum] = {};
		}
		areaGroups[groupNum].areas[areaNum][field] = value;
		this.setState({
			areaGroups:areaGroups
		});
		this.save();
	},

	deleteArea(groupNum,areaNum) {
		var areaGroups = this.state.areaGroups;
		areaGroups[groupNum].areas.splice(areaNum,1);		
		this.setState({
			areaGroups:areaGroups
		});
		this.save();
	},

	render () {
		var deleteArea = this.deleteArea;
		var updateAreaField = this.updateAreaField;
		var updateGroupField = this.updateGroupField;
		var areaGroups = this.state.areaGroups;
		var Menu = AutoInput.menu;
		return (
			<div className="panel-group"> 
				{areaGroups.map(function(group,groupNum){
					return (<div key={groupNum} className="panel panel-default"> 
					<div className="panel-heading" role="tab">
						<h4 className="panel-title">
							<span style={{width:"70%",display:"inline-block"}}>
								<AutoInput.Text 
									onChange={updateGroupField.bind(null,groupNum,'name')}
									value={group.name}
								/>
							</span>
							<span style={{float:"right",width:"30px",paddingLeft:"10px"}}>
								<AutoInput.Text
									onChange={updateGroupField.bind(null,groupNum,'number')}
									value={group.number}
								/>
							</span>
							<b>Number like this</b>
						</h4>
					</div>
					<div >
						<table className="table" style={{margin:0}}>
							<tbody>
							{group.areas.map(function(area,areaNum){
								return (
									<FacilityAreaRow
										key={areaNum}
										area={area}
										delete={deleteArea.bind(null,groupNum,areaNum)}
										update={updateAreaField.bind(null,groupNum,areaNum)}
									/>
								)
							})}
							<FacilityAreaRow
								key={group.areas.length}
								area={{}}
								delete={deleteArea.bind(null,groupNum,group.areas.length)}
								update={updateAreaField.bind(null,groupNum,group.areas.length)}
							/>
							</tbody>
						</table>
					</div>
				</div>)
				})}
			</div>
		)
	}
})