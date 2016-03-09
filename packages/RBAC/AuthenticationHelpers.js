// I wonder what the benefits of caching these results would be?
AuthHelpers = {
  creator:function(role,user,item) {
    return item&&item.creator&&(item.creator._id==user._id);
  },
  dev:function(role,user){
    return user.role=="dev";
  },
  manager:function(role) {
    return role=="manager"||role=="support";
  },
  managerOrCreator:function(role,user,team) {
    return AuthHelpers.manager(role,user,team)||AuthHelpers.creator(role,user,team)
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
    var supplier = Teams.find({
      _id:request.supplier._id,
      members:{$elemMatch:{
        _id:user._id
      }}
    });
    return supplier.count()>0;
  },
  currentUser:function(role,loggedUser,itemUser) {
    return loggedUser._id==itemUser._id;
  },
  currentUserOrCreator:function(role,loggedUser,itemUser) {
    return AuthHelpers.currentUser(role,loggedUser,itemUser)||AuthHelpers.creator(role,loggedUser,itemUser)
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