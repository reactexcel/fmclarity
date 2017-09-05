import React from "react";
import { ContactCard } from '/modules/mixins/Members';
import { SupplierFilter, Teams,TeamPanel } from '/modules/models/Teams';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Modal } from '/modules/ui/Modal';
import { Documents } from '/modules/models/Documents';
import { ThumbView } from '/modules/mixins/Thumbs';

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
	/*openTeamPanel( supplier ) {
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
	},*/
	getAttachments( supplier ){
        let attachments = [],
            documentList = supplier? Documents.find( {"team._id":supplier._id,"type":'Image'}).fetch():[];
            documentList.map((doc,i)=>{
            	doc.attachments.map((obj,j)=>{
                	attachments.push(<div className="col-sm-2" key={i+"-"+j}><ThumbView item={obj} readOnly={true}/></div>)
            	})
        	})
        return attachments;
    },
	render() {
		let idList = []
		let { team, facility, facilities, ...other } = this.props;
		let { suppliers } = this.data;
		if ( !team ) {
			return <div/>
		}
		idList = _.pluck(team.suppliers, '_id');
		return <div className="facility-page animated fadeIn">
			<div style = { { paddingTop:"10px"} }>
			<SupplierFilter suppliers={suppliers} onChange={ ( suppliers ) => { this.setState({suppliers})}} team={this.props.team}/>
            <div className ="row" style={{'marginLeft':'0px','marginTop':'20px'}}>
	            { suppliers ? suppliers.map( ( supplier, idx ) => {
					let contactName = supplier.contact ? supplier.contact.name : null,
					    availableServices = null;
				    if ( supplier.getAvailableServices ) {
					    availableServices = supplier.getAvailableServices();
				    }
					let attachments = this.getAttachments( supplier )
	        	    return (
						<div className="col-xs-12" key={idx}  style={{'backgroundColor':'white','marginBottom':'1%','padding':'0px'}}>
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
								</div>
								<div className="row">
									{attachments}
									<div className="col-sm-12">
										<span style={{'float':'right','marginRight':'1%'}}>
										<button
											title={"Click to save supplier in your team."}
											className="btn btn-flat btn-primary"
											onClick={() => {
												this.handleInvite( supplier )
											}}
											disabled={_.contains(idList, supplier._id) == true?true:false}
											style={{'cursor':_.contains(idList, supplier._id) == true?"not-allowed":"pointer"}}
										>
											{_.contains(idList, supplier._id) == true?"Saved":"Save supplier"}
										</button>
									</span>
								</div>
							</div>
							</div>
						</div>
					)
	            } ) : null }
	        </div>
	        </div>
		</div>
	}
})
