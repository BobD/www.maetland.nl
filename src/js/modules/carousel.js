import Events from 'events';
import Slick from 'vendors/slick.min';
import $ from 'jquery';

class Carousel {

	constructor($carousel){
		this.eventEmitter = new Events.EventEmitter();
		this.$carousel = $($carousel);

		// http://kenwheeler.github.io/slick/
		this.$carousel.slick({
			slide: '.carousel__item',
			prevArrow: `<button type="button" class="slick-prev">
				<svg viewBox="0 0 1792 1792" preserveAspectRatio="xMidYMid meet">
 		 			<use xlink:href="#chevron-left" />
				</svg></button>`,
			nextArrow: `<button type="button" class="slick-next">
				<svg viewBox="0 0 1792 1792" preserveAspectRatio="xMidYMid meet">
 		 			<use xlink:href="#chevron-right" />
				</svg></button>`,
			speed: 350,
			autoplay: true
		});
	}

	on(){
		this.eventEmitter.on.apply(this.eventEmitter, arguments);
	}
}

export default Carousel;