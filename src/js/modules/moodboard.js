import $ from 'jquery';
import Events from 'events';
import Slick from 'vendors/slick.min';
import Velocity from 'velocity-animate';

class MoodBoard {

	constructor(config){
		this.eventEmitter = new Events.EventEmitter();
		this.$container = $("*[data-js='moodboard']");
		this.$list = this.$container.find('.moodboard__list');
		this.scrollHandler = this.onScroll.bind(this);
		this.lock = false;

		let $info = this.$container.find('.moodboard__info');
		let $infoList = this.$container.find('.moodboard__info-list');
		let moveDuration = 650;

		// http://kenwheeler.github.io/slick/
		this.$list.slick({
			slide: '.moodboard__item',
			// appendArrows: false,
			speed: moveDuration,
			// infinite: false,
			draggable: false
		});

		this.$list.on('beforeChange', (e, slick, currentSlide, nextSlide) => {
			let offsetX = nextSlide * 100;
		  	Velocity($infoList, {translateZ: 0, translateX: `-${offsetX}%`}, {queue: false, duration: moveDuration});

		  	$infoList.find('.moodboard__info-item.show').removeClass('show');
		  	$infoList.find('.moodboard__info-item').eq(nextSlide).addClass('show');

		  	// The Slick Slider event for slide beginning and end ('beforeChange' and 'afterChange') are not reliable enough it seems
		  	this.lock = true;
		  	setTimeout(() => {
		  		this.lock = false;
		  	}, moveDuration * 2);

		  	this.eventEmitter.emit('change', {
		  		currentSlide: currentSlide,
		  		nextSlide: nextSlide,
		  		id: this.$list.find('.moodboard__item').eq(nextSlide + 1).attr('data-id')
		  	});

		  	this.$container.addClass('moodboard--scrolled');
		});

		// if(document.body.scrollTop == 0){
			this.maximize();
		// }else{
			// this.minimize();
		// }
	}

	on(){
		this.eventEmitter.on.apply(this.eventEmitter, arguments);
	}

	onScroll(e){
		if(e.wheelDelta < 0){
	    	this.prev();
	    }else{
	    	this.next();
	    }

	    e.preventDefault();
	}

	next(){
		if(!this.lock){
			this.$list.slick('slickNext');
		}
	}

	prev(){
		if(!this.lock){
			this.$list.slick('slickPrev');
		}
	}

	maximize(){
		this.eventEmitter.emit('maximize', {});
		this.$container.addClass('moodboard--maximize');
		window.addEventListener('mousewheel', this.scrollHandler);

		setTimeout(() => {
			this.$container.addClass('moodboard--init');
		}, 1000);
	}

	minimize(){
		this.eventEmitter.emit('minimize', {});
		this.$container.removeClass('moodboard--maximize');
		this.$container.removeClass('moodboard--init');
		window.removeEventListener('mousewheel', this.scrollHandler);
	}

}

export default MoodBoard;