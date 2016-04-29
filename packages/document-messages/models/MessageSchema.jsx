// move this to messages package

MessageSchema = {
  subject:{
    type:String,
  },
  body:{
    type:String,
  },
  recipient:{
    type:Object,
  },
  allRecipients:{
    type:[Object],
    defaultValue:[]
  },
  read:{
    type:Boolean,
    defaultValue:false
  },
  sticky:{
    type:Boolean,
    defaultValue:false    
  },
  rating:{
    type:Number,
    input:"vote",
    label:"Rating"
  },
  commments:{
    type:[Object],
    defaultValue:[]
  }
}