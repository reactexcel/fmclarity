/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";

/**
 * @class 			NavigationDrawer
 * @memberOf 		module:ui/MaterialNavigation
 */
class NavigationDrawer extends React.Component {

	constructor( props ) {
		super( props );
		this.state = {
			selectedRouteName: FlowRouter.getRouteName()
		}
	}

	selectRoute( route ) {
		this.setState( {
			selectedRouteName: route.name
		} )
		route.run();
	}
	toggleMobile(  ) {
		var winWidth = $(window).width();
		var docWidth = $(document).width();
		if (winWidth <= 600 || docWidth <= 600) {
			$( 'body' ).toggleClass( 'nav-drawer-closed' );
		}
		var TO = false;
	    var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
	    $(window).bind(resizeEvent, function() {
	        TO && clearTimeout(TO);
	        TO = setTimeout(function(){
	        	var height = window.innerHeight || $(window).height();
		        var width = window.innerWidth || $(window).width();
		        if ( width <=600 ) {
		        	$( 'body' ).addClass( 'nav-drawer-closed' );
		        }
		        else{
		        	$( 'body' ).removeClass( 'nav-drawer-closed' );
		        }
	        }, 200);
	    });
		
	}
	
	componentDidMount() {
		this.toggleMobile();
	}

	render() {
		import { Routes } from '/modules/core/Actions'; // moved here because of circular dependency
		let { userRole, routes, team } = this.props, 
			{ selectedRouteName } = this.state;

		if ( !team || routes == null || routes.length <= 1 ) {
			return <div/>
		}

		let routeNames = Object.keys( routes.actions ),
			validRoutes = Routes.filter( routeNames, team ),
			validRouteNames = Object.keys( validRoutes );

		return (

			<nav className = "nav-drawer">
			<ul onClick = { this.onMenuClick }>

			{/*******************************************/

			validRouteNames.map( ( routeName ) => { 

				let route = routes.actions[ routeName ];

				/*
				if( !routes.canAccess( routeName, userRole ) ) {
					return;
				}
				*/

				let pathName    = route.path,
					icon        = route.icon,
					label       = route.label,
					//path        = FlowRouter.path( pathName ),
					classes     = [];

				if( selectedRouteName == routeName ) {
					classes.push("active");
				}

				return (
				<li key = { routeName } className = { classes.join(' ') }>
					<a onClick = { () => { this.selectRoute( route ) } } >
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
}

export default NavigationDrawer;
