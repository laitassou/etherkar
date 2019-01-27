import React from 'react'
import CarForm from './carForm';

import CarList from './carList';

class Cars extends React.Component {
    render() {
        return (
            <main className="container">
                <div className="cars_header">
                    <img className="cars_icon" src='/static/react/ui/images/car_icon.png'/>
                    <h1 className="cars_title">Cars</h1>
                </div>
                <p className="car_subtitle" style={{fontSize: "22px"}}>Add you car here!</p>
                <CarForm/>

                <CarList/>
            </main>
        )
    }
}

export default Cars
