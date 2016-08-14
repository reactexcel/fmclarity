import React from "react";

AddressLink = class AddressLink extends React.Component {

	constructor(props) {
		super(props);
		this.style = {
			color:'#000',
			cursor:'pointer'
		}
	}

    makeAddressString(a){
		var str = '';
		if(a) {
			str = 
				(a.streetNumber?a.streetNumber:'')+
				(a.streetName?(' '+a.streetName):'')+
				(a.streetType?(' '+a.streetType):'')+
				(a.city?(', '+a.city):'');
		}
		str = str.trim();
		return str.length?str:'';
    }

    openMap(addressString) {
    	let url = `http://maps.google.com.au/?q=${addressString}`;
		window.open(url,'window','toolbar=no, menubar=no, location=no, resizable=yes');    	
    }

	render() {
		let addressString = this.makeAddressString(this.props.item);
		return (
	  		<span style={this.style} onClick={()=>{ this.openMap(addressString) }}>
	  			<i className="fa fa-map-marker"></i> 
	  			{addressString}
	  		</span>
	  	)
	}
}

FacilityDetails = React.createClass({
    render() {
        let facility = this.props.item;
        	address = '';

        if(!facility) {
        	return <div/>
        }

        return <div className="contact-info">
            <span className="contact-title">Site: {facility.name}<br/></span>
            {facility.address?<span><AddressLink item={facility.address}/><br/></span>:null}
        </div>
    }  
})