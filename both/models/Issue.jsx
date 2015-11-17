Schema.Issues = new SimpleSchema({
  name:{
    type:String,
  }
});

Issues = FM.createCollection('Issue',{
  name:"",
  status:"New",
  thumb:1,
  _team:{
  },
  _facility:{
  },
  _contact:{
  },
  _supplier:{
  },
  _assignee:{
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