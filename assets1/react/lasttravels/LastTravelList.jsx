import React, {Component} from 'react'

import Picker from "../DatePicker/Picker";

import './style.css';
import {Button} from 'react-bootstrap'
import PlacesAutocomplete from 'react-places-autocomplete'


import { reserveTravel } from './TravelListFormActions'

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






class LastTravelList extends React.Component {
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



        this.Rides = [];

        this.givenArticle = [];

        this.Article = ({id, article}) => {


            let [iddepart,idarrivee] = this.realPrice(article);
            console.log('price'+iddepart+' '+idarrivee+'index:'+ id) 

            let price=0;
            let reservedplaces = 0;

                for (var k =0; k <article.price.length;k++)
                {

                    
                        price += (article.price[k]);
                        console.log('price'+article.price[k])  
                    
                }            
            
            var finalprice =   Math.round ( (price *FRACTION)/100) ;
            
            let realresplace = 0;
            for (let u  = iddepart; u < idarrivee; u++)
            {
                realresplace = Math.max(realresplace, Math.floor( (article.reservedplaces % Math.pow(10, u+1))/ (Math.pow(10,u))))
            }




            return (
                <TableRow>
                <TableHeaderColumn>{article.id}</TableHeaderColumn>
                <TableHeaderColumn>{article.departurecity} </TableHeaderColumn>
                <TableHeaderColumn>{article.intermediatecities}  </TableHeaderColumn>
                <TableHeaderColumn>{article.arrivalcity} </TableHeaderColumn>
                <TableHeaderColumn> {finalprice}</TableHeaderColumn>
                <TableHeaderColumn> {realresplace}  </TableHeaderColumn>
                <TableHeaderColumn>{article.numberofplaces}</TableHeaderColumn>   
                <TableHeaderColumn> {article.date}  </TableHeaderColumn>
                     
                </TableRow>
            );
        }


    }


    componentDidMount() {
        this.loadLastTravels(5);
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

    loadLastTravels(number) {
        let data = {
            'number':number

        };
        $.ajax({
            method: 'GET',
            url: '/api/travelsearchlasttravels/',
            datatype: 'json',
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

    

    getComponeent(id, nbPlaces, price, iddepart, idarrivee) {
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
            <div>

                <div>
                    <br /> 
                    <br  /> 
                    <h2> Last published travels</h2>
                    <section className="article_section">
 
                            <Table>
                            <TableHeader displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>ID</TableHeaderColumn>
                                <TableHeaderColumn>Departure </TableHeaderColumn>
                                <TableHeaderColumn>Intermediate  </TableHeaderColumn>                                
                                <TableHeaderColumn>Arrival</TableHeaderColumn>
                                <TableHeaderColumn>Price</TableHeaderColumn>
                                <TableHeaderColumn>Reserved places</TableHeaderColumn>
                                <TableHeaderColumn>Total places</TableHeaderColumn>
                                <TableHeaderColumn>Date </TableHeaderColumn>
                                                 
                            </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                            {articles}
                            </TableBody>
                            </Table>
                   
                    </section>

                </div>
            </div>
        );

    }
}


export default   LastTravelList ;

