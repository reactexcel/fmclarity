import React from "react";

export default function NavigationDrawer( props ) {
    let { userRole, routes } = props;

    console.log( routes );

    if ( routes == null || routes.length <= 1 ) {
        return <div/>
    }

    let routeNames = Object.keys( routes.actions );

    return (

        <nav className = "nav-drawer">
            <ul onClick = { this.onMenuClick }>

            {/*******************************************/
            routeNames.map( ( routeName ) => { 

                let route = routes.actions[ routeName ];
                console.log(route);

                if( !routes.accessRules[ routeName ] || !routes.accessRules[ routeName ][ userRole ]  ) {
                    return;
                }

                let pathName    = route.path,
                    icon        = route.icon,
                    label       = route.label,
                    //path        = FlowRouter.path( pathName ),
                    classes     = [];

                if( FlowRouter.getRouteName() == pathName ) {
                    classes.push("active");
                }

                return (
                <li key = { routeName } className = { classes.join(' ') }>
                    <a onClick = { () => { route.run() } } >
                        <i className = { icon }></i>
                        <span>{ label }</span>
                    </a>
                </li>
                )

            })/*******************************************/}

            </ul>
        </nav>

    )
}
