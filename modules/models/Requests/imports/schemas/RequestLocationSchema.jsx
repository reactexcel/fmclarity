import * as Input from '/modules/ui/MaterialInputs';

export default RequestLocationSchema = {
	area: {
		input: Input.Select,
		size: 4,
		options: function( item ) {
			return {
				items: item.facility ? item.facility.areas : null,
				view: NameCard
			}
		}
	},
	subarea: {
		input: Input.Select,
		size: 4,
		options: function( item ) {
			return {
				items: item.location && item.location.area ? item.location.area.children : null,
				view: NameCard
			}
		}
	},
	identifier: {
		input: Input.Select,
		size: 4,
		options: function( item ) {
			return {
				items: item.location && item.location.subarea ? item.location.subarea.children : null,
				view: NameCard
			}
		}
	}
}
