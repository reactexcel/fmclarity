import React, {PropTypes} from 'react';
import { Documents} from '/modules/models/Documents'
import { Files } from '/modules/models/Files'

export default class DropFileContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    $("#drop-box").mouseout(( event ) => {
      $("#drop").css("display", "hide");
    })
  }
  render() {
    const { model } = this.props;
    return (
      <div>
        <div className="drop" id="drop"
          onDragOver={(event)=>{
             event.stopPropagation();
             event.preventDefault();
            $("#drop-box").css("display", "block");
          }}
        >
          {this.props.children}

        </div>
        <div className="drop-container" id="drop-box"
          onDragOver={(event)=>{
             event.stopPropagation();
             event.preventDefault();
            $("#drop-box").css("display", "block");
          }}
          onDrop={(event) => {
            event.stopPropagation();
            event.preventDefault();
            let facility = Session.getSelectedFacility(),
              team = Session.getSelectedTeam()
              doc = Documents.create( { attachments: [] } );
            if(model._name === "Facilities"){
              doc.facility = {
                _id: facility._id,
                name: facility.name,
              }
            } else if(model._name === "Teams"){
              doc.team = {
                _id: team._id,
                name: team.name,
              }
            } else if(model._name === "Issues"){
              request = this.props.request;
              doc.request = {
                _id: request._id,
                name: request.name,
              }
            }
            FS.Utility.eachFile( event, function( file ) {
              Files.insert( file, function( err, newFile ) {
                doc.name = (file.name.split('.'))[0];
                doc.attachments.push({_id: newFile._id, name: newFile.name});
                Documents.save.call( doc )
                  .then( ( doc ) => {
                    console.log(Documents.findOne({_id : doc._id}));
                  });
              } );
            } );
            $("#drop-box").css("display", "none");
          }}>
          <div className="drop-container-inner">
            <div className="row" >
              <div className="col-xs-offset-3 col-xs-6">
                <span className="drop-upload-icon">
                  <i className="fa fa-upload fa-5x" aria-hidden="true"></i>
                </span>
                <p className="drop-upload-text">
                  Drop here to create a doocument.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
  }
}
