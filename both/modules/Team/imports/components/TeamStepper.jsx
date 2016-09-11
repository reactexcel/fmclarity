import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { AutoForm } from '/both/modules/AutoForm';
import { ThumbView } from '/both/modules/DocThumbs';
import { ContactList } from '/both/modules/DocMembers';
import { ServicesProvidedEditor } from '/both/modules/Service';

/*
TODO: remove tour, add additional instructions into stepper
*/
export default TeamStepper = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {

        var viewer, viewersTeam, viewingTeam, group;

        viewer = Meteor.user();
        viewersTeam = this.props.team ? Teams.findOne( this.props.team._id ) : Session.getSelectedTeam();
        viewingTeam = this.props.item ? Teams.findOne( this.props.item._id ) : null;
        //if this team is a member of a group, group may be included as one of the props
        //this functionality will become deprecated when suppliers are saved as user contacts
        //note that we are erroneously assuming that the group is a facility when it may not always be
        group = this.props.group ? Facilities.findOne( this.props.group._id ) : null;

        return {
            viewer: viewer,
            viewersTeam: viewersTeam,
            viewingTeam: viewingTeam,
            group: group,
        }
    },

    tour: {
        id: "team-edit-page",
        steps: [ {
            title: "This is your team profile.",
            content: "In FM Clarity all suppliers are part of a team. This is the team settings page where you can check that your client has entered your details correctly, and update company files such as insurance documents, SWMS, references, etc",
            target: "fm-logo",
            arrowOffset: "center",
            onShow: function() {
                $( '.hopscotch-bubble-arrow-container' )
                    .css( 'visibility', 'hidden' );
            },
            placement: "bottom"
        }, {
            title: "Company documents",
            content: "This is where you can upload your company specific documents. Clients may request documents such as insurance policies or compliance info and that can be uploaded here",
            target: "company-documents",
            placement: "bottom"
        }, {
            title: "Members",
            content: "Adding staff members will enable you to assign jobs to members of your team. New members will be given the role of staff meaning they can only view requests assigned to them. If you want them to see all jobs you can promote them to manager by selecting the member and clicking promote from the tool icon at the top right of their profile. You can also invite them to use FMC from this same menu",
            target: "members",
            placement: "bottom"
        }, {
            title: "Services",
            content: "Jobs will be matched to suppliers based on the services profile which can be configured here. Consumed services are those that you employ suppliers to complete, provided services are those that you can perform as a supplier.",
            target: "services-provided",
            placement: "bottom"
        } ]
    },

    getInitialState() {
        return {
            shouldShowMessage: false
        }
    },

    handleInvite( event ) {
        event.preventDefault();
        var viewersTeam = this.data.viewersTeam;
        var group = this.data.group;
        var input = this.refs.invitation;
        var searchName = input.value;
        if ( !searchName ) {
            alert( 'Please enter a valid name.' );
        } else {
            input.value = '';
            viewersTeam.inviteSupplier( searchName, null, ( invitee ) => {
                invitee = Teams._transform( invitee );
                if ( group && group.addSupplier ) {
                    group.addSupplier( invitee );
                }
                this.setItem( invitee );
                if ( component.props.onChange ) {
                    this.props.onChange( invitee );
                }
                if ( !invitee.email ) {
                    this.setState( {
                        shouldShowMessage: true
                    } );
                } else {
                    Modal.hide();
                }
            } );
        }
    },

    setThumb( thumb ) {
        var viewingTeam = this.data.viewingTeam;
        viewingTeam.setThumb( thumb );
        viewingTeam.thumb = thumb;
        this.setState( {
            item: viewingTeam
        } );
    },

    render() {
        var viewingTeam = this.data.viewingTeam;
        if ( !viewingTeam ) {
            return (
                <form style={{padding:"15px"}} className="form-inline">
                    <div className="form-group">
                        <b>Lets search to see if this team already has an account.</b>
                        <h2><input className="inline-form-control" ref="invitation" placeholder="Supplier name"/></h2>
                        <button type="submit" style={{width:0,opacity:0}} onClick={this.handleInvite}>Invite</button>
                    </div>
                </form>
            )
        }
        /*
        else if ( !viewingTeam.canSave() )
        {
            return (
                <TeamViewDetail item={viewingTeam} />
            )
        }
        */
        return (
            <div className="ibox-form user-profile-card" style={{backgroundColor:"#fff"}}>
                {this.state.shouldShowMessage?<b>Team not found, please enter the details to add to your contact.</b>:null}
                <h2 style={{marginTop:"0px"}}>Edit team</h2>
                {(false&&viewingTeam.owner)?<div>
                    <b>Team owner:</b>
                    <DocOwnerCard item={viewingTeam}/>
                </div>
                :
                null
                }
                <Stepper tabs={[
                    {
                        tab:        <span id="discussion-tab">Basic Details</span>,
                        content:    <div className="row">
                                        <div className="col-sm-7"><AutoForm item={viewingTeam} form={["name","type","abn","email","phone","phone2"]} /></div>
                                        <div className="col-sm-5"><ThumbView item={viewingTeam.thumb} onChange={this.setThumb} /></div>
                                        <div className="col-sm-12"><AutoForm item={viewingTeam} form={["defaultWorkOrderValue","description"]} /></div>
                                    </div>,
                        guide:      <div>Enter the basic account info here including your teams name, address and image.</div>
                    },{
                        tab:        <span id="documents-tab">Documents</span>,
                        content:    <AutoForm item={viewingTeam} form={["documents"]}/>,
                        guide:      <div>Formal documentation related to the team can be added here. This typically includes insurance and professional registrations.</div>
                    },{
                        tab:        <span id="members-tab">Members</span>,
                        content:    <ContactList group={viewingTeam} team={viewingTeam}/>,
                        guide:      <div>In this section invite members to your team. Be sure to give them the relevant role in your organisation so that their access permissions are accurate.</div>
                    },{
                        tab:        <span id="services-provided-tab">Services provided</span>,
                        content:    <ServicesProvidedEditor item={viewingTeam} save={viewingTeam.setServicesProvided.bind(viewingTeam)}/>,
                        guide:      <div>In this section invite members to your team. Be sure to give them the relevant role in your organisation so that their access permissions are accurate.</div>
                    }
                ]}/>
            </div>
        )
    }
} );
