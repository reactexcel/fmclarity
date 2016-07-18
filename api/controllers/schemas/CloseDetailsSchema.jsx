CloseDetailsSchema = {
    attendanceDate: {
      label:"Attendence date and time",
      input:"date",
      size:6
    },
    completionDate: {
      label:"Completion date and time",
      input:"date",
      size:6
    },
    /*
    serviceReport: {
      label:"Service report",
      input:"FileField",
    },
    */
    serviceReport:{
      label:"Service report",
      input:"FileField"
    },
    invoice:{
      label:"Invoice",
      input:"FileField"
    },
    furtherWorkRequired: {
      label:"Further work required",
      input:"switch",
    },
    furtherWorkDescription: {
      label:"Details of further work",
      input:"mdtextarea",
      condition(item) {
        return item&&(item.furtherWorkRequired == true);
      },
    },
    furtherPriority : {
      label:"Priority",
      input:"MDSelect",
      options:{items:["Scheduled","Standard","Urgent","Critical"]},
      condition(item) {
        return item&&(item.furtherWorkRequired == true);
      },
    },
    furtherQuote: {
      label:"Quote",
      input:"FileField",
      condition(item) {
        return item&&(item.furtherWorkRequired == true);
      },
    },
    furtherQuoteValue: {
      label:"Value of quote",
      condition(item) {
        return item&&(item.furtherWorkRequired == true);
      },
    }
}