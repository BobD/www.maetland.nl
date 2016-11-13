class ScreenMode {

	constructor(){
		let modifiers = [];

		if(this.isMobile()){
			modifiers.push('is-mobile');
		}

		if(this.isMobileiOS()){
			modifiers.push('is-ios');
		}

		if(this.isTablet()){
			modifiers.push('is-tablet');
		}

		if(!this.isMobile() && !this.isTablet()){
			modifiers.push('is-desktop');
		}

		return {
			modifiers: modifiers,
			isMobile: this.isMobile(),
			isMobileiOS: this.isMobileiOS(),
			isTablet: this.isTablet()
		}
	}

	isMobile(){
		let isMobile = window.matchMedia("only screen and (max-width: 736px)");

		return isMobile.matches;
	}

	isTablet(){
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