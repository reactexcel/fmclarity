import React from "react";
import { ContactCard } from '/modules/mixins/Members';
import { SupplierFilter, Teams } from '/modules/models/Teams';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Modal } from '/modules/ui/Modal';

export default TeamGlobalSupplierPage = React.createClass( {

	mixins: [ ReactMeteorData ],

    getMeteorData() {
        let suppliers = this.state.suppliers //|| Teams.findAll( { type: "contractor" }, { sort: { name: 1 } } );
        return {
            suppliers
        }

    },
	getInitialState() {
		return {
			"suppliers": [],
			selectedSupplier: null
		}
	},
	handleSelect( selectedSupplier ) {
		this.setState( {
			selectedSupplier,
		} )
	},
	handleInvite( supplier ) {
        let viewersTeam = Session.getSelectedTeam();
        if (confirm("Do you want to save \'"+ supplier.name +"\' ?")) {
            viewersTeam.inviteSupplier( supplier.name, supplier._id, ( invitee ) => {
                invitee = Teams.collection._transform( invitee );
                Modal.hide();
            }, null );
        }
    },
	openTeamPanel( supplier ) {
        let contactName = supplier.contact ? supplier.contact.name : null,
			availableServices = null;
		if ( supplier.getAvailableServices ) {
			availableServices = supplier.getAvailableServices();
		}
		Modal.show({
			content: (
				<div>
                    <div className="business-card">
						<div className="contact-thumbnail pull-left">
							{supplier.thumbUrl?
								<img alt="image" src={supplier.thumbUrl} />
							:null}
						 </div>
						 <div className="contact-info">
							<h2>{supplier.name}</h2>
							<i style={{color:"#999",display:"block",padding:"3px"}}>{ contactName ? contactName : null }<br/></i>
							<b>Email</b> { supplier.email }<br/>
							{ supplier.phone ? <span><b>Phone</b> { supplier.phone }<br/></span> :null }
							{ supplier.phone2 ? <span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> { supplier.phone2 }<br/></span> :null }
							<div style={{margin:"10px 0 10px 70px",borderBottom:"1px solid #ccc"}}></div>
							{availableServices && availableServices.length?
							availableServices.map( (service,index) => {
								return <span key = { service.name }>{ index?' | ':'' }{ service.name }</span>
							})
							:null}
                            <br />
		                    <span>
		                        <button
                                    title={"Click to save supplier in your team."}
                                     className="btn btn-flat btn-primary" onClick={() => this.handleInvite( supplier )}>
		                            Save supplier
		                        </button>
		                    </span>
						</div>
					</div>
				</div>
			)
		})
	},
	render() {
		let { team, facility, facilities, ...other } = this.props;
		let { suppliers } = this.data;
		if ( !team ) {
			return <div/>
		}
		return <div className="facility-page animated fadeIn">
			<div style = { { paddingTop:"50px" } }>
			<SupplierFilter onChange={ ( suppliers ) => { this.setState({suppliers})}} team={this.props.team}/>
            <div className = "nav-list">
	            { suppliers ? suppliers.map( ( supplier, idx ) => {
	        	    return 	<div
						key 		= { `${idx}-${supplier._id}` }
						className 	= "list-tile"
						onClick		= { () => { this.openTeamPanel(supplier) } }
						>
						<ContactCard item = { supplier }/>
					</div>
	            } ) : null }
	        </div>
	        </div>
		</div>
	}
})
