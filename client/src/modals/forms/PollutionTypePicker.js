import React, { Component } from 'react'
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'

import sandImg from './images/Sand.JPG'
import rocksImg from './images/Rocks.JPG'
import pebblesAndShellsImg from './images/PebblesAndShells.JPG'
import pebblesImg from './images/Pebbles.JPG'
import gravelImg from './images/Gravel.JPG'
import clayImg from './images/Clay.JPG'

const imageList = [                   
  {image: sandImg, value: 'SAND'},
  {image: rocksImg, value: 'ROCKS' },
  {image: pebblesAndShellsImg, value: 'PEBBLESANDSHELLS'},
  {image: pebblesImg, value: 'PEBBLES'},
  {image: gravelImg, value: 'GRAVEL'},
  {image: clayImg, value: 'CLAY'},
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