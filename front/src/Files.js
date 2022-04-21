import React, { Component } from 'react';
import Login from './components/setting/login/Login.js';
import { FileManager, FileNavigator } from '@opuscapita/react-filemanager';
import connector from '@opuscapita/react-filemanager-connector-node-v1';
import './Files.css';

class Files extends Component {
    state = {
        token: sessionStorage.getItem('auth'),
        apiOptionsImages: {
            ...connector.apiOptions,
            apiRoot: 'http://' + window.location.hostname + ':3001/images'
        },
        apiOptionsVideos: {
            ...connector.apiOptions,
            apiRoot: 'http://' + window.location.hostname + ':3001/videos'
        }
    }

    handleShowImages = event => {
        event.preventDefault();

    };

    render() {
        if (!this.state.token) {
            return <Login />
        }

        return (
            <div style={{ height: "480px" }}>
                <FileManager>
                    <FileNavigator
                        id="filemanager-1"
                        api={connector.api}
                        apiOptions={this.state.apiOptionsImages}
                        capabilities={connector.capabilities}
                        listViewLayout={connector.listViewLayout}
                        viewLayoutOptions={connector.viewLayoutOptions}
                        onResourceItemClick={this.onResourceItemClick}
                    />
                    <FileNavigator
                        id="filemanager-1"
                        api={connector.api}
                        apiOptions={this.state.apiOptionsVideos}
                        capabilities={connector.capabilities}
                        listViewLayout={connector.listViewLayout}
                        viewLayoutOptions={connector.viewLayoutOptions}
                        onResourceItemClick={this.onResourceItemClick}
                    />
                </FileManager>
            </div>
        );
    }
};

export default Files;