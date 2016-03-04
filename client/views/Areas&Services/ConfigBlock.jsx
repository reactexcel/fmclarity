ConfigBlock = React.createClass({


	updateField(field,value) {
		var item = this.props.item;
		item[field] = value;
		this.handleChange();
	},

	updateChildField(idx,field,value) {
		var item = this.props.item;
		if(!item.children[idx]){
			item.children[idx] = {};
		}
		item.children[idx][field] = value;
		this.handleChange();
	},

	handleChange() {
		this.props.onChange(this.props.item);
	},

	render() {

		var component = this;
		var item = this.props.item;
		var Switch = AutoInput.switch;
		var supplier = item&&item.data?item.data.supplier:null;

		return (
			<div>
				{this.props.children}
				<div className="row">
					<div className="col-md-12">
						<Switch 
							value={item.active}
							onChange={component.updateField.bind(component,'active')}
						>
							<b>Active</b>
						</Switch>
					</div>
				</div>
				<div className="row" style={{backgroundColor:"#eee"}}>
					<div className="col-md-12">
						<Switch 
							value={item.hasChildren}
							onChange={component.updateField.bind(component,'hasChildren')}
						>
							<b>Show details</b>
						</Switch>
					</div>
				</div>
				<table className="table table-responsive" style={{marginBottom:0}}>
					<tbody>					
						{(item.hasChildren&&item.children)?item.children.map(function(child,idx){
						return (<tr key={idx}>
							<td style={{padding:0,width:"220px",fontWeight:"normal"}}>
								<Switch 
									value={child.active}
									onChange={component.updateChildField.bind(component,idx,'active')}
								>
									<span style={{display:"inline-block",width:"200px"}}>
										<AutoInput.Text
											className="inline-form-control" 
											value={child.name}
											onChange={component.updateChildField.bind(component,idx,'name')}
										/>
									</span>
								</Switch>
							</td>
						</tr>)
					}):null}
					</tbody>
				</table>
			</div>
		)
	}
})

ConfigBlockModal = React.createClass({

	getInitialState() {
		var field = this.props.field;
		var items = this.props.item[field];
		return {
			items:items
		}
	},

	componentWillReceiveProps(newProps) {
		var field = newProps.field;
		var items = newProps.item[field];
		this.setState({
			items:items
		});
	},

	updateItem(index,item) {
		var items = this.state.items;
		items[index] = item;
		this.setState({
			items:items
		});
		this.save(items);
	},

	removeItem(index) {
		var items = this.state.items;
		items.splice(index,1);
		this.setState({
			items:items
		});
		this.save(items);
	},

	save() {
		var field = this.props.field;
		var items = this.props.item[field];
		var obj = {};
		obj[field] = items;
		this.props.item.save(obj);
	},

	render() {
		var component = this;
		var tabs = [];
		var DetailComponent = this.props.view;
		this.state.items.map(function(item,index){
			tabs.push({
				tab:<span className="items-selector-tab">
					<span style={{opacity:!item.active?0.6:1}}>{item.name}</span>
					<span className="items-selector-close" onClick={component.removeItem.bind(component,index)}>&times;</span>
				</span>,
				content:<div style={{padding:"15px",paddingBottom:0}}>
					<ConfigBlock 
						item={item} 
						onChange={component.updateItem.bind(component,index)}
					>
						{DetailComponent?<DetailComponent
							item={item} 
							onChange={component.updateItem.bind(component,index)}
						/>:null}
					</ConfigBlock>
				</div>
			})
		});
		return(
			<div className="items-selector">
				<IpsoTabso tabs={tabs}/>
			</div>
		)
	}
})
