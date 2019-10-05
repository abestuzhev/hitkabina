/**
 * Форматирование цены в виде 2 234 322,11
 * @param data
 * @returns {string}
 */
function formatPrice(_number, bWithDecimal) {
	var decimal = 2;
	var separator = ' ';
	var decpoint = ',';
	bWithDecimal = bWithDecimal || false;

	var r = parseFloat(_number)

	var exp10 = Math.pow(10, decimal);// приводим к правильному множителю
	r = Math.round(r * exp10) / exp10;// округляем до необходимого числа знаков после запятой

	rr = Number(r).toFixed(decimal).toString().split('.');

	b = rr[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "\$1" + separator);

	r = bWithDecimal ? rr[1] ? b + decpoint + rr[1] : b : b;

	return r;
}
function changeRenderer(_el, _section) {
	if ($(_el).hasClass('active-list-btn')) {
		return false;
	}
	
	//window.location.reload();
}
function setRenderer(_type, _section) {

	return true;
}
var CatalogItem = Class({
	'extends': MK.Object,
	renderer: '',
	tableRenderer: '<div class="card-zoom"><a class="catalogItem listItem" href="" id="">\
			<div class="itemRaiting hidden-xs">\
				<span class="raitingStar bgSprite"></span>\
				<span class="raitingStar bgSprite"></span>\
				<span class="raitingStar bgSprite"></span>\
				<span class="raitingStar bgSprite"></span>\
				<span class="raitingStar bgSprite"></span>\
			</div>\
			<div class="itemLabel"></div>\
			<div class="itemImg-wrap">\
				<img class="itemImg center-block" src="" alt="" />\
			</div>\
			<div class="itemTitle"></div>\
			<ul class="propsTable__list">	\
			</ul>\
			<div class="item__head-buttons">\
				<span class="favorite-item"><i class="fa fa-heart"></i>В избранное</span>\
				<span class="compareItem"><i class="fa fa-sliders-h"></i>Сравнить</span>\
			</div>\
			<div class="itemPrice"><span class="oldPrice"></span></div>\
			<button class="delBtn"></button>\
			<div class="serviceIcons center-block text-center">\
				<button class="serviceIcon pull-left" title="Добавить в корзину"><i class="fa fa-shopping-cart shop-cart"></i></button>\
				<button class="serviceIcon commentsIcon befSprite"></button>\
				<button class="serviceIcon pull-right" title="Купить в один клик"><i class="fa fa-hand-pointer buy-1-click"></i></button>\
			</div>\
			<div class="action-btn">\
				<div class="item__buy btn btn-default shop-cart">В корзину</div>\
				<span class="item__buy-one-click buy-1-click"><i class="fa fa-hand-pointer"></i>&nbsp;&nbsp;<span>Купить в 1 клик</span></span>\
			</div>\
		</a></div>',
	listRenderer: '<div style="width:100%"><a class="catalogItem viewList listItem " href="" id="">\
		<div class="item__picture">\
			<div class="item-stats">\
				<div class="itemRaiting hidden-xs">\
					<span class="raitingStar bgSprite"></span>\
					<span class="raitingStar bgSprite"></span>\
					<span class="raitingStar bgSprite"></span>\
					<span class="raitingStar bgSprite"></span>\
					<span class="raitingStar bgSprite"></span>\
				</div>\
				<div class="itemLabel"></div>\
			</div>\
			<div class="itemImg-wrap">\
				<img class="itemImg center-block" src="" alt="" />\
			</div>\
		</div>\
		<div class="item__info">\
			<div class="itemTitle"></div>\
			<ul class="propsTable__list">	\
			</ul>\
		</div>\
		<div class="item__buttons">\
			<div class="item__head-buttons">\
				<span class="compareItem"><i class="fa fa-sliders-h"></i>Сравнить</span>\
				<span class="favorite-item"><i class="fa fa-heart"></i>В избранное</span>\
			</div>\
			<div class="itemPrice"><span class="oldPrice"></span></div>\
			<button class="delBtn"></button>\
			<div class="item__buy btn btn-default shop-cart">В корзину</div>\
			<button class="serviceIcon commentsIcon befSprite"></button>\
			<span class="item__buy-one-click buy-1-click"><i class="fa fa-hand-pointer"></i>&nbsp;&nbsp;<span>Купить в 1 клик</span></span>\
		</div>\
		</a></div> ',
	constructor: function (data) {
		var currView = '';
		if (data.type != null) {
			currView = data.type;
		}
		if ($.cookie('catalogviewtype') != null && $.cookie('catalogviewtype').length > 0){
			currView = $.cookie('catalogviewtype');
		}
		if ($(window).width() < 768)
			currView = 'table';
		var currRender = currView == 'list' ? this.listRenderer : this.tableRenderer;
		this.renderer = currRender;
		this.set(data);
		this.bindEvents();

	},
	onRender: function () {

		this.bindNode({
			'id': [':sandbox .listItem', MK.binders.attr('id')],
			'product_id': [':sandbox .listItem', MK.binders.attr('data-product')],
			'name': [':sandbox .itemTitle', MK.binders.html()],
			'props': [':sandbox .propsTable__list', MK.binders.html()],
			'pic.src': [':sandbox .itemImg', MK.binders.attr('src')],
			'pic.alt': [':sandbox .itemImg', MK.binders.attr('alt')],
			'service.basket': [':sandbox .shop-cart', MK.binders.className('active')],
			'service.bookmark': [':sandbox .favorite-item', MK.binders.className('active')],
			'service.comments': [':sandbox .commentsIcon', MK.binders.html()],
			'service.userComments': [':sandbox .commentsIcon', MK.binders.className('active')],
			'service.compare': [':sandbox .compareItem', MK.binders.className('active')],
			'url.detail': [':sandbox .listItem', MK.binders.attr('href')],
			'price': [':sandbox .itemPrice', {
				getValue: function () {

					return {
						old: this.querySelector('.oldPrice').innerText,
						current: this.lastChild.textContent
					}
				},
				setValue: function (price) { // обязательно {old: 20, current: 10}

					this.querySelector('.oldPrice').innerText = price.old;

					if (this.firstChild == this.lastChild)
						this.appendChild(document.createTextNode(price.current));
					else
						this.lastChild.nodeValue = price.current;

				}
			}],

		}).bindOptionalNode({
			'label': [':sandbox .itemLabel', MK.binders.html()],
			'raiting': [':sandbox .itemRaiting', {
				getValue: function () {

					return this.querySelectorAll('.raitingStar.full').length;

				},
				setValue: function (val) {

					$(this).find('.raitingStar').removeClass('full').slice(0, val).addClass('full');

				}
			}],
			'del': [':sandbox .delBtn', MK.binders.className('!hidden')],
		});
		//if(this.sandbox.parentElement)
		//	this.bindEvents();
	},
	bindEvents: function () {

		this.on('service@click::basket', function (e) {

			e.stopPropagation();
			e.preventDefault();

			if (!this.service.basket) {
				$.ajax({
					context: this,
					url: this.url.basket,
					dataType: 'json',
					success: function (response) {

						var $basketIcon = $(this.sandbox).find('.inBasketIcon'),
							basketModal = $('#basketModal'),
							basketModalBody, addParam = '';

						var _arr = this.id.split('_');
						addParam += 'itemID=' + _arr[2];

						if (response.STATUS == 'OK') {
							this.service.basket = true;
							app.basket.qty++;

							if (!basketModal.length) {
								//alert('added 2 cart script.js');
								$('body').append('<div id="basketModal" class="basketModal modal fade" role="dialog">'
									+ '<div class="modal-dialog" role="document">'
									+ '<div class="modal-content">'
									+ '<div class="modal-header"><h3>Товар добавлен в корзину</h3></div>'
									+ '<div class="modal-body"></div>'
									+ '<div class="modal-footer"><button type="button" class="btn btn-light" data-dismiss="modal">Продолжить покупки</button><a href="/basket/" class="btn btn-default">Оформить заказ</a></div>'
									+ '</div>'
									+ '</div>'
									+ '</div>');

								basketModal = $('#basketModal').modal({
									'show': false
								});

								addParam += '&withjs=Y';
							}

							basketModalBody = basketModal.find('.modal-body');

							basketModalBody.load('/basket/', addParam, function (response, status, xhr) {
								basketModal.modal('show');

							});
						}
						else {
							$basketIcon.popover({
								placement: 'top',
								trigger: 'focus',
								content: response.MESSAGE,
								html: true,
								container: $basketIcon
							});
							$basketIcon.triggerHandler('focusin');
							setTimeout(function () {

								$basketIcon.popover('destroy');

							}, 4000);
						}

					}
				});
			}

		}).on('service@click::bookmark click::del', function (e) {

			e.stopPropagation();
			e.preventDefault();

			$.ajax({
				context: this,
				url: this.service.bookmark ? this.url.bookmark.delete : this.url.bookmark.add,
				dataType: 'json',
				success: function (response) {

					var $bookmarkIcon = $(e.target);
					if ($bookmarkIcon.hasClass('fa-heart')) {
						$bookmarkIcon = $bookmarkIcon.parent();
					}
					var remove = e.key == 'del',
						removed = false;

					if ('error' !== response.STATUS) {
						this.service.bookmark = response.IN_BOOKMARKS;

						if ('added' === response.STATUS)
							app.bookmarks.qty++;
						$bookmarkIcon.html('<i class="fa fa-heart"></i>В избранном');
						$bookmarkIcon.addClass('active');

						if ('deleted' === response.STATUS) {
							app.bookmarks.qty--;
							$bookmarkIcon.html('<i class="fa fa-heart"></i>В избранное');
							$bookmarkIcon.removeClass('active');
							if (remove) {
								$(this.sandbox).fadeOut(600, function () {
									this.style.display = 'block';
									this.style.visibility = 'hidden';
								});
								removed = true;
							}
						}

					}

					if (!removed) {
						$bookmarkIcon.popover({
							placement: 'top',
							trigger: 'focus',
							content: response.MESSAGE,
							container: $bookmarkIcon
						});
						$bookmarkIcon.triggerHandler('focusin');
						setTimeout(function () {

							$bookmarkIcon.popover('destroy');

						}, 4000);
					}

				}
			});

		}).on('service@click::comments', function (e) {

			e.stopPropagation();
			e.preventDefault();

			window.location.href = this.url.comments;

		}).on('service@click::compare', function (e) {

			e.stopPropagation();
			e.preventDefault();
			var text = this.service.compare ? 'Сравнить' : 'В сравнении';
			this.service.compare ? app.compare.qty-- : app.compare.qty++;
			var $compareIcon = $(e.target);
			if ($compareIcon.hasClass('fa-sliders-h')) {
				$compareIcon = $compareIcon.parent();
			}


			if (this.service.compare) {
				$.ajax({
					context: this,
					url: this.url.compare.remove,
					dataType: 'json',
					success: function (response) {
					}
				});
				$compareIcon.removeClass('active');
			}
			else {
				$compareIcon.add('active');
				$.ajax({
					context: this,
					url: this.url.compare.add,
					dataType: 'json',
					success: function (response) {
					}
				});
				$compareIcon.popover({
					placement: 'top',
					trigger: 'focus',
					content: 'Товар добавлен в сравнение',
					container: $compareIcon
				});
			};
			$compareIcon.html('<i class="fa fa-sliders-h"></i>' + text);
			$compareIcon.triggerHandler('focusin');
			setTimeout(function () {
				$compareIcon.popover('destroy');
			}, 4000);
			this.service.compare = !this.service.compare;
		});

	}
});

