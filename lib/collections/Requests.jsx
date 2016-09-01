import '../schemas/RequestSchema.jsx';

Issues = ORM.Collection( "Issues", IssueSchema );

Issues.save = function( id, obj, callback )
{
	return Meteor.call( 'Issues.save', id, obj, callback )
}

Issues.mixins( [
	DocMessages.config(
	{
		helpers:
		{
			getInboxName: function()
			{
				return "work order #" + this.code + ' "' + this.getName() + '"';
			},
			getWatchers: function()
			{
				var user, owner, team, supplier, assignee;

				user = Meteor.user();
				owner = this.getOwner();

				//don't include suppliers and assignees if draft or new
				//is this deprecated?
				if ( this.status != Issues.STATUS_DRAFT )
				{
					team = this.getTeam();
					if ( this.status != Issues.STATUS_NEW )
					{
						supplier = this.getSupplier();
						assignee = this.getAssignee();
					}
				}
				return [ user, owner, supplier, team, assignee ];
			}
		}
	} ),
	DocMembers.config(
	{
		authentication: function( role, user, request )
		{
			return (
				AuthHelpers.memberOfRelatedTeam( role, user, request ) ||
				AuthHelpers.managerOfSuppliersTeam( role, user, request )
			)
		}
	} )
] )

function isEditable( request )
{
	return (
		request.status == "Draft" || request.status == "New"
	)
}

var accessForTeamMembers = function( role, user, request )
{
	return (
		isEditable( request ) &&
		AuthHelpers.memberOfRelatedTeam( role, user, request )
	)
}

var accessForTeamManagers = function( role, user, request )
{
	return (
		isEditable( request ) &&
		AuthHelpers.managerOfRelatedTeam( role, user, request )
	)
}

var accessForTeamMembersWithElevatedAccessForManagers = function( role, user, request )
{
	return (
		(
			request.status == "Issued" &&
			AuthHelpers.managerOfRelatedTeam( role, user, request )
		) ||
		(
			isEditable( request ) &&
			AuthHelpers.memberOfRelatedTeam( role, user, request )
		)
	)
}

//maybe actions it better terminology?
Issues.methods(
{

	create:
	{
		authentication: true, //AuthHelpers.all
		method: RBAC.lib.create.bind( Issues ),
	},

	save:
	{
		authentication: true,
		method: RBAC.lib.save.bind( Issues )
	},

	updateSupplierManagers:
	{
		authentication: true,
		helper: function( request )
		{
			if ( request.supplier )
			{
				var supplierManagers = request.supplier.getMembers(
				{
					role: "manager"
				} );
				request.dangerouslyReplaceMembers( supplierManagers,
				{
					role: "supplier manager"
				} );
			}
		}
	},

	getLocationString:
	{
		authentication: true,
		helper: function( request )
		{
			var str = '';
			if ( request.level )
			{
				str += request.level.name;
			}
			if ( request.area )
			{
				str += ( ' - ' + request.area.name );
				if ( request.area.identifier && request.area.identifier.name )
				{
					str += ( ', ' + request.area.identifier.name );
				}
			}
			return str;
		}
	},

	getServiceString:
	{
		authentication: true,
		helper: function( request )
		{
			var str = '';
			if ( request.service )
			{
				str += request.service.name;
			}
			if ( request.subservice )
			{
				str += ( ' - ' + request.subservice.name );
			}
			return str;
		}
	}

} )

Issues.helpers(
{
	// this sent to schema config
	// or put in another package document-urls
	path: 'requests',
	getUrl()
	{
		return Meteor.absoluteUrl( this.path + '/' + this._id )
	},
	getEncodedPath()
	{
		return encodeURIComponent( Base64.encode( this.path + '/' + this._id ) );
	}
} );

Issues.helpers(
{
	isOverdue: function()
	{
		return moment( this.dueDate )
			.isBefore();
	},
	isFollowUp: function()
	{
		return this.parent != null;
	},
} );

Issues.helpers(
{
	//doc-attachments
	getAttachmentCount()
	{
		if ( this.attachments )
		{
			return this.attachments.length;
		}
		return 0;
	},
} );
