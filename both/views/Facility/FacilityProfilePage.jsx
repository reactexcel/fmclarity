FacilityProfile = React.createClass({

	save() {
		var item = this.props.item;
		return function() {
			item.save();
		}
	},

	form1 : ["name","address","description"],
	form2 : ["addressLine1","addressLine2","city","state","country","postcode","buildingAreas","buildingServices"],

	render() {
		var item = this.props.item;
		var schema = FM.schemas['Facility'];
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
		           	<h4 className="background" style={{margin:"10px 15px"}}><span>Basic info</span></h4>
		           	<div>
				        <div className="col-lg-7" style={{paddingTop:"20px"}}>
				        	<AutoForm item={item} schema={schema} form={this.form1} save={this.save()} />
				        </div>
				        <div className="col-lg-5">
							<div className="contact-thumbnail">
								<img style={{width:"100%"}} alt="image" src={"img/"+item.thumb}/>
							</div>
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
