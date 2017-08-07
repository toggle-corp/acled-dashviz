'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CountryProfile = function (_Element) {
    _inherits(CountryProfile, _Element);

    function CountryProfile() {
        _classCallCheck(this, CountryProfile);

        var _this = _possibleConstructorReturn(this, (CountryProfile.__proto__ || Object.getPrototypeOf(CountryProfile)).call(this, '<div id="country-profile"></div>'));

        _this.scrollWrapper = new Element('<div class="scroll-wrapper"></div>');
        _this.childElements.push(_this.scrollWrapper);

        _this.header = new Element('<header><h3><a id="back-btn" class="fa fa-arrow-left"></a><span id="country-name">country_name</span></h3><button id="filter-btn"><i class="fa fa-filter"></i><span>Apply filters</span></button></header>');
        _this.scrollWrapper.childElements.push(_this.header);

        _this.countryMap = new CountryMap();
        _this.scrollWrapper.childElements.push(_this.countryMap);

        _this.countryReport = new CountryReport();
        _this.scrollWrapper.childElements.push(_this.countryReport);

        _this.timeSeries = new TimeSeries();
        _this.scrollWrapper.childElements.push(_this.timeSeries);

        _this.barChart = new BarChart();
        _this.scrollWrapper.childElements.push(_this.barChart);

        _this.timeline = new Timeline();
        _this.scrollWrapper.childElements.push(_this.timeline);

        var that = _this;
        _this.header.element.find('a').on('click', function () {
            that.hide();
        });

        _this.filterWrapper = new FilterWrapper();
        _this.childElements.push(_this.filterWrapper);
        return _this;
    }

    _createClass(CountryProfile, [{
        key: 'process',
        value: function process() {
            var that = this;

            this.element.find('#filter-btn').on('click', function () {
                that.filterWrapper.show();
            });

            this.filterWrapper.element.find('.btn-apply-filter').on('click', function () {
                that.applyFilters();
                that.filterWrapper.hide();
            });

            this.filterWrapper.element.find('.btn-cancel').on('click', function () {
                that.filterWrapper.hide();
            });

            this.filterWrapper.element.find('.btn-reset').on('click', function () {
                that.filterWrapper.init(that.admin1s);
            });
        }
    }, {
        key: 'applyFilters',
        value: function applyFilters() {
            this.filteredData = this.data.slice();
            this.filterByEvents();
            this.filterByInteraction();
            this.filterByFatalities();
            this.filterByYear();
            this.filterByAdmin1s();
            this.filterWrapper.element.hide();
            this.render();
        }
    }, {
        key: 'filterByEvents',
        value: function filterByEvents() {
            var container = this.filterWrapper.element.find('.filter-event-type .content');
            var requiredEvents = container.find('input[type="checkbox"]:checked').map(function () {
                return $(this).data('target');
            }).get();

            this.filteredData = this.filteredData.filter(function (x) {
                return requiredEvents.find(function (y) {
                    return compareEvents(x.event_type, y);
                });
            });
        }
    }, {
        key: 'filterByAdmin1s',
        value: function filterByAdmin1s() {
            var container = this.filterWrapper.element.find('.filter-admin1 .selected-admin1s');
            var requiredAdmin1s = container.find('.selected-admin1').map(function () {
                return $(this).find('.name').text();
            }).get();

            if (requiredAdmin1s.length > 0) {
                this.filteredData = this.filteredData.filter(function (x) {
                    return requiredAdmin1s.find(function (y) {
                        return x.admin1 == y;
                    });
                });
            }
        }
    }, {
        key: 'filterByInteraction',
        value: function filterByInteraction() {
            var container = this.filterWrapper.element.find('.filter-interaction .content');
            var lowerLimit = 0;
            var upperLimit = 0;

            switch (container.find('input[type="radio"]:checked').data('value')) {
                case 'less than 100':
                    lowerLimit = 0;
                    upperLimit = 100;
                    break;
                case '100 - 1000':
                    lowerLimit = 100;
                    upperLimit = 1000;
                    break;
                case '1000 - 10000':
                    lowerLimit = 1000;
                    upperLimit = 10000;
                    break;
                case 'more than 10000':
                    lowerLimit = 1000;
                    upperLimit = Infinity;
                    break;
                case 'all':
                    lowerLimit = 0;
                    upperLimit = Infinity;
                    break;
            }

            this.filteredData = this.filteredData.filter(function (x) {
                return x.interaction >= lowerLimit && x.interaction < upperLimit;
            });
        }
    }, {
        key: 'filterByFatalities',
        value: function filterByFatalities() {
            var container = this.filterWrapper.element.find('.filter-fatalities .content');
            var lowerLimit = 0;
            var upperLimit = 0;

            switch (container.find('input[type="radio"]:checked').data('value')) {
                case 'less than 100':
                    lowerLimit = 0;
                    upperLimit = 100;
                    break;
                case '100 - 1000':
                    lowerLimit = 100;
                    upperLimit = 1000;
                    break;
                case '1000 - 10000':
                    lowerLimit = 1000;
                    upperLimit = 10000;
                    break;
                case '10000 - 100000':
                    lowerLimit = 10000;
                    upperLimit = 100000;
                    break;
                case 'more than 10000':
                    lowerLimit = 1000;
                    upperLimit = Infinity;
                    break;
                case 'all':
                    lowerLimit = 0;
                    upperLimit = Infinity;
                    break;
            }

            this.filteredData = this.filteredData.filter(function (x) {
                return x.fatalities >= lowerLimit && x.fatalities < upperLimit;
            });
        }
    }, {
        key: 'filterByYear',
        value: function filterByYear() {
            var container = this.filterWrapper.element.find('.filter-year');

            var startYear = container.find('.start-year').val();
            startYear = startYear ? new Date(startYear) : new Date(0);

            var endYear = container.find('.end-year').val();
            endYear = endYear ? new Date(endYear) : new Date();

            function isDateYearInRange(d, d1, d2) {
                return d.getFullYear() >= d1.getFullYear() && d.getFullYear() <= d2.getFullYear();
            }

            this.filteredData = this.filteredData.filter(function (x) {
                return isDateYearInRange(new Date(x.year), startYear, endYear);
            });
        }
    }, {
        key: 'loadData',
        value: function loadData(country) {
            var that = this;
            this.data = [];
            this.filteredData = [];

            return $.ajax({
                method: 'GET',
                url: 'https://api.acleddata.com/acled/read.csv',
                data: { 'limit': 0, 'country': country, 'fields': 'actor1|year|event_type|interaction|fatalities|latitude|longitude|admin1|country' },
                crossDomain: true,
                success: function success(data) {
                    var rows = data.split('\n');
                    var keys = rows[0].split(',');

                    // 1st row is list of keys, last is blank
                    for (var i = 1; i < rows.length - 1; i++) {
                        var currentRow = rows[i].split(',');
                        var currentData = {};

                        for (var j = 0; j < keys.length; j++) {
                            if (keys[j] == 'event_type' || keys[j] == 'country') {
                                currentData[keys[j]] = (currentRow[j] || '').replace(/^"(.*)"$/, '$1').trim().toLowerCase();
                            } else {
                                currentData[keys[j]] = currentRow[j];
                            }
                        }

                        that.data.push(currentData);
                    }

                    that.data = that.data.filter(function (x) {
                        return compareCountryNames(x.country, country);
                    });

                    that.admin1s = that.data.map(function (x) {
                        return x.admin1 || '';
                    }).sort().filter(function (item, pos, array) {
                        return !pos || item != array[pos - 1];
                    });
                    that.filteredData = that.data.slice();
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            this.timeSeries.render(this.filteredData);
            this.barChart.render(this.filteredData);
            this.countryMap.load(this.country, this.filteredData);
        }
    }, {
        key: 'show',
        value: function show(country, geoJSON) {
            var _this2 = this;

            this.country = country;
            $('html').css('overflow', 'hidden');

            var that = this;

            this.element.fadeIn('fast', function () {
                that.header.element.find('#country-name').text(country);
                that.countryReport.load(country);
                that.timeSeries.load(country);
                that.barChart.load(country);
                that.timeline.load(country);

                that.loadData(country).then(function () {
                    that.filterWrapper.init(that.admin1s);
                    that.render();
                });
            });

            setTimeout(function () {
                _this2.scrollWrapper.element.scrollTop(0);
            }, 0);
        }
    }, {
        key: 'hide',
        value: function hide() {
            $('html').css('overflow', 'auto');
            this.countryMap.reset(true);
            this.element.fadeOut();
        }
    }]);

    return CountryProfile;
}(Element);
//# sourceMappingURL=CountryProfile.js.map