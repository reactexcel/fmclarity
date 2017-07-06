import { Text } from '/modules/ui/MaterialInputs';

export default IncidentCommentSchema = {

	where: {
		input: Text,
		label: "How and where are they being treated (if applicable)?",
		type: "string"
	},
	action: {
		input: Text,
		type: "string",
		label: "What has/is being done?",
		size: 6
	},
	furtherAction: {
		input: Text,
		label: "Further action required",
		size: 6,
		type: "string",
	}
}
