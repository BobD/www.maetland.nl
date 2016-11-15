import 'babel-polyfill';
import $ from 'jquery';
import log from './utils/logger';
import ScreenMode from './utils/screenmode';
import MoodBoard from './modules/moodboard';
import Block from './modules/block';
import Footer from './modules/footer';

window.log = log;

document.addEventListener("DOMContentLoaded", function(e) {
	let moodBoard = new MoodBoard();
	let screenMode = new ScreenMode();
	let footer = new Footer();
	let $html = document.querySelector('html');
	let $body = document.querySelector('body');
	let $page = document.querySelector('.page');
	let $content = document.querySelector('.content');
	let $header = document.querySelector("*[data-js='header']");
	let $sections = document.querySelectorAll(".content__section");
	let $contentContainer =  document.querySelector("*[data-js='content']");
	let $scrollTrigger =  document.querySelector("*[data-js='scroll-trigger']");
	let sectionStore = {};

	$html.classList.remove('no-js');
	$html.classList.add('js');

	screenMode.modifiers.forEach((modifier) =>{
		$html.classList.add(modifier);
	});

	$scrollTrigger.addEventListener('click', (e) => {
		moodBoard.detail();
		e.preventDefault();
	});	

	moodBoard.on('maximize', (e) => {
		$header.classList.add('header--full');
	});

	moodBoard.on('minimize', (e) => {
		$header.classList.remove('header--full');
	});

	moodBoard.on('detail', (e) => {
		ShowDetail(e.id);
	});

	moodBoard.on('remove-detail', (e) => {
		$content.setAttribute('data-section', '');
		$page.classList.remove('page--detail');

		$('html, body').animate({
          scrollTop: 0
        }, 500);
	});

	footer.on('detail', (e) => {
		moodBoard.goToDetail(e.id);
		$('html, body').animate({
          scrollTop: 0
        }, 250);

        ShowDetail(e.id);
	});

	Array.from($sections).forEach(($section) => {
		let sectionId = $section.getAttribute('id');
		let blocks = initBlocks($section);
		sectionStore[sectionId] = blocks;
	});

	function ShowDetail(id){
		let $section = document.querySelector(`#${id}`);
		$content.setAttribute('data-section', id);

		resetBlocks(sectionStore[id]);

		setTimeout(() => {
			$('html, body').scrollTop(0);
			$page.classList.add('page--detail');
		}, 10);
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

	setTimeout(() => {
		$page.classList.add('page--init');
	}, 1000);

	// Temp
	// moodBoard.detail();

});


