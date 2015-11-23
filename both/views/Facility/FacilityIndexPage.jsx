
FacilityWidget= React.createClass({
	render() {
		return (
			<FlipWidget
				front={FacilityEdit}
				back={FacilityView}
				item={this.props.item}
			/>
		)
	}
});

FacilityIndexPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var user, item;
    	user = Meteor.user();
    	if(user) {
    		item = user.getSelectedFacility();
    	}
		return {
			item:item
		}
	},

	render() {
		return (
		    <div className="wrapper wrapper-content animated fadeIn">
		        <div className="row">
		            <div className="col-lg-6 col-md-6 col-sm-6">
						<FlipWidget
							front={FacilityView}
							back={FacilityEdit}
							item={this.data.item}
						/>
					</div>
				</div>
			</div>
		)
	}
})
