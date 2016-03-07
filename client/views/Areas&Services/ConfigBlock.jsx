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

	insertChildAfter(idx,value) {
		this.props.item.children.splice(idx+1,0,{
			active:true
		});
		this.lastChild = idx+1;
		this.handleChange();
	},

	removeChild(idx) {
		this.props.item.children.splice(idx,1);
		this.lastChild = idx-1;
		this.handleChange();
	},

	handleChange() {
		this.props.onChange(this.props.item);
	},

	render() {

		var component = this;
		var item = this.props.item;
		var Switch = AutoInput.switch;
		var lastChild = this.lastChild;
		this.lastChild = null;

		return (
			<div>
				{this.props.children}
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
											autoFocus={idx==lastChild}
											onChange={component.updateChildField.bind(component,idx,'name')}
											onEnter={component.insertChildAfter.bind(component,idx)}
											onClear={component.removeChild.bind(component,idx)}
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

	addItem() {
		var items = this.state.items;
		items.push({
			name:"New item",
			active:true,
			hasChildren:true,
			data:{},
			children:[{
				active:true
			}]
		});
		this.setState({
			items:items
		});
		this.save(items);
		return items.length-1;	
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
		tabs.push({
			tab:<span style={{color:"#aaa"}} className="items-selector-tab"><i>New</i></span>,
			onClick:component.addItem
		})
		return(
			<div className="items-selector">
				<IpsoTabso tabs={tabs}/>
			</div>
		)
	}
})
