import { DateTime, Select, Switch, FileField, TextArea, Text } from '/modules/ui/MaterialInputs';

export default CloseDetailsSchema = {

    attendanceDate: {
        label: "Attendance date and time",
        input: DateTime,
        size: 6
    },

    completionDate: {
        label: "Completion date and time",
        input: DateTime,
        size: 6,
        required: true,
        defaultValue: () => {
            return new Date();
        }
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
    },

    invoice: {
        label: "Invoice",
        input: FileField,
    },

    furtherWorkRequired: {
        label: "Further work required",
        type: "boolean",
        input: Switch
    },

    furtherWorkDescription: {
        label: "Details of further work",
        input: TextArea,
        required: true,
        condition( item ) {
            return item.furtherWorkRequired == true;
        },
    },

    furtherPriority: {
        label: "Priority",
        input: Select,
        options: {
            items: [ "Scheduled", "Standard", "Urgent", "Critical" ]
        },
        condition( item ) {
            return item.furtherWorkRequired == true;
        },
    },

    furtherQuote: {
        label: "Quote",
        input: FileField,
        optional: true,
        condition( item ) {
            return item.furtherWorkRequired == true;
        },
    },

    furtherQuoteValue: {
        label: "Value of quote",
        input: Text,
        optional: true,
        condition( item ) {
            return item.furtherWorkRequired == true;
        },
    }
}
