import Events from 'events';

class Block {

	constructor(config){
		if(!config.$block){
			return;
		}

		this.eventEmitter = new Events.EventEmitter();
		this.$block = config.$block;
		this.$header = this.$block.getElementsByClassName('block__header')[0];
		
		this.$header.addEventListener('click', (e) => {
			let isClosed = this.$block.classList.value.indexOf('closed') != -1;

			if(isClosed){
				this.$block.classList.remove('closed');
			}else{
				// this.$block.classList.add('closed');
			}

			this.eventEmitter.emit(!isClosed ? 'close' : 'open', {
				$block: this.$block,
			});
		});
	}

	close(){
		this.$block.classList.add('closed');
	}

	open(){
		this.$block.classList.remove('closed');
	}

	on(){
		this.eventEmitter.on.apply(this.eventEmitter, arguments);
	}
}

export default Block;