import React from 'react';
import { Text, Select, DateInput } from '/modules/ui/MaterialInputs';

let period = null;
export default RequestFrequencySchema = {
	unit: {
	    label: "Frequency",
	    description: "The unit (days, weeks, months etc) of the repeats",
		input( props ) {
	        return (
	            <Select
	      			placeholder={props.placeholder}
	      			item={props.item}
	      			items={props.items}
	      			value={props.value}
	      			onChange={ item => props.onChange(item) }
	    		/>
	        );
	    },
	    defaultValue: "months",
	    type: "string",
	    size: 6,
	    options: {
	        items: [
	            { name: 'Daily', val: "days" },
	            { name: 'Weekly', val: "weeks" },
	            { name: 'Fortnightly', val: "fortnights" },
	            { name: 'Monthly', val: "months" },
	            { name: 'Quarterly', val: "quarters" },
	            { name: 'Annually', val: "years" },
	            { name: 'Custom', val: "custom" },
	        ],
			afterChange( item ){
				item.number = 1;
				item.repeats = 10;
				item.period = "";
				item.endDate = "";
			}
	    },
	},

	number: {
	    label: "Repeats every...",
	    description: "The number of days, weeks, months etc.",
	    input: Text,
	    type: "number",
	    size: 6,
	    options: {
	        afterChange( item ) {
	            number = item.number;
	        }
	    },
		condition: item => item.unit === "custom" ,
	},

	period: {
		label: "Period",
		description: "The unit (days, weeks, months etc) of the repeats",
		input(props){
			props.item.period = props.value?props.value:(props.item.unit === "custom"?"monthly":"");
 			return(
				<Select
					placeholder={props.placeholder}
		        	item={props.item}
		        	items={props.items}
		        	value={props.value?props.value:"monthly"}
		        	onChange={ item => props.onChange(item) } />
			)
		},
		defaultValue: "months",
		type: "string",
		size: 6,
		options: {
			items: [
				{ name: 'Day', val: "days" },
	            { name: 'Week', val: "weeks" },
	            { name: 'Fortnight', val: "fortnights" },
	            { name: 'Month', val: "months" },
	            { name: 'Quarter', val: "quarters" },
	            { name: 'Year', val: "years" },
			],
			afterChange: item => { period = item.period; },
		},
		condition: item => item.unit === "custom",
	},


	endDate: {
	    label: 'End date',
	    size: 6,
	    input: DateInput,
	    condition: item => item.unit === "custom",
	}
}


// repeats: {
// 	label: "Repeats",
// 	description: "The number of times this item should happen",
// 	input: Text,
// 	type: "number",
// 	defaultValue: 6,
// 	size: 6
// },
// number: {
// 	label: "Frequency (number)",
// 	description: "The number of days, weeks, months etc between repeats",
// 	input: Text,
// 	type: "number",
// 	defaultValue: 6,
// 	size: 6
// },
// unit: {
// 	label: "Frequency (unit)",
// 	description: "The unit (days, weeks, months etc) of the repeats",
// 	input: Select,
// 	defaultValue: "months",
// 	type: "string",
// 	size: 6,
// 	options: {
// 		items: [
// 			"days",
// 			"weeks",
// 			"months",
// 			"years",
// 		]
// 	}
// }
