import React from "react";

import { NavListDropDown } from '/both/modules/MaterialNavigation';
import { LoginService } from '/modules/core/Authentication';
import ContactCard from './ContactCard.jsx';

export default function UserFilter( props ) {
    return (
        <div style = { { overflow: "hidden" }}>
        <NavListDropDown
            { ...props }
            tile = { ContactCard }
            startOpen = { false }
            onChange = { ( user ) => { 
                LoginService.loginUser( user );
            } }
            multiple = { true }
        />
        </div>
    )
}
