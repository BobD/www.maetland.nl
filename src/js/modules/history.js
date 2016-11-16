import CreateBrowserHistory from 'history/createBrowserHistory';
import Events from 'events';

class History {

	constructor(config){
		// https://github.com/mjackson/history
		this.eventEmitter = new Events.EventEmitter();
		this.history = CreateBrowserHistory();

		// const location = history.location;
		const unlisten = this.history.listen((location, action) => {
		});
		// this.history.push('/home', {})
	}

	set(id){
		this.history.push(`/${id}`, {})
	}

	on(){
		this.eventEmitter.on.apply(this.eventEmitter, arguments);
	}

}

export default History;