var AjaxForm = Class({
	'extends': MK.Object,
	constructor: function (app, sandbox, data) {
		var bindData;

		this.set({
			application: app,
			form: false,
			resultMess: {
				text: '',
				class: ''
			}
		}).set(data);

		bindData = (function (arr) {
			var i, field,
				nodes = {},
				requiredFields = [];

			for (i in arr) {
				field = arr[i];

				if (field.required)
					requiredFields.push(i + '.value');

				nodes[i + '.value'] = ':sandbox [name=' + field.name + ']';
			}

			return {
				nodes: nodes,
				links: requiredFields.join(' ')
			};

		})(data);

		bindData.nodes['form'] = ':sandbox form';
		bindData.nodes['resultMess.text'] = [':sandbox .message', MK.binders.text()];
		bindData.nodes['resultMess.class'] = [':sandbox .message', MK.binders.toggleClasses(['success', 'error'])];

		this
			.bindSandbox(sandbox)
			.bindNode(bindData.nodes);

		if (bindData.links.length) {
			this.linkProps('form', bindData.links, function () {

				var canSubmit = true;

				for (var i = arguments.length; i--;) {
					canSubmit = canSubmit && arguments[i].length > 0;
				}

				return canSubmit;

			});
		}
		else {
			this.form = true;
		}

		this.on('submit::form', function (e) {

			e.preventDefault();

			if (!this.form) {
				for (var fieldName in data) {
					var field = data[fieldName];

					if (field.required && !this[fieldName].value.length) {
						this.bound(fieldName + '.value').focus();
						return;
					}
				}

				return;
			}

			$.ajax({
				context: this,
				dataType: 'json',
				type: 'POST',
				url: this.nodes.form.action,
				processData: false,
				contentType: false,
				data: (function (form) {

					var res = new FormData(form);

					res.append('web_form_submit', 'Y');
					//var res = {};
					//
					//for(var i = form.length; i--;)
					//{
					//	if('radio' == form[i].type.toLowerCase())
					//	{
					//		if(form[i].checked)
					//			res[form[i].name] = form[i].value;
					//	}
					//	else
					//	{
					//		res[form[i].name] = form[i].value;
					//	}
					//}

					return res;

				})(this.nodes.form),
				success: function (response) {

					if (response.FORM_ERRORS.length) {
						this.resultMess.class = 'error';
						this.resultMess.text = response.FORM_ERRORS.join('<br>');
					}
					else if (response.FORM_RESULT.length) {
						this.resultMess.class = 'success';
						this.resultMess.text = response.FORM_RESULT;
						this.sandbox.removeChild(this.bound('form'));
					}

				}
			});

		});
	}

});
var Bookmarks = Class({
	'extends': MK.Object,
	constructor: function (data, parent) {

		this.set({
			application: parent
		});

		this.bindSandbox('#bookmarkLabel')
			.bindNode({
				qty: [':sandbox', MK.binders.text()]
			})
			.bindNode({
				qty: [':sandbox', MK.binders.className('!hidden')]
			})
			.bindNode({
				qty: [$('.panelBookmarksCounter')[0], MK.binders.text()]
			})
			.bindNode({
				qty: [$('#bookmarkLabelMobile')[0], MK.binders.text()]
			});

		this.mediate('qty', function (val) {

			return +val;

		});


	}
});
var Compare = Class({
	'extends': MK.Object,
	constructor: function (data, parent) {

		this.set({
			application: parent
		});

		this.bindSandbox('#compareLabel')
			.bindNode({
				qty: [':sandbox', MK.binders.text()]
			})
			.bindNode({
				qty: [':sandbox', MK.binders.className('!hidden')]
			})
			.bindNode({
				qty: [$('#compareLabelMobile')[0], MK.binders.text()]
			});
		this.mediate('qty', function (val) {

			return +val;

		});


	}
});

