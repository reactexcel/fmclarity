import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

Dispatcher = {
    events: {},
    subscribe( event, callback ) {
        if ( !this.events[ event ] ) {
            this.events[ event ] = [];
        }
        this.events[ event ].push( callback );
    },

    broadcast( event, args ) {
        if ( this.events[ event ] && this.events[ event ].length ) {
            this.events[ event ].map( function( callback ) {
                callback( args );
            } );
        }
    }
}

export default Modal = React.createClass( {

    statics: {
        show( args ) {
            Dispatcher.broadcast( 'showModal', args );
        },
        hide( args ) {
            Dispatcher.broadcast( 'hideModal', args );
        },
        replace( args ) {
            Dispatcher.broadcast( 'replaceModal', args );
        }
    },

    getInitialState() {
        return {
            show: false,
            queue: []
        }
    },

    componentWillMount() {
        Dispatcher.subscribe( 'showModal', ( args ) => {
            var queue = this.state.queue;
            queue.push( args );
            setTimeout( () => {
                this.setState( {
                    show: true,
                    queue: queue,
                    title: args.title,
                    content: args.content,
                    onSubmit: args.onSubmit,
                    onCancel: args.onCancel
                } )
            }, 0 );
        } );


        Dispatcher.subscribe( 'hideModal', ( args ) => {
            this.handleHide();
        } );

        Dispatcher.subscribe( 'replaceModal', ( args ) => {
            queue = this.state.queue;
            queue.pop();
            queue.push( args );
            setTimeout( () => {
                this.setState( {
                    show: true,
                    queue: queue,
                    title: args.title,
                    content: args.content,
                    onSubmit: args.onSubmit,
                    onCancel: args.onCancel
                } )
            }, 0 );
        } );

    },

    handleHide() {
        ///*
        if ( this.state.onCancel ) {
            this.state.onCancel();
        }
        var queue = this.state.queue;
        queue.pop();
        if ( queue.length > 0 ) {
            var current = queue[ queue.length - 1 ];
            setTimeout( () => {
                this.setState( {
                    show: true,
                    queue: queue,
                    title: current.title,
                    content: current.content,
                    onSubmit: current.onSubmit,
                    onCancel: current.onCancel
                } )
            }, 0 );
            return false;
        } else {
            setTimeout( () => {
                this.setState( {
                    show: false,
                    queue: []
                } )
            }, 0 );
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

          <div className="modal-wrapper">
          {
            queue.map(function(q,idx){
              return <div className={"modal-dialog"+(q.size?(" modal-dialog-"+q.size):"")} key={idx}>
                <div className="modal-body">

                <span style={{float:"right",zIndex:4000,cursor:"pointer",fontSize:"20px",color:"#999",width:"20px"}} data-dismiss="modal">&times;</span>
                  {q.content}
                  
                </div>
              </div>
            })
          }
          </div>

        </ModalInner>
        )
    }
} );

ModalInner = React.createClass( {

    componentDidMount() {
        if ( this.props.show ) {
            $( this.refs.modal ).modal( 'show' );
        }
        $( this.refs.modal ).on( 'hidden.bs.modal', this.handleHide );
    },

    componentDidUpdate() {
        if ( this.props.show ) {
            $( this.refs.modal ).modal( 'show' );
        } else {
            $( this.refs.modal ).modal( 'hide' );
        }
    },

    handleHide() {
        if ( this.props.handleHide ) {
            this.props.handleHide();
        }
    },

    handleSubmit() {
        $( this.refs.modal ).modal( 'hide' );
        if ( this.props.handleSubmit ) {
            this.props.handleSubmit();
        }
    },

    render() {
        return (
            <div ref="modal" className="modal fade" tabIndex="-1" role="dialog" style={{display:"none"}}>
          {this.props.children}
      </div>
        )
    }
} );
