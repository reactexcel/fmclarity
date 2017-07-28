import { DateTime, Select, Switch, FileField, TextArea, Text, Currency } from '/modules/ui/MaterialInputs';
import { FileExplorer } from '/modules/models/Files';
import React from "react";

export default InvoiceDetailsSchema = {

    invoiceNumber: {
        label: "Invoice number ",
        input: Text,
        size: 6,
    },

    dueDate: {
        label: "Due date",
        input: DateTime,
        size: 6,
        type: 'date',
        required: true,
        defaultValue: () => {
            return new Date();
        },
    },

    invoiceDate: {
        label: "Invoice date",
        input: DateTime,
        size: 6,
        type: 'date',
        required: true,
        defaultValue: () => {
            return new Date();
        },
    },

    details: {
        label: "Invoice details",
        input: Text,
        size: 6,
        required: true,
    },

    totalPayable: {
        label: "Total Payable( ex GST )",
        type: "number",
        input: (props)=>{
                return <Text {...props}
                    onChange={(value)=>{
                        // null should equate to 0
                        if( !value ) {
                            value = '0';
                        }
                        value = parseInt(value);
                        props.item.gst = 0.1 * value;
                        props.item.totalPayablePlusGst = value + props.item.gst;
                        props.onChange( value );
                    }}
                />
            },
        size: 6,
    },

    gst: {
        required: true,
        label: "GST",
        type: "number",
        input: (props)=>{
                return <Text {...props}
                    onChange={(value)=>{
                        // null should equate to 0
                        if( !value ) {
                            value = '0';
                        }
                        value = parseInt(value);
                        let totalPayable = value * 10,
                            totalPayablePlusGst = totalPayable + value;
                            
                        props.item.totalPayable = totalPayable;
                        props.item.totalPayablePlusGst = totalPayablePlusGst;
                        props.onChange( value );
                    }}
                />
            },
        size: 6,
    },

    totalPayablePlusGst: {
        required: true,
        label: "Total Payable( incl GST )",
        type: "number",
        input: (props)=>{
                return <Text {...props}
                    onChange={(value)=>{
                        // null should equate to 0
                        if( !value ) {
                            value = '0';
                        }
                        value = parseInt(value);
                        let totalPayable = (100*value)/110,
                            gst = 0.1*totalPayable;

                        props.item.totalPayable = totalPayable;
                        props.item.gst = gst;
                        props.onChange( value );
                    }}
                />
            },
        size: 6,
    },

    invoice: {
        label: "Invoice Attachment",
        type: "array",
        input: FileExplorer
    },
    status: {

        label: "Status",
        description: "The current status of the invoice",
        type: "string",
        input: Select,
        readonly: true,
        condition( item ) {
            return false;
        },
        options: {
            items: [
                'Draft',
                'New',
                'Approved',
                'Accepted',
                'Issued',
                'Complete',
                'Closed'
            ]
        }
    },
}
