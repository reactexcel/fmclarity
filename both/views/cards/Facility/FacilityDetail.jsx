

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

    componentWillMount: function() {
        this.saveFacility = _.debounce(this.saveFacility,500);
    },

    render() {
        var $this = this;
        var facility = this.facility = this.props.item;
        var createdAt = moment(this.facility.createdAt).format();
        var contact = facility.contact;
        return (
<div>
    <div className="row">
        <div className="col-lg-9">
            <div className="row">
                <div className="col-lg-12" style={{marginBottom:"7px"}}>
                    <h2>
                        <input 
                            className="inline-form-control" 
                            defaultValue={facility.name} 
                            onChange={this.updateField('name')}
                        />
                    </h2>
                    <i className="fa fa-location-arrow"></i>
                    <input 
                        className="inline-form-control" 
                        style={{width:"90%",marginLeft:"3px",fontWeight:"bold"}} 
                        defaultValue={facility.address} 
                        onChange={this.updateField('address')}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-lg-8">
                    <div className="row">
                        <div className="col-lg-12">
                            <textarea 
                                className="inline-form-control" 
                                style={{width:"90%",minHeight:"50px"}} 
                                defaultValue={facility.description} 
                                onChange={this.updateField('description')}
                            />
                            <br/><br/><b>Contacts:</b><br/><br/>
                        </div>
                        <div className="col-lg-6">
                            <div>
                                <ContactCard contact={contact} view="2-line"/>
                                <ContactCard contact={contact} view="2-line"/>
                                <ContactCard contact={contact} view="2-line"/>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div>
                                <ContactCard contact={contact} view="2-line"/>
                                <ContactCard contact={contact} view="2-line"/>
                                <ContactCard contact={contact} view="2-line"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <b>Documents:</b>
                    <ul className="list-unstyled issue-files">
                        <li><a href=""><i className="fa fa-file"></i> Issue_document.docx</a></li>
                        <li><a href=""><i className="fa fa-file-picture-o"></i> Logo_zender_company.jpg</a></li>
                        <li><a href=""><i className="fa fa-stack-exchange"></i> Email_from_Alex.mln</a></li>
                        <li><a href=""><i className="fa fa-file"></i> Contract_20_11_2014.docx</a></li>                
                    </ul>
                    <div className="text-center m-t-md">
                        <a href="#" className="btn btn-xs btn-primary">+</a>&nbsp;
                    </div>
                </div>
            </div>
        </div>
        <div className="col-lg-3">
            <div className="facility-thumbnail pull-left">
                <img style={{width:"100%","borderRadius":"2px"}} alt="image" src={"img/building-"+facility.thumb+".jpg"} />
                <a href=""><img style={{"width":"40px","borderRadius":"2px","margin":"1px"}} alt="image" src="img/building-1.jpg"/></a>
                <a href=""><img style={{"width":"40px","borderRadius":"2px","margin":"1px"}} alt="image" src="img/building-2.jpg"/></a>
                <a href=""><img style={{"width":"40px","borderRadius":"2px","margin":"1px"}} alt="image" src="img/building-3.jpg"/></a>
                <a href="#" className="btn btn-xs btn-primary">+</a>
            </div>
        </div>
    </div>
</div>
)}
})