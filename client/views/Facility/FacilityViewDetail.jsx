FacilityViewDetail = React.createClass({

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
        var contact = facility.getPrimaryContact();
        if(contact) {
            contact = contact.getProfile();
        }
        return (
            <div className="business-card">             
                <div className="contact-thumbnail pull-left">
                    <img alt="image" src={facility.getThumbUrl()} />
                 </div>
                 <div className="contact-info">
                    <div>
                        <h2>{facility.getName()}</h2>
                        <b>{facility.getAddress()}</b>
                        <div style={{margin:"10px 0 10px 70px",borderBottom:"1px solid #ccc"}}>
                        </div>
                        {contact?
                        <div>
                            <b>Contact</b> {contact.name}<br/>
                        </div>
                        :null}

                    </div>
                </div>
            </div>
        )}
})