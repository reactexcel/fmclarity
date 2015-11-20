FileBrowser = React.createClass({
	render() {
		return (
        <div className="file-browser">
            <ul className="list-unstyled issue-files">
                <li>
                	<a href="" style={{color:"#666"}}>
                		<i className="file-browser-icon fa fa-file"></i>
                		<span className="file-browser-filename">Issue_document.docx</span>
                	</a>
                </li>
                <li>
                	<a href="" style={{color:"#666"}}>
                		<i className="file-browser-icon fa fa-file-picture-o"></i>
                		<span className="file-browser-filename">Logo_zender_company.jpg</span>
                	</a>
                </li>
                <li>
                	<a href="" style={{color:"#666"}}>
                		<i className="file-browser-icon fa fa-stack-exchange"></i>
                		<span className="file-browser-filename">Email_from_Alex.mln</span>
                	</a>
                </li>
                <li>
                	<a href="" style={{color:"#666"}}>
                		<i className="file-browser-icon fa fa-file"></i>
                		<span className="file-browser-filename">Contract_20_11_2014.docx</span>
                	</a>
                </li>                
            </ul>
        </div>
        )
	}
});


