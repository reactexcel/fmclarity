import { DateInput, Select, Switch, FileField, TextArea, Text, Currency } from '/modules/ui/MaterialInputs';
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
        input: DateInput,
        size: 6,
        type: 'date',
        required: true,
        defaultValue: () => {
            return new Date();
        },
    },

    invoiceDate: {
        label: "Invoice date",
        input: DateInput,
        size: 6,
        type: 'date',
        required: true,
        defaultValue: () => {
            return new Date();
        },
    },

    details: {
        label: "Invoice details",
        input: TextArea,
        size: 12,
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
                        //value = value.replace(/,/g, '');
                        let gst = 0.1 * parseFloat(value.replace(/,/g, '')),
                            totalPayablePlusGst = parseFloat(value.replace(/,/g, '')) + parseFloat(gst);
                        props.item.gst = formatToCurrency(gst.toFixed(2));
                        props.item.totalPayablePlusGst = formatToCurrency(totalPayablePlusGst.toFixed(2));
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
                return <Currency {...props}
                    onChange={(value)=>{
                        // null should equate to 0
                        if( !value ) {
                            value = '0';
                        }
                        let totalPayable = parseFloat(value.replace(/,/g, '')) * 10,
                            totalPayablePlusGst = totalPayable + parseFloat(value.replace(/,/g, ''));
                            
                        props.item.totalPayable = formatToCurrency(totalPayable.toFixed(2));
                        props.item.totalPayablePlusGst = formatToCurrency(totalPayablePlusGst.toFixed(2));
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
                return <Currency {...props}
                    onChange={(value)=>{
                        // null should equate to 0
                        if( !value ) {
                            value = '0';
                        }
                        let totalPayable = (100*parseFloat(value.replace(/,/g, '')))/110,
                            gst = 0.1*totalPayable;

                        props.item.totalPayable = formatToCurrency(totalPayable.toFixed(2));
                        props.item.gst = formatToCurrency(gst.toFixed(2));
                        props.onChange( value );
                    }}
                />
            },
        size: 6,
    },

    invoice: {
        label: "Invoice Attachment",
        required: true,
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

function formatToCurrency (val){
    val = val.toString().replace(/,/g, "");
    val += '';
    x = val.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';

    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return (x1 + x2);
}