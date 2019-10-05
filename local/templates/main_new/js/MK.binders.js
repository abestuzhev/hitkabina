;(function(b) {

	b.winSizes = function() {

		return {
			on: 'resize',
			getValue: function() {

				return {
					width: this.innerWidth,
					height: this.innerHeight,
					pageWidth: document.querySelector('.pageWrapper').offsetWidth
				};

			}
		}

	};

	b.customCheckbox = function() {
		return {
			on: 'click',
			getValue: function() {
				return this.checked;
			},
			setValue: function(v) {
				$(this).prop('checked', !!v).trigger('change');
			},
			initialize: function() {

				$(this).on('change', function() {
					$(this).parent('.checkbox').toggleClass('checked', this.checked);
				});

			}
		}
	};

	b.customRadio = function() {
		return {
			on: 'click',
			getValue: function() {
				return this.checked;
			},
			setValue: function(v) {
				$(this).prop('checked', !!v).trigger('change');
			},
			initialize: function() {

				$(this).on('change', function() {
					$(this).parent('.radio').toggleClass('checked', this.checked);
				});

			}
		}
	};

	b.toggleClasses = function(toggleClassList) {
		return {
			setValue: function(v) {
				for (var i = toggleClassList.length; i--;)
				{
					this.classList.remove(toggleClassList[i]);
				}

				if(toggleClassList.indexOf(v) >= 0)
				{
					this.classList.add(v);
				}
			}
		};
	};

})(MK.binders);

MK.defaultBinders.unshift(function(el) {

	if(el.nodeName && el.nodeName.toLowerCase() == 'input')
	{
		if(el.type.toLowerCase() == 'checkbox' && $(this).parent().hasClass('checkbox'))
		{
			return MK.binders.customCheckbox();
		}

		if(el.type.toLowerCase() == 'radio' && $(this).parent().hasClass('radio'))
		{
			return MK.binders.customRadio();
		}
	}

});