UserSchema = {
	teams:
	{
		label: "Teams",
		description: "Teams this user is a member of",
		relation:
		{
			type: ORM.OneToMany,
			source: "Teams",
			key: "members._id"
		}
	}
}
