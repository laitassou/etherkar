import React, {Component} from 'react'

import Picker from "../DatePicker/Picker";

import './style.css';
import {Button} from 'react-bootstrap'
import PlacesAutocomplete from 'react-places-autocomplete'


import { reserveTravel } from './TravelListFormActions'

import { setRatio } from './TravelListFormActions'
import {setFraction}  from './TravelListFormActions'
import { FRACTION } from './TravelListFormActions'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import 'react-tabs/style/react-tabs.css';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';


  import ReactDOM from 'react-dom';




class TravelListForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // start : '',
            // end :'',
            // startCity:'',
            depart: '',
            arrivee: '',
            date: '',
            // endCity:'',
            // nbPlaces:'',
            reservedPlaces: 0,
            price: 0,
            id: 0,
            addressDepart: '',
            addressArrivee: '',
            tabIndex:0,
            travelIndex: ''
        };

        this.onChangeDepart = (addressDepart) => this.setState({ addressDepart });
        this.onChange = (addressArrivee) => this.setState({ addressArrivee });

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputDateChange = this.onInputDateChange.bind(this);

        this.changeState  = this.changeState.bind(this);

        this.Rides = [];

        this.givenArticle = [];

        this.Article = ({id, article}) => {


            let [iddepart,idarrivee] = this.realPrice(article);
            console.log('price'+iddepart+' '+idarrivee+'index:'+ id) 

            let price=0;
            let reservedplaces = 0;
            if(iddepart != -1 && idarrivee != -1)
            {
                for (var k =0; k <article.price.length;k++)
                {
                    if( k >= iddepart && k < idarrivee)  
                    {  
                        price += (article.price[k]);
                        console.log('price'+article.price[k])  
                    } 
                }            
            }
            var finalprice =   Math.round ( (price *FRACTION)/100) ;
            
            let show  = '';
            let realresplace = 0;
            for (let u  = iddepart; u < idarrivee; u++)
            {
                realresplace = Math.max(realresplace, Math.floor( (article.reservedplaces % Math.pow(10, u+1))/ (Math.pow(10,u))))
            }

            if (realresplace < article.numberofplaces) {
                 //show =  <Button bsStyle="danger" onClick={this.getComponent.bind(this, article.id , 1, article.price)}>Reserve</Button>;
                // show =  <Button bsStyle="danger" onClick={this.getDetails.bind(this, article.id , 1, price, iddepart, idarrivee)}>Reserve</Button>;
                show =  <Button bsStyle="danger" onClick={() => this.handleChange(1,id)} >Details</Button>  ;
            } else {
                show =  'Full';
            }



  /*          
            let intercities = JSON.parse(article.intermediatecities)
            for (let k =0; k < intercities.length;k++)
            {
                console.log('inter'+intercities[k]);
            }
            for (let k =0; k < article.price.length;k++)
            {
                console.log('inter'+article.price[k]);
            }
*/
            return (
                <TableRow hoverable={true}>
                <TableHeaderColumn ><div  className="depart"> {article.departurecity} </div></TableHeaderColumn>
                <TableHeaderColumn>{article.intermediatecities}  </TableHeaderColumn>
                <TableHeaderColumn > <div className="arrivee"> {article.arrivalcity} </div ></TableHeaderColumn>
                <TableHeaderColumn> {finalprice}</TableHeaderColumn>
                <TableHeaderColumn> {realresplace}  </TableHeaderColumn>
                <TableHeaderColumn>{article.numberofplaces}</TableHeaderColumn>   
                <TableHeaderColumn> {article.date}  </TableHeaderColumn>
                <TableHeaderColumn>{show} </TableHeaderColumn>                               
                </TableRow>
            );
        }

        this.OneArticle = ({ article}) => {
            
            
                        let [iddepart,idarrivee] = this.realPrice(article);
                        console.log('price'+iddepart+' '+idarrivee) 
            
                        let price=0;
                        let reservedplaces = 0;
                        if(iddepart != -1 && idarrivee != -1)
                        {
                            for (var k =0; k <article.price.length;k++)
                            {
                                if( k >= iddepart && k < idarrivee)  
                                {  
                                    price += (article.price[k]);
                                    console.log('price'+article.price[k])  
                                } 
                            }            
                        }
            

                        var finalprice =   Math.round ( (price *FRACTION)/100) ;
                        let show  = '';
                        let realresplace = 0;
                        for (let u  = iddepart; u < idarrivee; u++)
                        {
                            realresplace = Math.max(realresplace, Math.floor( (article.reservedplaces % Math.pow(10, u+1))/ (Math.pow(10,u))))
                        }
            
                        if (realresplace < article.numberofplaces) {
                             //show =  <Button bsStyle="danger" onClick={this.getComponent.bind(this, article.id , 1, article.price)}>Reserve</Button>;
                             show =  <Button bsStyle="danger"  onClick={() => this.getComponent( article.id , 1, price, iddepart, idarrivee)}>Reserve</Button>;
                        } else {
                            show =  'Full';
                        }
            
            

                        return (
                          <Table>
                                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                    <TableRow>
                                            <TableHeaderColumn>Departure </TableHeaderColumn>                             
                                            <TableHeaderColumn>Arrival</TableHeaderColumn>
                                            <TableHeaderColumn>Price</TableHeaderColumn>
                                            <TableHeaderColumn>Reserved places</TableHeaderColumn>
                                            <TableHeaderColumn>Total places</TableHeaderColumn>
                                            <TableHeaderColumn  colSpan={2}>Date </TableHeaderColumn>
                                            <TableHeaderColumn>Action </TableHeaderColumn>                                                         
                                    </TableRow>
                                </TableHeader>
                    
        
                               <TableBody displayRowCheckbox={false} showRowHover={true}>
                                    <TableRow>
                                            <TableRowColumn>{article.departurecity} </TableRowColumn>
                                            <TableRowColumn>{article.arrivalcity} </TableRowColumn>
                                            <TableRowColumn> {finalprice}</TableRowColumn>
                                            <TableRowColumn> {realresplace}  </TableRowColumn>
                                            <TableRowColumn>{article.numberofplaces}</TableRowColumn>   
                                            <TableRowColumn colSpan={2}> {article.date}  </TableRowColumn>
                                            <TableRowColumn>{show} </TableRowColumn>                               
                                    </TableRow>
                                    <TableRow>
                                            <TableRowColumn colSpan={2}>driver infos: </TableRowColumn> 
                                            <TableRowColumn>{article.user.username}</TableRowColumn> 
                                            <TableRowColumn>{article.user.city}</TableRowColumn> 
                                            <TableRowColumn  colSpan={4}>{article.user.date_of_birth}</TableRowColumn>       
                                           </TableRow>
                                
                                    <TableRow>
                                            <TableRowColumn  colSpan={2}>description:</TableRowColumn> 
                                            <TableRowColumn colSpan={6}>{article.description}</TableRowColumn> 
                                    </TableRow>
                                    <TableRow>
                                            <TableHeaderColumn  colSpan={2} >Intermediate  cities </TableHeaderColumn>      
                                            <TableRowColumn colSpan={6} >{article.intermediatecities}</TableRowColumn>                             
                                    </TableRow>
                                    <TableRow>
                                            <TableRowColumn colSpan={2}>Reservation status:</TableRowColumn> 
                                            <TableRowColumn colSpan={6} ><div id="resStatus"> </div></TableRowColumn> 
                                    </TableRow>
                            </TableBody>

                            </Table>
                        );
                    }

    }


    componentDidMount() {

    }

    splitCity(city){
        var res = city.split(",");
        return  res[0]
    }

    realPrice(article)
    {
        let idDepart = -1;
        let idArrivee = -1;
        let cityA = this.splitCity(this.state.addressDepart);
        let cityB  = this.splitCity(this.state.addressArrivee);
        let articleCityA = this.splitCity(article.departurecity);
        let articleCityB  = this.splitCity(article.arrivalcity);

        let intercities = JSON.parse(article.intermediatecities)

        console.log('cityA'+cityA+'cityB'+cityB+'articleCityA'+articleCityA+'articleCityB'+articleCityB)
        if(cityA.toLowerCase() == articleCityA.toLowerCase())
        {
            idDepart = 0;
        }
        else
        for (var k =0; k <intercities.length;k++)
        {
 
            if((intercities[k].toLowerCase().search(cityA.toLowerCase())) != -1){
                console.log(cityA+'found in '+intercities[k])        
                idDepart = k+1;        
            }
        }

        if(cityB.toLowerCase() == articleCityB.toLowerCase())
        {
            idArrivee = intercities.length+1;
        }
        else
        for (var k =0; k <intercities.length;k++)
        {

            if((intercities[k].toLowerCase().search(cityB.toLowerCase()))!=-1){
                console.log(cityB+'found in '+intercities[k])        
                idArrivee = k+1;        
            }
        }

        return [idDepart,idArrivee];
    }

    loadTravels(depart, arrivee, date) {

        /*
        setRatio(100);
        setFraction(100);
        */

        console.log('setRatio 100');
        let data = {
            'depart':depart,
            'arrivee':arrivee,
            'date':date
        };
        $.ajax({
            method: 'GET',
            url: '/api/travelsearch/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            data: data,
            success: function (response) {
                this.Rides =response;
                this.forceUpdate();
            }.bind(this)
        })
    }

    updateState() {

    }

    reserveTravelDb(id,iddepart,idarrivee,accountAddress)
    {
       let travelfield = "travelreserve/travel/"+id;
       let data = {
                   'reservedplaces':1,
                   'travel': id ,
                   'iddepart':iddepart,
                   'idarrivee':idarrivee,
                   'address' : accountAddress                
                  };

       $.ajax({
            method: 'POST',
            url: '/api/travelreserve/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            data: data,
            success: function (response) {
            }
        })

    }


    onInputChange(e) {
        // console.log('onInputChange '+ JSON.stringify(e.target.name));
        this.setState({[e.target.name]: e.target.value});
        //console.log(this.state.depart+ ', ' +this.state.arrivee);
    }

    changeState(date) {
        console.log('changeState from travelform'+ date);
        //this.state.timestampdate = date._d.valueOf() ;
        //this.state.date =  date.format('YYYY-MM-DDTHH:mm:ss') ;
        
       this.setState({date: date.format('YYYY-MM-DD')});
      }


    onInputDateChange(date) {
        // console.log('onInputChange '+ JSON.stringify(e.target.name));
        //this.setState({date: date._d.valueOf()});
        console.log('INPUT DATE CHANGE date' + this.state.date);
        this.setState({date: date.format('YYYY-MM-DD')});
    }

    handleSubmit(event) {
        event.preventDefault()
        //alert(this.state.name);

       // if (this.state.depart.length < 2) {
       //     return alert('Please fill fields.')
       // }
       // this.Rides = [("id", "date", "depart", "arrivee", 1, 5), ("id", "date", "depart", "arrivee", 1, 6)];

        console.log('depart, arrive '+this.state.addressDepart+ this.state.addressArrivee + this.state.date)
        let cityA = this.splitCity(this.state.addressDepart);
        let cityB  = this.splitCity(this.state.addressArrivee);

        this.loadTravels(cityA.toLowerCase(), cityB.toLowerCase() , this.state.date);
        console.log('handleSubmit before load ');

        console.log(JSON.stringify(this.Rides));
        console.log('handleSubmit after load');
        


    }

    renderArticles(articles) {
        if (articles.length > 0) {
            return articles.map((article, index) => (
                <this.Article key={index} id={index} article={article}/>
            ));
        }
        else return [];
    }


    renderOneArticle(articles) {
        if (articles.length > 0) {
            return articles.map((article, index) => (
                <this.OneArticle key={index}  article={article}/>
            ));
        }
        else return [];
    }

    

    getComponent(id, nbPlaces, price, iddepart, idarrivee) {
        // event.preventDefault()
        //alert(this.state.name);

        console.log('dbg' + id + ' ' + nbPlaces + ' ' + price+ 'depart='+ iddepart+ 'arrivee:'+idarrivee);

        reserveTravel(id,nbPlaces,price, iddepart, idarrivee,this.reserveTravelDb);
        //this.handleClearForm(event);

        //this.reserveTravelDb(id);
    }

    handleClearForm(e) {
        e.preventDefault();
        this.setState({
            price: 0,
            id: 0,
            nbRes: 0
        });
    }

    //Use arrow functions to avoid binding
    handleSelect = (index) => {
  
            console.log('Selected tab: ' + this.state.selectedIndex);
   
    }

    handleChange = (value,index) => {
        this.setState({
          tabIndex: value,
          travelIndex : index,
        });
        console.log('index' + index)
        this.givenArticle = [];
        this.givenArticle.push( this.Rides[index] );
        this.forceUpdate();
     };

    render() {

        let articles = this.renderArticles(this.Rides);
        let givenArticle ='';
        console.log('outisde render'+this.state.travelIndex)
        if(this.state.travelIndex !=='' )
        {
            console.log('insider render')
             givenArticle =  this.renderOneArticle(this.givenArticle) ; 

        }



        const inputProps = {
            value: this.state.addressDepart,
            onChange: this.onChangeDepart,
            type: 'search',
            placeholder: 'Depart',
            autoFocus: true,
            className: 'form-control'
        };

        const inputArrProps = {
            value: this.state.addressArrivee,
            onChange: this.onChange,
            type: 'search',
            placeholder: 'Arrivée',
            autoFocus: true,
            className: 'form-control'
        };

        const cssClasses = {
            input: 'form-control travel_list_input'
        };



        return (
            <main className="container container-nopadding">
            <div>
                <div className="container panel panel-info travel_form_panel">
                    <div className="panel-body p25 ">
                        <div className="m0 pt25 row row-eq-height">

                            <div className="col-xs-7 travel_list_form">
                                <div className="form-group">
                                    <div>
                                <span>
                                    <label className="control-label">Depart:</label>
                                    <PlacesAutocomplete inputProps={inputProps} classNames={cssClasses} />
                                </span>
                                    </div>
                                </div>
                                <div className="form-group travel_list_input_group">
                                    <div>
                                <span>
                                    <label className="control-label">Arrivée:</label>
                                    <PlacesAutocomplete inputProps={inputArrProps} classNames={cssClasses} />
                                </span>
                                    </div>
                                </div>
                                <div className="form-group travel_list_input_group">
                                    <div>
                                <span>
                                    <label className="control-label">Date:</label>
                                    <Picker onChange={this.onInputDateChange}  changeState={this.changeState} />
                                </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel-footer clearfix">
                        <form onSubmit={this.handleSubmit}>
                            <button type="submit" className="pull-left btn travel_button">Search</button>
                        </form>
                    </div>
                </div>
                <div>
                    <section className="article_section">




                                    <Tabs  selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })} >
                          
                                <TabList>
                                      <Tab value ='a' >Travels</Tab>
    
                                      <Tab id="detailstrvID" value='b'>Traveil details</Tab>

                                    </TabList>
                                
                                    <TabPanel>
 
                                            <Table allRowsSelected={true}	>
                                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                            <TableRow>
                                                <TableHeaderColumn>Departure </TableHeaderColumn>
                                                <TableHeaderColumn>Intermediate  </TableHeaderColumn>                                
                                                <TableHeaderColumn>Arrival</TableHeaderColumn>
                                                <TableHeaderColumn>Price</TableHeaderColumn>
                                                <TableHeaderColumn>Reserved places</TableHeaderColumn>
                                                <TableHeaderColumn>Total places</TableHeaderColumn>
                                                <TableHeaderColumn>Date </TableHeaderColumn>
                                                <TableHeaderColumn>Action </TableHeaderColumn>                                                         
                                            </TableRow>
                                            </TableHeader>
                                            <TableBody displayRowCheckbox={false} showRowHover={true} >
                                            {articles}
                                            </TableBody>
                                            </Table>

                                    </TabPanel>
                                    <TabPanel>
                                     <p>
 


                                     {givenArticle}



                                     </p>
                                    </TabPanel>

 
                                  </Tabs>

                   
                    </section>

                </div>

            </div>
            </main>
        );

    }
}


export default   TravelListForm ;

