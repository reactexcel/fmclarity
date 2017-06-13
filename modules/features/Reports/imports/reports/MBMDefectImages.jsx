import React from "react";
import moment from 'moment';
import { Requests } from '/modules/models/Requests';
import { Files } from '/modules/models/Files';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { TextArea } from '/modules/ui/MaterialInputs';

const MBMDefectImages = React.createClass( {
    getInitialState(){
        return{
            data:[],
            removedImg:[],
            expandall: false,
            comment: "",
            commentData: {},
          };
    },

	componentWillMount() {
    this.updateImages();
	},
  componentWillReceiveProps(){
    this.updateImages();
  },
    updateImages(){
      var user, team, facility, requests, data = [];
          var user = Meteor.user();
  		if ( user ) {
  			var q = {};
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
                  q['status'] = {$in:['Completed', "Issued"]};
                  q['type'] = "Defect";
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
    getImage( _id ){
        let file = Files.findOne({_id});
        let url = null;
        let { removedImg } = this.state;
        if (file != null ) {
            url = file.url();
            if( _.contains(["jpg", "png"], file.extension()) && !_.contains(removedImg, _id) ) {
                return (
                    <div className="col-sm-3 report-thumb" key={_id}>
                        <img src={url} style={{ height:"100%", width:"100%" }} />
                    </div>
                );
            }
        }
        return null;
    },

	render() {
		return (
			<div className = "defectTable">
        {this.props.MonthlyReport ? null :
					<button className="btn btn-flat pull-left noprint"  onClick={this.printChart}>
						<i className="fa fa-print" aria-hidden="true"></i>
					</button>
				}
                <div className="ibox-content">
                  <table>
                    <thead>
                    <tr>
                    <th>S no.</th>
                    <th>Service</th>
                    <th>Images</th>
                  </tr>
                  </thead>
                <tbody>

                  {this.state.data.map( ( d, idx ) => {
                    return(
                      <tr key={idx} >
                        <td>{idx+1}</td>
                        <td style={{fontWeight:"600"}}>{d.name}</td>
                        <td>{_.flatten(d.requests.map( (r, idy) => {
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
                            }
                          });
                        }
                        return imgs;
                      }), true)}
                      <div style={ { marginTop: "180px"} } key={idx+2000}>
              					<div className="comment-header">
              						<h4>Comments</h4>
              						<span style={{float: "right"}}>
              							<button className="btn btn-flat" onClick={(e) => {
              									let edited = this.state.showEditor;
              									let component = this;
              									this.setState({
              										showEditor: !this.state.showEditor
              									}, () => {
              										if ( !edited ){
              											//console.log("edited", component );
              											$(component.refs.textarea.refs.input).focus();
              										}else{
              											// this.handleComment(item);
              										}
              									})
              								}}>
              									<i className="fa fa-floppy-o" aria-hidden="true"></i>
              							</button>
              						</span>
              					</div>
              					<div className="comment-body">
              							<TextArea
              								ref="textarea"
              								style={{height:"50px"}}
              								value={this.state.comment}
              								onChange={( value ) => {this.setState({ comment: value })}}
              								/>
              					</div>
              				</div>
                    </td>

                      {/* <div className="col-sm-12">
                        <h3>
                        {d.name}
                      </h3>
                    </div>
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
          }
        });
      }
      return imgs;
    }), true)} */}
  </tr>
)
})}
                </tbody>
                  </table>
                </div>
            </div>
        )
	}
} )

export default MBMDefectImages;
