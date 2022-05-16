import React, { Component } from 'react';
import Login from './components/setting/login/Login.js';
import { FileManager, FileNavigator } from '@opuscapita/react-filemanager';
import connector from '@opuscapita/react-filemanager-connector-node-v1';
import SocketIOClient from 'socket.io-client';
import { SOCKET_PORT } from './helper/Config';
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
        },
        apiOptionsMedia: {
            ...connector.apiOptions,
            apiRoot: 'http://' + window.location.hostname + ':3001/media'
        }
    }

    handleLogout = (event) => {
        event.preventDefault();
    
        sessionStorage.clear();
        window.location.reload();
    }

    handleRefreshPage = (event) => {
        event.preventDefault();

        this.socket = SocketIOClient(window.location.hostname + ':' + SOCKET_PORT);

        this.socket.emit('refresh');
    }

    render() {
        if (!this.state.token) {
            return <Login />
        }

        return (
            <div className="app m-files">
                <div className="files-box">
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
                        <FileNavigator
                            id="filemanager-1"
                            api={connector.api}
                            apiOptions={this.state.apiOptionsMedia}
                            capabilities={connector.capabilities}
                            listViewLayout={connector.listViewLayout}
                            viewLayoutOptions={connector.viewLayoutOptions}
                            onResourceItemClick={this.onResourceItemClick}
                        />
                    </FileManager>
                </div>
                <div className="files-navigations">
                    <span title="Logout"
                        onClick={this.handleLogout}
                        className="glyphicon glyphicon-off logout-button btn-icon">
                        <span className="subtitle-btn">Logout</span>
                    </span>
                    <span title="Refresh board"
                        onClick={this.handleRefreshPage}
                        className="glyphicon glyphicon-refresh refresh-button btn-icon">
                        <span className="subtitle-btn">Refresh board</span>
                    </span>
                </div>
            </div>
        );
    }
};

export default Files;
