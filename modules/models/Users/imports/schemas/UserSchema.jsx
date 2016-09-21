/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

/**
 * @memberOf 		module:models/Users
 */
const UserSchema = {
	teams: {
		label: "Teams",
		description: "Teams this user is a member of",
		relation: {
			type: ORM.OneToMany,
			source: "Teams",
			key: "members._id"
		}
	}
}

export default UserSchema;
