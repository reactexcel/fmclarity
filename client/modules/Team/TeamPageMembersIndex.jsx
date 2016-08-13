import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

TeamIndexPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('users');

        var user,team,members,facilities;
        user = Meteor.user();
        if(user) {
            team = Session.getSelectedTeam();
            if(team) {
                members = team.getMembers();
                facilities = team.getFacilities();
            }
        }
        return {
        	team : team,
            members : members,
            facilities : facilities
        }
    },

    showModal(selectedUser) {
        Modal.show({
            content:<UserProfile />
        })
    },

	render() {
		// okay - so we really need to pass in a function here
		// seeing as this class is the only one aware of the 
		// structure of the data being sent in
		return(
			<div className="contacts-page animated fadeIn">
				<FilterBox2 
					items={this.data.members}
					newItemCallback={this.showModal}
					itemView={{
						summary:ContactCard,
						detail:UserProfileWidget
					}}
				/>
			</div>
		);
	}
})