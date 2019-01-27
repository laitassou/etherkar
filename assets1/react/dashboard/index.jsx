import React from 'react';

import './style.css';
import {Button} from 'react-bootstrap'

import TravelFundRequest from './travelFundRequest';
import { requestCancelReservationTravel } from './TravelFundManageActions';
import { setProofLitigeAsReserver } from './TravelFundManageActions';

import { Redirect } from 'react-router-dom'

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';



  

const  RESERVATIONCANCELWINDOW = 86400000; // 24Hours in  milliseconds
const  RESERVATIONCANCELHALFWINDOW = 21600000; // 6Hours in  milliseconds

const  RESERVATIONLASTHOURSCANCELWINDOW = 3600000; // 1Hours in  milliseconds
const  RESERVATIONLITIGELWINDOW = 3600000; // 1Hours in  milliseconds

class Dashboard extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            username: '',
            pos :{}
        };
        this.loadUser = this.loadUser.bind(this);
        this.loadMyTravels = this.loadMyTravels.bind(this);

        this.loadMyReservations = this.loadMyReservations.bind(this);


        this.Rides = [];
        this.Reservations = [];

        this.travelIds = [];
        
        this.Article = ({article}) => {
           // let button   = <Button bsStyle="danger" onClick= {(event) => this.redirectToTravel(article.id)}  >update</Button>
           let link = "/app/traveledit/"+article.id; 
            let button   =<Button bsStyle="danger"> <a  href={link}  >Edit</a> </Button>
            
                return (
                    <TableRow >

                                <TableHeaderColumn>{article.departurecity} </TableHeaderColumn>
                                <TableHeaderColumn>{article.arrivalcity} </TableHeaderColumn>
                                <TableHeaderColumn> {article.price}</TableHeaderColumn>
                                <TableHeaderColumn>{article.reservedplaces}  </TableHeaderColumn>
                                <TableHeaderColumn>{article.numberofplaces}</TableHeaderColumn>   
                                <TableHeaderColumn> {article.date}  </TableHeaderColumn>
                                <TableHeaderColumn> {button}  </TableHeaderColumn>                         
                    </TableRow>
                );
        }
    

        this.Reservation = ({article}) => {
             let dateTravel = Date.parse(article.travel.date);
             let dateReservationCreation =Date.parse(article.datacreation);
             //timestampTravel = dateTravel.getTime()/1000;
             let now =  Date.now() ; // UTC time
             var offset = new Date().getTimezoneOffset(); // in minutes
             let now_local = now - offset * 60000;
           
             let now_plusfull = now_local +  RESERVATIONCANCELWINDOW;
             let now_plushalf = now_local +  RESERVATIONCANCELHALFWINDOW;

             let reservationonLastHours = dateReservationCreation + RESERVATIONLASTHOURSCANCELWINDOW;

             console.log('now '+now + 'now_local:' +now_local +'offset:'+offset+' article:'+ dateTravel+ ',now_plusfull:'+now_plusfull+ ',now_plushalf:'+now_plushalf);

             let show = <Button bsStyle="danger" onClick={this.cancelReservation.bind(this, article.travel.id, article.id ,article.address, article.reservedplaces, article.travel.price)}>Done</Button>
             
            if(article.reservedplaces >0){

                if ( (now_local +  RESERVATIONCANCELHALFWINDOW) < dateTravel){
       
                    show = <Button bsStyle="danger" onClick={this.cancelReservation.bind(this, article.travel.id, article.id ,article.address, article.reservedplaces,  article.travel.price,article.iddepart, article.idarrivee)}>Cancel</Button>
                }else if( (dateTravel  > now_local ) &&  (dateTravel < reservationonLastHours)){
                    show = <Button bsStyle="danger" onClick={this.cancelReservation.bind(this, article.travel.id, article.id ,article.address, article.reservedplaces,  article.travel.price,article.iddepart, article.idarrivee)}>Cancel</Button>
                    
                }else if(  (reservationonLastHours > dateTravel)){
                    show = <Button bsStyle="danger" onClick={this.cancelReservation.bind(this, article.travel.id, article.id ,article.address, article.reservedplaces,  article.travel.price/2,article.iddepart, article.idarrivee)}>Cancel </Button>
                    
                }else if( (now_local < dateTravel +  RESERVATIONLITIGELWINDOW) &&  now_local > dateTravel){
                    show = <Button bsStyle="danger" onClick={this.litigeRequestReservation.bind(this, article.travel.id, article.id ,article.address, article.reservedplaces,  article.travel.price,article.iddepart, article.idarrivee)}>litige request</Button>
                }
                else
                {
                    show = 'Done' 
                }
  
                    
            }else{
                show = 'Canceled'
                
            }

            return (
                <TableRow>
                <TableHeaderColumn>{article.code}</TableHeaderColumn>
                <TableHeaderColumn>{article.travel.departurecity} </TableHeaderColumn>
                <TableHeaderColumn> {article.travel.arrivalcity}</TableHeaderColumn>
                <TableHeaderColumn> {article.travel.price}</TableHeaderColumn>
                <TableHeaderColumn>{article.reservedplaces}  </TableHeaderColumn>
                <TableHeaderColumn>{article.travel.numberofplaces}  </TableHeaderColumn>                        
                <TableHeaderColumn>{article.travel.user.username}</TableHeaderColumn>   
                <TableHeaderColumn>{article.travel.user.phone_number}</TableHeaderColumn>  
                <TableHeaderColumn> {article.travel.date}  </TableHeaderColumn>
                <TableHeaderColumn> {show} </TableHeaderColumn>                               
                </TableRow>
            );
        }
    }




    componentDidMount(){
        this.loadUser();
        this.loadMyTravels() ;
        this.loadMyReservations() ;
    }

    redirectToTravel = (id) => {
       let  route = '/app/traveledit/'+id;
       console.log('route:'+route)
          return <Redirect to={route} />;
        
      }

    loadUser(){
        $.ajax({
            method: 'GET',
            url: '/api/users/i/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (response) {
                this.setState({username: response['username']})
            }.bind(this)
        })
    }

   loadMyTravels() {
        $.ajax({
            method: 'GET',
            url: '/api/travellistuser/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (response) {
                this.Rides =response;
                this.forceUpdate();
            }.bind(this)
        })
    }


    loadMyReservations() {
        $.ajax({
            method: 'GET',
            url: '/api/reservations/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (response) {
                this.Reservations =response;
                this.forceUpdate();
            }.bind(this)
        })
    }


    cancelReservation(id, resid, address,nbPlaces, price,iddepart,idarrivee) {
        console.log('cancelReservation' + id + ' ' + nbPlaces + ' ' + price+'resid'+resid+'iddp:'+iddepart+'idarr'+idarrivee);
        requestCancelReservationTravel(id,resid,address,nbPlaces,price, iddepart,idarrivee,this.cancelResevationDbCallback);
    }

    litigeRequestReservation(id, resid, address,nbPlaces, price,iddepart,idarrivee)
    {
        console.log('litigeRequestReservation' + id + ' ' + nbPlaces + ' ' + price);
        this.getGeolocPosition();
        setProofLitigeAsReserver(id);

    }

    locCallback(position) {
        this.state.pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
        };

        console.log('pos lat:'+this.state.pos.lat+ 'lng: '+this.state.pos.lng)
    }

    getGeolocPosition() {

        // Try HTML5 geolocation.
        if (navigator.geolocation) 
        {
          navigator.geolocation.getCurrentPosition(this.locCallback.bind(this), function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }


      }

    handleLocationError(browserHasGeolocation) {
 
        alert(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
    }
    

    cancelResevationDbCallback(rideID,resID,nbplaces, address,iddepart,idarrivee)
    {
        console.log('inside cancelResevationDbCallback' + 'iddepart:'+iddepart +'idarrivee:'+idarrivee);
 

       let data = {
                   'travel_id': rideID ,
                   'id' : resID,
                   'address' : address,
                   'reservedplaces': nbplaces,
                   'iddepart':iddepart,
                   'idarrivee':   idarrivee        
                  };

       $.ajax({
            method: 'PUT',
            url: '/api/cancelreservation/'+resID+'/',
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
                <this.Article key={index} article={article}/>
            ));
        }
        else return [];
    }



    renderReservations(articles) {
        if (articles.length > 0) {
            return articles.map((article, index) => (
                <this.Reservation key={index} article={article}/>
            ));
        }
        else return [];
    }




    render() {


       let MyArticles = this.renderArticles(this.Rides);
       let MyReservations  = this.renderReservations(this.Reservations);   
       let Travels   = this.travelIds;

        
        let request = null;
        
        if (this.Rides.length > 0) {
              request =  <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1>Funds request</h1>
                            <TravelFundRequest travels={this.Rides}/>
                        </div>               
                 </div>    ;
        } 

        return (
            <main className="container">
                <div>
                    <div >
                        <h1>Dashboard</h1>
                        <p><strong>Congratulations {this.state.username}!</strong> If you're seeing this page, you've
                            logged in with your own smart contract successfully.</p>
                    </div>
                </div>

                <div >
                    <div >
                            <h1>My reservations </h1>
                            <Table>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>CODE</TableHeaderColumn>
                                <TableHeaderColumn>Departure</TableHeaderColumn>
                                <TableHeaderColumn>Arrival</TableHeaderColumn>
                                <TableHeaderColumn>Price</TableHeaderColumn>
                                <TableHeaderColumn>Reserved places </TableHeaderColumn>
                                <TableHeaderColumn>Total places</TableHeaderColumn>
                                <TableHeaderColumn>Driver</TableHeaderColumn>    
                                <TableHeaderColumn>Phone</TableHeaderColumn>    
                                <TableHeaderColumn>Date </TableHeaderColumn>
                                <TableHeaderColumn>Status </TableHeaderColumn>                                                         
                            </TableRow>
                            </TableHeader>
                            <TableBody  displayRowCheckbox={false}   showRowHover={true}>
                                {MyReservations}
                            </TableBody>
                            </Table>
                        </div>
                </div>

                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <h1>My published travels</h1>
                        <br />
                        <p> Funds are available 12 hours after the date of your travel, if you  requestd them  before, nothing will happen  </p>
                        <p> you need at least one valid code from your co-travellers </p>
                        <br />
                        <Table>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                            <TableRow>

                                <TableHeaderColumn>Departure</TableHeaderColumn>
                                <TableHeaderColumn>Arrival</TableHeaderColumn>
                                <TableHeaderColumn>Price</TableHeaderColumn>
                                <TableHeaderColumn>Reserved places </TableHeaderColumn>
                                <TableHeaderColumn>Total places</TableHeaderColumn>   
                                <TableHeaderColumn>Date </TableHeaderColumn>
                                <TableHeaderColumn>Update </TableHeaderColumn>
                                                 
                            </TableRow>
                            </TableHeader>
                            <TableBody  displayRowCheckbox={false} showRowHover={true}>
                             {MyArticles}  
                            </TableBody>
                            </Table>
                       
              
                    </div>
                        
                </div>

                {request}
                
            </main>
        )
    }
}

export default Dashboard;

