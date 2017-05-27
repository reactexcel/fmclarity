import { FileExplorer } from '/modules/models/Files';


import { Text, TextArea, Select, DateInput, Currency, Switch } from '/modules/ui/MaterialInputs';
import { Facilities, FacilityListTile } from '/modules/models/Facilities';
import { Requests } from '/modules/models/Requests';

import { ContactCard } from '/modules/mixins/Members';

import React from 'react';

export default ReportSchema = {
	comment: {
		label: "Comment",
		optional: true,
		type: "string",
		input: TextArea
	},
	facility: {
		label: "Facility",
		optional: true,
		description: "The site for this job",
		type: "object",
		size: 12,
		input: Select,
		defaultValue: ( item ) =>{
				return Session.getSelectedFacility();
		},
		options: ( item ) => {
			//console.log( item );
			let team = Session.getSelectedTeam();
			return {
				items: ( team && team.getFacilities ? team.getFacilities() : null ),
				view: FacilityListTile
			}
		},
	},
}
