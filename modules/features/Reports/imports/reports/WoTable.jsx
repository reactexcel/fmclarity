import React from "react";
import moment from 'moment';
import { Requests } from '/modules/models/Requests';
import { Files } from '/modules/models/Files';
import { Reports } from '/modules/models/Reports';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { TextArea } from '/modules/ui/MaterialInputs';
import { AutoForm } from '/modules/core/AutoForm';
import { Modal } from '/modules/ui/Modal';

const WoTable = React.createClass( {
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
  componentDidMount(){
    	$(".loader").hide();
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
                  //  q['dueDate'] = {
                  //      $gte: moment().startOf("month").toDate(),
                  //      $lte: moment().endOf("month").toDate()
                  //  };

                  q["type"] = {$ne:'Defect'}

                  q['status'] ={$nin:['Deleted','PPM']};
                      q['service.name'] = this.props.service;
                      let requests = Requests.findAll(q);
                      if (requests.length){
                          data.push({
                              name: this.props.service,
                              requests: requests
                          })
                      }
  			}
  		}
  		this.setState({
              data
          })
    },
    handleRemove( key ){
        let { removedImg } = this.state;
        removedImg.push(key);
        this.setState({ removedImg });
    },
    handleRemoveWO( r ){
		var message = confirm( 'Are you sure you want to delete this WO?' );
    console.log(message,r);
    if(message){
      r["status"]="Deleted"
      Requests.save.call(r)
    }
    },
    getImage( _id ){

        let file = Files.findOne({_id});
        let url = null;
        let { removedImg } = this.state;
        if (file != null ) {
            url = file.url();
            if( _.contains(["jpg", "png"], file.extension()) && !_.contains(removedImg, _id) ) {
                return (
                  <div className="col-sm-7 report-thumb" style={{padding:"0"}} key={_id}>
                    {/* <span
                      style={{top:"5px",left:"180px"}}
                      className="remove-img"
                      title="Remove image"
                      onClick={() => this.handleRemove(_id)}
                      >
                        &times;
                      </span> */}
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
      commentQuery["type"]="WOComment";
      commentQuery["code"]= s.code ;
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
          let previousMonthServiceComment = previousMonthComment.filter((val) => val.service === s.service.name);
          let presentMonthServiceComment = currentMonthComment.filter((val) => val.service === s.service.name);
          if(presentMonthServiceComment.length > 0){
            currentMonth = true
            finalComment = presentMonthServiceComment
          }else{
            currentMonth = false
            finalComment = previousMonthServiceComment
          }
          return <CommentRequest serviceName={s.service.name} request = {s} commentData = {finalComment} currentMonth ={currentMonth}/>
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
                    <th>WO#</th>
                    <th>Summary & Images</th>
                    <th>Value</th>
                    <th>Comments</th>
                  </tr>
                  </thead>
                <tbody>

                  {this.state.data.map( ( d, idx ) => {
                    return(

                      _.flatten(d.requests.map( (r, idy) => {

                          let imgs = [];
                          let owner = r.getOwner();
                          if (r.attachments && r.attachments.length) {
                          r.attachments.map( (attach, idz) => {
                            let element = this.getImage(attach._id);
                            // console.log(element);
                            if( element ) {
                              imgs.push( element);
                            }
                          });
                        }
                        return (
                          <tr key={idx + idy} className="row-WO">
                            <td>{r.code}</td>
                            <td>
                              <span
                                style={{right:"200px"}}
                                className="remove-WO"
                                title="Remove image"
                                onClick={() => this.handleRemoveWO(r)}
                                >
                                  &times;
                                </span>
                              <span style={{
                                color:"#0152b5",
                                fontSize:"20px",
                                fontWeight:"900",
                                float:"right",
                                cursor:"pointer"
                              }} onClick={()=>{$(".add"+r.code).show()}}>+</span>
                              <div className = {"add"+r.code}  style = {
                                  {
                                    background: "rgba(0,0,0,0.5)",
                                    position: "fixed",
                                    zIndex: 5000,
                                    left: "0px",
                                    right: "0px",
                                    top: "0px",
                                    bottom: "0px",
                                    textAlign: "center",
                                    display:"none"
                                  }
                                } >
                                <span
                                  style={{top:"70px",right:"37px",fontSize:"50px",height:"55px",width:"55px",cursor:"pointer",display:"block"}}
                                  className="remove-img"
                                  title="Remove image"
                                  onClick={() => {
                                    $(".add"+r.code).hide();
                                  }}
                                  >
                                    &times;
                                  </span>
                                <div style = {
                                  {
                                    position: "absolute",
                                    background:"white",
                                    borderRadius:"3px",
                                    left: "45%",
                                    top: "50%",
                                    marginTop: "-50px"
                                  }
                                } >

                                <AutoForm model = { Requests } item = { r } form = { ['attachments'] }  afterSubmit={ ( r) => {
                                  $(".add"+r.code).hide();
                                  r.distributeMessage( {
                                    recipientRoles: [ 'team manager', 'facility manager', 'supplier manager', 'assignee' ],
                                    message: {
                                      verb: "uploaded a file to",
                                      subject: "A new file has been uploaded" + ( owner ? ` by ${owner.getName()}` : '' ),
                                      body: r.description
                                    }
                                  } );
                                  r.markAsUnread();
                                } }  />
                                </div>
                                </div>

                              <div>{r.name}</div>
                              <div>{(r.hasOwnProperty("subservice") && r.subservice != null && r.subservice.hasOwnProperty("name")) ? "Sub-Service :" +  r.subservice.name :null }</div>
                              <div>Due Date : {moment(r.dueDate).format("DD-MM-YYYY")}</div>
                              {imgs}
                            </td>
                            <td>{r.costThreshold}</td>
                            <td key ={idx + idy + 20}>{this.getComment(r)}</td>
                            </tr>)
                      }), true)
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
      code:this.props.request.code,
			team : {
				_id : team._id
			},
			facility :{
				_id : facility._id
			},
      type:"WOComment",
			comment : this.state.comment.trim()
		}

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

          <div>
						<span style={{float: "left"}}>
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


				</div>
		)
	}

} );

export default WoTable;
