import { connect } from 'react-redux'
import TravelForm from './TravelForm'
//import { addTravel } from './TravelFormActions'
//import { listTravels } from './TravelFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    depart: state.user.data.depart
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    
    onTravelsFormSubmit: (date,depart,arrivee,places,prix) => {     //event.preventDefault();

      //dispatch(addTravel(date,date,depart,arrivee,places,prix))
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
)(TravelForm)


const TravelFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TravelForm)



export default TravelFormContainer
