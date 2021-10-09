import React, { Component } from 'react'
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'

import trashImg from './images/trash.jpg'
import oilImg from './images/oil.jpg'
import tarImg from './images/tar.jpg'



const imageList = [{image: trashImg, value: 'TRASH'},
                   {image: oilImg, value: 'OIL'},
                   {image: tarImg, value: 'TAR' }
                ];

class PollutionTypePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: '',
      images: [],
      max_images: [],
      max_message: ''
    }
  }

  onPickImage(image) {
    this.setState({image})
  }

  onPickImages(images) {
    this.setState({images})
  }

  onPickImagesWithLimit(max_images) {
    this.setState({max_images})
  }

  onPickMaxImages(last_image) {
    let image = JSON.stringify(last_image)
    let max_message = `Max images reached. ${image}`

    this.setState({max_message})
  }

  render() {
    return (
      <div>
        <h3>Pollution Type</h3>
        <ImagePicker
          images={imageList.map((imageData) => ({src: imageData.image, value: imageData.value}))}
          onPick={this.onPickImage.bind(this)}
        />
      </div>
    )
  }
}

export default PollutionTypePicker;