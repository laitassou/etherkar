import React from 'react';

class ProfileForm extends React.Component {
    render() {
        return <div className="panel panel-info profile_form_panel">
            <div className="panel-body p25 ">
                <div className="m0 pt25 row row-eq-height">
                    <div className="col-xs-7">
                        <div className="form-group">
                            <div>
                                <span>
                                    <label className="control-label">First name:</label>
                                    <input id="first_name" name="first" placeholder="First name"
                                           className="form-control"
                                           required="" onChange={(e) => (console.log(e.target.value))}/>
                                </span>
                            </div>
                        </div>
                        <label id="first_error_label" className="error_label">This is a required field!</label>
                        <div className="form-group">
                            <div>
                                <span>
                                    <label className="control-label">Last name:</label>
                                    <input id="end_name" name="last" placeholder="Last name"
                                           className="form-control"
                                           required=""/>
                                </span>
                            </div>
                        </div>
                        <label id="second_error_label" className="error_label">This is a required field!</label>
                        <div className="form-group">
                            <div>
                                <span>
                                    <label className="control-label">Date of birth:</label>
                                    {/*<Picker onChange={this.onInputDateChange} disabled={false}/>*/}
                                </span>
                            </div>
                        </div>
                        <div className="form-group">
                            <div>
                                <span>
                                    <label className="control-label">City:</label>
                                    <input name="city" placeholder="City"
                                           className="form-control"
                                           required=""/>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="panel-footer clearfix">
                <form onSubmit={()=> (console.log(e.target.value))}>
                    <button type="submit" className="pull-right btn update_button">Update</button>
                </form>
            </div>
        </div>
    }
}

export default ProfileForm
