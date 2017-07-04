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
 * @class           TeamStepper2
 * @memberOf        module:models/Teams
 * @todo            Remove tour, add additional instructions into stepper
 */

const TeamStepper2 = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        console.log("getMeteorData");
        let viewer = Meteor.user(),
            viewersTeam = null,
            viewingTeam = null,
            group = null;

        if ( this.state.team ) {
            viewersTeam = Teams.findOne( this.state.team._id );
        } else {
            viewersTeam = Session.getSelectedTeam();
        }
        if ( this.state.item && this.state.item._id ) {
            viewingTeam = Teams.findOne( this.state.item._id );
            if(!_.isEmpty(this.state.item.preActiveService)){
                let preService = _.filter( viewingTeam.services, ( ser ) => ser.name == this.state.item.preActiveService.name );
                if (preService.length > 0) {
                    for(var i in viewingTeam.services){
                        if(viewingTeam.services[i].name == this.state.item.preActiveService.name){
                            viewingTeam.services[i].active = true;
                            break;
                        }
                    }
                }else{
                    var array = $.map(viewingTeam.services, function(value, index) {
                        return [value];
                    });
                    viewingTeam.services = array;
                    this.state.item.preActiveService.active = true;
                    viewingTeam.services.push(this.state.item.preActiveService)
                }
            }
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
        group = this.props.group ? Facilities.findOne( this.props.group._id ) : null;
        console.log(viewingTeam,"viewingTeam");
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
            viewingTeam:{
                owner:{
                    name:Session.getSelectedTeam().name,
                    type:"team",
                    _id:Session.getSelectedTeam()._id
                }
            }
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

    handleInviteSupplier( supplier = {} ){
        var viewersTeam = this.data.viewersTeam
        let supplierId = supplier._id || Random.id();
        viewersTeam.inviteSupplier( this.state.viewingTeam.name, supplierId, ( invitee ) => {
            invitee = Teams.collection._transform( invitee );
            this.setItem( invitee );
            console.log(invitee,"invitee");
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
        console.log(query,"query");
        searchTeams = Teams.findAll( query, { sort: { name: 1 } } );
        if ( searchTeams.length > 0 ) {
            this.setState( { foundTeams: true } );

        } else {
            this.setState( { foundTeams: false } );
            this.handleInvite();

        }
    },
    checkSupplierName(name){
        event.preventDefault();
        let query = {name:name};
        if ( this.state.teamType ) {
            query.type = this.state.teamType
        }
        console.log(query,"query");
        searchTeams = Teams.findAll( query, { sort: { name: 1 } } );
        console.log(searchTeams,"searchTeams");
        if ( searchTeams.length > 0 ) {
            this.setState( {
                foundTeams: true,
                messageToShow:{
                    message:"Supplier with this name already exist.",
                    color:"#e11d60"
                }
             } );
            console.log(searchTeams,"team found");
            return true;

        } else {
            console.log("team not found");
            this.setState( {
                foundTeams: false,
                messageToShow: null
             } );
            this.handleInviteSupplier();
            return true;
        }
    },

    render() {
        console.log(this.data.viewingTeam,"this.data.viewingTeam");
        console.log(this.state.viewingTeam,"this.state.viewingTeam");
        var viewingTeam = this.data.viewingTeam ? this.data.viewingTeam : (_.omit(this.state.viewingTeam,"_id"));
        var teamsFound = this.state.foundTeams;
        var role = this.props.role;
        var teamType = this.state.teamType;
        var component = this;
        var showFilter = this.props.showFilter;
        console.log(viewingTeam,"viewingTeam in render");
        return (
            <div className="ibox-form user-profile-card" style={{backgroundColor:"#fff"}}>

                { this.state.shouldShowMessage ?
                <b>Team not found, please enter the details to add to your contact.</b>
                : null }

                <h2 style = { { marginTop:"0px" } }>Add team</h2>

                { viewingTeam.owner ?
                <div>
                    <b>Team owner:</b>
                    <OwnerCard item = { viewingTeam }/>
                </div>
                : null }

                <Stepper
                  submitForm = {
                    ( callback ) => {
                        let supplierFound = false;
                        if(!_.isEmpty(this.state.viewingTeam.name) && !_.isEmpty(this.state.viewingTeam.email) && !_.isEmpty(this.state.viewingTeam.email) && _.isEmpty(this.data.viewingTeam) ){
                            console.log("submitForm");
                            supplierFound = this.checkSupplierName(this.state.viewingTeam.name);
                        }
                        console.log(supplierFound,"supplierFound");
                        if(supplierFound==false){
                            console.log("run-------------------");
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


                        /*if(!_.isEmpty(this.state.viewingTeam.name) && _.isEmpty(this.data.viewingTeam)){
                            console.log("submitForm");
                            supplierFound = this.checkSupplierName(this.state.viewingTeam.name);
                        }*/
                        /*console.log(this.state.viewingTeam,"viewingTeam");
                      if( this.submitFormCallback && this.submitFormCallbackForWorkOrder ){
                        this.submitFormCallback( ( errorList ) => {
                            let supplierFound = false;
                            console.log(errorList,_.isEmpty(errorList),"errorList 111");
                            if(_.isEmpty(errorList) && _.isEmpty(this.data.viewingTeam)){
                                if(!_.isEmpty(this.state.viewingTeam.name)){
                                    supplierFound = this.checkSupplierName(this.state.viewingTeam.name);
                                }
                            }
                            if(supplierFound == false){
                                this.submitFormCallbackForWorkOrder( ( error ) => {
                                    console.log("now");
                                      let keys = Object.keys( error );
                                        _.forEach( keys, ( k ) => {
                                          errorList[ k ] = error[ k ];
                                        } );
                                      callback( errorList );
                                } );
                            }
                        } );
                    }*/
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
                                                console.log(this.data.viewingTeam,"this.data.viewingTeam");
                                                console.log(newItem,"newItem");
                                                this.setState({
                                                    viewingTeam: newItem.item
                                                })
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
                                    <div className = "col-sm-5"><ThumbView item = { viewingTeam && viewingTeam.thumb } onChange = { this.setThumb } /></div>
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
                        guide:      <div>
                                        <div>Enter the basic account info here including your teams name, address and image.</div>
                                        <div>{ this.state.messageToShow?<b style={{color:this.state.messageToShow.color}}>{this.state.messageToShow.message}</b>:null}</div>
                                    </div>
                    },{
                        tab:        <span id = "documents-tab">Documents</span>,
                        content:    (viewingTeam._id?<AutoForm model = { Teams } item = { viewingTeam } form = { ["documents"] } hideSubmit = { true } />:null),
                        guide:      <div>Formal documentation related to the team can be added here. This typically includes insurance and professional registrations.</div>
                    },{
                        tab:        <span id = "members-tab">Members</span>,
                        content:    (viewingTeam._id?<ContactList
                                        team        = { viewingTeam }
                                        group       = { viewingTeam }
                                        filter      = { {role: {$in: ['staff', 'manager', 'caretaker', 'portfolio manager', 'property manager'] } } }
                                        defaultRole = "staff"
                                    />:null),
                        guide:      <div>In this section invite members to your team. Be sure to give them the relevant role in your organisation so that their access permissions are accurate.</div>
                    },{
                        tab:        <span id = "services-provided-tab">Services provided</span>,
                        content:    (viewingTeam._id?<ServicesProvidedEditor item = { viewingTeam } save = { viewingTeam.setServicesProvided.bind(viewingTeam) }/>:null),
                        guide:      <div>Click on a service name to modify it, or click in the suppliers column to add a default supplier for that service.</div>
                    }
                ]}/>
            </div>
        )
    }
} );

export default TeamStepper2;
