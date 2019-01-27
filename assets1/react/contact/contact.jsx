import React, {Component} from 'react'

import 'bootstrap/dist/css/bootstrap.css';
//import './style.css'

import 'react-select/dist/react-select.css';

import TextField from 'material-ui/TextField';





class Contact extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            name: '',
            email : '',
            description:''        

        };


        this.handleSubmit = this.handleSubmit.bind(this);

        this.onInputChange = this.onInputChange.bind(this);
 
        
        
    }


    onInputChange(e, a) {
         console.log('onInputChange '+ JSON.stringify(e.target.name));
        this.setState({[e.target.name]: e.target.value});
        //this.setState({ selectedOption: e });
    }




    
    handleSubmit(event) {
        event.preventDefault();
        //alert(this.state.name);





         if(this.state.name ===''|| this.state.title ==='' || this.state.description ==='')
         {
             alert('empty field! verify your form');
             return;
         }
        let data = {
            name: this.state.name,
            email: this.state.email,            
            description : this.state.description                    
    
            };  
    
        $.ajax({
            method: 'POST',
            url: '/api/sendmessage/',
            datatype: 'json',
            data: data,
            success: function (response) {              
                          
            }
        })

    }



    
    
        


    render() {

        return (
                <div className="container panel panel-info travel_form_panel">
                    <div className="panel-body p25 ">
                        <div className="m0 pt25 row row-eq-height">

                            <div className="col-xs-10">
                            <div className="form-group">
                            <div>
                        <span>
                            <label className="control-label">Name:</label>
                            <input id='model_id' type='text' name="name" placeholder="name"
                                   className="form-control"
                                   onChange={(e) => (this.setState({name: e.target.value}))}
                                   required="" value={this.state.name}/>
                        </span>
                            </div>
                        </div>

                        <div className="form-group">
                                    <div>
                                <span>
                                    <label className="control-label">Email:</label>
                                    <input id='model_id' type='text' name="email" placeholder="email"
                                           className="form-control"
                                           onChange={(e) => (this.setState({email: e.target.value}))}
                                           required="" value={this.state.email}/>
                                </span>
                                    </div>
                                </div>

                                <div className="form-group">

                                    <span>  
                                     <div>  <label className="control-label">Message:</label> </div>
                                     <div  className="text-field-custom"> 
                                        <TextField  name="description" onChange={this.onInputChange}
                                         hintText="Enter your message here"
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
                        </div>
                    </div>
                    <div className="panel-footer clearfix">
                        <form onSubmit={this.handleSubmit}>
                            <div id="resStatus"  className="pull-right"> </div>
                            <button type="submit" className="pull-left btn travel_button">Send</button>
                        </form>
                    </div>
                </div>
        );
    }
}

export default Contact



