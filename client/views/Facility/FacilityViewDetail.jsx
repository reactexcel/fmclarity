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
            contactName = contact.getName();
            contact = contact.getProfile();
        }
        return (
            <div className="business-card">             
                <div className="contact-thumbnail pull-left">
                    <img alt="image" src={facility.getThumbUrl()} />
                    {/*<div style={{width:"100%",minHeight:"230px",backgroundImage:"url('"+facility.getThumbUrl()+"')",backgroundSize:"cover"}}/>*/}
                 </div>
                 <div className="contact-info">
                    <div>
                        <h2>{facility.getName()}</h2>                        
                        <b>{facility.getAddress()}</b>
                        <div style={{margin:"10px 0 10px 70px",borderBottom:"1px solid #ccc"}}>
                        </div>
                        {contact?
                        <div>

                            <i style={{color:"#999",display:"block",padding:"3px"}}>{contactName?contactName:null}<br/></i>
                            <b>Email</b> {contact.email}<br/>
                            {contact.phone?<span><b>Phone</b> {contact.phone}<br/></span>:null}
                            {contact.phone2?<span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> {contact.phone2}<br/></span>:null}

                        </div>
                        :null}

                    </div>
                </div>
            </div>
        )}
})
