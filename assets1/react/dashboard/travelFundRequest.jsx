import React from 'react'

import { requestFundTravel } from './TravelFundManageActions'

class TravelFundRequest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            code: '',
            travelid:'',
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.onChangeSelect  =this.onChangeSelect.bind(this);
    }

    componentDidMount() {

    }

    handleSubmit(e) {
        e.preventDefault();

        let data = {
            code: this.state.code,

        };

        //let callback = this.fundRequestDbUpdate; 
        
        console.log('before fundRequestDbUpdate' + this.state.travelid);
        /*
        if(this.state.travelid != ''){
            requestFundTravel(this.state.travelid,1,20 , this.fundRequestDbUpdate);

        }
        else
        {
            alert ('Select a travel from popup menu !')
        }
        */
       let nbplaces = 1;
               
        $.ajax({
            method: 'GET',
            url: '/api/reservationscode/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            data: data,
            success: function (response) {
                console.log('id' +response[0].travel);
                if(response[0] != 'undefined' && response[0].travel != 'undefined')
                {
                    requestFundTravel(response[0].travel,nbplaces);
                } else
                {
                    alert('check your code');
                }
            }
        })
        

        
    }

/*
    fundRequestDbUpdate(rideID)
    {

        console.log('fundRequestDbUpdate rideID' +rideID )

       let data = {
                   'travel_id': rideID
      
                  };

       $.ajax({
            method: 'PUT',
            url: '/api/updateRequesttravel/'+rideID+'/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            data: data,
            success: function (response) {
            }
        })
   

    }
*/
  renderTableList() {

    let tablesHTML = [];
    let first = 0;

    console.log('this.props.travels.length '+this.props.travels.length);

    for (let i = 0; i < this.props.travels.length; i++) {

      let table = this.props.travels[i];
      /*
      this.state.travelid = this.props.travels[0].id;
      console.log('this.state.travelid' + this.state.travelid );
      */

      if(table.fundRequested === false )
      {
        tablesHTML.push(<option value={table.id} key={table.id} >{table.id} - {table.departurecity} -> {table.arrivalcity}</option>);
      }

    }

    return tablesHTML;

  }

 onChangeSelect(e)
 {
  this.setState({travelid: e.target.value})

 }
  renderOldTravels() {
    
        let tablesHTML = [];
    
        console.log('this.props.travels.length '+this.props.travels.length);
    
        for (let i = 0; i < this.props.travels.length; i++) {
    
          let table = this.props.travels[i];
          //console.log(table);
          
          if(table.fundRequested === true )
          {
            tablesHTML.push(<option value={table.id} key={table.id} >{table.id} - {table.departurecity} -> {table.arrivalcity}</option>);
          }
    
        }
    
        return tablesHTML;
    
      }
    
    render() {
        return <div>
                <div className="panel panel-info cars_form_panel">
                    <div className="panel-body p25 ">
                        <div className="m0 pt25 row row-eq-height">
                            <div className="col-xs-9">
                                <div className="">
                                    <div className="form-group">

                                         <span>
                                            <label className="control-label">Travel:</label>
                                            <select id='travelid'  name="travelid" className="form-control" onChange={this.onChangeSelect} value={this.state.travelid}>
                                            {this.renderTableList()}
                                            </select>
                                        </span> 
                                    </div>
                                    <div className="form-group">

                                        <span>
                                            <label className="control-label">code:</label>
                                            <input id='code' type='text' name="code" placeholder="code" className="form-control"
                                                   required="" onChange={(e) => (this.setState({code: e.target.value}))}  />
                                        </span>                                        
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="panel-footer clearfix">
                        <form onSubmit={this.handleSubmit}>
                            <button type="submit" className="pull-left btn travel_button">request</button> 
                            <div id="fundStatus"> </div>
                        </form>
                    </div>



                </div>

                <div className="panel panel-info cars_form_panel">
                    <span>
                                            <label className="control-label">Old Travels:</label>
                                            {this.renderOldTravels()}
                                            
                                        </span> 
                    </div>
        </div>

        
    }
}

export default TravelFundRequest