/*
MK.binders.scroll = function(el) {

    return {
        on: 'scroll',
        getValue: function() {

            return el.scrollTop;

        },
        setValue: function(val) {

            $(el).animate(
                {'scrollTop': val},
                200,
                'linear',
                function() {

                    //el.scrollTop = val;

                }
            );

        }
    }

};
*/

var Application = Class({
	'extends': MK,
	constructor: function () {

		var self = this,
			serviceData = {

				dropdownList: document.querySelectorAll('.dropdown-menu:not([not-select])')

			};

		this.set({
			mobileView: true,
			isMobile: /(android|bb\d+|meego).+(mobile|tablet)|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|miui|playbook|silk|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(navigator.userAgent || navigator.vendor || window.opera) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent || navigator.vendor || window.opera).substr(0, 4)),
			settings: {

			},
			isIndex: globalJSON.INDEX_PAGE
		});

		//this.scrollElement = document.querySelector(/webkit/i.test(navigator.userAgent) ? 'body' : 'html');

		this.bindSandbox('body')
			.bindNode({
				win: [window, MK.binders.winSizes()],
				//pageScroll: [window, MK.binders.scroll(this.scrollElement)],
				//footer: [$('.footer, .prefooter'), MK.binders.style('height')]
			});

		this.linkProps('mobileView', 'win', function (win) {

			return win.pageWidth == 640;

		});

		this.on('change:mobileView', function () {



		}, true);

		this.setClassFor('bookmarks', Bookmarks);
		this.setClassFor('compare', Compare);

		// для мобильных браузеров заменяем выпадающий список на нативные селекты
		// для десктопных - запрещаем закрывать выпадающий список для multiple список
		if (this.isMobile) {
			for (var i = 0, len = serviceData.dropdownList.length; i < len; i++) {
				this.dropdownUtils.createSelect(serviceData.dropdownList[i]);
			}
		}
		else {
			for (var i = 0, len = serviceData.dropdownList.length; i < len; i++) {
				var $dropdown = $(serviceData.dropdownList[i]);

				this.dropdownUtils.clickHandler($dropdown.parent());
			}
		}

		/*
		* Поиск в шапке
		* */
		(function (app, $searchBlock) {

			var select, options, filteredOptions, i;

			if (app.isMobile) {
				select = $searchBlock.find('.pseudoSelect');
				options = select.find('option');

				select.on('click', 'option', function () {

					if (this.selected) {
						if (this.value == 'all') {
							filteredOptions = options.filter(':selected');
							for (i = filteredOptions.length; i--;) {
								if (filteredOptions[i].value != 'all') {
									filteredOptions[i].selected = false;
								}

							}
						}
						else {
							filteredOptions = options.filter('[value=all]');
							if (filteredOptions[0].selected) {
								filteredOptions[0].selected = false;
							}
						}
					}

				});
			}
			else {
				select = $searchBlock.find('.dropdown-menu');
				options = select.find('[type=checkbox]');

				select.on('change', '[type=checkbox]', function () {

					if (this.checked) {
						if (this.value == 'all') {
							filteredOptions = options.filter(':checked');
							for (i = filteredOptions.length; i--;) {
								if (filteredOptions[i].value != 'all') {
									$(filteredOptions[i]).prop('checked', false).trigger('change');
								}

							}
						}
						else {
							filteredOptions = options.filter('[value=all]');
							if (filteredOptions[0].checked) {
								$(filteredOptions[0]).prop('checked', false).trigger('change');
							}
						}
					}

					$searchBlock.find('.caption').text(function () {

						var filteredOptions = options.filter(':checked'),
							res = [], i;

						if (filteredOptions.length) {
							for (i = 0; i < filteredOptions.length; i++) {
								res.push(filteredOptions[i].parentElement.title);
							}

							return res.join(', ');
						}

					});

				});
			}

		})(this, $('.searchBlock'));


		/*
		 * Анимация ярлычка верхней панели
		 * */
		if ($('#topPanel').length) {
			(function (topPanel) {

				var timer,
					btnState = {
						opened: false,
						hovered: false,
						needAnimate: true,
						startTimer: function () {

							var timer;

							timer = setInterval(function () {

								var btn = $('.topPanelBtn');

								if (!btnState.opened && !btnState.hovered && btnState.needAnimate) {
									btn.addClass('hovered');
									setTimeout(function () {
										btn.removeClass('hovered');
									}, 200);
								}

							}, 15000);

							return timer;

						}
					};

				topPanel.on('show.bs.collapse', function () {

					btnState.opened = true;
					btnState.needAnimate = false;
					clearInterval(timer);

				}).on('hidden.bs.collapse', function () {

					btnState.opened = false;
					if (btnState.needAnimate)
						timer = btnState.startTimer();

				});

				$('.topPanelBtn').on('mouseenter', function () {

					btnState.hovered = true;
					clearInterval(timer);

				}).on('mouseleave', function () {

					btnState.hovered = false;
					if (btnState.needAnimate && !btnState.opened)
						timer = btnState.startTimer();

				});

				timer = btnState.startTimer();

			})($('#topPanel'));
		}



	},
	dropdownUtils: {

		createSelect: function (dropdownMenu) {

			var $dropdown = $(dropdownMenu),
				$arOptions = $dropdown.children('li'),
				multiple = $arOptions[0].querySelector('input').type.toLowerCase() == 'checkbox' ? ' multiple ' : '',
				name = $arOptions[0].querySelector('input').name,
				strSelect = '<select class="pseudoSelect" onchange="app.dropdownUtils.changeHandler(this);"'
					+ multiple
					+ ' name="' + name + '"'
					+ '>';

			if (multiple == '') {
				strSelect += '<option class="hidden" value=""></option>';
				/*strSelect += '<option class="hidden" value="">' + $dropdown.find('.dropdown-toggle').text().trim() +'</option>';*/
			}

			for (var i = 0, optionsLen = $arOptions.length; i < optionsLen; i++) {
				var $option = $($arOptions[i]),
					$input = $option.find('input'),
					text = $option.text().trim(),
					value = $input.val(),
					selected = $option.hasClass('active') ? ' selected ' : '';

				strSelect += '<option value="' + value + '"' + selected + '>' + text + '</option>';
			}

			$dropdown.before(strSelect += '</select>').remove();

		},
		clickHandler: function ($dropdownParent) {

			if ($dropdownParent.find(':checkbox').length) {
				$(document).on('click', function (e) {

					if ($dropdownParent.hasClass('open')) {
						if (!$(e.target).hasClass('closeBtn') && $(e.target).closest('.dropdown-menu').length) return;

						$dropdownParent.removeClass('open');

						e.stopPropagation();
					}

				});

				$dropdownParent.on('hide.bs.dropdown', function (e) {
					e.preventDefault();
				});
			}
			else {
				$dropdownParent.on('click', 'input', function (e) {

					var dropdown = $(this).closest('.dropdown');

					dropdown.find('.dropdown-toggle').html($(this).parent().text().trim());
					dropdown.find('li.selected').removeClass('selected');
					$(this).closest('li').addClass('selected');

				});
			}
		},
		changeHandler: function (el) {

			var optionText = (function () {

				var options = el.querySelectorAll('option'),
					res = [], i;

				for (i = 0; i < options.length; i++) {
					if (options[i].selected)
						res.push(options[i].label);
				}

				return res.join(', ');

			})(),
				btn = el.parentElement.querySelector('.dropdown-toggle').querySelector('.caption') || el.parentElement.querySelector('.dropdown-toggle');

			btn.innerHTML = optionText;
		}

	}
});

