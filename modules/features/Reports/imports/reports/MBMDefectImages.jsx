import React from "react";
import moment from 'moment';
import { Requests } from '/modules/models/Requests';
import { Files } from '/modules/models/Files';
import { Reports } from '/modules/models/Reports';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { TextArea } from '/modules/ui/MaterialInputs';

const MBMDefectImages = React.createClass( {
    getInitialState(){
      let	user = Meteor.user();
      let team = user.getSelectedTeam();
      let facility = Session.getSelectedFacility();
        return{
            data:[],
            removedImg:[],
            expandall: false,
            comment: "",
            commentData: {},
            facility,
            team
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
                    </div>
                );
            }
        }
        return null;
    },
    getComment(s) {

      var facility = this.state.facility
      var query = {};
      if ( facility ) {
        query[ "facility._id" ] = facility._id;
      }
      var team = this.state.team
      if ( team ) {
        query[ "team._id" ] = team._id;
      }
      const handle = Meteor.subscribe('User: Facilities, Requests,Reports') ;
      let commentQuery = {}
      commentQuery[ "facility._id" ] = facility._id;
      commentQuery[ "team._id" ] = team._id;
      commentQuery["type"]="Defect";
      commentQuery["createdAt"] = {
        $gte: moment().subtract(0, "months").startOf("month").toDate(),
        $lte: moment().subtract(0, "months").endOf("month").toDate( )
      };
      let currentMonthComment = Reports.find(commentQuery).fetch();
      commentQuery["createdAt"] = {
        $gte: moment().subtract(1, "months").startOf("month").toDate(),
        $lte: moment().subtract(1, "months").endOf("month").toDate( )
      };
      let previousMonthComment = Reports.find(commentQuery).fetch();

      if ( facility ) {
        let finalComment
        let currentMonth = false
        if(s != null){
          let previousMonthServiceComment = previousMonthComment.filter((val) => val.service === s.name);
          let presentMonthServiceComment = currentMonthComment.filter((val) => val.service === s.name);
          if(presentMonthServiceComment.length > 0){
            currentMonth = true
            finalComment = presentMonthServiceComment
          }else{
            currentMonth = false
            finalComment = previousMonthServiceComment
          }
          return <CommentRequest serviceName={s.name} commentData = {finalComment} currentMonth ={currentMonth}/>
        }
        //console.log(d);
      }
    },

	render() {
		return (
			<div className = "defectTable">
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
                      {this.getComment(d)}
                    </td>
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



const CommentRequest = React.createClass( {

	getInitialState() {
		return ( {
      expandall: false,
			comment: this.props.commentData.length > 0 ? this.props.commentData[0].comment : "",
			commentData:this.props.commentData.length > 0 ? this.props.commentData[0] : {},
			currentMonth: this.props.currentMonth
		} )
	},
  componentWillReceiveProps(props){
  this.setState({
    comment: props.commentData.length > 0 ? props.commentData[0].comment : "",
    commentData:props.commentData.length > 0 ? props.commentData[0] : {},
    currentMonth:props.currentMonth
  })
  },
	handleComment(item){
		let	user = Meteor.user();
		let team = user.getSelectedTeam();
		let facility = Session.getSelectedFacility();
		let commentSchema = {
			service : this.props.serviceName,
			team : {
				_id : team._id
			},
			facility :{
				_id : facility._id
			},
      type:"Defect",
			comment : this.state.comment.trim()
		}
    console.log(item);
		if(item){

			if(!item._id){
				let test = this.state.comment.trim()

				if(test != "" || null || undefined){
					Reports.save.call(commentSchema);
				}

			}else{
				item["comment"] = this.state.comment;
				let test = this.state.comment.trim()

				if(test != "" || null || undefined){
					if(this.state.currentMonth){
						console.log("current");
						Reports.save.call(item);
				}else{
						console.log("previousMonthComment");
						Reports.save.call(commentSchema);
					}
				}

			}
		}
	},

	render() {
		let item = this.state.commentData;
		return (
				<div className = "test">
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
											this.handleComment(item);
										}
									})
								}}>
								{!this.state.showEditor?
									<i className="fa fa-pencil-square-o" aria-hidden="true"></i>:
									<i className="fa fa-floppy-o" aria-hidden="true"></i>
								}
							</button>
						</span>
					</div>
					<div className="comment-body">
						{this.state.showEditor?
							<TextArea
								ref="textarea"
								style={{height:"50px"}}
								value={this.state.comment}
								onChange={( value ) => {this.setState({ comment: value })}}
								/>:
							<div>
								<p style={{fontFamily: "inherit"}}>{this.state.comment}</p>
							</div>}
					</div>
				</div>
		)
	}

} );

export default MBMDefectImages;
