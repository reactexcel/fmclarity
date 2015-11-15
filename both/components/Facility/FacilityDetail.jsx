FacilityDetail = React.createClass({

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
                    <div className="col-lg-8">
                        <div className="row">
                            <div className="col-lg-12" style={{marginBottom:"7px"}}>
                                <i className="fa fa-location-arrow"></i>
                                <input 
                                    className="inline-form-control" 
                                    style={{width:"90%",marginLeft:"3px",fontWeight:"bold"}} 
                                    value={facility.address} 
                                    onChange={this.updateField('address')}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <textarea 
                                            className="inline-form-control" 
                                            style={{width:"90%",minHeight:"50px"}} 
                                            value={facility.description} 
                                            onChange={this.updateField('description')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="facility-thumbnail pull-left">
                            <img style={{width:"100%"}} alt="image" src={"img/"+facility.thumb} />
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