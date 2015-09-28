ContractCardTableHeader = React.createClass({

	render() {
		return (
			<div className="card-table-header contract-card-table-header">
				<div className="contract-card-col contract-card-service-col">
					Service
				</div>
				<div className="contract-card-col contract-card-supplier-col">
					Supplier
				</div>
				<div className="contract-card-col contract-card-commencement-col">
					Commencement
				</div>
				<div className="contract-card-col contract-card-expiry-col">
					Expiry
				</div>
				<div className="contract-card-col contract-card-amount-col">
					{_.map(this.props.item.amount,function(val,key){
						return <div className="contract-card-col contract-card-amount-subcol">$ - {key}</div>
					})}
				</div>
				<div className="contract-card-col contract-card-supplierexecuted-col">
					Supplier Executed
				</div>
				<div className="contract-card-col contract-card-clientexecuted-col">
					Client Executed
				</div>
			</div>
		)
	}

});

ContractCardHeader = React.createClass({

	render() {
		var contract = this.props.item;
		var service = contract.service;
		var supplier = contract.supplier;
		var facility = contract.facility;
		var amount = contract.amount || {};
		return (
			<div className="card-header">
				<div className="contract-card-col contract-card-service-col">
					{service.name}
				</div>
				<div className="contract-card-col contract-card-supplier-col">
					<a href="#">{supplier.name}</a>
				</div>
				<div className="contract-card-col contract-card-commencement-col">
					{contract.commencement}
				</div>
				<div className="contract-card-col contract-card-expiry-col">
					{contract.expiry}
				</div>
				<div className="contract-card-col contract-card-amount-col">
					{_.map(amount,function(val,key){
						return <div className="contract-card-col contract-card-amount-subcol">{val}</div>
					})}
				</div>
				<div className="contract-card-col contract-card-supplierexecuted-col">
					<input type="checkbox" checked={contract.supplierExecuted}/>
				</div>
				<div className="contract-card-col contract-card-clientexecuted-col">
					<input type="checkbox" checked={contract.clientExecuted}/>
				</div>
			</div>
		)
	}
});

ContractCardBody = React.createClass({

	render() {
		var contract = this.props.item;
		var service = contract.service;
		var supplier = contract.supplier;
		var facility = contract.facility;
		var amount = contract.amount || {};
		return (
			<div className="card-body">
			</div>
		)
	}
});

ContractCard = React.createClass({

	render() {
		return (
			<div className="card">
				<ContractCardHeader item={this.props.item}/>
				<ContractCardBody item={this.props.item}/>
			</div>
		)
	}

});
