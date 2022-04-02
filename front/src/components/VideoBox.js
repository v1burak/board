import React, { PureComponent } from "react";

export default class extends PureComponent {
    render() {
        return (
            <div className="video-wrapper">
                <video
                    src={this.props.src}
                    autoPlay={this.props.autoPlay}
                    onEnded={this.props.onEnded}
                    id={this.props.id}
                    muted
                />
            </div>
        );
    }
}
