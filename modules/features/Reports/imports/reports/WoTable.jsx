import React from "react";
import moment from 'moment';
import { Requests,RequestActions,PPM_Schedulers } from '/modules/models/Requests';
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
    let query = {
      "facility._id" : this.state.facility._id ,
      service: this.props.service,
      type : this.props.defect ? "defectToggle" : "toggle"
    }
    let RemovedWoKeys =  Reports.findOne(query);
    this.setState({
      removedImg : RemovedWoKeys && RemovedWoKeys.keys ? RemovedWoKeys.keys : []
    })
	},
  componentWillReceiveProps(){
    this.updateImages();
    let query = {
      "facility._id" : this.state.facility._id ,
      service: this.props.service,
      type : this.props.defect ? "defectToggle" : "toggle" }
    let RemovedWoKeys =  Reports.findOne(query);
    this.setState({
      removedImg : RemovedWoKeys && RemovedWoKeys.keys ? RemovedWoKeys.keys : []
    })
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
                   q['createdAt'] = {
                       $gte: moment().startOf("month").toDate(),
                       $lte: moment().endOf("month").toDate()
                   };
                  if(this.props.defect){
                    q["type"] = 'Defect'
                  }else{
                    q["type"] = {$ne:'Defect'}
                  }

                  q['status'] ={$nin:['Deleted','PPM']};
                      q['service.name'] = this.props.service;
                      let requests = Requests.findAll(q);
                      if(!this.props.defect){
                        let PPMIssued = PPM_Schedulers.findAll(q);
                        if(PPMIssued.length > 0){
                          PPMIssued.map((val)=>{
                            requests.push(val)
                          })
                        }
                      }

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
    handleReload(){
      var facility = this.state.facility
      let query = {
        "facility._id" : facility._id ,
        service: this.props.service,
        type : this.props.defect ? "defectToggle" : "toggle" }
      let RemovedWoKeys =  Reports.findOne(query);
      if(RemovedWoKeys){
        RemovedWoKeys.keys = [] ;
        this.setState({
          removedImg : RemovedWoKeys.keys
        },()=>{
          Reports.save.call(RemovedWoKeys);
        })
      }else{
        return
      }

    },
    handleRemove( key,r ){
        var facility = this.state.facility
        let query = {
          "facility._id" : facility._id ,
          service: r.service.name,
          type : this.props.defect ? "defectToggle" : "toggle" }
        let RemovedWoKeys =  Reports.findOne(query);
        console.log(RemovedWoKeys);

        if(!RemovedWoKeys){
          let item = {
            facility : {
              _id : facility._id
            } ,
            service : r.service.name,
            keys:[key],
            type : this.props.defect ? "defectToggle" : "toggle"
          }
          this.setState({
            removedImg : item.keys
          },()=>{
            Reports.save.call(item);
          })
        }else{
          RemovedWoKeys.keys.push(key);
          this.setState({
            removedImg : RemovedWoKeys.keys
          },()=>{
            Reports.save.call(RemovedWoKeys);
          })
        }
    },
    getImage( _id ,r){

        let file = Files.findOne({_id});
        let url = null;
        let { removedImg } = this.state;
        if (file != null ) {
            url = file.url();
            if( _.contains(["jpg", "png"], file.extension()) && !_.contains(removedImg, _id) ) {
                return (
                  <div className="col-sm-6 report-thumb" style={{padding:"0"}} key={_id}>
                    <span
                      style={{top:"5px",left:"160px"}}
                      className="remove-img"
                      title="Hide image"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleRemove(_id,r)}}
                      >
                        &times;
                      </span>
                      <img src={url} style={{ height:"150px", width:"180px" }} />
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
      commentQuery["type"]=this.props.defect ? "defect" : "WOComment";
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
          return <CommentRequest serviceName={s.service.name} request = {s} commentData = {finalComment} currentMonth ={currentMonth} {...this.props}/>
        }
        //console.log(d);
      }
    },

	render() {

		return (
			<div className = "defectTable">
        <div style={{
          color:"#0152b5",
          fontSize:"10px",
          fontWeight:"900",
          cursor:"pointer",
          padding:"10px 0 0 15px"
              }} onClick={(e)=>{
                e.stopPropagation();
                this.handleReload();
              }}>Reload</div>
                <div className="ibox-content">
                  <table>
                    <thead>
                    <tr>
                    <th>WO#</th>
                    <th>Summary & Images</th>
                    {this.props.defect ? <th>Status</th> : <th>Value</th>}
                    <th>Comments</th>
                    <th>Opt</th>
                  </tr>
                  </thead>
                <tbody>

                  {this.state.data.map( ( d, idx ) => {
                    return(

                      _.flatten(d.requests.map( (r, idy) => {
                        if(!_.contains(this.state.removedImg, r._id) ){
                          let imgs = [];
                          let owner = r.getOwner();
                          if (r.attachments && r.attachments.length) {
                            r.attachments.map( (attach, idz) => {
                              let element = this.getImage(attach._id,r);
                              // console.log(element);
                              if( element ) {
                                imgs.push( element);
                              }
                            });
                          }
                          return (
                            <tr key={idx + idy} className="row-WO">
                              <td onClick={()=>{
                                r["tabIndex"]= 0
                                RequestActions.view.run( r )
                              }}></td>
                              <td style={{width:"45%"}} onClick={()=>{
                                r["tabIndex"]= 0
                                RequestActions.view.run( r )
                              }}>
                              <label style={{position:"absolute",left:"40px",cursor:"pointer"}}>{r.code}</label>
                              <span style={{
                                color:"#0152b5",
                                fontSize:"10px",
                                fontWeight:"900",
                                float:"right",
                                cursor:"pointer",
                                padding:"5px"
                              }} onClick={(e)=>{
                                e.stopPropagation();
                                r["tabIndex"]= 1
                                RequestActions.view.run( r )
                              }}>+ Add-image</span>
                              <div style={{cursor:"pointer"}}>{r.name}</div>
                              <div style={{cursor:"pointer"}}>{(r.hasOwnProperty("subservice") && r.subservice != null && r.subservice.hasOwnProperty("name")) ? "Sub-Service :" +  r.subservice.name :null }</div>
                              {this.props.defect ? null : <div style={{cursor:"pointer"}}>Due Date : {moment(r.dueDate).format("DD-MM-YYYY")}</div>}
                              {imgs}
                            </td>
                            {this.props.defect ? <td>{r.status}</td> : <td>{r.costThreshold}</td>}
                            <td key ={idx + idy + 20}>{this.getComment(r)}</td>
                            <td  style={{
                              color:"#0152b5",
                              fontSize:"10px",
                              fontWeight:"900",
                              cursor:"pointer",
                              padding:"5px"
                            }} onClick={(e)=>{
                              e.stopPropagation();
                              this.handleRemove(r._id,r)
                            }}>hide</td>
                          </tr>)
                        }
                        return null ;
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
      type:this.props.defect ? "defect" : "WOComment",
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
