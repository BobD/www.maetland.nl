import 'babel-polyfill';
import $ from 'jquery';
import log from './utils/logger';
import ScreenMode from './utils/screenmode';
import MoodBoard from './modules/moodboard';
import Block from './modules/block';

window.log = log;

document.addEventListener("DOMContentLoaded", function(e) {
	let moodBoard = new MoodBoard();
	let screenMode = new ScreenMode();
	let $html = document.querySelector('html');
	let $body = document.querySelector('body');
	let $header = document.querySelector("*[data-js='header']");
	let $blocks = document.querySelectorAll("*[data-js='block']");
	let $contentContainer =  document.querySelector("*[data-js='content']");
	let $scrollTrigger =  document.querySelector("*[data-js='scroll-trigger']");
	let activeBlock;

	$html.classList.remove('no-js');
	$html.classList.add('js');

	screenMode.modifiers.forEach((modifier) =>{
		$html.classList.add(modifier);
	});

	Array.from($blocks).forEach(($block) => {
		let block = new Block({
			$block: $block
		});

		block.on('open', (e) => {
			if(activeBlock){
				activeBlock.close();
			}

			activeBlock = block;
		});

		block.on('close', (e) => {
		});
	});

	$scrollTrigger.addEventListener('click', (e) => {
		moodBoard.minimize();
		e.preventDefault();
	});	

	moodBoard.on('maximize', (e) => {
		$header.classList.add('header--full');
	});

	moodBoard.on('minimize', (e) => {
		$header.classList.remove('header--full');
	});

	moodBoard.on('change', (e) => {
		let goingUp = e.currentSlide > e.nextSlide;
		let $sections = document.querySelectorAll(".page__section");
		Array.from($sections).forEach(($section) => {
			log($section);
			$section.classList.remove('active');
		});
		let $activeSection = document.getElementById(e.id);
		$activeSection.classList.add('active');
		scrollTosection(e.id);
	});


	// document.documentElement.scrollTop = 0;
	// log(document.documentElement.scrollTop);
    //  $('html, body').animate({
    //   scrollTop: 0
    // }, 1);

	// Temp
	moodBoard.minimize();
	$header.classList.remove('header--full');
});

function scrollTosection(hash){
    let target = $(`#${hash}`);
    let topOffset = window.outerWidth * .25;
    let offset =  (target.offset().top - topOffset) - 50;
    
    if (target.length) {
        $('html, body').animate({
          scrollTop: offset
        }, 500);
        return false;
    }
}


// function getScrollPercent() {
//     var h = document.documentElement, 
//         b = document.body,
//         st = 'scrollTop',
//         sh = 'scrollHeight';
//     return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
// }