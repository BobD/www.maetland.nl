import $ from 'jquery';
import Slick from 'vendors/slick.min';
import Velocity from 'velocity-animate';

class MoodBoard {

	constructor(){
		let $container = $("*[data-js='moodboard']");
		let $list = $container.find('.moodboard__list');
		let $info = $container.find('.moodboard__info');
		let $infoList = $container.find('.moodboard__info-list');

		// http://kenwheeler.github.io/slick/
		$list.slick({
			slide: '.moodboard__item',
			appendArrows: false,
			// infinite: false,
			swipeToSlide: true
		});

		$list.on('swipe', function(event, slick, direction){
			let index = slick.slickCurrentSlide();
			let offsetX = slick.slickCurrentSlide() * 100;
		  	Velocity($infoList, {translateZ: 0, translateX: `-${offsetX}%`}, {queue: false, duration: 500});

		  	$infoList.find('.moodboard__info-item.show').removeClass('show');
		  	$infoList.find('.moodboard__info-item').eq(index).addClass('show');
		});
	}

}

export default MoodBoard;