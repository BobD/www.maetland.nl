class Logger {

	constructor(){
	}

	static log(){
		if(ENV == 'development'){
			console.log.apply(this, arguments);
		}
	}
}

export default Logger.log;