import { DateTime, Select, Switch, FileField, TextArea, Text, Currency } from '/modules/ui/MaterialInputs';
import React from "react";

export default InvoiceDetailsSchema = {

    invoiceNumber: {
        label: "Invoice number ",
        input: Text,
        size: 6,
    },

    invoiceDate: {
        label: "Invoice date",
        input: DateTime,
        size: 6,
        required: true,
        defaultValue: () => {
            return new Date();
        },
    },

    dueDate: {
        label: "Due date",
        input: DateTime,
        size: 6,
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
                return <Currency {...props}
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
        input: Currency,
        required: true,
        label: "GST",
        size: 6,
    },

    totalPayablePlusGst: {
        input: Currency,
        required: true,
        label: "Total Payable( incl GST )",
        size: 6,
    },

    invoice: {
        label: "Invoice Attachment",
        input: FileField,
    },
    status: {

        label: "Status",
        description: "The current status of the invoice",
        type: "string",
        input: Select,
        readonly: true,
        defaultValue: "New",
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
