import Events from 'events';

class ScreenMode {

	constructor(){
		this.eventEmitter = new Events.EventEmitter();

		window.addEventListener('resize', () => {
			this.onWindowResize();
		});

		this.onWindowResize();
	}

	on(){
		this.eventEmitter.on.apply(this.eventEmitter, arguments);
	}

	onWindowResize(){
		let screenMode = this.getScreenMode();
		this.eventEmitter.emit('change', {
			mode: screenMode
		});
	}

	getScreenMode(){
		let modifiers = [];

		return {
			isMobile: this.isMobile(),
			isMobileiOS: this.isMobileiOS(),
			isTablet: this.isTablet(),
			isTabletLandscape: this.isTabletLandscape(),
			isTabletPortrait: this.isTabletPortrait(),
			isMinimal: (this.isMobile() || this.isTabletPortrait())
		}
	}

	isMobile(){
		let isMobile = window.matchMedia("only screen and (max-width: 736px)");

		return isMobile.matches;
	}

	isTablet(){
		let isTablet = window.matchMedia("only screen and (min-width: 768px) and (max-width: 1024px)");
		return isTablet.matches;
	}

	isTabletLandscape(){
		let isTablet = window.matchMedia("only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape)");
		return isTablet.matches;
	}

	isTabletPortrait(){
		let isTablet = window.matchMedia("only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait)");
		return isTablet.matches;
	}

	isMobileOrTablet(){
		let isMobileOrTablet = this.isMobile() || this.isTablet();
		return isMobileOrTablet;
	}

	isMobileiOS(){
		var userAgent = window.navigator.userAgent;
		return (userAgent.match(/iPhone/i));
	}

	checkiOSversion() {
	  if (/iP(hone|od|ad)/.test(window.navigator.platform)) {
	    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
	    var v = (window.navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
	    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
	  }
	}

}

export default ScreenMode;