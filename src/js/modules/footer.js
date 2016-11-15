import Events from 'events';

class Footer {

	constructor(config){
		this.eventEmitter = new Events.EventEmitter();
		let $nav = document.querySelector("*[data-js='footer-nav']");
		let $links = $nav.getElementsByClassName("footer__nav-link");

		Array.from($links).forEach(($link) => {
			let href = $link.getAttribute('href');
			let id = href.substring(1);

			$link.addEventListener('click', (e) => {
				this.eventEmitter.emit('detail', {
					id: id,
				});
				e.preventDefault();
			});
		});
	}

	on(){
		this.eventEmitter.on.apply(this.eventEmitter, arguments);
	}
}

export default Footer;