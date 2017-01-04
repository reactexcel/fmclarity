import React from 'react';
import { Facilities } from '/modules/models/Facilities';
import { ContactCard } from '/modules/mixins/Members';
import { Select } from '/modules/ui/MaterialInputs';

const CreateSupplierFacility = React.createClass({
	getInitialState(){
		return {
			team: null,
			addTo: "Add facility to my portfolio",
		}
	},
	render () {
		let selectedTeam = Session.getSelectedTeam(),
			item = Facilities.create({ });

		if ( this.state.addTo == "Add facility to client's portfolio" && this.state.team ) {
			item.team = this.state.team;
		} else {
			item.team = selectedTeam
		}
		item = Facilities.collection._transform( item );

		return (
			<div className="row">
				<div className="col-xs-12" style={ { padding:"15px" } }>
					<div style={{margin: "10px"}}>
						<Select
							items={ ["Add facility to my portfolio", "Add facility to client's portfolio"] }
							onChange={ ( addTo ) => {
								this.setState( { addTo } );
							}}
							placeholder="Add facility to portfolio."
							value={this.state.addTo}
							/>
					</div>
					{this.state.addTo == "Add facility to client's portfolio" ?<div style={{margin: "10px"}}>
						<Select
							items={this.props.clients}
							view={ContactCard}
							onChange={( team ) => {
								this.setState( { team } );
							}}
							placeholder="Select Client."
							value={this.state.team}
						/></div>:null}
				</div>
				<div className="col-xs-12">
					{this.state.addTo == "Add facility to client's portfolio" && this.state.team ?
						<FacilityStepperContainer params = { { item } } />:null}
					{this.state.addTo == "Add facility to my portfolio"?<FacilityStepperContainer params = { { item } } />:null}
				</div>
			</div>
		)
	}
});

export default CreateSupplierFacility;
