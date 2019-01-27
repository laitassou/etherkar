import React, {Component} from 'react'

import 'bootstrap/dist/css/bootstrap.css';
import './style.css'
import Picker from "../DatePicker/Picker";
import { Async } from 'react-select';
import {getLocations} from '../services/googleService'

import PlacesAutocomplete from 'react-places-autocomplete'



import { updateTravel } from './TravelFormActions'

import 'react-select/dist/react-select.css';

import TextField from 'material-ui/TextField';

import Slider from 'material-ui/Slider';

const intermediateOption  = false;


const SCALE_PRICE=  100000;

class TravelFormEditor extends React.Component {
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
            travelid:'',
            databasedate:'',
            databasetimestampdate:'',           

        };

        //this.sliderValue =[]];



        this.onChangeDepart = (addressDepart) => this.setState({ addressDepart });
        this.onChange = (address) => this.setState({ address });

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onInputDateChange = this.onInputDateChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
  
        this.onPriceConfig  =this.onPriceConfig.bind(this);

        this.changeState  = this.changeState.bind(this);
        
        
    }

    componentDidMount() {
        let  travel_id  = this.props.params.travelid;
        //console.log('traveil_id: '+travel_id)
        this.setState({travelid:travel_id})
        this.loadTravel(travel_id)
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
    updateTravelCb(id) {

        let myid =this.state.travelid;
        let data = {
            id:myid,
            date:this.state.date,
            numberofplaces:this.state.nbplaces,
            timestampdate:this.state.timestampdate,            
            description : this.state.description                    
    
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

      

    splitCity(city){
        var res = city.split(",");
        return  res[0]
    }

 
    loadTravel(id) {
        
                console.log('setRatio 100');
                let data = {
                    'id':id
                };
                $.ajax({
                    method: 'GET',
                    url: '/api/travelsearchbyid/',
                    datatype: 'json',
                    headers: {
                        'Authorization': 'Token ' + localStorage.token
                    },
                    data: data,
                    success: function (response) {
                        if(response.length > 0){
                            let data = response[0];
                            this.setState( {databasedate: data.date,
                                           nbplaces :data.numberofplaces,
                                           description: data.description,
                                           databasetimestampdate: data.date,
                                           addressDepart : data.departurecity,
                                           address : data.arrivalcity
                                    });
                            console.log('response.numberofplaces' +data.numberofplaces)
                        }

                    }.bind(this)
            })
     }


    /*
    * check if date is updated to interact with blockchain
    */
    dateUpdated()
    {
        if(this.state.date !==''  && this.state.date !== his.state.databasedate  )
        {
            return true;
        }
        return false;
    }

    handleSubmit(event) {
        event.preventDefault();
        //alert(this.state.name);

        console.log('log'+this.state.addressDepart + this.state.date);
        
        let intermcities = [];
        let firstObj = this.state.addressDepart;
        let lastobj = this.state.address;

        let departlow = firstObj.toLowerCase();
        let arriveelow = lastobj.toLowerCase();
        //let intermcitieslow = intermcities.toLowerCase();

        let myid =this.state.travelid;
        let data = {
            id:myid,
            date:this.state.date,
            numberofplaces:this.state.nbplaces,
            timestampdate:this.state.timestampdate,            
            description : this.state.description                    
    
            };  
    

        if(dateUpdated())
        {
            updateTravel(myid,data.timestampdate,this.updateTravelCb);   
        }
        else 
        {
            
            // update only database
            if(this.state.description ==='' || this.state.nbplaces ===0 )
            {
                alert('empty field! verify your form');
                return;
            }

            $.ajax({
                method: 'POST',
                url: '/api/travelupdate/',
                datatype: 'json',
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                data: data,
                success: function (response) {                
          
                }
            })

        }

    }

    getOptions = (input) => {
        return getLocations(input).then(options => {
            console.log("option", options);
            return {options};
        });

    };



        


    render() {
        const { selectedOption } = this.state;
        const value = selectedOption;

  

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
                                    <PlacesAutocomplete  classNames={cssClasses}  value ={this.state.addressDepart} />
                                </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                <div>
                                <span>
                                    <label className="control-label">Arrival:</label>
                                    <PlacesAutocomplete classNames={cssClasses}    value ={this.state.address}  />
                                </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div>
                                <span>
                                    <label className="control-label">Date:</label>
                                    <Picker onChange={this.onInputDateChange} changeState={this.changeState}  value= {this.state.timestampdate} />
                                </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                <div>
                                    <span>  
                                     <div>  <label className="control-label">Description:</label> </div>
                                     <div  className="text-field-custom"> 
                                        <TextField  name="description" onChange={this.onInputChange}
                                        
                                        multiLine={true}
                                        rows={3}
                                        rowsMax={6}     
                                        fullWidth ={true}
                                        style={{border:'1px solid black'}}
                                        value= {this.state.description} 
                                           />    

                                    </div>
                                    </span>
                                </div>
                                </div>
                                <div className="form-group">
                                <div>
                                    <span>
                                        <label className="control-label">Number of places:</label>
                                        <input type="number" name="nbplaces" min="1" max="4" onChange={this.onInputChange}
                                               className="form-control" value={this.state.nbplaces}
                                               required=""  />
                                    </span>
                                </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="panel-footer clearfix">
                        <form onSubmit={this.handleSubmit}>
                            <div id="resStatus"  className="pull-right"> </div>
                            <button type="submit" className="pull-left btn travel_button">Update travel</button>
                        </form>
                    </div>
                </div>
        );
    }
}

export default TravelFormEditor