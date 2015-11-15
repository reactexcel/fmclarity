FacilityProfile = React.createClass({

	save() {
		var item = this.props.item;
		return function() {
			item.save();
		}
	},

	form1 : [
		{
			key:"name",
			type:"mdtext"
		},
		{
			key:"address",
			type:"mdtext"
		},
		{
			key:"description",
			type:"textarea"
		}
	],

	form2 : [
		{
			key:"addressLine1",
			type:"mdtext",
			cols:6
		},
		{
			key:"addressLine2",
			type:"mdtext",
			cols:6
		},
		{
			key:"city",
			type:"mdtext",
			cols:3
		},
		{
			key:"state",
			type:"mdtext",
			cols:3
		},
		{
			key:"country",
			type:"mdtext",
			cols:3
		},
		{
			key:"postcode",
			type:"mdtext",
			cols:3
		},
		{
			key:"buildingAreas",
			type:"custom",
			options:{
				containerStyle:{height:"300px"}
			}
		},
		{
			key:"buildingServices",
			type:"custom",
			options:{
				containerStyle:{height:"300px"}
			}
		}
	],

	render() {
		var item = this.props.item;
		var schema = Schema.Facility;
		if(!item) {
			return <div/>
		}
		return (
		    <div className="user-profile-card" style={{backgroundColor:"#fff"}}>
			    <div className="row">
			        <div className="col-lg-12">
		            	<h2 className="background"><span>{item.name}</span></h2>
		            </div>
			   	</div>
			   	<div className="row">
			        <div className="col-lg-7" style={{paddingTop:"20px"}}>
			        	<AutoForm item={item} schema={schema} form={this.form1} save={this.save()} />
			        </div>
			        <div className="col-lg-5">
						<div className="contact-thumbnail">
							<img style={{width:"100%"}} alt="image" src={"img/"+item.thumb}/>
						</div>
					</div>
				</div>
				<div className="row">
			        <div className="col-lg-12" style={{paddingTop:"10px"}}>
			        	<AutoForm item={item} schema={schema} form={this.form2} save={this.save()} />
		            </div>
				</div>
			</div>
		)
	}
});

FacilityProfileWidget= React.createClass({
	render() {
		return (
			<FlipWidget
				front={FacilityProfile}
				back={FacilityDetail}
				item={this.props.item}
			/>
		)
	}
});

FacilityProfilePage = React.createClass({

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
							front={FacilityDetail}
							back={FacilityProfile}
							item={this.data.item}
						/>
					</div>
				</div>
			</div>
		)
	}
})
