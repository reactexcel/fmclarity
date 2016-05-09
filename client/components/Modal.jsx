import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

Dispatcher = {
	events:{},
	subscribe(event,callback) {
		if(!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(callback);
	},

	broadcast(event,args) {
  	this.events[event].map(function(callback){
			callback(args);
		});
	}
}


Modal = React.createClass({

	statics : {
		show(args) {
			Dispatcher.broadcast('showModal',args);
		},
    hide(args) {
      Dispatcher.broadcast('hideModal',args);
    }
	},

	getInitialState() {
    	return {
      		show:false,
          queue:[]
    	}
  },

  componentWillMount() {
  	var component = this;
  	Dispatcher.subscribe('showModal',function(args){
      var queue = component.state.queue;
      queue.push(args);
      component.setState({
        show:true,
        queue:queue,
        title:args.title,
        content:args.content,
        onSubmit:args.onSubmit,
        onCancel:args.onCancel
      })
  	});


    Dispatcher.subscribe('hideModal',function(args){
      component.handleHide();
    });

  },

  handleHide() {
    ///*
    if(this.state.onCancel) {
      this.state.onCancel();
    }
    var queue = this.state.queue;
    queue.pop();
    if(queue.length>0) {
      var current = queue[queue.length-1];
      this.setState({
        show:true,
        queue:queue,
        title:current.title,
        content:current.content,
        onSubmit:current.onSubmit,
        onCancel:current.onCancel
      })   
      return false;   
    }
    else {
      this.setState({
        show:false,
        queue:[]
      })
      return true;
    }
    //*/
    /*
    this.setState({
	      show:false,
        queue:[]
    })
    //*/
  },

  render() {
    var queue = this.state.queue;
    //if(!this.state.show) return <div/>
      return (
        <ModalInner
          title={this.state.title}
          show={this.state.show}
          handleSubmit={this.state.onSubmit}
          handleHide={this.handleHide}>
          {
            queue.map(function(q,idx){
              return <div className="modal-body" key={idx}>
                {q.content}
              </div>
            })
          }
        </ModalInner>
      )
  }
});

ModalInner = React.createClass({

  componentDidMount() {
    if(this.props.show) {
      $(this.refs.modal).modal('show');
    }
    $(this.refs.modal).on('hidden.bs.modal', this.handleHide);
  },

  componentDidUpdate() {
    if(this.props.show) {
      $(this.refs.modal).modal('show');
    }
    else {
      $(this.refs.modal).modal('hide');
    }
  },

  handleHide() {
    if(this.props.handleHide) {
      this.props.handleHide();
    }
  },

  handleSubmit() {
    $(this.refs.modal).modal('hide');
    if(this.props.handleSubmit) {
      this.props.handleSubmit();
    }
  },

  render() {
    return (
      <div ref="modal" className="modal fade" tabIndex="-1" role="dialog" style={{display:"none"}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div>{this.props.children}</div>
            {this.props.handleSubmit?
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" onClick={this.handleSubmit} className="btn btn-primary">Submit</button>
              </div>
            :null}
            </div>
          <span style={{position:"absolute",right:0,top:0,cursor:"pointer",fontSize:"20px",color:"#999",width:"20px"}} data-dismiss="modal">&times;</span>
        </div>
      </div>
    )
  }
});
