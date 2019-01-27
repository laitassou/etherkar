import React, {Component} from 'react'

import 'bootstrap/dist/css/bootstrap.css';
import './style.css'
import Picker from "../DatePicker/Picker";
import { Async } from 'react-select';
import {getLocations} from '../services/googleService'

import PlacesAutocomplete from 'react-places-autocomplete'



import { addTravel } from './TravelFormActions'

import 'react-select/dist/react-select.css';

import TextField from 'material-ui/TextField';

import Slider from 'material-ui/Slider';

const intermediateOption  = false;


const SCALE_PRICE=  100000;

class TravelForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            date: '',
            timestampdate : '',
            nbplaces: 0,
            price: 0,
            arrayTowns:[],
            selectedOption: '',
            addressDepart: '',
            address: '',
            description:'',
            sliderValue :[],
           

        };

        //this.sliderValue =[]];

        this.configPrices = ( {currState}) => {
                     
                      return (<li>{currState.name}<Slider id ={currState.id} min={3} max={250}  step={1} style={{height: 50}} axis="x" 
                      defaultValue={5}  onChange={(event,value) => this.handleSlider(event, value,currState.id )}  value={this.state.sliderValue[currState.id]} /> <span>{this.state.sliderValue[currState.id]}</span> </li>);
        }

        this.onChangeDepart = (addressDepart) => this.setState({ addressDepart });
        this.onChange = (address) => this.setState({ address });

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onInputDateChange = this.onInputDateChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputIntermediateCityChange = this.onInputIntermediateCityChange.bind(this);
        this.onPriceConfig  =this.onPriceConfig.bind(this);

        this.handleSlider = this.handleSlider.bind(this);

        this.changeState  = this.changeState.bind(this);
        
        
    }

    componentDidMount() {
        this.updateState()
    }

    updateState() {

    }

    onInputChange(e, a) {
         console.log('onInputChange '+ JSON.stringify(e.target.name));
        this.setState({[e.target.name]: e.target.value});
        //this.setState({ selectedOption: e });
    }


    onPriceConfig(e,a)
    {
        console.log('config prices');
        let myarrayprices = [];
        myarrayprices.push({'name':this.state.addressDepart,'id':0});
        let id = 0;
        for (var key in  this.state.selectedOption) {
            var obj = this.state.selectedOption[key];
            id++;
            myarrayprices.push({'name':obj.label,'id':id});

        }
        //myarrayprices.push(this.state.address);
        
        this.setState({arrayTowns:myarrayprices});
        
    }


    onInputIntermediateCityChange(e, a) {
       // this.setState({[e.target.name]: e.target.value});
        //console.log('onInputIntermediateCityChange', e[0].label,a)
        //this.setState({selectedOption: e});
        //this.setState({ selectedOption: e });
   /*
        this.state.arrayprices = [];
        this.state.arrayprices.push(this.state.addressDepart);
        for (var key in e) {
            var obj = e[key];
            this.state.arrayprices.push(obj.label);
        }
   */
        this.setState({selectedOption: e});
    }

    changeState(date) {
        console.log('changeState from travelform'+ date);
        //this.state.timestampdate = date._d.valueOf() ;
        //this.state.date =  date.format('YYYY-MM-DDTHH:mm:ss') ;
        
       this.setState({ timestampdate:Date.parse(date)});
       this.setState({date: date.format('YYYY-MM-DDTHH:mm:ss')});
      }

    onInputDateChange(date) {
        //this.setState({timestampdate: date._d.valueOf()});
        console.log('date timestamps' + this.state.timestampdate);
         //console.log('onInputChange '+ JSON.stringify(e.target.name));
        //this.setState({date: date._d.valueOf()}); correct one to show
        //this.setState({date: date.format('YYYY-MM-DDTHH:mm:ss')});

        console.log('date lla' + this.state.date);
        //this.setState({[e.target.name]: e.target.value});
        }


    /*
    *  update travel callback, will be used to update address of travel if needed
    */
    updateTravelCb(id, address) {
        let data  = {
                    'id': id,
                    'address':address
                   };

        $.ajax({
            method: 'POST',
            url: '/api/travelupdate/'+id+'/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            data: data,
            success: function (response) {
              //let id = response.id;
              //console.log('update travel id' +id);
            }
        })
  
    } 

    /*
     * delete travel callback
     * called if gas price is low, transaction to add to block chain failed for any reason
     * or web3 not instanciated
     */
    deleteTravelCb(id)
    {

        return function(id){    
            let data  = {'travelid':id};
            $.ajax({
                method: 'DELETE',
                url: '/api/travels/'+id+'/',
                datatype: 'json',
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                data: data,
                success: function (response) {
                let id = response.id;
                console.log('delete travel id' +id);
                }
            })
         };
    }

        
    calculateDistance(origin, destination, callback) {
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            avoidHighways: false,
            avoidTolls: false
        }, callback);
    }


    getPrice(){
        let prices = [];
        let sum = 0;
        for (let key in this.state.sliderValue){
            
            prices.push(this.state.sliderValue[key] );
            sum += this.state.sliderValue[key]
        }
        return prices;
    }


    splitCity(city){
        var res = city.split(",");
        return  res[0]
    }

    
    handleSubmit(event) {
        event.preventDefault();
        //alert(this.state.name);

        /*if (this.state.depart.length < 2) {
            return alert('Please fill in your name.')
        }*/


   
        console.log('log'+this.state.addressDepart + this.state.date);
        
        let intermcities = [];
        let firstObj = this.state.addressDepart;
        let lastobj = this.state.address;

        let distances = [];

        for (var key in this.state.selectedOption) {
            var obj = this.state.selectedOption[key];

            console.log('elem',obj.label);
            intermcities.push(obj.label.toLowerCase());
        /*
            this.calculateDistance(firstObj,obj,function(response,status){
                var distance = response.rows[0].elements[0].distance;
                var distance_value = distance.value;
                console.log(response);
                distances.push(distance_value);
            })
            firstObj = obj;

            */
        }    
        /*   
        this.calculateDistance(firstObj,lastobj,function(response,status){
            var distance = response.rows[0].elements[0].distance;
            var distance_value = distance.value;
            console.log(response);            
            distances.push(distance_value);
        });
        */
        let departlow = firstObj.toLowerCase();
        let arriveelow = lastobj.toLowerCase();
        //let intermcitieslow = intermcities.toLowerCase();

         let computedprice = this.getPrice();
         console.log('computedprice'+computedprice);
    

         if(departlow ==='' || arriveelow ==='' || this.state.date ===''|| this.state.nbplaces === 0 || computedprice ==='')
         {
             alert('empty field! verify your form');
             return;
         }
        let data = {
            departurecity: departlow,
            intermediatecities: JSON.stringify(intermcities),
            arrivalcity: arriveelow,
            date:this.state.date,
            numberofplaces:this.state.nbplaces,
            reservedplaces:0,
            timestampdate:this.state.timestampdate,
            price:  JSON.stringify(computedprice),//this.state.price,  
            
            description : this.state.description                    
    
            };  
    
        var  deleteTravelCallback = this.deleteTravelCb();
        $.ajax({
            method: 'POST',
            url: '/api/travels/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            data: data,
            success: function (response) {
              let id = response.id;
              console.log('id' +id);
              
              addTravel(id,computedprice,data.timestampdate,this.updateTravelCb, deleteTravelCallback);              
            }
        })

    }

    getOptions = (input) => {
        return getLocations(input).then(options => {
            console.log("option", options);
            return {options};
        });

    };


    handleSlider (event, value,id) {
        
        let values = [...this.state.sliderValue];

        values[id] =  value;
        this.setState({sliderValue: values });
        console.log('handlerslider'+value+' '+id);
    }
  




 /*    
    handlePrices()
    {
        let id = 0;
        let fistState= ''
        return this.state.arrayTowns.map(function(state) {
            if(fistState !== '')
            {

                let Li = <li>{fistState} ->{state}  <Slider  min={3} max={500}  step={1} style={{height: 100}} axis="y" 
                  defaultValue={5} />   <span></span></li>;
                fistState =state;
                return Li;
            }
            fistState =state;
 
        });
    }
    
*/
    
    handlePrices(priceCities){
  
            return   priceCities.map( (cstate, index) => (
    
                   <this.configPrices key={index}   currState={cstate}/> 

            ));
    
    }

    
    
        


    render() {
        const { selectedOption } = this.state;
        const value = selectedOption;

        let configSliderPrices = this.handlePrices(this.state.arrayTowns);

        const inputProps = {
            value: this.state.addressDepart,
            onChange: this.onChangeDepart,
            type: 'search',
            placeholder: 'Depart',
            autoFocus: true,
            className: 'form-control'
        };

        const inputArrProps = {
            value: this.state.address,
            onChange: this.onChange,
            type: 'search',
            placeholder: 'Arrivée',
            autoFocus: true,
            className: 'form-control'
        };

        const cssClasses = {
            input: 'form-control'
        };

        return (
                <div className="container panel panel-info travel_form_panel">
                    <div className="panel-body p25 ">
                        <div className="m0 pt25 row row-eq-height">

                            <div className="col-xs-10">
                                <div className="form-group">
                                    <div>
                                <span>
                                    <label className="control-label">Departure:</label>
                                    <PlacesAutocomplete inputProps={inputProps} classNames={cssClasses} />
                                </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div>
                                <span>
                                    <label className="control-label">Intermediate cities:</label>
                                    <Async
                                        name="form-field-name"
                                        onChange={this.onInputIntermediateCityChange}
                                        value={value}
                                        multi={true}
                                        loadOptions={this.getOptions}
                                    />
                                </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                <div>
                                <span>
                                    <label className="control-label">Arrival:</label>
                                    <PlacesAutocomplete inputProps={inputArrProps} classNames={cssClasses} />
                                </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div>
                                <span>
                                    <label className="control-label">Date:</label>
                                    <Picker onChange={this.onInputDateChange} changeState={this.changeState} />
                                </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                <div>
                                    <span>  
                                     <div>  <label className="control-label">Description:</label> </div>
                                     <div  className="text-field-custom"> 
                                        <TextField  name="description" onChange={this.onInputChange}
                                         hintText="Enter detailed address for appointments for your travel"
                                        multiLine={true}
                                        rows={3}
                                        rowsMax={6}     
                                        fullWidth ={true}
                                        style={{border:'1px solid black'}}
                                           />    

                                    </div>
                                    </span>
                                </div>
                                </div>
                                <div className="form-group">
                                <div>
                                    <span>
                                        <label className="control-label">Number of places:</label>
                                        <input type="number" name="nbplaces" min="1" max="4" placeholder="nbplaces" onChange={this.onInputChange}
                                               className="form-control"
                                               required=""  />
                                    </span>
                                </div>
                                </div>
                                <div className="form-group">
                                    <div>
                                    <span>
                                        <input type="button" value="Configure price in Finney"
                                            className="form-control"
                                            onClick={this.onPriceConfig}
                                             />
                                    </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div>
                                    <span>
                                        <label className="control-label">Prices in Finney :</label>                                        
                                    <ul> 
                                     {configSliderPrices}
                                     <li> {this.state.address} </li>
                                    </ul>
                                    </span>
                                    </div>
                                </div>
                                <label id="prix_error_label" className="prix_error_label">Price in finney (1 ether = 1000 finney) </label>
                            </div>
                        </div>
                    </div>
                    <div className="panel-footer clearfix">
                        <form onSubmit={this.handleSubmit}>
                            <div id="resStatus"  className="pull-right"> </div>
                            <button type="submit" className="pull-left btn travel_button">Add travel</button>
                        </form>
                    </div>
                </div>
        );
    }
}

export default TravelForm