import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

ConfigureAdHoc = React.createClass({
    render() {
        return <div>
            <h1>Fart</h1>
        </div>
    }
})

FacilityPluginSelector = React.createClass({

    modules:[{
        name:"Reactive",
        icon:"icons/plugins/adhoc.jpg",
        description:"Create work requests that can be sent to you supplier contacts",
        active:true,
        price:0,
        config:()=>{
            Modal.show({
                size:"large",
                content:<ConfigureAdHoc/>
            })
        }
    },{
        name:"Sign in register",
        icon:"icons/plugins/sign-in.jpg",
        description:"Keep records of on site attendances for personel and guests",
        active:false,
        price:75,
        config:()=>{
            Modal.show({
                content:<ConfigureAdHoc/>
            })
        }
    },{
        name:"Periodic",
        icon:"icons/plugins/periodic.jpg",
        description:"Configure cyclic maintenence tasks",
        active:false,
        price:100,
        config:()=>{
            Modal.show({
                content:<h1>Periodic</h1>
            })
        }
    },{
        name:"Bookings",
        icon:"icons/plugins/bookings.jpg",
        description:"Book areas and schedule events",
        active:false,
        price:100,
        config:()=>{
            Modal.show({
                content:<h1>Bookings</h1>
            })
        }
    },{
        name:"Compliance",
        icon:"icons/plugins/compliance.jpg",
        description:"Automatically rate and track your buildings compliance",
        active:false,
        price:100,
        config:()=>{
            Modal.show({
                content:<h1>Compliance</h1>
            })
        }
    },{
        name:"Predictive",
        icon:"icons/plugins/predictive.jpg",
        description:"Data analytics that can help you improve the effectiveness of you maintenence tasks",
        active:false,
        price:150,
        config:()=>{
            Modal.show({
                content:<h1>Predictive</h1>
            })
        }
    },{
        name:"Live Building",
        icon:"icons/plugins/live.jpg",
        description:"Configure your facility to communicate directly with FMC",
        active:false,
        price:150,
        config:()=>{
            Modal.show({
                content:<h1>Live Building</h1>
            })
        }
    }],

    render() {
        var modules = this.modules;
        return (   
            <div className="feed-activity-list">
                {modules.map((mod)=>{
                    return (
                        <div className="feed-element">
                            <div>

                                {mod.active?
                                    <button onClick={()=>{mod.config()}} className="btn btn-success" style={{width:"110px",float:"right"}}>Configure</button>
                                :
                                    <button onClick={()=>{mod.active=true;mod.config()}} className="btn btn-default" style={{width:"110px",float:"right"}}>${mod.price}/mo</button>
                                }

                                <img style={{width:"35px",height:"35px",float:"left",marginRight:"10px"}} 
                                src={mod.icon}/>
                                <div className="media-body message-type-undefined" style={{whiteSpace: "pre-wrap"}}>
                                    <div>
                                        <div className="message-subject">
                                            <a><span style={{color:(mod.active?"inherit":"#999"),fontWeight:"bold"}}>{mod.name}</span></a>
                                        </div>
                                        <div className="message-body">{mod.description}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
})

FacilityViewDetail = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var team,facility,suppliers,address,coverImage;
        team = Session.getSelectedTeam();
        facility = this.props.item?Facilities.findOne(this.props.item._id):null;
        if(facility) {
            Meteor.subscribe("messages","Facilities",facility._id,moment().subtract({days:7}).toDate());
            Meteor.subscribe("contractors");
            suppliers = facility.getSuppliers();
            address = facility.getAddress();
            coverImage = facility.getThumbUrl();
        }
        return {
            facility:facility,
            address:address,
            suppliers:suppliers,
            team:team,
            coverImage:coverImage
        }
    },

    render() {
        var facility = this.data.facility;
        var suppliers = this.data.suppliers;
        var team = this.data.team;
        var address = this.data.address;
        var thumb = this.data.coverImage;

        var thumb, createdAt, contact, contactName;
        if(facility) {
            createdAt = moment(facility.createdAt).format();
            contact = facility.getPrimaryContact();
            if(contact) {
                contactName = contact.getName();
                contact = contact.getProfile();
            }
        }

        //IpsoTabs content needs slimscroll applied
        //IpsoTabs should be renamed... TabPanel?
        return (
            <div className="facility-card">

                <div className="contact-thumbnail">
                    {thumb?
                    <div style={{backgroundImage:"url('"+thumb+"')"}}>
                        <img alt="image" src={thumb}/>
                    </div>
                    :null}
                </div>

                <div className="title-overlay">
                    <h2>{facility.getName()}</h2>                        
                    {address?<b>{address}</b>:null}
                </div>

                {contact?

                     <div className="contact-info">
                        {contactName?<span className="contact-title">Contact: {contactName}<br/></span>:null}
                        <span><i className="fa fa-envelope"></i> {contact.email}<br/></span>
                        {contact.phone?<span><i className="fa fa-phone"></i> {contact.phone}<br/></span>:null}
                        {contact.phone2?<span><i className="fa fa-phone"></i> {contact.phone2}<br/></span>:null}
                    </div>

                :null}

                <IpsoTabso tabs={[
                    {
                        hide:       !facility.canGetMessages(),
                        tab:        <span id="discussion-tab"><span style={{color:"white"}}>Updates</span></span>,
                        content:    <Inbox for={facility} readOnly={true} truncate={true}/>
                    },{
                        hide:       !facility.canAddDocument(),
                        tab:        <span id="documents-tab"><span style={{color:"white"}}>Documents</span></span>,
                        content:    <AutoForm item={facility} form={["documents"]}/>
                    },{
                        hide:       !facility.canAddMember(),
                        tab:        <span id="personnel-tab"><span style={{color:"white"}}>Personnel</span></span>,
                        content:    <ContactList group={facility} filter={{role:{$in:["staff","manager"]}}} defaultRole="staff" team={team}/>
                    },{
                        hide:       !facility.canAddMember(),
                        tab:        <span id="tenants-tab"><span style={{color:"white"}}>Tenants</span></span>,
                        content:    <ContactList group={facility} filter={{role:"tenant"}} defaultRole="tenant" team={team}/>
                    },/*{
                        hide:       !facility.canAddSupplier(),
                        tab:        <span id="suppliers-tab"><span style={{color:"white"}}>Suppliers</span></span>,
                        content:    <ContactList group={facility} members={suppliers} defaultRole="supplier" type="team"/>
                    },*/{
                        hide:       !facility.canSetAreas(),
                        tab:        <span id="areas-tab"><span style={{color:"white"}}>Areas</span></span>,
                        content:    <FacilityAreasSelector item={facility}/>
                    },{
                        hide:       !facility.canSetServicesRequired(),
                        tab:        <span id="services-tab"><span style={{color:"white"}}>Services</span></span>,
                        content:    <ServicesSelector item={facility} field={"servicesRequired"}/>
                    },{
                        tab:        <span id="requests-tab"><span style={{color:"white"}}>Requests</span></span>,
                        content:    <RequestsTable filter={{"facility._id":facility._id}}/>
                    }
                ]} />                
            </div>
        )}
})
