import Events from 'events';
import $ from 'jquery';

class Block {

	constructor(config){
		if(!config.$block){
			return;
		}

		this.eventEmitter = new Events.EventEmitter();
		this.$block = config.$block;
		this.$header = this.$block.getElementsByClassName('block__header')[0];
		
		this.$header.addEventListener('click', (e) => {
			let isClosed = $(this.$block).hasClass('closed');

			if(isClosed){
				$(this.$block).removeClass('closed');
			}
			
			this.eventEmitter.emit(!isClosed ? 'close' : 'open', {
				$block: this.$block,
			});
		});
	}

	close(){
		$(this.$block).addClass('closed');
	}

	open(){
		$(this.$block).removeClass('closed');
	}

	on(){
		this.eventEmitter.on.apply(this.eventEmitter, arguments);
	}
}

export default Block;