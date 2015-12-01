FacilityView = React.createClass({

    saveFacility() {
        Meteor.call("Facility.save",this.facility);
    },

    updateField(field) {
        var $this = this;
        return function(event) {
            $this.facility[field] = event.target.value;
            $this.saveFacility();
        }
    },


    render() {
        var $this = this;
        var facility = this.facility = this.props.item;
        var createdAt = moment(this.facility.createdAt).format();
        var contact = facility.contact;
        return (
            <div className="ibox">
                <div className="row">
                    <div className="col-lg-12">
                        <h2 className="background">
                            <span>{facility.name}</span>
                        </h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6" style={{paddingLeft:"30px"}}>
                        <div className="row">
                            <div className="col-lg-12" style={{marginBottom:"7px"}}>
                                <b>{facility.getAddress()}</b>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="col-lg-12">
                                        {facility.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="facility-thumbnail pull-left">
                            <img style={{width:"100%"}} alt="image" src={facility.thumb[0]} />
                            <a href=""><img style={{"width":"40px","margin":"1px"}} alt="image" src="img/building-1.jpg"/></a>
                            <a href=""><img style={{"width":"40px","margin":"1px"}} alt="image" src="img/building-2.jpg"/></a>
                            <a href=""><img style={{"width":"40px","margin":"1px"}} alt="image" src="img/building-3.jpg"/></a>
                            <a href=""><img style={{"width":"40px","margin":"1px"}} alt="image" src="img/building-2.jpg"/></a>
                        </div>
                    </div>
                </div>
            </div>
        )}
})