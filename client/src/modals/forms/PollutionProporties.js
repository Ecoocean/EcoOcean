import React from 'react'

import 'react-image-picker/dist/index.css'

class PollutionProporties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {length: 0,
    width:0,
  depth:0,
coverage:0,
cleaningStatus:0};

    this.handleChangeLength = this.handleChangeLength.bind(this);
    this.handleChangeWidth = this.handleChangeWidth.bind(this);
    this.handleChangeDepth = this.handleChangeDepth.bind(this);
    this.handleChangeCoverage = this.handleChangeCoverage.bind(this);
    this.handleChangeCleaningStatus = this.handleChangeCleaningStatus.bind(this);


  }

  handleChangeLength(event) {
    this.setState({length: event.target.value});
  }
  handleChangeWidth(event) {
    this.setState({width: event.target.value});
  }
  handleChangeDepth(event) {
    this.setState({depth: event.target.value});
  }
  handleChangeCoverage(event) {
    this.setState({coverage: event.target.value});
  }
  handleChangeCleaningStatus(event) {
    this.setState({cleaningStatus: event.target.value});
  }

  render() {
    return (
      <form >
        <label>
        <p><b>Length:</b></p>
          <input type="integer" value={this.state.length} onChange={this.handleChangeLength} />
        </label>
        <label>
        <p><b>Width:</b></p>
          <input type="integer" value={this.state.width} onChange={this.handleChangeWidth} />
        </label>
        <label>
        <p><b>Depth:</b></p>
          <input type="integer" value={this.state.depth} onChange={this.handleChangeDepth} />
        </label>
        <label>
        <p><b>Coverage: (%)</b></p>
          <input type="integer" value={this.state.coverage} onChange={this.handleChangeCoverage} />
        </label>
        <label>
        <p><b>Cleaning Status:</b></p>
          <select value={this.state.cleaningStatus} onChange={this.handleChangeCleaningStatus}>
            <option value="clean">Clean</option>
            <option value="finalCleaningSteps">Final Cleaning Steps</option>
            <option  value="cleaningRightNow">Cleaning right now</option>
            <option  value="noCleaning">No cleaning is perfoemed</option>
            <option  value="selection">Please choose an option</option>
          </select>
        </label>
      </form>
    );
  }
}
export default PollutionProporties;