import './Requests.jsx';

// doc-custom-queries
// Used by calendar - this is quite ugly
// where should it be - if it is only used but calendar shouldn't it be in there
// what is it? It's a few helpers for different types of complex queries
// well - this is the right place for them but then - is it?
// for starters I should probably put them in another file - and then think of 
// what to do with them ultimately later...
Issues.actions = {
  search(params) {
    var q = _.omit(params,'month');
    if(params.month) {
      var month = parseInt(params.month);
      var now = moment().setMonth(month);
      var start = now.startOf('month');
      var end = now.endOf('month');

      q.createdAt = {
        $gte:start.toDate(),
        $lte:end.toDate()
      }
    }
    return Issues.find(q);
  },
  searchByDate(args) {
    var q = args.q;
    var config = args.config;

    var groupBy = config.groupBy||'week';
    var start = config.startDate?moment(config.startDate):moment().subtract(5,'months').startOf('month');
    var end = config.endDate?moment(config.endDate):moment();
    var format = config.format||'MMM';

    var rs = {
      labels:[],
      sets:[]
    };

    //so that they are evenly distributed
    start.startOf(groupBy);
    end.endOf(groupBy);

    var now = start.clone();
    var lastLabel = '';
    while(!now.isAfter(end)) {
      var startDate = now.clone();
      var endDate = now.clone().endOf(groupBy);
      var label = startDate.format(format);
      if(label!=lastLabel) {
        lastLabel = label;
      }
      else {
        label='';
      }
      q.createdAt = {
        $gte:startDate.toDate(),
        $lte:endDate.toDate()
      }
      rs.labels.push(label);
      rs.sets.push(Issues.find(q).count());
      now.add(1,groupBy);
    }
    //console.log(rs);
    return rs;
  },
  find(params) {
    return this.search(params).fetch();
  },
  count(params) {
    return this.search(params).count();
  }
};
