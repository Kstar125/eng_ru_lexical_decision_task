
import './imageCard.css'

const ResponseButton = (props) => {
  
    return (
    <div className="buttonFrame">
        <button className="responseButton">{props.wordChoice}</button>
        </div>
  )
}

export default ResponseButton