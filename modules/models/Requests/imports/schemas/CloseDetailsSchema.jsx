import { DateTime, Select, Switch, FileField, TextArea, Text, Currency } from '/modules/ui/MaterialInputs';
import React from "react";
import moment from 'moment';

export default CloseDetailsSchema = {

    attendanceDate: {
        label: "Attendance date and time",
        input: DateTime,
        size: 6,
        condition( item ) {
            return (item.jobCancelled == undefined ? false : item.jobCancelled) == false
        },
    },

    completionDate: {
        label: "Completion date and time",
        input: (props)=>{
            return <DateTime
                {...props}
                onChange = { (val,callback) => {
                    if(moment(val).isAfter(moment(new Date()))){
                        Bert.alert({
    						  title: 'Operation not allowed',
    						  message: 'Date is invalid.',
    						  type: 'danger',
    						  style: 'growl-top-right',
    						  icon: 'fa-ban'
    						});
                        if(callback){
                            callback();
                        }
                    } else{
                        props.onChange(val)
                    }
                }}
            />
        },
        size: 6,
        required: true,
        defaultValue: () => {
            return new Date();
        },
        condition( item ) {
            return (item.jobCancelled == undefined ? false : item.jobCancelled) == false
        },
    },

    comment:{
        label: "Comment",
        input: TextArea,
        type: "string",
        required: true,
        condition( item ) {
            return (item.jobCancelled == undefined ? false : item.jobCancelled) == true;
        },
    },
    /*
    serviceReport: {
      label:"Service report",
      input:FileField,
    },
    */

    serviceReport: {
        label: "Service report",
        input: FileField,
        condition( item ) {
            return (item.jobCancelled == undefined ? false : item.jobCancelled) == false
        },
    },

    /*invoice: {
        label: "Invoice",
        input: FileField,
        condition( item ) {
            return (item.jobCancelled == undefined ? false : item.jobCancelled) == false
        },
    },*/

    furtherWorkRequired: {
        label: "Further work required",
        type: "boolean",
        input: Switch,
        condition( item ) {
            return (item.jobCancelled == undefined ? false : item.jobCancelled) == false
        },
    },

    jobCancelled: {
        label: "Job Cancelled",
        type: "boolean",
        input: Switch
    },

    furtherWorkDescription: {
        label: "Details of further work",
        input: TextArea,
        required: true,
        condition( item ) {
            return item.furtherWorkRequired == true && (item.jobCancelled == undefined ? false : item.jobCancelled) == false;
        },
    },

    furtherPriority: {
        label: "Priority",
        input: Select,
        options: {
            items: [ "Scheduled", "Standard", "Urgent", "Critical" ]
        },
        condition( item ) {
            return item.furtherWorkRequired == true && (item.jobCancelled == undefined ? false : item.jobCancelled) == false;
        },
    },

    furtherQuote: {
        label: "Quote",
        input: FileField,
        optional: true,
        condition( item ) {
            return item.furtherWorkRequired == true && (item.jobCancelled == undefined ? false : item.jobCancelled) == false;
        },
    },

    furtherQuoteValue: {
        label: "Value of quote",
        input: Currency,
        optional: true,
        condition( item ) {
            return item.furtherWorkRequired == true && (item.jobCancelled == undefined ? false : item.jobCancelled) == false;
        },
    }
}
