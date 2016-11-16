import React from 'react';
import ReactDOM from 'react-dom';
import Geosuggest from 'react-geosuggest';

const GeoLocation = React.createClass( {
    /**
     * Render the example app
     */
    handleChange( event ) {
        let newValue = this.props.item;
        if ( this.props.onChange ) {
            this.props.onChange( newValue );
        }
    },

    handleClear() {
        if ( this.props.onClear ) {
            this.props.onClear()
        }
        if ( this.props.onChange ) {
            this.props.onChange( null );
        }
        this.refs.input.value = "";
    },

    handleSelect( event ) {
        if ( this.props.onSelect ) {
            this.props.onSelect( event.target.value );
        }
    },
    render: function() {
        let { value, errors } = this.props,
            used = false,
            invalid = false,
            classes = [ "input" ];

        if ( value != null && value.length != 0 ) {
            used = true;
            classes.push( "used" );
        }

        if ( errors != null && errors.length ) {
            invalid = true;
            classes.push( "invalid" );
        }

        var fixtures = [
            { label: 'Old Elbe Tunnel, Hamburg', location: { lat: 53.5459, lng: 9.966576 } },
            { label: 'Reeperbahn, Hamburg', location: { lat: 53.5495629, lng: 9.9625838 } },
            { label: 'Alster, Hamburg', location: { lat: 53.5610398, lng: 10.0259135 } }
        ];

        return (
            <Geosuggest
                inputClassName = { classes.join(' ') }
                className = "md-input"
                placeholder = {this.props.placeholder}
                id = "streetName"
                initialValue = {value}
                fixtures={fixtures}
                onSuggestSelect={this.props.onSuggestSelect}
                onChange = {this.handleChange}
                location={new google.maps.LatLng(53.558572, 9.9278215)}
                radius="20" 
            />
        )
    },

    /**
     * When a suggest got selected
     * @param  {Object} suggest The suggest
     */

} );
export default GeoLocation;
