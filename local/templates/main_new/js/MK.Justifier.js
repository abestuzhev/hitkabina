; (function (w, MK) {

	MK.Justifier = Class({
		'extends': MK.Array,
		constructor: function (data, parent) {
			data.options = $.extend({
				Model: MK.Object,
				application: parent,
				sandbox: '',
				maxInRow: 0
			}, data.options);

			data.items = data.items || [];

			this.set(data.options);
			this.bindSandbox(this.sandbox);

			this.mediate('itemsInRow', function (v) {

				return this.maxInRow ? Math.min(this.maxInRow, v) : v;

			});

			this.linkProps('spaceStyle', 'space', function (v) {

				return v + 'px';

			}, { setOnInit: false });

			this.onDebounce('recreate application.win@change:pageWidth', this.justify, 150);

			if (data.items.length)
				this.recreate(data.items);
			else
				this.restore();

			this.bindNode({
				spaceStyle: [this.sandbox.children, MK.binders.style('marginLeft')]
			});

		},
		onItemRender: function (item) {

			MK.bindNode(item, 'posInRow', ':sandbox', MK.binders.className('!noLeftMargin'));

		},
		justify: function () {

			var minSpaceBetween, subj, i;

			if (this.length > 1) {
				subj = this[1].sandbox;
				subj.style.removeProperty('margin-left');
				minSpaceBetween = +getComputedStyle(subj).getPropertyValue('margin-left').replace('px', '');

				this.itemsInRow = ~~((this.sandbox.offsetWidth + minSpaceBetween) / (subj.offsetWidth + minSpaceBetween));

				if (this.itemsInRow > 1) {
					this.space = (this.sandbox.offsetWidth - this.itemsInRow * subj.offsetWidth) / (this.itemsInRow - 1);

					for (i = this.length; i--;) {
						this[i].posInRow = i % this.itemsInRow;
					}
				}
				else {
					this.space = 0;
				}
			}

		}

	});

})(window, MK);