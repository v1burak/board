import React, { PureComponent } from "react";
import SocketIOClient from 'socket.io-client';
import Slider from "react-slick";

import { API_PORT, SOCKET_PORT } from './helper/Config';
import 'bootstrap/dist/css/bootstrap.min.css';

import VideoBox from "./components/VideoBox";
import "./App.css";

const CONFIG_TYPES = {
	VIDEO: 'video',
	FRAME: 'frame',
	SLIDER: 'slider'
}

export default class extends PureComponent {
	i = 0;
	base64Videos = [];
	tmpBase64Videos = [];
	videos = [];
	updated = false;
	updatedConfig = false;
	constructor() {
		super();
		this.state = {
			configIsReturned : false,
			videoIsReturned : false,
			template: [],
			config: [{
				"type": "video",
				"startPosition": 0,
				"height": 25,
				"width": 100
			}],
			freshVideos: [],
			currentVideos: [{
				file: null,
				fileName: null,
				onEnded: false
			}],
			currentVideoIndexes: [],
			controls: [],
			enabled: true,
			images: []
		};
	}

	componentDidMount() {
		this.socket = SocketIOClient(window.location.hostname + ':' + SOCKET_PORT);
		this.socket.on('videos', (data) => {
			this.tmpBase64Videos = [];
			this.i = 0;
			this.videos = data.videos;
			this.updated = false;
			this.convertUrlTObase64(data.videos);
			this.setState({videoIsReturned : true});
			
		});
		this.socket.on('config', (data) => {
			window.location.reload();
		});
		this.socket.on('cron', (data) => {
			this.setState({enabled : data.enabled});
		});

		this.getConfig();
		this.fetchAllVideos();
		this.fetchAllImages();
	}

	getConfig() {
		fetch('http://' + window.location.hostname + ':' + API_PORT + '/api/config').then(response => response.json())
		.then(data => {
			this.setState({config : data});
			this.setState({
				configIsReturned : true,
				currentVideoIndexes: this.getCurrentVideoIndex(),
				currentVideos: this.getCurrentVideos(),
				controls: this.getControls()
			});
		}).catch(error => {
			alert(error);
		});
	}

	fetchAllVideos() {
		fetch('http://' + window.location.hostname + ':' + API_PORT + '/api/videos').then(response => response.json())
		.then(data => {
			this.tmpBase64Videos = [];
			this.i = 0;
			this.videos = data.data;
			this.updated = false;
			this.convertUrlTObase64(data.data);
			this.setState({videoIsReturned : true});
		}).catch(error => {
			alert(error);
		});
	}

	fetchAllImages() {
		fetch('http://' + window.location.hostname + ':' + API_PORT + '/api/images').then(response => response.json())
		.then(data => {
			this.setState({images : data.data});
		}).catch(error => {
			alert(error);
		});
	}

	render() {
		return (
			<main role="main" className={this.state.enabled ? 'main m-enabled': 'main m-disabled'}>
				<div className="album bg-light">
					<div className="box">
						{this.state.configIsReturned && this.state.videoIsReturned ? this.setTemplate() : <h1>Loading...</h1>}
					</div>
				</div>
			</main>
		);
	}

	getControls() {
		const videosSetting = this.filterConfig(CONFIG_TYPES.VIDEO);

		return videosSetting.map(video => {
			return {autoPlay: true, onEnded: true};
		});
	}

	setTemplate() {
		let i = -1;

		return this.state.config.map((item, index) => {
			if (item.type === CONFIG_TYPES.VIDEO) {
				i++;

				return this.getVideoTemplate(i, index, item);		
			} else if (item.type === CONFIG_TYPES.FRAME) {
				return this.getFrameTemplate(item.url, index, item);
			} else if (item.type === CONFIG_TYPES.SLIDER) {
				return this.getSliderTemplate(i, index, item);
			}

			return null;
		});
	}

	getVideoTemplate(i, index, params) {
		const width = params.width ? params.width : '100';
		const height = params.height ? params.height : '100';

		if (!this.state.currentVideos[i]) return;

		return (
			<div className="video-box" key={index} data-width={width} data-height={height}>
				<VideoBox
					src={this.state.currentVideos[i].file}
					autoPlay={this.state.controls[i].autoPlay}
					onEnded={this.onVideoEnd}
					data={this.state.currentVideos[i]}
					id={i}
				/>
			</div>
		);
	}

	getFrameTemplate(url, index, params) {
		const width = params.width ? params.width : '100';
		const height = params.height ? params.height : '100';

		return (
			<div className="frame-wrapper" key={index} data-width={width} data-height={height}>
				<iframe src={url} id="myIFrame" title="MyFrame" referrerPolicy="no-referrer" className="frame" data-height={height}></iframe>
			</div>
		);
	}

