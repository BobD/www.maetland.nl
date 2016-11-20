import 'babel-polyfill';
import $ from 'jquery';
import log from './utils/logger';
import History from './modules/history';
import ScreenMode from './utils/screenmode';
import MoodBoard from './modules/moodboard';
import Block from './modules/block';
import Carousel from './modules/carousel';
import Footer from './modules/footer';

window.log = log;

document.addEventListener("DOMContentLoaded", function(e) {
	let history = new History();	
	let screenMode = new ScreenMode();
	let mode = screenMode.getScreenMode();
	let moodBoard = new MoodBoard({
		mode: (mode.isMobile || mode.isTabletPortrait) ? 'mobile' : 'desktop'
	});
	let footer = new Footer();
	let $html = document.querySelector('html');
	let $body = document.querySelector('body');	
	let $page = document.querySelector('.page');
	let $content = document.querySelector('.content');
	let $header = document.querySelector("*[data-js='header']");
	let $sections = document.querySelectorAll(".content__section");
	let $sectionBackButtons = document.querySelectorAll("*[data-js='section-back']");
	let $contentContainer =  document.querySelector("*[data-js='content']");
	let $scrollTrigger =  document.querySelector("*[data-js='scroll-trigger']");
	let sectionStore = {};


	$html.classList.remove('no-js');
	$html.classList.add('js');

	history.on('change', (e) => {
		showDetail(e.id)
	})

	applyScreenMode(mode);
	screenMode.on('change', (e) => {
		applyScreenMode(e.mode);
		moodBoard.setMode((mode.isMobile || mode.isTabletPortrait) ? 'mobile' : 'desktop');
	});

	$scrollTrigger.addEventListener('click', (e) => {
		if(mode.isMinimal){
			let id = moodBoard.getDetailId();
			scrollTo(`#${id}`);
		}else{
			moodBoard.detail();
			scrollTo('#content', 1500, 1000);
		}

		e.preventDefault();
	});	

	moodBoard.on('maximize', (e) => {
		$header.classList.add('header--full');
	});

	moodBoard.on('change', (e) => {
	});

	moodBoard.on('detail', (e) => {
		showDetail(e.id);
	});

	moodBoard.on('remove-detail', (e) => {
		removeDetail();
	});

	footer.on('detail', (e) => {
		if(mode.isMinimal){
			scrollTo(`#${e.id}`);
		}else{
			moodBoard.goTo(e.id);

			scrollTo('#top', 400, 0, () => {
				showDetail(e.id);
			});
		}
	});

	Array.from($sections).forEach(($section) => {
		let sectionId = $section.getAttribute('id');
		let blocks = initBlocks($section);
		let carousels = initCarousels($section);
		sectionStore[sectionId] = blocks;
	});


	Array.from($sectionBackButtons).forEach(($button) => {
		$button.addEventListener('click', (e) => {
			scrollTo('#top', 500);
			e.preventDefault();
		});
	});

	function applyScreenMode(mode){
		(mode.isMobile) ? $html.classList.add('is-mobile') : $html.classList.remove('is-mobile');
		(mode.isMobileiOS) ? $html.classList.add('is-ios') : $html.classList.remove('is-ios');
		(mode.isTablet) ? $html.classList.add('is-tablet') : $html.classList.remove('is-tablet');
		(mode.isTabletLandscape) ? $html.classList.add('is-tablet-landscape') : $html.classList.remove('is-tablet-landscape');
		(mode.isTabletPortrait) ? $html.classList.add('is-tablet-portrait') : $html.classList.remove('is-tablet-portrait');
		(mode.isMinimal) ? $html.classList.add('is-minimal') : $html.classList.remove('is-minimal');
		(!mode.isMobile && !mode.isTablet) ? $html.classList.add('is-desktop') : $html.classList.remove('is-desktop');
	}

	function showDetail(id){
		let $section = document.querySelector(`#${id}`);
		$content.setAttribute('data-section', id);

		resetBlocks(sectionStore[id]);

		setTimeout(() => {
			$('html, body').scrollTop(0);
			$page.classList.add('page--detail');
			$html.classList.add('html--detail');
		}, 10);

		$page.setAttribute('data-page', id);

		initImages($section);
		initCarousels($section);
		// history.set(`/#${id}`);
	}

	function removeDetail(){
		$content.setAttribute('data-section', '');
		$page.classList.remove('page--detail');
		$html.classList.remove('html--detail');
        scrollTo('#top', 500);

        // history.set('');
	}

	function initBlocks($section){
		let $blocks = $section.querySelectorAll("*[data-js='block']");
		let blockStore = [];
		let index = 0;
		let activeBlock;

		Array.from($blocks).forEach(($block) => {
			let block = new Block({
				$block: $block
			});

			if(index == 0){
				activeBlock = block;
			}

			block.on('open', (e) => {
				if(activeBlock){
					activeBlock.close();
				}

				activeBlock = block;
			});

			block.on('close', (e) => {
			});

			blockStore.push(block);
			++index;
		});

		return blockStore;
	}

	function resetBlocks(blocks){
		let index = 0;
		blocks.forEach((block) => {
			if(index == 0){
				block.open();
			}else{
				block.close();
			}

			++index;
		});
	}

	function initImages($section){
		let $imageSets = $section.querySelectorAll("*[data-js='images']");
		Array.from($imageSets).forEach(($images) => {
			// http://masonry.desandro.com/
			var msnry = new Masonry( $images, {
			  itemSelector: '.images__item',
			  columnWidth: '.images__sizer',
			  percentPosition: true
			});

			imagesLoaded( $images ).on( 'progress', function() {
			  	msnry.layout();
			});
		});

	}

	function initCarousels($section){
		let $carousels = $section.querySelectorAll("*[data-js='carousel']");
		Array.from($carousels).forEach(($carousel) => {
			let carousel = new Carousel($carousel);
			$carousel.removeAttribute('data-js');
		});

	}

	function scrollTo(id, speed = 250, delay = 0, callback){
		let target = $(`${id}`);
      	if (target.length) {
        	$('html, body').delay( delay ).animate({
          		scrollTop: target.offset().top
        	}, speed, callback);
      	}
	}

	setTimeout(() => {
		$page.classList.add('page--init');
	}, 1000);

    scrollTo('#top', 250);

	// Temp
	// showDetail('id_de-woning');
	// moodBoard.detail();
});


