import $ from 'jquery';
import Events from 'events';
import Slick from 'vendors/slick.min';
import Velocity from 'velocity-animate';

class MoodBoard {

	constructor(config){
		this.eventEmitter = new Events.EventEmitter();
		this.$container = $("*[data-js='moodboard']");
		this.$list = this.$container.find('.moodboard__list');
		this.$back = this.$container.find('.moodboard__back');
		this.scrollHandler = this.onScroll.bind(this);
		this.lock = false;
		let mode = config.mode;
		let $info = this.$container.find('.moodboard__info');
		let $infoList = this.$container.find('.moodboard__info-list');
		let moveDuration = 650;

		// http://kenwheeler.github.io/slick/
		this.$list.slick({
			slide: '.moodboard__item',
			prevArrow: `<button type="button" class="slick-prev">
				<svg viewBox="0 0 1792 1792" preserveAspectRatio="xMidYMid meet">
 		 			<use xlink:href="#chevron-left" />
				</svg></button>`,
			nextArrow: `<button type="button" class="slick-next">
				<svg viewBox="0 0 1792 1792" preserveAspectRatio="xMidYMid meet">
 		 			<use xlink:href="#chevron-right" />
				</svg></button>`,
			speed: moveDuration,
			draggable: false,
			// infinite: false,
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

		this.$back.on('click', (e) => {
			this.removeDetail();
			e.preventDefault();
		});

		this.maximize();
		this.setMode(mode);
	}

	on(){
		this.eventEmitter.on.apply(this.eventEmitter, arguments);
	}

	onScroll(e){

		if(e.wheelDelta > 0){
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
		this.addScroll();
	}

	detail(){
		this.eventEmitter.emit('detail', {
			id: this.getDetailId()
		});
		this.removeScroll();
	}

	getDetailId(){
		let currentIndex = 	this.$list.slick('slickCurrentSlide');
		let detailId = this.$list.find('.moodboard__item').eq(currentIndex + 1).attr('data-id');
		return detailId;
	}

	goTo(id){
		let $slickItem = this.$list.find(`.slick-slide[data-id="${id}"]`);
		this.$list.slick('slickGoTo', $slickItem.index() - 1);
	}

	removeDetail(){
		this.eventEmitter.emit('remove-detail', {});
		this.addScroll();
	}

	addScroll(){
		window.addEventListener('mousewheel', this.scrollHandler);
		window.addEventListener('DOMMouseScroll', this.scrollHandler);
	}

	removeScroll(){
		window.removeEventListener('mousewheel', this.scrollHandler);
		window.removeEventListener('DOMMouseScroll', this.scrollHandler);
	}

	mobileMode(){
		if(this.mode != 'mobile'){
			log('mobile');
			this.mode = 'mobile';
		}

	}

	setMode(mode){
		if(this.mode != mode){
			if(mode == 'mobile'){
				this.removeScroll();
			}else{
				this.addScroll();
			}

			this.mode = mode;
		}
	}

}

export default MoodBoard;