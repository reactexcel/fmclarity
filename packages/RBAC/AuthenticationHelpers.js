// I wonder what the benefits of caching these results would be?
AuthHelpers = {
  owner:function(role,user,item) {
    if(item&&item.owner) {
      if(item.owner.type=="team") {
        var team = Teams.findOne(item.owner._id);
        var role = RBAC.getRole(user,team);
        return role=="manager";
      }
      else {
        return item.owner._id==user._id;
      }
    }
  },
  dev:function(role,user){
    return user.role=="dev";
  },
  manager:function(role) {
    return role=="manager"||role=="support";
  },
  managerOrOwner:function(role,user,team) {
    return AuthHelpers.manager(role,user,team)||AuthHelpers.owner(role,user,team)
  },
  managerOfRelatedTeam:function (role,user,item) {
    var team = Teams.findOne(item.team._id);
    var role = RBAC.getRole(user,team);
    return role=="manager";
  },
  memberOfRelatedTeam:function (role,user,item) {
    var team = Teams.find({
      _id:item.team._id,
      members:{$elemMatch:{
        _id:user._id
      }}
    });
    return team.count()>0;
  },
  memberOfSuppliersTeam:function (role,user,request) {
    var supplier = request.supplier;
    if(supplier) {

      var query = {members:{$elemMatch:{
        _id:user._id
      }}};

      if(supplier._id) {
        query._id = supplier._id;
      }
      else if(supplier.name) {
        query.name = supplier.name;
      }

      return Teams.find(query).count()>0;
    }
  },
  currentUser:function(role,loggedUser,itemUser) {
    return loggedUser._id==itemUser._id;
  },
  currentUserOrOwner:function(role,loggedUser,itemUser) {
    return AuthHelpers.currentUser(role,loggedUser,itemUser)||AuthHelpers.owner(role,loggedUser,itemUser)
  },
  managerofMembersTeam:function(role,user,item) {
    //not sure this one is valid?
    var teams = Teams.find({
      $and:[
        {members:{$elemMatch:{
          _id:Meteor.userId(),
        }}},
        {members:{$elemMatch:{
          _id:user._id,
          role:"manager"
        }}}
      ]
    });
    return teams.count()>0;
  }
}