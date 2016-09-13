FM = {
	version: "1.5.4-01b"
}

Config = {
	getModules: function( user, team ) {
		var type = team && team.type == "fm" ? "fm" : "contractor";
		var role = team && user ? RBAC.getRole( user, team ) : "staff";
		return Config.modules[ type ][ role ];
	}
}

// a bit more configuration here wouldn't go astray
//eg:
/*

	fm:{
		manager:[{
			name:"Dashboard",
			route:"dashboard"
		},
		{
			name:"Portfolio",
			route:"portfolio"
		}]
	}

*/

var navFMSupport = [ {
		path: "dashboard",
		label: "Dashboard",
		icon: "fa fa-newspaper-o"
	}, {
		path: "portfolio",
		label: "Portfolio",
		icon: "fa fa-building"
	}, {
		path: "suppliers",
		label: "Suppliers",
		icon: "fa fa-group"
	}, {
		path: "requests",
		label: "Requests",
		icon: "fa fa-wrench"
	}
	/*,{
		path:"reports",		
		label:"Reports",
		icon:"fa fa-bar-chart"
	}*/
];

var navFM = [ {
		path: "dashboard",
		label: "Dashboard",
		icon: "fa fa-newspaper-o"
	}, {
		path: "portfolio",
		label: "Portfolio",
		icon: "fa fa-building"
	}, {
		path: "suppliers",
		label: "Suppliers",
		icon: "fa fa-group"
	}, {
		path: "requests",
		label: "Requests",
		icon: "fa fa-wrench"
	}, {
		path: "calendar",
		label: "Calendar",
		icon: "fa fa-calendar"
	}, {
		path: "abc",
		label: "Compliance",
		icon: "fa fa-check-square-o"
	}
	/*,{
		path:"reports",		
		label:"Reports",
		icon:"fa fa-bar-chart"
	}*/
];

if ( false ) {
	navFM.push( {
		path: "maintenence",
		label: "Maintenence",
		icon: "fa fa-calendar"
	} );
	navFM.push( {
		path: "abc",
		label: "Compliance",
		icon: "fa fa-check-square"
	} );
	navFM.push( {
		path: "Sustainability",
		label: "Sustainability",
		icon: "fa fa-leaf"
	} );
	navFM.push( {
		path: "contracts",
		label: "Contracts",
		icon: "fa fa-file-text-o"
	} );
	navFM.push( {
		path: "reports",
		label: "Reports",
		icon: "fa fa-bar-chart"
	} );
}

var navFMStaff = [ {
	path: "requests",
	label: "Requests",
	icon: "fa fa-wrench"
}, {
	path: "portfolio",
	label: "Portfolio",
	icon: "fa fa-building"
} ];

var navSupplier = [ {
	path: "requests",
	label: "Jobs",
	icon: "fa fa-wrench"
}, {
	path: "portfolio",
	label: "Sites",
	icon: "fa fa-building"
}, {
	path: "suppliers",
	label: "Clients",
	icon: "fa fa-group"
} ];

var navTenant = [ {
	path: "portfolio",
	label: "Sites",
	icon: "fa fa-building"
} ];

Config.modules = {
	fm: {
		'portfolio manager': navFM,
		'manager': navFM,
		'fmc support': navFM,
		'staff': navFMStaff,
		'tenant': navTenant,
		'contact': [],
	},
	contractor: {
		'fmc support': navFM,
		'manager': navSupplier,
		'staff': navSupplier
	}
}



