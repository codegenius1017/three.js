import React, { Component } from 'react'

import { ReactArToolKitComponentDefaultProps, ReactArToolKitComponentPropTypes } from '../proptypes'
import initArToolKit from '../engine/three'
import arController from '../engine/arController'

export default class ReactArToolKit extends Component {
	toolKitSource = null
	toolKitContext = null
	renderer = null
	scene = null
	camera = null
	byAmt = 1000
	outputToFlush = null

	state = {
		// Store the functions to render
		accumulator: [],
	}

	static propTypes = ReactArToolKitComponentPropTypes()

	static defaultProps = ReactArToolKitComponentDefaultProps()

	// Create a canvas and initialise the scene and camera
	componentWillMount = () => {
		this.setBaseUrl()

		// Initialise the ARToolKit (also ARController)
		let { rendererRef, sceneRef, cameraRef } = initArToolKit(this.renderer, this.scene, this.camera, this.props)

		// WebGL renderer intialised
		this.renderer = rendererRef

		// Scene initialised
		this.scene = sceneRef

		// Camera initialised
		this.camera = cameraRef
	}

	// After the canvas has been created, render the three.js objects onto the marker. outputToFlush starts the rendering loop (performance concern)
	componentDidMount = () => {
		// AR toolkit utils required to configure the main engine and start the rendering loop (returns the output to be flush)
		const arToolKitUtils = {
			context: this.toolKitContext,
			source: this.toolKitSource,
			renderer: this.renderer,
			scene: this.scene,
			camera: this.camera,
			accumulator: this.state.accumulator,
		}

		// Main engine
		this.outputToFlush = arController(arToolKitUtils, this.props, this.byAmt)
	}

	// Remove the rendering context, hence exit the render loop
	componentWillUnmount = () => this.renderer.dispose()

	setBaseUrl = () =>
		(window.THREEx.ArToolkitContext.baseURL = 'https://rawgit.com/jeromeetienne/ar.js/master/three.js/')

	// For the first render, 'null' is rendered because we manually append the canvas to DOM
	// and use the next render to enter the threex.artoolkit render loop to render the 3D objects onto the marker
	render() {
		return this.outputToFlush
	}
}
