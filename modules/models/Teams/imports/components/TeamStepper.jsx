/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Teams, SearchSuppliersWithinNetwork } from '/modules/models/Teams';
import { ThumbView } from '/modules/mixins/Thumbs';
import { ContactList } from '/modules/mixins/Members';
import { ContactCard } from '/modules/mixins/Members';
import { ServicesProvidedEditor } from '/modules/mixins/Services';

import { AutoForm } from '/modules/core/AutoForm';
import { OwnerCard } from '/modules/mixins/Owners';
import { Stepper } from '/modules/ui/Stepper';

import { Select } from '/modules/ui/MaterialInputs';

/**
 * @class           TeamStepper
 * @memberOf        module:models/Teams
 * @todo            Remove tour, add additional instructions into stepper
 */

const TeamStepper = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {

        let viewer = Meteor.user(),
            viewersTeam = null,
            viewingTeam = null,
            group = null;

        if ( this.state.team ) {
            viewersTeam = Teams.findOne( this.state.team._id );
        } else {
            viewersTeam = Session.getSelectedTeam();
        }

        //getting value of item from state instead of props
        if ( this.state.item && this.state.item._id ) {
            viewingTeam = Teams.findOne( this.state.item._id );
            /*
            if(viewingTeam.type == "contractor"){
                Teams.schema.email.required=false;
            }
            */
            if ( !viewingTeam && this.state.searchName ) {
                let query = {
                    name: {
                        $regex: this.state.searchName,
                        $options: 'i'
                    },
                };
                if ( this.state.teamType ) {
                    query.type = this.state.teamType
                }
                viewingTeam = Teams.findOne( query );
            }
        }

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
            shouldShowMessage: false,
            foundTeams: false,
            facility: this.props.facility,
            item: this.props.item,
            teamType: this.props.teamType || null,
        }
    },
    //Update the state of ui
    setItem( newItem ) {
        this.setState( {
            item: newItem
        } );
    },

    handleInvite( supplier = {} ) {

        var viewersTeam = this.data.viewersTeam;
        var group = this.data.group;
        var input = this.refs.invitation;
        var searchName = supplier.name ? supplier.name : input.value;
        if ( !searchName ) {
            alert( 'Please enter a valid name.' );
        } else {
            //this.setState( { searchName: searchName} );
            this.setState( { searchName: searchName }, () => {
                input.value = '';
                let supplierId = supplier._id || Random.id();
                viewersTeam.inviteSupplier( searchName, supplierId, ( invitee ) => {
                    invitee = Teams.collection._transform( invitee );

                    /*if ( group && group.addSupplier ) {
                        group.addSupplier( invitee );
                    }*/
                    this.setItem( invitee );
                    if ( this.props.onChange ) {
                        this.props.onChange( invitee );
                    }

                    if ( !invitee.email ) {
                        this.setState( { shouldShowMessage: true } );
                    } else {
                        Modal.hide();
                    }

                }, null );
                setTimeout(function () {
                    //quick fix to manually add supplier to a team. better solution needed
                    if (Session.getSelectedFacility()) {
                        Session.getSelectedFacility().addSupplier(supplier);
                    }
                },2000);
                

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
    submitFormCallback: null,
    submitFormCallbackForWorkOrder: null,
    onNext( callback ) {
        this.submitFormCallback = callback;
    },
    onNextWorkOrder( callback ) {
        this.submitFormCallbackForWorkOrder = callback;
    },
    handleTeamChange( team ) {

        this.handleInvite( team );

    },

    checkName( event ) {
        event.preventDefault();
        var inputName = this.refs.invitation.value;
        let query = {
            name: {
                $regex: inputName,
                $options: 'i'
            }
        };
        if ( this.state.teamType ) {
            query.type = this.state.teamType
        }
        searchTeams = Teams.findAll( query, { sort: { name: 1 } } );
        if ( searchTeams.length > 0 ) {
            this.setState( { foundTeams: true } );

        } else {
            this.setState( { foundTeams: false } );
            this.handleInvite();

        }
    },

    render() {
        var viewingTeam = this.data.viewingTeam;
        var teamsFound = this.state.foundTeams;
        var role = this.props.role;
        var teamType = this.state.teamType;
        var component = this;
        var showFilter = this.props.showFilter;
        console.log({showFilter});
        if ( !viewingTeam ) {
            if (showFilter == true) {
                return (
                    <SearchSuppliersWithinNetwork facility={this.data.group || Session.getSelectedFacility()} onSaveSupplier = {(supplier)=>{
                        if(this.props.onChange){
                            this.props.onChange(supplier)
                        }
                    }}/>
                )
            }
            return (
                <form style={{padding:"15px"}} className="form-inline">
                    <div className="form-group">
                        <b>Lets search to see if this team already has an account.</b>
                        {teamsFound ? <Select items={searchTeams} view={ContactCard} onChange={this.handleTeamChange} placeholder={"Select "+(this.props.title?this.props.title:"Supplier")+" from dropdown"}/> : null }
                        <h2><input className="inline-form-control" ref="invitation" placeholder="Team name"/></h2>
                        <button type = "submit" style = { { width:0, opacity:0} } onClick = { this.checkName }>Invite</button>
                    </div>
                </form>
            )
        }

        /*
        if(viewingTeam.type == "contractor"){
            Teams.schema.email.required=false;
        }
        */

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

                { this.state.shouldShowMessage ?
                <b>Team not found, please enter the details to add to your contact.</b>
                : null }

                <h2 style = { { marginTop:"0px" } }>Edit team</h2>

                { viewingTeam.owner ?
                <div>
                    <b>Team owner:</b>
                    <OwnerCard item = { viewingTeam }/>
                </div>
                : null }

                <Stepper
                  submitForm = {
                    ( callback ) => {
                      if( this.submitFormCallback && this.submitFormCallbackForWorkOrder ){
                        this.submitFormCallback( ( errorList ) => {
                          this.submitFormCallbackForWorkOrder( ( error ) => {
                            let keys = Object.keys( error );
                            _.forEach( keys, ( k ) => {
                              errorList[ k ] = error[ k ];
                            } );
                            callback( errorList );
                          } );
                        } );
                      }
                    }
                  }
                  onFinish = { () => {
                        if(this.props.onFinish){
                            this.props.onFinish( viewingTeam )
                        }
                    }
                  }
                  tabs={[
                    {
                        tab:        <span id = "discussion-tab">Basic Details</span>,
                        content:    <div className = "row">
                                    <div className = "col-sm-7">
                                        <AutoForm
                                            model = { Teams }
                                            item = { viewingTeam }
                                            form = { ["name","type","abn","email","phone","phone2","website","address"] }
                                            onNext = { this.onNext }
                                            hideSubmit = { true }
                                            onChange =  { ( newItem ) => {
                                                /*
                                                if(newItem.item.type == "contractor"){
                                                    Teams.schema.email.required=false;
                                                }
                                                */
                                                }
                                            }
                                            submitFormOnStepperNext = { true }
                                            afterSubmit = { ( item ) => {
                                                team = Teams.collection._transform(item);
                                                if (Session.getSelectedFacility()) {
                                                    //quick fix to manually add supplier to a team. better solution needed
                                                    Session.getSelectedFacility().addSupplier(item);
                                                }
                                                
                                                if ( team.email && team.inviteMember && ( !team.members || !team.members.length ) ) {
                                                team.inviteMember( team.email, {
                                                      role: role ? role : "manager",
                                                      owner: {
                                                        type: 'team',
                                                        _id: team._id,
                                                        name: team.name
                                                      }
                                                    }
                                                   );
                                                   if (role == "property manager") {
                                                       this.props.onChange && this.props.onChange( item );
                                                   }
                                                }
                                              }
                                            }
                                        />
                                    </div>
                                    <div className = "col-sm-5"><ThumbView item = { viewingTeam.thumb } onChange = { this.setThumb } /></div>
                                    <div className = "col-sm-12">
                                        <AutoForm
                                            model = { Teams }
                                            item = { viewingTeam }
                                            form = { ["defaultWorkOrderValue", "defaultCostThreshold", "description"] }
                                            onNext = { this.onNextWorkOrder }
                                            hideSubmit = { true }
                                            submitFormOnStepperNext = { true }
                                        /> <br />
                                    </div>
                                    </div>,
                        guide:      <div>Enter the basic account info here including your teams name, address and image.</div>
                    },{
                        tab:        <span id = "documents-tab">Documents</span>,
                        content:    <AutoForm model = { Teams } item = { viewingTeam } form = { ["documents"] } hideSubmit = { true } />,
                        guide:      <div>Formal documentation related to the team can be added here. This typically includes insurance and professional registrations.</div>
                    },{
                        tab:        <span id = "members-tab">Members</span>,
                        content:    <ContactList
                                        team        = { viewingTeam }
                                        group       = { viewingTeam }
                                        filter      = { {role: {$in: ['staff', 'manager', 'caretaker', 'portfolio manager', 'property manager'] } } }
                                        defaultRole = "staff"
                                    />,
                        guide:      <div>In this section invite members to your team. Be sure to give them the relevant role in your organisation so that their access permissions are accurate.</div>
                    },{
                        tab:        <span id = "services-provided-tab">Services provided</span>,
                        content:    <ServicesProvidedEditor item = { viewingTeam } save = { viewingTeam.setServicesProvided.bind(viewingTeam) }/>,
                        guide:      <div>Click on a service name to modify it, or click in the suppliers column to add a default supplier for that service.</div>
                    }
                ]}/>
            </div>
        )
    }
} );

export default TeamStepper;
