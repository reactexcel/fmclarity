CloseDetails = {
    attendenceDate: {
      label:"Attendence date",
      size:6
    },
    attendenceTime: {
      label:"Attendence time",
      size:6
    },
    completionDate: {
      label:"Completion date",
      size:6
    },
    completionTime: {
      label:"Completion time",
      size:6
    },
    furtherWorkRequired: {
      label:"Is further work required?",
      input:"switch",
    },
    futureWork: {
      label:"Enter details of future work",
      input:"mdtextarea",
    }
};


Issues = FM.createCollection('Issue',{
  name:{
  },
  priority:{
    defaultValue:"Standard",
  },
  description:{
    input:"textarea"
  },
  status:{
    defaultValue:"New",
  },
  costThreshold:{
    defaultValue:500,
  },
  costActual:{
  },
  closeDetails:{
    type:Object,
    schema:CloseDetails
  },
  code:{
    defaultValue:function(item) {
      var team = Teams.findOne({_id:item._team._id});
      return team.getNextWOCode();
    }
  },
  thumb:{
    label:"Thumbnail file",
    defaultValue:["img/default-placeholder.png"]
  },
  _attachments:{
    type:[Object],
    label:"Attachments",
    input:"attachments"
  },
  messages:{
    type:[Object],
    label:"Discussion"
  },
  area:{
  },
  _team:{
    type:Object
  },
  _facility:{
    type:Object
  },
  _contact:{
    type:Object
  },
  _supplier:{
    type:Object
  },
  _assignee:{
    type:Object
  }
},true);

Issues.helpers({
  getFacility() {
    return Facilities.findOne(this._facility._id);
  },
  getContact() {
    return this.contact;
  },
  getCreator() {
    return Users.findOne(this._creator._id);
  },
  getTeam() {
    return Teams.findOne({_id:this._team._id});
  },
  getTimeframe() {
    var team = this.getTeam();
    return team.getTimeframe(this.priority);
  },
  getAttachmentUrl(index) {
    index=index||0;
    var file;
    if(this._attachments&&this._attachments[index]) {
      file = Files.findOne(this._attachments[index]._id);
      if(file) {
        return file.url();
      }
  }
  return "img/default-placeholder.png";
  },
  getThumbUrl() {
    return this.getAttachmentUrl(0);
  },
  setPriority(priority) {
    var team = this.getTeam();
    this.priority = priority;
    this.timeframe = team.getTimeframe(priority);
  },
  setSupplier(supplier) {
    this._supplier = supplier;
    this.save();
  },
  getSupplier() {
    if(this._supplier) {
      return Teams.findOne(this._supplier._id);
    }
  },
  getAssignee() {
    if(this._assignee) {
      return Users.findOne(this._assignee._id);
    }
  },
});