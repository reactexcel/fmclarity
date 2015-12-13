Dispatcher = {
	events:{},
	subscribe(event,callback) {
		if(!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(callback);
	},

	broadcast(event,args) {
		for(var i in this.events) {
			this.events[i].map(function(callback){
				callback(args);
			});
		}
	}
}


Modal = React.createClass({

	statics : {
		show(args) {
			Dispatcher.broadcast('showModal',args);
		}
	},

	getInitialState() {
    	return {
      		show:false
    	}
  	},

  	componentDidMount() {
  		var component = this;
  		Dispatcher.subscribe('showModal',function(args){
  			component.setState({
  				show:true,
  				title:args.title,
  				content:args.content,
  				onSubmit:args.onSubmit
  			})
  		});
  	},

  	handleHide() {
      if(this.props.onClose) {
        this.props.onClose();
      }
    	this.setState({
	      	show:false
    	})
  	},

    render() {
        if(!this.state.show) return <div/>
        return (
            <ModalInner
            	title={this.state.title}
                handleSubmit={this.state.onSubmit}
                handleHide={this.handleHide}>
                {this.state.content}
            </ModalInner>
        )
    }
});

ModalInner = React.createClass({

    componentDidMount() {
        $(this.refs.modal).modal('show');
        $(this.refs.modal).on('hidden.bs.modal', this.props.handleHide);
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
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        {this.props.handleSubmit?
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                            <button type="button" onClick={this.handleSubmit} className="btn btn-primary">Submit</button>
                        </div>
                        :null}
                    </div>
                </div>
            </div>
        )
    }
});
