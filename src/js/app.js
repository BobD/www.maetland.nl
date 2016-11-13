import 'babel-polyfill';
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
	let introContainer =  document.querySelector("*[data-js='content']");
	let scrollTrigger =  document.querySelector("*[data-js='scroll-trigger']");
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
	
	window.addEventListener('scroll', function() {
        let scrollPos = getScrollPercent();

        if(scrollPos == 0){
        	$header.classList.add('header--full');
        }else{
        	$header.classList.remove('header--full');
        }
	});
});


function getScrollPercent() {
    var h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
}