'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FilterWrapper = function (_Element) {
    _inherits(FilterWrapper, _Element);

    function FilterWrapper(name) {
        _classCallCheck(this, FilterWrapper);

        var _this = _possibleConstructorReturn(this, (FilterWrapper.__proto__ || Object.getPrototypeOf(FilterWrapper)).call(this, '\n            <div class="filter-wrapper" hidden>\n                <div class="container">\n                    <header>\n                        <h4>Filters</h4>\n                        <div class="action-buttons">\n                            <button class="btn-reset">Reset</button>\n                            <button class="btn-apply-filter">Apply</button>\n                            <button class="btn-cancel"><i class="fa fa-times"></i></button>\n                        </div>\n                    </header>\n                    <div class="content">\n                        <section class="filter-event-type">\n                            <header><h5>Event types</h5></header>\n                            <div class="content"></div>\n                        </section>\n                        <section class="filter-interaction">\n                            <header><h5>Actor types</h5></header>\n                            <div class="content"></div>\n                        </section>\n                        <section class="filter-year">\n                            <header><h5>Date range</h5></header>\n                            <div class="content">\n                                <div class="input-container">\n                                    <label>From</label>\n                                    <input type="text" class="start-year">\n                                </div>\n                                <div class="input-container">\n                                    <label>To</label>\n                                    <input type="text" class="end-year">\n                                </div>\n                            </div>\n                        </section>\n                        <section class="filter-fatalities">\n                            <header><h5>Fatalities</h5></header>\n                            <div class="content">\n                                <label class="radio-input"><input type="radio" data-lowerlimit="0" data-upperlimit="Infinity" data-value="all" checked="true" name="' + name + '-filter-fatalities-input"><span class="name">All</span></label>\n                                <label class="radio-input"><input type="radio" data-lowerlimit="0" data-upperlimit="10" data-value="less than 10" name="' + name + '-filter-fatalities-input"><span class="name">Less than 10</span></label>\n                                <label class="radio-input"><input type="radio" data-lowerlimit="0" data-upperlimit="50" data-value="less than 50" name="' + name + '-filter-fatalities-input"><span class="name">Less than 50</span></label>\n                                <label class="radio-input"><input type="radio" data-lowerlimit="0" data-upperlimit="100" data-value="less than 100" name="' + name + '-filter-fatalities-input"><span class="name">Less than 100</span></label>\n                                <label class="radio-input"><input type="radio"  data-lowerlimit="0" data-upperlimit="1" data-value="none" name="' + name + '-filter-fatalities-input"><span class="name">None</span></label>\n                            </div> \n                        </section>\n                        <section class="filter-admin1">\n                            <header><h5>Admin1</h5></header> \n                            <div class="content">\n                                <div class="select-wrapper">\n                                    <select class="admin1-select">\n                                        <option value="">Select admin1</option>\n                                    </select>\n                                </div>\n                                <div class="selected-admin1s">\n                                </div>\n                            </div>\n                        </section>\n                    </div>\n                </div>\n            </div>\n        '));

        _this.name = name;

        return _this;
    }

    _createClass(FilterWrapper, [{
        key: 'getAcledEventListElement',
        value: function getAcledEventListElement() {
            var elem = '';
            for (var e in acledEvents) {
                elem += '<label class="checkbox-input"><input type="checkbox"><span class="name">' + e + '</span></label>';
            }
        }
    }, {
        key: 'process',
        value: function process() {
            var container = this.element.find('.selected-admin1s');
            this.element.find('.admin1-select').on('click', function () {
                var val = jQ3(this).val();
                var text = jQ3(this).find('option[value="' + val + '"]').text();

                if (val && container.find('.selected-admin1[data-val="' + val + '"]').length === 0) {
                    var elem = jQ3('<div data-val="' + val + '" class="selected-admin1"><span class="name">' + text + '</span><button><i class="fa fa-times"></i></button></div>');
                    elem.appendTo(container);
                    elem.find('button').on('click', function () {
                        jQ3(this).closest('.selected-admin1').remove();
                    });
                }

                jQ3(this).val('');
            });

            var yearFilter = this.element.find('.filter-year');
            yearFilter.find('.start-year').datepicker({
                language: "en",
                minView: "months",
                view: "years",
                dateFormat: "yyyy-mm-dd",
                multipleDatesSeparator: ' - ',
                minDate: new Date('1990-01-01'),
                maxDate: new Date(),
                onSelect: function onSelect(fd, date, picker) {
                    yearFilter.find('.start-year').val(date.toLocaleDateString());
                    picker.hide();
                }
            });

            yearFilter.find('.end-year').datepicker({
                language: "en",
                minView: "months",
                view: "years",
                dateFormat: "yyyy-mm-dd",
                multipleDatesSeparator: ' - ',
                minDate: new Date('1990-01-01'),
                maxDate: new Date(),
                onSelect: function onSelect(fd, date, picker) {
                    var newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    yearFilter.find('.end-year').val(newDate.toLocaleDateString());
                    picker.hide();
                }
            });
        }
    }, {
        key: 'init',
        value: function init(admin1s) {
            var name = this.name;
            var container = this.element.find('.filter-event-type .content');
            container.empty();

            for (var eventName in acledEvents) {
                jQ3('<label class="checkbox-input"><input type="checkbox" data-target="' + eventName + '" checked="true"><span class="name">' + eventName + '</span></label>').appendTo(container);
            }

            container = this.element.find('.filter-interaction .content');
            container.empty();

            for (var actor in acledActors) {
                jQ3('<label class="checkbox-input"><input type="checkbox" data-target="' + acledActors[actor] + '" checked="true"><span class="name">' + actor + '</span></label>').appendTo(container);
            }

            this.element.find('input[name="' + name + '-filter-interaction-input"]').eq(0).prop('checked', true);
            this.element.find('input[name="' + name + '-filter-fatalities-input"]').eq(0).prop('checked', true);

            this.element.find('input[type="text"]').val('');

            this.element.find('.selected-admin1s').empty();

            var admin1select = this.element.find('.admin1-select');

            if (admin1s) {
                this.element.find('.filter-admin1').show();
                admin1select.empty();
                admin1select.append('<option value="">Select admin1</option>');

                for (var i = 0; i < admin1s.length; i++) {
                    admin1select.append('<option value="' + (i + 1) + '">' + admin1s[i] + '</option>');
                }

                admin1select.val('');
            } else {
                this.element.find('.filter-admin1').hide();
            }
        }
    }, {
        key: 'show',
        value: function show() {
            var that = this;
            this.element.fadeIn(200, function () {
                that.element.find('.container').slideDown(200);
            });
        }
    }, {
        key: 'hide',
        value: function hide() {
            var that = this;

            this.element.find('.container').slideUp(200, function () {
                that.element.fadeOut(200);
            });
        }
    }, {
        key: 'setDefaultStartDate',
        value: function setDefaultStartDate(val) {
            var input = this.element.find('.filter-year .start-year');
            input.val(val);
        }
    }, {
        key: 'getAppliedFilters',
        value: function getAppliedFilters() {
            var appliedFilters = {};

            var container = this.element.find('.filter-event-type .content');
            var requiredEvents = container.find('input[type="checkbox"]:checked').map(function () {
                return jQ3(this).data('target');
            }).get();

            if (requiredEvents.length < 5) {
                appliedFilters['event-types'] = {
                    name: "Event types",
                    filters: requiredEvents
                };
            }

            container = this.element.find('.filter-interaction .content');
            var requiredActors = container.find('input[type="checkbox"]:checked').map(function () {
                return jQ3(this).siblings('.name').text();
            }).get();

            if (requiredActors.length < 7) {
                appliedFilters['actor-types'] = {
                    name: "Actor types",
                    filters: requiredActors
                };
            }

            container = this.element.find('.filter-fatalities .content');
            var input = container.find('input[type="radio"]:checked');

            var lowerLimit = input.data('lowerlimit');
            var upperLimit = input.data('upperlimit');

            if (lowerLimit > 0 || upperLimit < Infinity) {
                appliedFilters['fatalities'] = {
                    name: "Fatalities",
                    filters: input.siblings('.name').text()
                };
            }

            container = this.element.find('.filter-admin1 .selected-admin1s');
            var requiredAdmin1s = container.find('.selected-admin1').map(function () {
                return jQ3(this).find('.name').text();
            }).get();

            if (requiredAdmin1s.length > 0) {
                appliedFilters['admin-levels'] = {
                    name: "Admin levels",
                    filters: requiredAdmin1s
                };
            }

            container = this.element.find('.filter-year');

            var startYear = container.find('.start-year').val();
            var endYear = container.find('.end-year').val();

            if (startYear || endYear) {
                startYear = startYear ? new Date(startYear) : new Date(0);
                endYear = endYear ? new Date(endYear) : new Date();

                appliedFilters['date'] = {
                    name: "Date",
                    filters: { start: startYear, end: endYear }
                };
            }

            return appliedFilters;
        }
    }]);

    return FilterWrapper;
}(Element);
//# sourceMappingURL=FilterWrapper.js.map