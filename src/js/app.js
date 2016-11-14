import 'babel-polyfill';
import $ from 'jquery';
import log from './utils/logger';
import ScreenMode from './utils/screenmode';
import MoodBoard from './modules/moodboard';
import ContentSection from './modules/content-section';

window.log = log;

document.addEventListener("DOMContentLoaded", function(e) {
	let moodBoard = new MoodBoard();
	let screenMode = new ScreenMode();
	let $html = document.querySelector('html');
	let $body = document.querySelector('body');
	let $header = document.querySelector("*[data-js='header']");
	let $contentSections = document.querySelectorAll("*[data-js='content-section']");
	let $contentContainer =  document.querySelector("*[data-js='content']");
	let $scrollTrigger =  document.querySelector("*[data-js='scroll-trigger']");
	let activeContentSection;

	$html.classList.remove('no-js');
	$html.classList.add('js');

	screenMode.modifiers.forEach((modifier) =>{
		$html.classList.add(modifier);
	});

	Array.from($contentSections).forEach(($section) => {
		let contentSection = new ContentSection({
			$section: $section
		});

		contentSection.on('open', (e) => {
			if(activeContentSection){
				activeContentSection.close();
			}

			activeContentSection = contentSection;
		});

		contentSection.on('close', (e) => {
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
		log(e);
	});
});

function scrollTo(el){
    let target = $(el.hash);

    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    
    if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
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