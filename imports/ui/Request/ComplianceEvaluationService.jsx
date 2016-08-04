ComplianceEvaluationService = new function() {

  var defaultResult = {
    passed:false,
    message:{
      summary:"failed"
    },
    resolve() {
      alert('No resolution available');
    }
  }

  var evaluators = {
    //can pass in facility and service for more efficient calculation
    "Document exists":function(rule,facility,service){
    },
    "Document is current":function(rule,facility,service){

    },
    "PPM schedule established":function(rule,facility,service){
      console.log(rule);
      if(!facility) {
        return _.extend({},defaultResult,{
          passed:false,
          message:{
            summary:"failed",
            detail:"Facility not specified"
          }
        })
      }
      else if(!rule.service) {
        return _.extend({},defaultResult,{
          passed:false,
          message:{
            summary:"failed",
            detail:"Service not specified"
          }
        })
      }
      var numEvents = Issues.find({'facility._id':facility._id,'service.name':rule.service.name,type:"Preventative"}).count();
      if(numEvents) {
        return _.extend({},defaultResult,{
          passed:true,
          message:{
            summary:"passed",
            detail:numEvents+ " "+(rule.service.name?(rule.service.name+" "):"")+"PMP events setup"
          }
        })
      }
      return _.extend({},defaultResult,{
        passed:false,
        message:{
          summary:"failed",
          detail:"Set up "+(rule.service.name?(rule.service.name+" "):"")+"PPM rules"
        },
        resolve:function(){
          FABActions.createRequest();
        }
      })
    },
    "PPM event completed":function(rule,facility,service){
      var event;
      if(rule.event) {
        event = Issues.findOne(rule.event._id);
      }
      
      if(event) {
        return _.extend({},defaultResult,{
          passed:true,
          message:{
            summary:"passed",
            detail:"Last completed "+moment(event.dueDate).format('ddd Do MMM')
          },
          data:event
        })
      }
      return _.extend({},defaultResult,{
        passed:false,
        message:{
          summary:"failed",
          detail:"PPM event not found"
        }
      })
    }
  }

  function evaluateRule(rule,facility,service) {
    if(!facility&&rule.facility) {
      facility = Facilities.findOne(rule.facility._id);
    }
    var func,result;
    func = evaluators[rule.type];
    if(func) {
      result = func(rule,facility,service);
    }
    else {
      console.log("No "+rule.type+" evaluator");
    }
    return result||{
      passed:false
    }
  }

  function evaluate(rules) {
    var results = {
      passed:[],
      failed:[]
    };
    if(!_.isArray(rules)) {
      rules = [rules];
    }
    rules.map((r)=>{
      var result = evaluateRule(r);
      if(result.passed) {
        results.passed.push(result);
      }
      else {
        results.failed.push(result);
      }
    })
    return results;
  }

  return {
    evaluateRule,
    evaluate
  }
}