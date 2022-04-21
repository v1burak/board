import React, { Component } from "react";

import "./Row.css";

class Row extends Component {
  render() {
    const {
      index,
      id,
      moveRowUpDown,
      addOneColumn,
      deleteSelectedRow,
      select_row,
      changeHeight,
      generateHeightModal,
      modalHeight,
      row
    } = this.props;

    const height = row.height ? Math.round(row.height) : 20;
    const select = row.cols.filter(col => col.type === "frame");

    return (
      <div className={`row-component ${select.length ? 'm-select' : ''}`} key={id}>
        <div className="row-control">
          <div>
            <span
              title="Move row up"
              onClick={() => moveRowUpDown("up", index)}
              className="glyphicon glyphicon-arrow-up"
            ></span>
          </div>
          <div>
            <span
              title="Move row down"
              onClick={() => moveRowUpDown("down", index)}
              className="glyphicon glyphicon-arrow-down"
            ></span>
          </div>
          <div>
            <span
              title="Add new column"
              onClick={() => addOneColumn(id)}
              className="glyphicon glyphicon-plus"
            ></span>
          </div>
          <div>
            <span
              title="Delete row"
              onClick={() => deleteSelectedRow(id)}
              className="glyphicon glyphicon-remove"
            ></span>
          </div>
          <div>
          <span
              title="Change height"
              onClick={() => changeHeight(index + 1)}
              className="glyphicon glyphicon-wrench"
            ></span>
          </div>
        </div>
        {modalHeight[index] ? generateHeightModal(index) : null}
        <div
          onClick={() => select_row(id)}
          className="row row-content"
          droppable="true"
        >
          {this.props.children}
        </div>
        <div className="row-height">Height: {height}%</div>
      </div>
    );
  }
}

export default Row;
