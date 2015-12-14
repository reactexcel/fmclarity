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
      var team = Teams.findOne({_id:item.team._id});
      return team.getNextWOCode();
    }
  },
  thumb:{
    label:"Thumbnail file",
    defaultValue:["img/default-placeholder.png"]
  },
  attachments:{
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
  team:{
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
    return Teams.findOne({_id:this.team._id});
  },
  getArea() {
    return this.area;
  },
  getTimeframe() {
    var team = this.getTeam();
    return team.getTimeframe(this.priority);
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