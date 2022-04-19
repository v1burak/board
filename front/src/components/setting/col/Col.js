import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Resizable from 're-resizable';

import './Col.css';

const TYPES = {
  frame: 'frame',
  video: 'video',
  slider: 'slider'
}

class Col extends Component {
  state = {
    dragging: false,
    type: this.props.type,
    inputValue: this.props.inputValue,
    inputDelayValue: this.props.config.delay,
    selectedImages: []
  }

  componentDidMount () {
    ReactDOM.findDOMNode(this).style.removeProperty('height');
    ReactDOM.findDOMNode(this).style.removeProperty('width');

    if (this.props.config.type === 'slider') {
      this.setState({
        selectedImages: this.props.config.images.map(img => img.fileName)
      })
    }
  }

  startResize = (e, direction, ref) => {
    this.setState({
      dragging: true
    });
  };

  reSize = (e, direction, ref, delta) => {
    this.setState({
      dragging: false
    }, () => {
      const bootstrapWidth = Number(ref.style.width.split('p')[0]) / (e.path[5].clientWidth / 12) > 10.8 ? 12 : Math.round(Number(ref.style.width.split('p')[0]) / (e.path[5].clientWidth / 12))

      this.props.changeColumnWidth(this.props.row, this.props.id, bootstrapWidth > 0 ? bootstrapWidth : 12);

      ref.style.removeProperty('height');
      ref.style.removeProperty('width');
    })
  }

  handleChange = (event) => {
    this.setState({
      type: TYPES[event.target.value]
    });

    this.props.updateSelectState(this.props.row, this.props.id, event.target.value);
  }

  handleInputChange = (event) => {
    this.setState({
      inputValue: event.target.value
    })

    this.props.updateInputState(this.props.row, this.props.id, event.target.value);
  }

  dragOver = e => {
    e.preventDefault()
  };

  handleInputDelayChange = (event) => {
    this.setState({
      inputDelayValue: Number(event.target.value) * 1000
    })

    this.props.updateInputDelayState(this.props.row, this.props.id, Number(event.target.value) * 1000);
  }

  handleSelectAllChange = event => {
    var selectedCheckbox = event.target.checked;
    var selected = [];

    if (selectedCheckbox) {
      selected = this.props.images.map(img => img.fileName);
    } else {
      selected = [];
    }

    this.setState({
      selectedImages: selected
    });

    this.props.updateSelectImageState(this.props.row, this.props.id, selected.map(option => {
      return {fileName: option}
    }));
  }

  handleSelectChange = event => {
    var value = event.target.getAttribute('data-value');
    var selectedCheckbox = event.target.checked;
    var selected = this.state.selectedImages;

    if (selectedCheckbox) {
      selected.push(value)
    } else {
      selected.splice(selected.findIndex(e => e === value),1);
    }

    this.setState({
      selectedImages: selected
    });

    this.props.updateSelectImageState(this.props.row, this.props.id, selected.map(option => {
      return {fileName: option}
    }));
  }

  returnSliderTemplate = () => {
    if (!this.props.images.length) {
      return false;
    }

    const imagesOptions = this.props.images.map((image, index) => {
      const checked = this.state.selectedImages.filter(img => img === image.fileName).length;

      return (
        <label className="switch" key={index}>
          <input className="switch__input" type="checkbox" data-value={image.fileName} checked={checked} onChange={this.handleSelectChange}/>
          <i className="switch__icon"></i>
          <span className="switch__span">{image.fileName}</span>
        </label>
      )
    })
    return (
      <>
        <div className="form-group col-12">
          <label className="form-label">Please choose an image</label>
          <div className="switch-list">
            <label className="switch">
              <input className="switch__input" type="checkbox" onChange={this.handleSelectAllChange}/>
              <i className="switch__icon"></i>
              <span className="switch__span">Select all</span>
            </label>
            {imagesOptions}
          </div>
        </div>
        <div className="form-group col-12">
          <label className="form-label">Please choose delay time (seconds)</label>
          <input className="form-control input" type="number" placeholder="Slider delay" step="0.1" value={this.state.inputDelayValue / 1000} onChange={this.handleInputDelayChange} />
        </div>
      </>
    )
  }

  render() {
    const { select_column, config, deleteSelectedColumn, row, id } = this.props;
    const { dragging } = this.state;

    let colSizes = `col-${config.width} `;

    const colInfo = {
      id: this.props.id,
      row: this.props.row
    };
    
    return (
      <Resizable 
        onClick={() => select_column({...config, ...colInfo})}
        className={`${colSizes} col no-gutter ${dragging ? 'no-transition' : ''}`}
        enable={{ 
          top: false, 
          right: true, 
          bottom: false, 
          left: false, 
          topRight: false, 
          bottomRight: false, 
          bottomLeft: false, 
          topLeft: false 
        }}
        bounds={'parent'}
        onResizeStop={this.reSize}
        onResizeStart={this.startResize} 
        key={id}
      >
        <div draggable className="col-inner">
          <div className="col-sizes">
            <div className="form-group col-12">
              <label className="form-label">Select type of element</label>
              <select className="form-control select" value={this.state.type} onChange={this.handleChange}>
                <option value="frame">
                  Frame
                </option>
                <option value="video">
                  Video
                </option>
                <option value="slider">
                  Slider
                </option>
              </select>
            </div>
            {this.state.type === 'slider' ? this.returnSliderTemplate() : null}
            <div className="form-group col-12">
              <label className="form-label">Please {this.state.type === 'frame' ? 'add iframe url': 'choose start position value'}</label>
              <input className="form-control input" type={this.state.type === 'frame' ? 'text': 'number'} placeholder="Url/StartPosition" value={this.state.inputValue} onChange={this.handleInputChange} />
            </div>
          </div>
          <span 
            className="glyphicon glyphicon-remove"
            onClick={() => deleteSelectedColumn(id, row)}
          ></span>
          <div className="col-width">Width: {Math.floor((config.width / 12) * 100)}%</div>
        </div>
      </Resizable>
    );
  };
};

export default Col;
