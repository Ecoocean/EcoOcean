import React from "react";
import ImageUploader from "react-images-upload";


class ImageUploaderComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pictures: [] , picturesData:[] };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(pictureFiles, pictureDataURLs) {
    
    this.setState({
      picturesData: this.state.picturesData.concat(pictureDataURLs),
      pictures: this.state.pictures.concat(pictureFiles)
    });
  }

  render() {
    return (
      <ImageUploader
        withIcon={true}
        withPreview={true}
        buttonText="Upload Pollution Images"
        onChange={this.onDrop}
        imgExtension={[".jpg", ".gif", ".png", ".gif"]}
        maxFileSize={5242880}
      />
    );
  }
}
export default ImageUploaderComp;