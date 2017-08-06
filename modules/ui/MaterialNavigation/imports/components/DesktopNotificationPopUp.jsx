import React from "react";

class DesktopNotificationPopUp extends React.Component {

    constructor( props ) {
        super( props );
        this.showPopUp = false;
    }

    /*
    shouldComponentUpdate( nextProps ) {

        console.log( {
            props: this.props,
            nextProps: nextProps
        } );

        if ( !this.props.notifications ) {
            return true;
        }
        else if ( !nextProps.notifications || ( nextProps.notifications.length <= this.props.notifications.length ) ) {
            return false;
        }
        else {
            return true;
        }
    }
    */

    componentWillReceiveProps( { items } ) {
        import { Messages } from '/modules/models/Messages';
        if ( !this.showPopUp ) {
            let component = this;
            if ( items && items.length ) {
                component.showPopUp = Meteor.apply( 'Messages.setAllShown', [ items ], { returnStubValue: true } );
            }
        } else if ( this.showPopUp && items.length ) { // when new notification arrived after loggin.
            this.props.showNotifications( items );
        }
    }

    render() {
        return (
            <div />
        )
    }
}

export default DesktopNotificationPopUp;