/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import Facilities from './imports/Facilities.jsx';
import AddressSchema from './imports/schemas/AddressSchema.jsx';
import BillingAddressSchema from './imports/schemas/AddressSchema.jsx';
import ServiceDetailsSchema from './imports/schemas/ServiceDetailsSchema.jsx';
import AreaDetailsSchema from './imports/schemas/AreaDetailsSchema.jsx';

import FacilityFilter from './imports/components/FacilityFilter.jsx';
import FacilityStepper from './imports/components/FacilityStepper.jsx';
import FacilityStepperContainer from './imports/containers/FacilityStepperContainer.jsx';
import FacilityDetails from './imports/components/FacilityDetails.jsx';
import FacilityListTile from './imports/components/FacilityListTile.jsx';
import CreateSupplierFacility from './imports/components/CreateSupplierFacility.jsx';
import PropertyManagerDetails from './imports/components/PropertyManagerDetails.jsx';
import BillingAddressDetails from './imports/components/BillingAddressDetails.jsx';

import FacilityActions from './actions.jsx'

/**
 * @module 			models/Facilities
 */
export {
	Facilities,
	AddressSchema,
	BillingAddressSchema,
	ServiceDetailsSchema,
	AreaDetailsSchema,
	BillingAddressDetails,
	FacilityFilter,
	FacilityDetails,
	FacilityStepper,
	FacilityStepperContainer,
	FacilityListTile,
	CreateSupplierFacility,
	PropertyManagerDetails,

	FacilityActions
}
