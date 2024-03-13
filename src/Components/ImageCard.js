import './imageCard.css'


const ImageCard = (props) => {
      
  return (
    <div className="imageCard">
      <div className='leftNumberFrame'>

      </div>
      <div className='centralFrame'>
        <div className="pictureFrame">
          <img className='renderedImage' src={String(props.imageAddress)} alt="Stimuli"/>

        </div>
        

      </div>
      <div className='rightNumberFrame'>

      </div>
    </div>
  )
}

export default ImageCard