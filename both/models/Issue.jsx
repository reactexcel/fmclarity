
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
  }
});