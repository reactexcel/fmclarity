import { DateTime, Select, Switch, FileField, TextArea, Text } from '/modules/ui/MaterialInputs';

export default CloseDetailsSchema = {
    attendanceDate: {
        label: "Attendence date and time",
        input: DateTime,
        size: 6
    },
    completionDate: {
        label: "Completion date and time",
        input: DateTime,
        size: 6
    },
    /*
    serviceReport: {
      label:"Service report",
      input:FileField,
    },
    */
    serviceReport: {
        label: "Service report",
        input: FileField
    },
    invoice: {
        label: "Invoice",
        input: FileField
    },
    furtherWorkRequired: {
        label: "Further work required",
        input: Switch
    },
    furtherWorkDescription: {
        label: "Details of further work",
        input: TextArea,
        condition( item ) {
            //I have a hunch this is broken
            //shouldn't we be sending in the subobject as item?
            return item.closeDetails && ( item.closeDetails.furtherWorkRequired == true );
        },
    },
    furtherPriority: {
        label: "Priority",
        input: Select,
        options: {
            items: [ "Scheduled", "Standard", "Urgent", "Critical" ]
        },
        condition( item ) {
            return item.closeDetails && ( item.closeDetails.furtherWorkRequired == true );
        },
    },
    furtherQuote: {
        label: "Quote",
        input: FileField,
        condition( item ) {
            return item.closeDetails && ( item.closeDetails.furtherWorkRequired == true );
        },
    },
    furtherQuoteValue: {
        label: "Value of quote",
        input: Text,
        condition( item ) {
            return item.closeDetails && ( item.closeDetails.furtherWorkRequired == true );
        },
    }
}
