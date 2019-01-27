import React, {Component} from 'react'

import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';


class Faqs extends React.Component {

  constructor(props) {
    super(props);

  }
  
  insertDividers() {
        let titles = []
        let answers = {};

        obj = {title:"What is etherkar", answer: "Etherkar is a service to share ride fees between users. Etherkar is only an interface between users and we don't organise transports." };
        titles.push(obj) ;      
        let obj = {title:"What do I need to use etherkar?", answer: "you need an ethreum account, a metamask plugin as wallet" };        
        titles.push(obj) ;
  
        obj = {title:"Installing MetaMask, your digital wallet?", answer: "Currently the app is a web service and you need a browser that supports metamask (chrome do)" };
        titles.push(obj) ;     

        obj = {title:"Why is MetaMask locked?", answer: "You need to unlock using your password, metamask locks after some times of incactivity for seacurity reasons" };
        titles.push(obj) ;   

        obj = {title:"Getting Ether, your digital currency", answer: "You need to acquire some ethers to use the application, you have transaction fees any time you write data to blockchain" };
        titles.push(obj) ;   
        
        obj = {title:"how Does it cost money to use etherkar", answer: "When you publish a travel, we apply 5% of fees for any reservation. you need to add to this fees to write data to blockchain"};     
        titles.push(obj) ; 
        
        obj = {title:"How do I publish a travel? and how it costs to publish it ?", answer: "Go to travel add page, add cities, you need to give details about meeting points in description. for estimation you need  nearly 1.5$ to add travel" };     
        titles.push(obj) ; 


        obj = {title:"How can I reserve a travel ?", answer: "Search for travels and make a reservation. reservation fees are nearly 1.5$ for blockchain transaction and 5% of price for etherkar" };
        titles.push(obj) ;   
      
        obj = {title:"how I get reimbursed ?", answer: "If you canceled your reservation some hours before travel. you will reimbursed all price except fees. But if you cancel later and before travel departure you get only 50% of price" };
        titles.push(obj) ;  
    
        obj = {title:"Is it possible to cancel a travel ?", answer: "If no reservation is done." };
        titles.push(obj) ;  

        obj = {title:"as travel publisher, how I get my money after travel?", answer: "Go to dashboard and ask for fund request. No code is needed hoewever this option could be activated" };
        titles.push(obj) ;   

        obj = {title:"as travel publisher, when funds are available?", answer: "Currently funds are available only 24 hours after date travel, this could be reducted to 12 hours if needed" };
        titles.push(obj) ;   
        
        obj = {title:"Can I use etherkar with my smartphone?", answer: "Sorry, but not for the moment" };
        titles.push(obj) ;   
      
        /*
        obj = {title:"", answer: "" };
        titles.push(obj) ;  
      
         titles.push("?");
         answers.push();
      
    
      
      */ 
         


          return   titles.map( (q, index) => (
          <div>  
            <List key={index}>
              <ListItem insetChildren={true} primaryText= {q.title}  secondaryText ={q.answer} />
            </List>
            <Divider inset={true} />
          </div>
        ));
    }

 

 render() {
      let  faqs = this.insertDividers();
        return (
            <main className="container">

                 {faqs}   

            </main>
        )
    }
}

export default Faqs



