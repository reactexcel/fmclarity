/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";

import moment from 'moment';

import DocViewEdit from './DocViewEdit.jsx';

import { DocActions } from '/modules/models/Documents';

import { Switch } from '/modules/ui/MaterialInputs';

import { Documents } from '/modules/models/Documents';

export default function DocDirectory( props ) {

    function getColorFromString( str ) {
        var r = ( str.charCodeAt( str.length - 3 ) % 25 ) * 10;
        var g = ( str.charCodeAt( str.length - 2 ) % 25 ) * 10;
        var b = ( str.charCodeAt( str.length - 1 ) % 25 ) * 10;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    function checkCondition( condition, item ) {
        return (
            ( _.isString( condition ) && item.type == condition ) ||
            ( _.isArray( condition ) && _.contains( condition, item.type ) ) ||
            ( _.isFunction( condition ) && condition( item ) )
        )
    }

    function runaction( item ) {
        if ( item.verb ) {
            if ( item.verb.shouldConfirm ) {
                var message = confirm( item.label + ". Are you sure?" );
                if ( message != true ) {
                    return;
                }
            }
        }
        item.run();
        props.onChange();
    }

    let folder = props.folder,
        currentFolders = props.currentFolders,
        role = props.role,
        idx = props.idx,
        icon = 'fa fa-folder',
        color = '#acb5c0',
        visibility = true,
        docAlmostExpires = null,
        docExpired = null,
        docRemoveButton = null;
    if(!folder.content){
        icon = 'fa fa-file'
        let item = folder
        if ( item && item._id ) {
            item = Documents.findOne( { "_id": item._id } );
        }
        if ( item.type ) {
            color = getColorFromString( item.type );
        }
        docAlmostExpires = checkCondition(DocumentSchema.expiryDate.condition, item) && item.expiryDate && moment(item.expiryDate).diff(moment(new Date()), 'days') <= 14 && moment(item.expiryDate).diff(moment(new Date()), 'days') >= 0;
        docExpired = checkCondition(DocumentSchema.expiryDate.condition, item) && item.expiryDate && moment(item.expiryDate).diff(moment(new Date()), 'days') < 0;
        visibility =  _.contains([ 'facility manager', 'fmc support', "portfolio manager" ], role ) || !item.private || _.contains( item.visibleTo, role )
        docRemoveButton =  _.contains(['fmc support', "portfolio manager" ], role ) ?
            <span style={{display:"inline-block",minWidth:"15px",whiteSpace:"nowrap",textDecoratin:"underline",paddingLeft:"0px",float:'right'}}>
            <button
                type 		= "button"
                className 	= "btn btn-flat"
                title="Remove"
                onClick={( event ) => {
                        event.stopPropagation();
                        let remove = runaction( DocActions.destroy.bind(Session.getSelectedTeam(), folder ) );
                        //props.onChange();
                    }
                }>
                <span>&times;</span>
            </button>
        </span> : null
    }
    return (
        <div>
        {visibility==true?<div id={'doc-icon-'+idx} key={idx} className="doc-icon"  style={{paddingLeft:'12px',paddingRight:'10px',backgroundColor:(folder.folderColor?folder.folderColor:(docAlmostExpires?'#ffffcc':(docExpired?'#ffe0e0':'#ffffff')))}} onMouseOver={()=>{
            $("#doc-icon-"+idx).css("background-color", "#75aaee");
            $("#doc-icon-"+idx).css("box-shadow","1px 1px 1px #888")
            $("#icon-"+idx).css("box-shadow", "0px 1px 1px #888");
            $("#icon-"+idx).css("color", "#75aaee");
        }} onMouseOut={()=>{
            $("#doc-icon-"+idx).css("background-color",folder.folderColor?folder.folderColor:(docAlmostExpires?'#ffffcc':(docExpired?'#ffe0e0':'transparent'))  );
            $("#doc-icon-"+idx).css("box-shadow","0px 0px 0px white")
            $("#icon-"+idx).css("color", color);
            $("#icon-"+idx).css("box-shadow", "0px 0px 0px white");
        }} onClick={()=>{
            props.onClickFolder(folder,currentFolders)
        }}>
            <span style={{display:"inline-block",minWidth:"18px",color:'gray',paddingRight:"24px"}}><i style={{backgroundColor:(folder.folderColor?folder.folderColor:(docAlmostExpires?'#ffffcc':(docExpired?'#ffe0e0':'#ffffff'))),borderRadius:'60px',padding:(folder.content?'7px 7px':'7px 9px'),color:color,fontSize:'20px',marginTop:'10px'}} id={'icon-'+idx} className={icon}></i></span>
            <span style={{display:"inline-block",width:"20%",minWidth:"20px",whiteSpace:"nowrap"}}>{folder.name}</span>
            {docRemoveButton}
        </div>:null}
    </div>
    )
}
