import React from "react";
import moment from 'moment';
import { Requests } from '/modules/models/Requests';
import { Files } from '/modules/models/Files';
import { ReactMeteorData } from 'meteor/react-meteor-data';

const MBMServiceImages = React.createClass( {
    getInitialState(){
        return{
            data:[],
            removedImg:[],
            expandall: false,
          };
    },
	componentWillMount() {
    this.updateImages();
	},
  componentWillReceiveProps(){
    this.updateImages();
  },
  componentDidMount(){
    setTimeout(function(){
      $(".loader").hide();
    },2000)
  },
    updateImages(){
      var user, team, facility, requests, data = [];
          var user = Meteor.user();
  		if ( user ) {
  			var q = {
          			type:{$ne:'Defect'}
        };
  			team = Session.getSelectedTeam();
  			facility = Session.getSelectedFacility();
  			if ( facility ) {
  				let services = facility.servicesRequired;
          // console.log(services);
          services = services.filter((val)=> val != null)
                  q['facility._id'] = facility._id;
                  // q['closeDetails.completionDate'] = {
                  //     $gte: moment().startOf("month").toDate(),
                  //     $lte: moment().endOf("month").toDate()
                  // };
                   q['dueDate'] = {
                       $gte: moment().startOf("month").toDate(),
                       $lte: moment().endOf("month").toDate()
                   };
                  q['status'] = {$in:['Complete', "Issued", "Closed" , "New"]};
                  for (var i in services) {
                      q['service.name'] = services[i].name;
                      let requests = Requests.findAll(q);
                      if (requests.length){
                          data.push({
                              name: services[i].name,
                              requests: requests
                          })
                      }
                  }
  			}
  		}
  		this.setState({
              data
          })
    },
    printChart(){
		var component = this;
		component.setState( {
			expandall: true
		} );

		setTimeout(function(){
			window.print();
			component.setState( {
				expandall: false
			} );
		},200);
	},
    handleRemove( key ){
        let { removedImg } = this.state;
        removedImg.push(key);
        this.setState({ removedImg });
    },
    getImage( _id ){
        let file = Files.findOne({_id});
        let url = null;
        let { removedImg } = this.state;
        if (file != null ) {
            url = file.url();
            if( _.contains(["jpg", "png"], file.extension()) && !_.contains(removedImg, _id) ) {
                return (
                    <div className="col-sm-3 report-thumb" key={_id}>
                        <img src={url} style={{ height:"150px", width:"200px" }} />
                        <span
                            className="remove-img"
                            title="Remove image"
                            onClick={() => this.handleRemove(_id)}
                        >
                            &times;
                        </span>
                    </div>
                );
            }
        }
        return null;
    },

	render() {
		return (
			<div>
        {this.props.MonthlyReport ? null :
					<button className="btn btn-flat pull-left noprint"  onClick={this.printChart}>
						<i className="fa fa-print" aria-hidden="true"></i>
					</button>
				}
                <div className="ibox-content">
                    {this.state.data.map( ( d, idx ) => {
                        return(
                            <div className="row" key={idx}>
                                {_.flatten(d.requests.map( (r, idy) => {
                                    let imgs = [];
                                    if (r.attachments && r.attachments.length) {
                                        imgs.push(<div className="row" key={idy} style={{marginLeft:"5px"}}>
                                            <div className="col-sm-12" style={{paddingTop:"20px", marginBottom:"5px", fontWeight:"500"}}>
                                                <span>#WO: <em>{r.code}</em></span>
                                                <span style={{paddingLeft:"10px"}}>
                                                    {r.name}
                                                </span>
                                            </div>
                                        </div>
                                        );
                                        r.attachments.map( (attach, idz) => {
                                            let element = this.getImage(attach._id);
                                            // console.log(element);
                                            if( element ) {
                                                imgs.push( element);
                                                imgs.unshift(
                                                  <div className="col-sm-12" style={{borderTop:"1px solid black"}} key = {idy + idx + 25000 +idz}>
                                                    <h3>
                                                        {d.name}
                                                    </h3>
                                                </div>)
                                            }
                                        });
                                    }
                                    return imgs;
                                }), true)}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
	}
} )

export default MBMServiceImages;
