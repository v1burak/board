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
      drop,
      changeHeight,
      generateHeightModal,
      modalHeight,
      row
    } = this.props;

    const height = row.height ? Math.round(row.height) : 20;

    return (
      <div className="row-component" key={id} data-height={height}>
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
              onClick={() => addOneColumn(index)}
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
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => drop(e, id)}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Row;
