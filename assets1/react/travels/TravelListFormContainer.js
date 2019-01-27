import { connect } from 'react-redux'
import TravelListForm from './TravelListForm'
//import { reserveTravel } from './TravelListFormActions'
//import { listTravels } from './TravelListFormActions'


const mapStateToProps = (state, ownProps) => {
  return {
    depart: state.user.data.depart,
    arrivee: state.user.data.arrivee,
    date: state.user.data.date
    
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    
    
    onReserveFormSubmit: (id,nbplaces,price) => {     //event.preventDefault();

      //dispatch(reserveTravel(id,nbplaces,price))
    },

    
    
    onTravelsSearchSubmit: (obj,depart,arrivee,date) => {     //event.preventDefault();
      
            //dispatch(listTravels(obj,depart,arrivee,date))
          }
    
  }
}


const mapStateToItemProps = (dispatch) => {
    return {
        //items: (depart) => {dispatch(listTravels(depart))}
    }
}



const FilterItem = connect(
    mapStateToItemProps,
    mapStateToItemProps
)(TravelListForm)


const TravelListFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TravelListForm)



export default TravelListFormContainer

