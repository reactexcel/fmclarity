import React from "react";

import FacilityCard from './FacilityCard.jsx';
import FacilityPanel from './FacilityPanel.jsx';

// FacilityPageIndex
//
// Uses fmc:filterbox2 to create a layout with the users facilities in a left navigation panel
// and the detail view of the currently selected facility in the right navigation
//

export default class FacilityPageIndex extends React.Component 
{
	componentWillMount()
	{
		Session.selectFacility( 0 );
	}

	// Used as a callback to filterbox
	// Causes facility selected in filterbox left nav to be also selected globally
	handleSelect( facility )
	{
		Session.selectFacility( facility );
	}

	render()
	{
		let { team, facilities, facility, ...other } = this.props;

		if ( !team ) 
		{
			return <div/>
		}

		return <div className="facility-page animated fadeIn">
			{/*<ClientFilter/>*/}
	        {/*<FacilityFilter/>*/}
	        {facilities.map((f)=>{
	        	return <FacilityCard key={f._id} item={f} onClick={()=>{
	        		this.handleSelect(f);
	        	}}/>
	        })}
	    	{/*should be in a layout class - should this be fm-layout?*/}

            {facility?
            <div className="panel-wrapper animated slideInRight">
				<FacilityPanel team = { team } facility = { facility } { ...other } />
            </div>
            :null}

		</div>
	}
}

