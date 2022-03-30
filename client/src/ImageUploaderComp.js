import React, {useRef} from "react";
import ImageUploader from "react-images-upload";


class ImageUploaderComp extends React.Component {
  constructor(props) {
    super(props);
    this.imageUploadRef = React.createRef(null)
    this.state = { pictures: [] , picturesData:[] };
    this.onDrop = this.onDrop.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.imageUploadRef.current.clearPictures();
    this.imageUploadRef.current.state.files = [];
    this.setState({
      picturesData: [],
      pictures: []
    });
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
        ref={this.imageUploadRef}
        withIcon={true}
        withPreview={true}
        buttonText="Upload Pollution Images"
        onChange={this.onDrop}
        imgExtension={[".jpg", ".jpeg", ".gif", ".png", ".gif"]}
        maxFileSize={5242880}
      />
    );
  }
}
export default ImageUploaderComp;