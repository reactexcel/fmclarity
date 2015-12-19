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
  facility:{
    type:Object
  },
  supplier:{
    type:Object
  },
  assignee:{
    type:Object
  }
},true);

Issues.helpers({
  getFacility() {
    return Facilities.findOne(this.facility._id);
  },
  getCreator() {
    return Users.findOne(this.creator._id);
  },
  getTeam() {
    return Teams.findOne({_id:this.team._id});
  },
  getArea() {
    return this.area;
  },
  getPotentialSuppliers() {
    if(this.service&&this.service.name) {
      var query = {};
      var team = this.getTeam();
      query["$or"] = [team].concat(team.suppliers);
      query["services"] = { $elemMatch : {
          name:this.service.name,
          available:true
      }};
      if(this.subservice&&this.subservice.name) {
        query["services.subservices"] = { $elemMatch : {
            name:this.subservice.name,
            available:true
        }};
      }
      var teams = Teams.find(query).fetch();
      console.log({
              query:query,
              teams:teams
            });
      return teams;
    }
    return null;
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
    this.supplier = supplier;
    this.save();
  },
  getSupplier() {
    if(this.supplier) {
      return Teams.findOne(this.supplier._id);
    }
  },
  getAssignee() {
    if(this.assignee) {
      return Users.findOne(this.assignee._id);
    }
  },
  isNew() {
    return this.status=="New";
  },
  isEditable() {
    return this.isNew();
  },
  canCreate() {
    return (
      this.name&&this.name.length&&
      this.description&&this.description.length&&
      this.facility&&this.facility._id&&
      this.area&&this.area.name.length&&
      this.service&&this.service.name.length
    )    
  },
  canIssue() {
    return (
      this.canCreate()&&
      this.subservice&&this.subservice.name.length&&
      this.supplier&&this.supplier._id
    )   
  },
  canClose() {
    return (
      this.canIssue()&&
      this.status=="Issued"
    )
  },
});