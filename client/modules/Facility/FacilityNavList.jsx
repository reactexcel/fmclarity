import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

FacilityNavList = React.createClass(
{
	mixins: [ ReactMeteorData ],

	getMeteorData()
	{

		Meteor.subscribe( 'teamsAndFacilitiesForUser' );
		Meteor.subscribe( 'facilities' );
		Meteor.subscribe( 'users' );
		//
		var team, facility, client, facilities;

		team = Session.getSelectedTeam();
		facility = Session.getSelectedFacility();
		client = Session.getSelectedClient();

		if ( team )
		{
			Meteor.subscribe( 'suppliersForTeam', team._id, team.suppliers ? team.suppliers.length : null );

			facilities = team.getFacilities();

			if ( client )
			{
				//note that the facilities are being filtered after retreival from db
				//this could be employed more widely across the app to improve performance
				//on retrieval of non-sensitive data
				facilities = _.filter( facilities, function( f )
				{
					return (
						( f.team._id == client._id ) ||
						( f.team.name == client.name )
					)
				} )
			}
		}
		return {
			selectedTeam: team,
			selectedFacility: facility,
			facilities: facilities
		}
	},
	render()
	{
		return (
			<NavList 
				items={this.data.facilities} 
				selectedItem={this.data.selectedFacility}
				onClick={this.props.onClick}
				tile={FacilitySummary}
			/>
		)
	}
} )

SupplierNavList = React.createClass(
{

	mixins: [ ReactMeteorData ],

	getMeteorData()
	{
		Meteor.subscribe( 'contractors' );
		Meteor.subscribe( 'teamsAndFacilitiesForUser' );
		var team, suppliers;
		team = Session.getSelectedTeam();
		facility = Session.getSelectedFacility();
		//this needs to be changed so that it always goes through team.getSuppliers
		// ie team.getSuppliers({facility._id}) ergh or something
		if ( facility )
		{
			suppliers = facility.getSuppliers();
		}
		else if ( team )
		{
			Meteor.subscribe( "messages", "Teams", team._id, moment().subtract(
			{
				days: 7
			} ).toDate() )
			suppliers = team.getSuppliers();
		}
		return {
			team: team,
			suppliers: suppliers,
			facility: facility
				//            suppliers : Teams.find({type:"contractor"},{sort:{createdAt:-1}}).fetch()
		}
	},

	render()
	{
		return (
			<NavList 
				items={this.data.suppliers} 
				selectedItem={this.props.selectedItem}
				onClick={this.props.onChange}
				tile={ContactCard}
			/>
		)
	}
} )

NavList = class NavListInner extends React.Component
{

	componentDidUpdate()
	{
		$( this.refs.slimscroll ).slimScroll(
		{
			height: 'auto'
		} );
	}

	render()
	{
		var items = this.props.items;
		var ListTile = this.props.tile;
		var selectedItem = this.props.selectedItem ||
		{};
		return (
			<div ref="slimscroll" className={"nav-list"+(!selectedItem._id?" inactive":"")}>
				{items?items.map((item,idx)=>{
					return <div 
						key={item._id} 
						className={"list-tile"+(item._id==selectedItem._id?" active":"")} 
						onClick={()=>{this.props.onClick(item)}}
					>
						<ListTile item={item}/>
					</div>
				}):null}
			</div>
		)
	}
}

NavDropDownList = class NavDropDownList extends React.Component
{

	constructor( props )
	{
		super( props );
		this.state = {
			selectedItem: this.props.selectedItem,
			open: this.props.startOpen != null ? this.props.startOpen : true
		};
	}

	render()
	{
		var items = this.props.items;
		var ListTile = this.props.tile;
		if ( this.state.open )
		{
			return (
				<div className="nav-list">
					{this.props.multiple&&items&&items.length>1?
					<div className="list-tile" onClick={()=>{
						this.setState({
							open:false,
							selectedItem:0
						});
						this.props.onChange(0);
					}}>
						<MultipleItems items={items}/>
					</div>: null
			}

			{
				items && items.length ? items.map( ( item, idx ) =>
				{
					return <div
					key = {
						idx + '-' + item._id
					}
					className = {
						"list-tile fadeIn" + ( this.state.selectedItem && this.state.selectedItem._id == item._id ? " active" : "" )
					}
					onClick = {
							( e ) =>
							{
								this.setState(
								{
									open: false,
									selectedItem: item
								} );
								this.props.onChange( item );
							}
						} >
						<ListTile item={item}/> < /div>
				} ) : null
			} < /div>
		)
	}
	else
	{
		return (
			<div className="nav-list-selected">
					<div className="list-tile" onClick={()=>{
						this.setState({open:true});
					}}>
						{
						!this.state.selectedItem?
							<MultipleItems items={items}/>
						:
							<ListTile item={this.state.selectedItem}/>
						}
					</div> < /div>
		)
	}
}
}

MultipleItems = class MultipleItems extends React.Component
{
	render()
	{
		var items = this.props.items;
		var images = [];
		if ( items && items.length )
		{
			for ( var i = 0; i < 3; i++ )
			{
				if ( items[ i ] )
				{
					images.push( items[ i ].getThumbUrl() );
				}
			}
		}
		return (
			<div>
			<div className="avatar" style={{position:"relative",float:"left"}}>
				{images.map((src,idx)=>{
					return <img key={idx+'-'+src} src={src} style={{width:"27px",height:"27px",border:"1px solid #bbb",position:"absolute",top:(idx*5)+"px",left:(idx*5)+"px"}} />
				})}
				{items&&items.length?
					<div style={{position:"absolute",top:"15px",left:"25px"}}>
						<span className="label label-notification">{items.length}</span>
					</div>:null
				}
			</div>
			<div style={{float:"left",paddingLeft:"42px"}}>All Facilities</div>
			</div>
		)
	}
}
