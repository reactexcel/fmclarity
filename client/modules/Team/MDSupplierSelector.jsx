import React from 'react';
import {ReactMeteorData} from 'meteor/react-meteor-data';

MDSupplierSelector = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		let request = this.props.context,
			supplier = this.props.value,
			facility = null,
			suppliers = null;

		if(request) {
			if(request.facility && request.facility._id) {
				facility = Facilities.findOne(request.facility._id);
				suppliers = facility.getSuppliers();
			}
		}

		return { request, suppliers, supplier }
	},

	render() {
		return <AutoInput.MDSelect 
			items = { this.data.suppliers } 
			disabled = { !this.data.suppliers }
			selectedItem = { this.data.supplier }
			itemView = { ContactCard }
			onChange = { this.props.onChange }
			placeholder = "Supplier"
		/>
	}

})
