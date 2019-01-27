import React from 'react'

class CarList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cars: [],
        };
        this.loadCars = this.loadCars.bind(this)
    }

    componentDidMount() {
        this.loadCars()
    }

    loadCars() {
        $.ajax({
            method: 'GET',
            url: '/api/car/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (response) {
                this.setState({cars: response})
            }.bind(this)
        })
    }

    render() {
        return <div>
            <div id="cars">
                <div>All cars : </div>
                <div id="listcars">
                    {this.state.cars.map((value, index) => (
                        <div key={index}>
                            {value.brand} -- {value.model} -- {value.color} -- {value.year} -- {value.type}
                        </div>))}
                    {/*<button type="submit" onClick={(e) => (console.log('handler not added'))}*/}
                            {/*className="pure-button pure-button-primary">Delete*/}
                    {/*</button>*/}
                </div>
            </div>
        </div>
    }
}

export default CarList