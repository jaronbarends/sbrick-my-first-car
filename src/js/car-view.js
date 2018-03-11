(() => {

	// (optional) tell jshint about globals (they should remain commented out)
	/* globals SBrick */ //Tell jshint someGlobalVar exists as global var

	let body = document.body,
		mySbrick;



	/**
	* handle change of port power
	* @param {event} e - portchange.sbrick event with detail: portObjs {portId, power, direction}
	* @returns {undefined}
	*/
	// TODO: sbrick.js does seem to send consecutive portchange events for quickDrive, instead of just 1
	// so change that in sbrick.js
	const portchangeHandler = function(e) {
		let portObjs = e.detail;
		if (!Array.isArray(portObjs)) {
			portObjs = [portObjs];
		}

		portObjs.forEach((portObj) => {
			// do something useful here
		});

	};


	/**
	* handle change of sensor state (i.e. up/down/left/right/flat, clear/midrange/close)
	* @param {event} e - sensorchange.sbrick event;
	* @returns {undefined}
	*/
	const sensorchangeHandler = function(e) {
		const sensorData = e.detail,
			{type, state} = sensorData;

		// do something useful here
		window.util.log(type, state);
	};


	/**
	* handle change of sensor value (i.e. number)
	* @param {event} e - sensorchange.sbrick event;
	* @returns {undefined}
	*/
	const sensorvaluechangeHandler = function(e) {
		const sensorData = e.detail,
			{type, value} = sensorData;

		// do something useful here
		window.util.log(type, value);
	};
	
	

	/**
	* add listeners for changed ports
	* @returns {undefined}
	*/
	const addEventListeners = function() {
		body.addEventListener('portchange.sbrick', portchangeHandler);
		body.addEventListener('sensorchange.sbrick', sensorchangeHandler);
	};



	/**
	* initialize all functionality
	* @returns {undefined}
	*/
	const init = function() {
		window.mySBrick = window.mySBrick || new SBrickExtended();
		mySBrick = window.mySBrick;
		
		addEventListeners();
	};



	// kick of the script when all dom content has loaded
	document.addEventListener('DOMContentLoaded', init);

})();
