import React from 'react';
import moment from 'moment';
import { Users } from '/modules/models/Users';
import { ContactCard } from '/modules/mixins/Members';
import { Text, TextArea, Select, Switch, Currency, DateTime, StartEndTimePicker} from '/modules/ui/MaterialInputs';

export default ServiceDetailsSchema =  {
    baseBuilding:{
        label: "Base Building",
        type: 'boolean',
        size:6,
        input: Switch,
        options:{
            afterChange(item){
                item.tenant = !item.baseBuilding;
            }
        }
    },
    tenant:{
        label: "Tenancy",
        type: "boolean",
        size:6,
        input: Switch,
        options:{
            afterChange(item){
                item.baseBuilding = !item.tenant;
            }
        }
    },
    glAccount:{
        label: "GL Account",
        type: "string",
        input: Select,
        options( item ){
            return {
                items:[ "Not applicable" ],
            }
        },
        condition(itm){
            item = itm
            return true;
        }
    },
    cfy: {
        size: 1,
        input( props ){
            let month = parseInt(moment().format("M"));
            return (
                <div style={item.glAccount !== "Not applicable"?{}:{ paddingTop: "3px", marginTop:'100%' }}>
                    <span style={{paddingLeft:"0px"}}>FY{props.cfy?props.cfy:( month > 6 ? parseInt(moment().format("YY"))+1 :moment().format("YY") )}</span>
                </div>
            )
        }
    },
    budget:{
        label:"Enter budget",
        size: 11,
        input( props ){
            return(
                item.glAccount == "Not applicable"?
                    <Currency { ...props }/>:
                <div style={{marginLeft:"-7px"}}>
                    Budget: <span>${props.value!=""?props.value:0 }</span>
                </div>
            )
        }
    },
    workOrder:{
        label: "WO#",
        type: "boolean",
        size: 6,
        input: Switch,
        options:{
            afterChange(item){
                item.purchaseOrder = !item.workOrder;
            }
        }
    },
    purchaseOrder:{
        label: "PO#",
        type: 'boolean',
        size: 6,
        input: Switch,
        options:{
            afterChange(item){
                item.workOrder = !item.purchaseOrder
            }
        }
    },
    assetTrackig:{
        label: "Asset tracking",
        type: 'boolean',
        size: 6,
        input: Switch,
        condition(item){
            return item.purchaseOrder;
        }
    },
    supplier:{
        label: "Default supplier",
        size: 12,
        input: Select,
        options(item){
            let facility = Session.getSelectedFacility();
            return {
                items: facility.getSuppliers(),
                view: ContactCard,
                addNew: {
                    //Add new supplier to request and selected facility.
                    show: !_.contains( [ "staff", 'resident' ], Meteor.user().getRole() ), //Meteor.user().getRole() != 'staff',
                    label: "Create New",
                    onAddNewItem: ( callback ) => {
                        import { TeamStepper } from '/modules/models/Teams';
                        Modal.show( {
                            content: <TeamStepper item = { supplier }
                                facility = { facility }
                                onChange = {
                                    ( supplier ) => {
                                        facility.addSupplier( supplier );
                                        callback( supplier );
                                    }
                                }
                            />
                        } )
                    }
                },
                afterChange(item){
                    item.defaultContact = [];
                }
            }
        }
    },
    defaultContact:{
        label: "Default supplier contact",
        type: 'array',
        required: true,
        size: 12,
        input(props){
            // props.onChange = ( item ) => {
            //     props.onChange({
            //         _id: item._id,
            //         name: item.name || item.profile.name,
            //         role: "supplier manager",
            //         email: item.email || item.profile.email,
            //     });
            // }
           return (
                <div className="col-sx-12">
                    <Select
                        placeholder = {"Default supplier contact"}
                        item = {props.item}
                        items = {props.items}
                        view = {props.view}
                        errors = {props.errors}
                        model = {props.model}
                        onChange ={ ( contact ) => {
                            if ( !_.find( props.item.defaultContact, m => m._id === contact._id) ) {
                                if( ! props.item.defaultContact ) {
                                    props.item.defaultContact = [];
                                }
                                props.item.defaultContact.push({
                                    _id: contact._id,
                                    name: contact.name || contact.profile.name,
                                    role: "supplier manager",
                                    email: contact.email || contact.profile.email,
                                });
                                props.onChange( props.item.defaultContact );
                            }
                        }
                    }/>
                    <div>
                        {_.map( props.item.defaultContact, ( sc, i ) => (
							<div className="col-sm-5" key={i}
								style={{
									backgroundColor: 'aliceblue',
    								padding: '5px',
    								border: '1px solid transparent',
    								borderRadius: '5px',
									margin: '5px',
									borderLeft: '4px solid aquamarine',
								}}>
								<span onClick={() => {
										let id = sc._id;
										let newValue =	_.filter( props.item.defaultContact,  v => v._id !== id );
                                        props.onChange( newValue );
									}}
									style={{
										float: 'right',
										cursor: 'pointer',
										fontSize: '14px',
										fontWeight: 'bold',
										marginRight: '0px',
										marginTop: '-6px',
									}} title="Remove tag">&times;</span>
								<ContactCard item={sc}/>
							</div>))}
                    </div>
                </div>
            )
        },
        options( item ){
            let members = [];
            if( item.supplier && item.supplier._id ) {
                import { Teams } from '/modules/models/Teams';
                let supplier = Teams.findOne( item.supplier._id );
                if( supplier ) {
                    members = supplier.getMembers();
                }
            }
            return {
                items: members,
                view: ContactCard
            }
        }
    },
}
