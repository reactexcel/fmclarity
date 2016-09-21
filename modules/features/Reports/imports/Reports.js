// can we include all login functionality in this package?
// including the login forms and the rest?

FMCReports = {}

export default Reports = {
	dict:
	{},
	register: function( data )
	{
		this.dict[ data.id ] = data;
	},
	get: function( data )
	{
		return this.dict[ data.id ];
	},
	getAll: function()
	{
		return this.dict;
	}
}
