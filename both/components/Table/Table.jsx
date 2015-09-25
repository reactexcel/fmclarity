if(Meteor.isServer) {
    //ContentEditable = Meteor.npmRequire('react-contenteditable');
}

TableCell = React.createClass({

    render(){
        return <td id="contenteditable"
            onInput={this.emitChange} 
            onBlur={this.emitChange}
            contentEditable
            dangerouslySetInnerHTML={{__html: this.props.html}}></td>;
    },

    shouldComponentUpdate(nextProps){
        return nextProps.html !== this.getDOMNode().innerHTML;
    },

    componentDidUpdate() {
        if ( this.props.html !== this.getDOMNode().innerHTML ) {
           this.getDOMNode().innerHTML = this.props.html;
        }
    },

    emitChange(evt){
        var html = this.getDOMNode().innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            evt.target = { value: html };
            this.props.onChange(evt);
        }
        this.lastHtml = html;
    }
});

TableHeader = React.createClass({
    render() {
        var cols = this.props.cols;
        return (
            <tr>
                {Object.keys(cols).map(function(key) {
                    return <th key={key}>{cols[key].label}</th>;
                })}
            </tr>
        );
    }
});

TableRow = React.createClass({

    update(item,timeout) {
        if(timeout==null) {
            timeout = 1000;
        }
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(function(){
            console.log('saving');
            Meteor.call("Book.upsert",item);
        },timeout);
    },

    render() {
        var component = this;
        var cols = this.props.cols;
        var item = this.props.item;
        var isNewItem = _.isEmpty(item);

        function handleChange(key,event) {
            item[key] = event.target.value;
            if(!isNewItem) {
                this.update(item);
            }
        }

        function handleKeyPress(event) {
            if(event.key==='Enter') {
                this.update(item,0);
            }
        }

        function handleDelete() {
            Meteor.call("Book.destroy",item);
        }

        return (
            <tr>
                {Object.keys(cols).map(function(key) {
                    //return <TableCell key={key} html={item[key]||''} onChange={handleChange.bind(component,key)} />;
                    return (<td>
                        <input 
                            className="inline-edit" 
                            defaultValue={item[key]||''} 
                            onChange={handleChange.bind(component,key)}
                            onKeyPress={handleKeyPress.bind(component)}
                        />
                    </td>)
                })}
                <td><a onClick={handleDelete}>Delete</a></td>
            </tr>
        )
    }
});

Table = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe('books');
        return {
            books : Books.find().fetch()
        }
    },

	componentDidMount() {
		$('.footable').footable();
	},
	
	render() {
        console.log(this.data.books);
        var schema = Schemas.Books.schema();
        var newItem = {};
        return (
            <div>
                <input type="text" className="form-control input-sm m-b-xs" id="filter" placeholder="Search in table"/>
                <table className="footable table table-stripped" data-page-size="8" data-filter="#filter">
                    <thead>
                        <TableHeader cols={schema}/>
                    </thead>
                    <tbody>
                        {this.data.books.map(function(item,idx){
                            return <TableRow item={item} cols={schema} />
                        })}
                        <TableRow cols={schema} item={newItem}/>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="5">
                                <ul className="pagination pull-right"></ul>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
	   )
    }


});