	getSliderTemplate(i, index, params) {
		const width = params.width ? params.width : '100';
		const height = params.height ? params.height : '100';
		const settings = {
			dots: false,
			infinite: true,
			speed: 500,
			autoplaySpeed: params.delay ? Number(params.delay) : 3000,
			autoplay: true,
			slidesToShow: 1,
			slidesToScroll: 1
		};
		let imagesArray = this.state.images;

		if (!imagesArray.length) {
			return false;
		}

		const firstHalf = imagesArray.slice(0, params.startPosition)
		const secondHalf = imagesArray.slice(params.startPosition);

		imagesArray = secondHalf.concat(firstHalf);
		
		const imagesList = imagesArray.map((image, index) => {
			let imageObj;

			params.images.forEach((img) => {
				if (image.fileName === img.fileName) {
					imageObj = image;
				}
			})

			if (!imageObj) {
				return <></>;
			}

			return (
				<div className="slide_item" key={index}>
					<img src={'http://' + window.location.hostname + ':' + API_PORT + '/media/' + imageObj.fileName} alt={imageObj.fileName} className="slide_image"/>
				</div>
			);
		})

		return (
			<div key={index} data-width={width} data-height={height}>
				<Slider {...settings}>
				{imagesList}
				</Slider>
			</div>
		);
	}

	getCurrentVideoIndex() {
		const videosSetting = this.filterConfig(CONFIG_TYPES.VIDEO);

		return videosSetting.map(video => video.startPosition);
	}

	getCurrentVideos() {
		const videosSetting = this.filterConfig(CONFIG_TYPES.VIDEO);

		return videosSetting.map(video => {
			return {
				file: null,
				fileName: null,
				onEnded: false
			};
		});
	}

	filterConfig(type) {
		return this.state.config.filter(item => {
			if (item.type === type) {
				return item;
			}

			return null;
		})
	}

	equals(a, b) {
		return a.length === b.length;
	};

	checkUpdate() {
		fetch('http://' + window.location.hostname + ':' + API_PORT + '/api/videos').then(response => response.json())
		.then(data => {
			this.updated = !this.equals(this.videos, data.data);
		}).catch(error => {
			alert(error);
		});
		fetch('http://' + window.location.hostname + ':' + API_PORT + '/api/config').then(response => response.json())
		.then(data => {
			this.updatedConfig = !this.equals(this.state.config, data);
		}).catch(error => {
			alert(error);
		});
	}

	convertUrlTObase64(videos){
		let video = videos[this.i];
		if(video){
			this.i++;
			let isAlready = this.base64Videos.find(item => item.fileName === video.fileName);
			if(!isAlready || isAlready.size !== video.size){
				this.getBase64('http://' + window.location.hostname + ':' + API_PORT + '/video/' + video.fileName, video.fileName, (result) => {
					let encoded = {
						file: result,
						fileName: video.fileName,
						size: video.size
					};
					this.tmpBase64Videos.push(encoded);
					this.convertUrlTObase64(videos);
				});
			} else {
				this.tmpBase64Videos.push(isAlready);
				this.convertUrlTObase64(videos);
			}
		} else {
			this.base64Videos = Object.assign([], this.tmpBase64Videos);
			this.setVideos(this.base64Videos);
		}
	}


	async getBase64(file, fileName, cb) {
		let response = await fetch(file);
		let data = await response.blob();
		let metadata = {
			type: 'video/'+fileName.split('.')[1]
		};
		file = new File([data], fileName, metadata);

		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			cb(reader.result)
		};
		reader.onerror = function (error) {
			console.log('Error: ', error);
		};
	}

	setVideos = (videos) => {
		this.setState({ freshVideos: videos });
		if (this.state.freshVideos.length) {
			this.state.currentVideoIndexes.forEach((id, index) => {
				this.selectVideo(this.state.freshVideos[id], index);
			})
		} else {
			this.setState({ currentVideos: [{ name: null, file: null }, { name: null, file: null }] });
		}
	}

	selectVideo = (currentVideo, id) => {
		let currentVideoIndex =  this.base64Videos.findIndex(item => {
			return item.fileName === currentVideo.fileName
		});
		let currentVideos = [...this.state.currentVideos];
		let currentVideoIndexes = [...this.state.currentVideoIndexes];

		currentVideoIndexes[id] = currentVideoIndex;
		currentVideos[id] = currentVideo;

		this.setState({ currentVideos, currentVideoIndexes });
	};

	updateControls = (controls, id) => {
		let oldControls = Object.assign({}, this.state.controls[id]);
		for (let key in controls) {
			let val = controls[key];
			oldControls[key] = val;
		}
		let controlList =  this.state.controls;
		controlList[id] = oldControls;
		this.setState({ controls: controlList });
	};

	onVideoEnd = (id) => {
		id = id.currentTarget.id;

		this.updateControls({ isEnded: true }, id);

		let nextIndex = 0;

		if (this.state.freshVideos[this.state.currentVideoIndexes[id] + 1]) {
			nextIndex = this.state.currentVideoIndexes[id] + 1;

			this.selectVideo(this.state.freshVideos[nextIndex], id);
		} else {
			let currentVideoIndexes = [...this.state.currentVideoIndexes];

			currentVideoIndexes[id] = 0;

			this.setState({ currentVideoIndexes });

			nextIndex = 0;

			this.selectVideo(this.state.freshVideos[nextIndex], id);
		}
	}
}