(() => {

	// (optional) tell jshint about globals (they should remain commented out)
	/* globals SBrick */ //Tell jshint someGlobalVar exists as global var

	let body = document.body,
		mySbrick,
		motor = {},
		servo = {},
		motorPort,
		servoPort,
		motionSensorPort;


	/**
	* handle changing of motor
	* @returns {undefined}
	*/
	const motorchangeHandler = function(portObj) {
		if (portObj.power === 0) {
			// motor was stopped
			mySBrick.stopSensor(motionSensorPort);
		} else {
			motor = portObj;
			mySBrick.startSensor(motionSensorPort);
		}
	};



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
			switch (portObj.portId) {
				case motorPort:
					motorchangeHandler(portObj);
					break;
			}
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
		if (state === 'midrange' || state === 'close') {
			motor.power = 0;
			mySBrick.setDrive(motor);
			mySBrick.stopSensor(motionSensorPort);
			invert();
		}
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
	};


	/**
	* turn sensor around, invert motor direction
	* @returns {undefined}
	*/
	const invert = function() {
		servo.direction = mySBrick.invDir(servo.direction);
		motor.power = 100;
		motor.direction = mySBrick.invDir(motor.direction);
		start();
	};
	


	/**
	* turn sensor into right direction; start sensor; start drive
	* @returns {undefined}
	*/
	const start = function() {
		mySBrick.setServo(servo);
		setTimeout(() => {
			mySBrick.setDrive(motor);
			mySBrick.startSensor(motionSensorPort);
		}, 600);
	};
	




	/**
	* 
	* @returns {undefined}
	*/
	const kickOff = function(e) {
		e.preventDefault();
		servo = {
			portId: servoPort,
			angle: 90,
			direction: mySBrick.CCW
		};
		motor = {
			portId: motorPort,
			power: 100,
			direction: mySBrick.CW
		};
		start();
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

		motorPort = mySBrick.BOTTOMLEFT;
		servoPort = mySBrick.TOPRIGHT;
		motionSensorPort = mySBrick.BOTTOMRIGHT;
		
		addEventListeners();

		document.getElementById('start-all').addEventListener('click', kickOff);
	};



	// kick of the script when all dom content has loaded
	document.addEventListener('DOMContentLoaded', init);

})();
