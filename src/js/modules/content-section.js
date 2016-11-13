import Events from 'events';

class ContentSection {

	constructor(config){
		if(!config.$section){
			return;
		}

		this.eventEmitter = new Events.EventEmitter();
		this.$section = config.$section;
		this.$header = this.$section.getElementsByClassName('section__header')[0];
		
		this.$header.addEventListener('click', (e) => {
			let isClosed = this.$section.classList.value.indexOf('closed') != -1;

			if(isClosed){
				this.$section.classList.remove('closed');
			}else{
				this.$section.classList.add('closed');
			}

			this.eventEmitter.emit(!isClosed ? 'close' : 'open', {
				$section: this.$section,
			});
		});
	}

	close(){
		this.$section.classList.add('closed');
	}

	on(){
		this.eventEmitter.on.apply(this.eventEmitter, arguments);
	}
}

export default ContentSection;