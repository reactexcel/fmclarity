ServicesSelector = React.createClass({
	//this is stupid - save should be hosted here instead
	showModal() {
		Modal.show({
	        content:<ConfigBlockModal 
	        	item={this.props.item}
	        	field="services"
	        	view={ServiceDetail}
	        />
	     })
	},

	render() {
		var services = this.props.item.services;
		return (
			<div onClick={this.showModal}>
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
				</table>
				<span className="btn btn-primary pull-right">Edit services</span>
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
	},

	render() {
		var service = this.props.item;
		return (
			<div className="row">
				<div className="col-md-6">
					<AutoInput.mdtext
						placeholder="Service name"
				    	value={service.name} 
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
		)
	}
})