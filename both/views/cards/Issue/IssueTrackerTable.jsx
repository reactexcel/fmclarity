IssueTrackerTable = React.createClass({
    render(){
        return (
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Status</th>
                    <th>Title</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Comments</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <span className="label label-danger"><i className="fa fa-check"></i> New</span>
                    </td>
                    <td>
                        Create issue
                    </td>
                    <td>
                        12.07.2014 10:10:1
                    </td>
                    <td>
                        14.07.2014 10:16:36
                    </td>
                    <td>
                        <p className="small">
                            Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="label label-warning"><i className="fa fa-check"></i> Issued</span>
                    </td>
                    <td>
                        Various versions
                    </td>
                                                        <td>
                                                            12.07.2014 10:10:1
                                                        </td>
                                                        <td>
                                                            14.07.2014 10:16:36
                                                        </td>
                                                        <td>
                                                            <p className="small">
                                                                Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                                                            </p>
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span className="label label-success"><i className="fa fa-check"></i> Opened</span>
                                                        </td>
                                                        <td>
                                                            There are many variations
                                                        </td>
                                                        <td>
                                                            12.07.2014 10:10:1
                                                        </td>
                                                        <td>
                                                            14.07.2014 10:16:36
                                                        </td>
                                                        <td>
                                                            <p className="small">
                                                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which
                                                            </p>
                                                        </td>

                                                    </tr>

                                                    </tbody>
                                                </table>
        )
    }
})