;(function(w, MK) {

	MK.Slider = Class({
		'extends': MK.Array,
		constructor: function(data, app)
		{
			var obHammer;
			
			data.options = $.extend({
				Model: MK.Object,
				application: app,
				container: '.lineSlider',
				showArrows: true,
				showIndicators: true,
				maxVisible: 0,
				curSlide: 0
			}, data.options);

			data.items = data.items || [];

			this.set(data.options);

			//if(typeof this.Model === 'string')
			//	this.Model = window[this.Model];

			this.bindNode('container', this.container);
			this._buildSlider();

			this.set({
				frame: this.sandbox.querySelector('.sliderFrame')
			});

			if(data.items.length)
			{
				this.recreate(data.items);
			}
			else
			{
				this.restore();
			}

			this.bindNode({
				listPos: [this.bound('container'), MK.binders.style('left')],
				listWidth: [this.bound('container'), MK.binders.style('width')],
				spaceStyle: [this.bound('container').children, MK.binders.style('marginLeft')],
				prev: [':sandbox .prev', MK.binders.className('hidden')],
				next: [':sandbox .next', MK.binders.className('hidden')]
			});

			if(this.showIndicators)
				this.setClassFor('indicators', this.IndicatorsConstructor);
				//this.indicators = new this.IndicatorsConstructor(this.sandbox.querySelector('.sliderNav'));

			this.mediate('curSlide', this._curSlideMediator)
			    .mediate('visibleItems', function(v) {

				    return this.maxVisible ? Math.min(this.maxVisible, v) : v;

			    });

			this.linkProps('prev', 'curSlide', function(slide) {

				return slide == 0;

			}).linkProps('maxIndex', 'length visibleItems', function(len, visible) {

				return Math.max(0, len - visible);

			}, {setOnInit: false}).linkProps('next', 'curSlide maxIndex', function(slide, max) {

				return slide == max;

			}, {setOnInit: false}).linkProps('spaceStyle', 'space', function(v) {

				return v + 'px';

			}, {setOnInit: false});
			
			obHammer = new Hammer(this.bound('container'), {domEvents: true});

			this.on('click::prev swiperight::container', function() {

				this.curSlide -= this.visibleItems;

			}).on('click::next swipeleft::container', function() {

				this.curSlide += this.visibleItems;

			}).on('change:curSlide', function() {

				this.listPos = -this[this.curSlide].sandbox.offsetLeft + 'px';
				if(this.showIndicators)
					this.indicators[Math.ceil(this.curSlide / this.visibleItems)].active = true;

			}).onDebounce('application.win@change:pageWidth', this._recalcSlider, 150, true);

		},
		_recalcSlider: function()
		{
			var tempCurSlide;

			this.frameWidth = this.frame.offsetWidth;
			this.itemWidth = this[0].sandbox.offsetWidth;
			this.visibleItems = ~~(this.frameWidth / this.itemWidth);
			this.space = this.visibleItems == 1 ? 0 : (this.frameWidth - this.visibleItems * this.itemWidth) / (this.visibleItems - 1);
			this.listWidth = this.itemWidth * this.length + this.space * (this.length - 1) + 'px';
			if(this.showIndicators)
				this._recalcIndicators();

			if(this.curSlide === (tempCurSlide = Math.min(this.curSlide, this.maxIndex)))
			{
				this.trigger('change:curSlide');
			}
			else
			{
				this.curSlide = tempCurSlide;
			}
		},
		_recalcIndicators: function()
		{
			var i, indicators = [];

			this.cntIndicators = Math.ceil(this.length / this.visibleItems);

			for(i = this.cntIndicators; i--;)
			{
				indicators[i] = {
					value: i,
					active: i == 0
				};
			}

			this.indicators = indicators;
			this.indicators.activeNum = 0;

		},
		_curSlideMediator: function(val)
		{
			return val > 0 ? Math.min(val, this.maxIndex) : 0;
		},
		_buildSlider: function() {

			var slider = this.bound('container'),
				wrapper = document.createElement('div');

			wrapper.className = 'sliderWrapper';
			wrapper.innerHTML = '<div class="sliderFrame"></div>';

			if(this.showArrows)
			{
				wrapper.innerHTML += '<button class="sliderArrow prev"></button><button class="sliderArrow next"></button>'
			}
			if(this.showIndicators)
			{
				wrapper.innerHTML += '<ul class="carousel-indicators sliderNav"></ul>';
			}

			slider.parentElement.insertBefore(wrapper, slider);
			wrapper.querySelector('.sliderFrame').appendChild(slider);

			this.bindSandbox(wrapper);

		}

	});

	MK.Slider.prototype.IndicatorsConstructor = Class({
		'extends': MK.Array,
		itemRenderer: '<li></li>',
		constructor: function(data, parent) {

			this.set({
				slider: parent,
				hidden: true
			});

			this.bindSandbox(parent.sandbox.querySelector('.sliderNav'))
				.bindNode('hidden', ':sandbox', MK.binders.className('hidden'));

			this.linkProps('hidden', 'length', function(length) {

				return length < 2;

			});

			this.on('*@beforechange:active', function(e) {

				if(e.value == true && e.previousValue == false)
				{
					this[this.activeNum].active = false;
				}

			}).on('*@change:active', function(e) {

				if(e.value == true && e.previousValue == false)
				{
					this.activeNum = e.self.value;
				}

			});
		},
		onItemRender: function(item) {

			MK.set(item, {
				slider: this.slider
			});

			MK.bindNode(item, 'active', ':sandbox', MK.binders.className('active'));

			MK.on(item, 'click::sandbox', function() {

				this.slider.curSlide = this.value * this.slider.visibleItems;
				this.active = true;

			});
		}
	});

})(window, MK);