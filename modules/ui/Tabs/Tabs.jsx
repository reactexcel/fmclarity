import React from "react";

export default class IpsoTabso extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            active: 0,
            tabs: props.tabs,
        }
    }

    selectTab( idx ) {
        if ( this.state.tabs[ idx ].onClick ) {
            idx = this.state.tabs[ idx ].onClick();
        }
        this.setState( {
            active: idx
        } );
    }
    componentWillMount(){
      if(this.props.defaultIndex){
        this.setState({
          active:this.props.defaultIndex,
          tabs: this.props.tabs
        })
      }
    }

    componentWillReceiveProps( props ){
      this.setState( {
        tabs: props.tabs
      } );
    }
    render() {
        let active = this.state.active,
            content = null;

        let tabs = _.filter( this.state.tabs, function( t ) {
            return !t.hide;
        } )

        if ( tabs[ active ] != null ) {
            content = tabs[ active ].content;
        }

        return (
            <div className="tab-panel">
                {/* container for the tabs */}
                <div className="panel-heading">
                    <div className="row" style={{margin:0}}>
                        <div className="col-md-12">
                            <div className="row tab-row">

                                {/**************************************************/
                                tabs.map( (i,idx) => { return i.hide?null:(
                                    <div
                                        key = { idx }
                                        className = { ( idx==active ? "ipso-tab active" : "ipso-tab" ) }
                                        onClick = { () => { this.selectTab(idx) } }
                                    >
                                        <div className="tab">
                                            {i.tab}
                                        </div>
                                        <div className="highlight"/>
                                    </div>
                                )})
                                /**************************************************/}

                            </div>
                        </div>
                    </div>
                </div>
                {/* container for the current active tab pane */}
                <div className="tab-pane active">
                    {content}
                </div>

            </div>
        )
    }
}