window.app = new Application();

(function () {
	var i, interfaceElems = {

		checkboxList: document.querySelectorAll('[type=checkbox]'),
		radioList: document.querySelectorAll('[type=radio]'),

		obCheckList: {},
		obRadioList: {}

	};

	for (i = interfaceElems.checkboxList.length; i--;) {
		MK.bindNode(interfaceElems.obCheckList, i.toString(), interfaceElems.checkboxList[i]);
	}
	/*for(i = interfaceElems.radioList.length; i--;)
	{
		MK.bindNode(interfaceElems.obRadioList, i.toString(), interfaceElems.radioList[i]);
	}*/

	// Актуализация ссылок с телефонами
	$('[href ^= tel]').each(function () {
		$(this).attr('href', 'tel:' + $(this).text().replace(/[^\d+]/g, ''));
	});
	$('a.hotline-set').attr('href', 'tel:' + $('a.hotline-get').text().replace(/[^\d+]/g, ''));
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
		$('html').addClass('bx-safari');
	}


})();

function updateFileValue($fileInput) {

	var value = $fileInput[0].files[0].name,
		$valueBlock = $fileInput.closest('.form-group'),
		$fileFieldLegend = $valueBlock.find('.fileFieldLegend'),
		$fileFieldValue = $valueBlock.find('.fileFieldValue');

	if (value == '') {

		$fileFieldLegend.show();
		$fileFieldValue.hide();

	} else {

		$fileFieldLegend.hide();
		$fileFieldValue.html(value).show();

	}

}
$(document).ready(function () {
	$(".compareItem.active").html('<i class="fa fa-sliders-h"></i>В сравнении');
	$(".favorite-item.active").html('<i class="fa fa-heart"></i>В избранном');
	$(".catalogItem.viewList.listItem .propsTable__list .propsTable__item").each(function () {
		var value = $(this).find(".propsTable__item--right").html();
		if (value.length == 0) {
			$(this).hide();
		}
	});
	var form = $('[name=CALLBACK_REQUEST]');
	form.find('[type=tel]').inputmask("+7 (999) 999-99-99");
	var form = $('[name=MAILBACK]');
	form.find('[type=tel]').inputmask("+7 (999) 999-99-99");

	$(".leftColumn").append("<div class='show-mnu'><i class='fa fa-bars'></i></div>")
	$(".show-mnu").click(function () {
		$(".leftColumn").toggleClass('menu-show');
	})
	$('.sort-type__selector').click(function () {
		$('.sort-types').toggleClass('sort-types-show');
	});
	$('.sort-types__title').click(function () {
		$('.sort-types').toggleClass('sort-types-show');
	})
});
function closeReviewPopup(e) {
	var form = $(e).closest('.modal');
	form.modal('hide');
	$('#reviewModal').addClass('reviews--hidden');
	$('.reviews__shadow').addClass('reviews--hidden');
}
$.removeCookie('catalogviewtype');
$.removeCookie('catalogviewtype', { expires: 7, path: '/' });


/* loader */
function showLoader() {
    if (!window.loadingScreen)
    {
        window.loadingScreen = new BX.PopupWindow("loading_screen", null, {
            overlay: {backgroundColor: 'white', opacity: '80'},
            events: {
                onAfterPopupShow: BX.delegate(function () {
                    BX.cleanNode(window.loadingScreen.popupContainer);
                    BX.removeClass(window.loadingScreen.popupContainer, 'popup-window');
                    this.loadingScreen.popupContainer.appendChild(
                            BX.create('IMG', {props: {src: "/loader.gif"}})
                            );
                    window.loadingScreen.popupContainer.removeAttribute('style');
                    window.loadingScreen.popupContainer.style.display = 'block';
                }, this)
            }
        });
        BX.addClass(window.loadingScreen.popupContainer, 'bx-step-opacity');
    }
    window.loadingScreen.show();
}

function endLoader()
{
    if (window.loadingScreen && window.loadingScreen.isShown())
        window.loadingScreen.close();
}