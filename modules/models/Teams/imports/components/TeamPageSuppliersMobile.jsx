import React from "react";
import { ContactCard } from '/modules/mixins/Members';
import { FacilityFilter } from '/modules/models/Facilities';
import { Teams, TeamActions, TeamPanel, TeamStepper } from '/modules/models/Teams';
import { DropFileContainer } from '/modules/ui/MaterialInputs';

// FacilityPageIndex
//
// Uses fmc:filterbox2 to create a layout with the users facilities in a left navigation panel
// and the detail view of the currently selected facility in the right navigation
//

export default class TeamPageSuppliersMobile extends React.Component {

	constructor( props ) {
		super( props );
		this.state = {
			selectedSupplier:null
		}
	}

	// Used as a callback to filterbox
	// Causes facility selected in filterbox left nav to be also selected globally
	handleSelect( selectedSupplier ) {
		this.setState( {
			selectedSupplier
		} )
	}

	addSupplier(){
		let facility = Session.getSelectedFacility();

        Modal.show( {
            content: <DropFileContainer model = { Teams }>
                <TeamStepper item = { null } onChange = { ( supplier ) => {
                	if( facility ) {
                		facility.addSupplier( supplier );
                	}
                }}
                />
            </DropFileContainer>
        } )
	}

	render() {
		let { team, facility, facilities, suppliers, ...other } = this.props;

		if ( !team ) {
			return <div/>
		}

		return <div className="facility-page animated fadeIn">
			{/*<ClientFilter/>*/}
			<div className="row">
				<div className="col-sm-6">
					<FacilityFilter
						items           = { facilities }
						selectedItem    = { facility }
						onChange = {
							() => {
								this.setState( {
									selectedSupplier: null
								} )
							}
						}
					/>
				</div>
				<div className="col-sm-6" style={{float:"right"}}>
					<span style={{float: "right"}}>
						<button className="btn btn-flat" onClick = { () => this.addSupplier() } >
							Add new supplier
						</button>
					</span>
				</div>
			</div>

			<div style = { { paddingTop:"50px" } }>
				<div className = "nav-list">
					{ suppliers ? suppliers.map( ( supplier, idx ) => {
						return 	<div
							key 		= { `${idx}-${supplier._id}` }
							className 	= "list-tile"
							onClick		= { () => { TeamActions.view.run( supplier ) } }
						>
							<ContactCard item = { supplier }/>
						</div>
					} ) : null }
				</div>
	        </div>

		</div>
	}
}
