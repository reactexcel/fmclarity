import React from "react";
import moment from 'moment';
import { Requests,RequestActions,PPM_Schedulers } from '/modules/models/Requests';
import { Files } from '/modules/models/Files';
import { Reports } from '/modules/models/Reports';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { TextArea } from '/modules/ui/MaterialInputs';
import { AutoForm } from '/modules/core/AutoForm';
import { ContactCard } from '/modules/mixins/Members';
import { Modal } from '/modules/ui/Modal';

const WoTable = React.createClass( {
    getInitialState(){
      let	user = Meteor.user();
      let team = user.getSelectedTeam();
      let facility = Session.getSelectedFacility();
        return{
            data: this.props.data || [],
            removedImg:[],
            expandall: false,
            comment: "",
            commentData: {},
            facility,
            team
          };
    },

  componentWillReceiveProps(props){
    this.setState({
      data: props.data || []
    })
  },

  componentDidMount(){
    	$(".loader").hide();
  },

  isHidden(facility, service ){
    let query = {
      "facility._id" : facility._id ,
      type : this.props.defect ? "defectToggle" : "toggle" }
      if(service){
        query.service = service;
      }
    let RemovedWoKeys =  Reports.findOne(query);
    return RemovedWoKeys ? true : false;
  },

    handleReload(){
      if(this.props.reload){
        this.props.reload();
      }
      // var facility = this.state.facility
      // let query = {
      //   "facility._id" : facility._id ,
      //   service: this.props.service,
      //   type : this.props.defect ? "defectToggle" : "toggle" }
      // let RemovedWoKeys =  Reports.findOne(query);
      // if(RemovedWoKeys){
      //   RemovedWoKeys.keys = [] ;
      //   this.setState({
      //     removedImg : RemovedWoKeys.keys
      //   },()=>{
      //     Reports.save.call(RemovedWoKeys);
      //   })
      // }else{
      //   return
      // }

    },
    handleRemove( facility, key ,r ){
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
                        this.handleRemove(r.facility, _id,r)}}
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
    getComment(facility, s) {
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
          return <CommentRequest serviceName={s.service && s.service.name} facility={facility} request = {s} commentData = {finalComment} currentMonth ={currentMonth} {...this.props}/>
        }
        //console.log(d);
      }
    },

	render() {

		return (
			<div className = "defectTable">
        {!this.props.WoReport && <div id = "NoWOReport"  onClick={(e)=>{
                e.stopPropagation();
                this.handleReload();
              }}>Reload</div>}
                <div className="ibox-content">
                  <table>
                    <thead>
                    <tr>
                    <th id = "WO" >WO#</th>
                    <th id = "summary" >Summary & Images</th>
                    {this.props.defect ? <th id = "value" >Status</th> : <th id = "value" >Value</th>}
                    {this.props.WoReport && <th id="status">Status</th> }
                    {this.props.WoReport && <th id="supplier" >Supplier</th>}
                    <th id = "comment" >Comments</th>
                    <th id = "optHeading" >Opt</th>
                  </tr>
                  </thead>
                <tbody>

                  {this.state.data.map( ( r, idx ) => {
                    if(!this.isHidden(r.facility, r.service && r.service.name)){
                      let imgs = [];
                      let owner = r.getOwner();
                      if (r.attachments && r.attachments.length) {
                        r.attachments.map( (attach, idz) => {
                          let element = this.getImage(attach._id,r);
                          if( element ) {
                            imgs.push( element);
                          }
                        });
                      }
                      return (
                        <tr key={idx} className="row-WO">
                          <td id = "WO" onClick={()=>{
                            r["tabIndex"]= 0
                            RequestActions.view.run( r )
                          }}><label style={{cursor:"pointer"}}>{r.code}</label></td>
                          <td id = "summary" onClick={()=>{
                            r["tabIndex"]= 0
                            RequestActions.view.run( r )
                          }}>
                          <span id = "summary-info"  onClick={(e)=>{
                            e.stopPropagation();
                            r["tabIndex"]= 1
                            RequestActions.view.run( r )
                          }}>+ Add-image</span>
                          <div style={{cursor:"pointer"}}>{r.name}</div>
                          <div style={{cursor:"pointer"}}>{(r.hasOwnProperty("subservice") && r.subservice != null && r.subservice.hasOwnProperty("name")) ? "Sub-Service :" +  r.subservice.name :null }</div>
                          {this.props.defect ? null : <div style={{cursor:"pointer"}}>Due Date : {moment(r.dueDate).format("DD-MM-YYYY")}</div>}
                          <div style={{cursor:"pointer"}}>Issued Date : {moment(r.issuedAt).format("DD-MM-YYYY")}</div>
                          {imgs}
                        </td>
                        {this.props.defect ? <td id = "value">{r.status}</td> : <td id = "value">{r.costThreshold}</td>}
                        {this.props.WoReport && <td id = "status">{r.status}</td> }
                        {this.props.WoReport && <td id = "supplier"><ContactCard item = { r.supplier }/></td>}
                        <td id = "comment" key ={idx + 20}>{this.getComment(r.facility, r)}</td>
                        <td id = "opt" onClick={(e)=>{
                          e.stopPropagation();
                          this.handleRemove(r.facility, r._id, r)
                        }}>hide</td>
                      </tr>)
                    }
                    return null ;
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
		let facility = this.props.facility; //Session.getSelectedFacility();
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
