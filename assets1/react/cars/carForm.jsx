import React from 'react'



class CarsForm extends React.Component {
    componentDidMount() {
        this.loadCar()
    }

    constructor(props) {
        super(props);

        this.state = {
            model: '',
            brand: '',
            color: '',
            year: '',
            vehicule_type: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadCar = this.loadCar.bind(this)
    }

    loadCar() {
        $.ajax({
            method: 'GET',
            url: '/api/car/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (response) {
                this.setState(response);
            }.bind(this)
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        let data = {
            model: this.state.model,
            brand: this.state.brand,
            year: this.state.year,
            color: this.state.color,
            vehicule_type: this.state.vehicule_type,
        };
        $.ajax({
            method: 'POST',
            url: '/api/car/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            data: data,
            success: () => {
                this.setState({errors: []})
                alert('Your car was successfully updated')
            },
            error: (response) => {
                if (response.status === 400) {
                    this.setState({'errors': response.responseJSON})
                }
            },
        })
    }

    render() {
        let errors = this.state.errors;
        let messages = (
            <div>
                {errors ? Object.keys(errors).map(function (key) {
                    return <div key={key}>{key}: {errors[key]}</div>;
                }) : null}
            </div>
        );
        return (
            <div>
                <div className="panel panel-info cars_form_panel">
                    <div className="panel-body p25 ">
                        <div className="m0 pt25 row row-eq-height">
                            <div className="col-xs-7">
                                <div className="">
                                    <div>{messages}</div>
                                    <div className="form-group">
                                <span>
                                    <label className="control-label">Brand:</label>
                                    <input id='brand_id' type='text' name="brand" placeholder="Brand"
                                           className="form-control"
                                           required="" onChange={(e) => (this.setState({brand: e.target.value}))}
                                           value={this.state.brand}/>
                                </span>
                                    </div>
                                    <label id="brand_error_label" className="cars_error_label">This is a required
                                        field!</label>
                                </div>
                                <div className="form-group">
                                    <div>
                                <span>
                                    <label className="control-label">Model:</label>
                                    <input id='model_id' type='text' name="model" placeholder="Model"
                                           className="form-control"
                                           onChange={(e) => (this.setState({model: e.target.value}))}
                                           required="" value={this.state.model}/>
                                </span>
                                    </div>
                                </div>
                                <label id="model_error_label" className="cars_error_label">This is a required
                                    field!</label>
                                <div className="form-group">
                                    <div>
                                <span>
                                    <label className="control-label">Color:</label>
                                    <input id="color_id" name="color" placeholder="Color"
                                           className="form-control"
                                           onChange={(e) => (this.setState({color: e.target.value}))}
                                           required value={this.state.color}/>
                                </span>
                                    </div>
                                </div>
                                <label id="cars_error_label" className="cars_error_label">This is a required
                                    field!</label>
                                <div className="form-group">
                                    <div>
                                <span>
                                    <label className="control-label">Year:</label>
                                    <input id="year_id" name="year" type='number' placeholder="Year"
                                           className="form-control"
                                           onChange={(e) => (this.setState({year: e.target.value}))}
                                           required value={this.state.year}/>
                                </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div>
                                        <span>
                                    <label className="control-label">Vehicule type:</label>
                                    <input id="type_id" name="type" placeholder="Vehicule type"
                                           className="form-control"
                                           onChange={(e) => (this.setState({vehicule_type: e.target.value}))}
                                           required value={this.state.vehicule_type}/>
                                </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel-footer clearfix">
                        <form onSubmit={this.handleSubmit}>
                            <button type="submit" className="pull-right btn travel_button">Add car</button>
                        </form>
                    </div>

       
                </div>
            </div>
        )

    }
}

export default CarsForm