/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import { mount } from 'react-mounter';

import { Route } from '/modules/core/Actions';
import { AccessGroups } from '/modules/core/Authentication';
import { LayoutMain, LayoutBlank } from '/modules/core/Layouts';

import PageCalendarContainer from './imports/containers/PageCalendarContainer.jsx';

/**
 * @memberOf 		module:ui/Calendar
 */
AccessGroups.loggedIn.add( {
	name: 'calendar',
	path: '/calendar',
	label: "Calendar",
	icon: 'fa fa-calendar',
	action() {
		mount( LayoutMain, {
			content: <PageCalendarContainer/>
		} );
	}
} );

export {
	CalendarRoute
}
