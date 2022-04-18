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
    inputDelayValue: this.props.config.delay
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

      this.props.changeColumnWidth(this.props.row, this.props.id, bootstrapWidth > 0 ? bootstrapWidth : 1);
  
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

  handleSelectChange = event => {
    var select = event.target;
    var selected = [...select.options]
      .filter(option => option.selected)
      .map(option => option.value);

    this.setState({
      selectedImages: selected
    });

    this.props.updateSelectImageState(this.props.row, this.props.id, selected.map(option => {
      return {fileName: option}
    }));
  }

  returnSliderTemplate = () => {
    const imagesOptions = this.props.images.map((image, index) => {
      return (
        <option value={image.fileName} key={index}>{image.fileName}</option>
      )
    })
    return (
      <>
        <select className="form-control form-select" multiple value={this.state.selectedImages} onChange={this.handleSelectChange}>
        {imagesOptions}
        </select>
        <input className="form-control input" type="number" placeholder="Slider delay" step="0.1" value={this.state.inputDelayValue / 1000} onChange={this.handleInputDelayChange} />
      </>
    )
  }

  render() {
    const { select_column, config, deleteSelectedColumn, row, id, onDrag, drop } = this.props;
    const { dragging } = this.state;

    let colSizes = `col-${config.width} `;

    const colInfo = {
      id: this.props.id,
      row: this.props.row
    };
    
    return (
      <Resizable 
        onClick={() => select_column({...config, ...colInfo})}
        className={`${colSizes} col no-gutter ${dragging ? 'no-transition' : null}`}
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
        onDragStart={e => onDrag(e, row, id)}
        onDragOver={this.dragOver}
        onDrop={e => drop(e, row, id)}
        key={id}
      >
        <div draggable className="col-inner">
          <div className="col-sizes">
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
            {this.state.type === 'slider' ? this.returnSliderTemplate() : null}
            <input className="form-control input" type="text" placeholder="Url/StartPosition" value={this.state.inputValue} onChange={this.handleInputChange} />
          </div>
          <span 
            className="glyphicon glyphicon-remove"
            onClick={() => deleteSelectedColumn(id, row)}
          ></span>
        </div>
      </Resizable>
    );
  };
};

export default Col;
