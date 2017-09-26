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

        _this.header = new Element('\n            <header>\n                <h3>\n                    <a id="back-btn" class="fa fa-arrow-left"></a>\n                    <span id="country-name">country_name</span>\n                </h3>\n                <div class="filter-btn-container">\n                    <button id="filter-btn">\n                        <i class="fa fa-filter"></i><span>Click to add filters</span>\n                    </button>\n                    <div class="filter-info-wrapper"></div>\n                </div>\n            </header>\n        ');
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

        _this.filterWrapper = new FilterWrapper('country');
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
                syncCheckboxes(that.filterWrapper.element.find('.filter-event-type .content'), that.countryMap.mapLegend.element, true);
                syncCheckboxes(that.filterWrapper.element.find('.filter-event-type .content'), that.timeSeries.mapLegend.element, true);
                that.applyFilters();
                that.filterWrapper.hide();
            });

            this.filterWrapper.element.find('.btn-cancel').on('click', function () {
                that.filterWrapper.hide();
            });

            this.filterWrapper.element.find('.btn-reset').on('click', function () {
                that.filterWrapper.init(that.admin1s);
            });

            this.countryMap.element.on('countrymap:filterclick', function () {
                syncCheckboxes(that.countryMap.mapLegend.element, that.filterWrapper.element.find('.filter-event-type .content'));
                syncCheckboxes(that.countryMap.mapLegend.element, that.timeSeries.mapLegend.element, true);
                that.applyFilters();
            });

            this.timeSeries.element.on('timeseries:filterclick', function () {
                syncCheckboxes(that.timeSeries.mapLegend.element, that.filterWrapper.element.find('.filter-event-type .content'));
                syncCheckboxes(that.timeSeries.mapLegend.element, that.countryMap.mapLegend.element, true);
                that.applyFilters();
            });
        }
    }, {
        key: 'applyFilters',
        value: function applyFilters() {
            this.filteredData = $.extend(true, [], this.data);

            this.filterByEvents();
            this.filterByInteraction();
            this.filterByFatalities();
            this.filterByYear();
            this.filterByAdmin1s();
            this.filterWrapper.element.hide();

            this.render();

            var filterInfoWrapper = this.header.element.find('.filter-info-wrapper');
            filterInfoWrapper.empty();
            $(new FilterInfo(this.filterWrapper.getAppliedFilters()).html).appendTo(filterInfoWrapper);
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
            var requiredActors = container.find('input[type="checkbox"]:checked').map(function () {
                return $(this).data('target');
            }).get();

            this.filteredData = this.filteredData.filter(function (x) {
                return requiredActors.find(function (y) {
                    return x.interaction.includes(y);
                });
            });
        }
    }, {
        key: 'filterByFatalities',
        value: function filterByFatalities() {
            var container = this.filterWrapper.element.find('.filter-fatalities .content');
            var input = container.find('input[type="radio"]:checked');

            var lowerLimit = input.data('lowerlimit');
            var upperLimit = input.data('upperlimit');

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
            endYear = new Date(endYear.getFullYear(), endYear.getMonth() + 1, 0);

            function isDateYearInRange(d, d1, d2) {
                return d >= d1 && d <= d2;
            }

            this.filteredData = this.filteredData.filter(function (x) {
                return isDateYearInRange(new Date(x.event_date), startYear, endYear);
            });
        }
    }, {
        key: 'loadData',
        value: function loadData(country) {
            var deferred = $.Deferred();
            var that = this;
            this.data = [];
            this.filteredData = [];

            d3.csv('https://api.acleddata.com/acled/read.csv?country=' + country + '&limit=0&fields=actor1|actor2|year|event_date|event_type|interaction|fatalities|latitude|longitude|admin1|country', function (data) {
                data.forEach(function (row) {
                    row.event_type = getAcledEventName(row.event_type.toLowerCase());
                    row.country = row.country.toLowerCase();
                });
                that.data = data;
                that.data = that.data.filter(function (x) {
                    return compareCountryNames(x.country, country);
                });
                that.admin1s = that.data.map(function (x) {
                    return x.admin1 || '';
                }).sort().filter(function (item, pos, array) {
                    return !pos || item != array[pos - 1];
                });

                // remove the empty ones 
                that.admin1s = that.admin1s.filter(function (x) {
                    return x;
                });

                that.filteredData = that.data.slice();

                deferred.resolve();
            });

            return deferred.promise();
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

                    if (country == 'sudan') {
                        that.filterWrapper.setDefaultStartDate('2013-01-01');
                    }
                    that.applyFilters();

                    that.countryMap.mapLegend.fillAcledEvents('countrymap');
                    that.timeSeries.mapLegend.fillAcledEvents('timeseries');
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
            this.countryMap.mapLegend.clearLegendElements();
            this.timeSeries.mapLegend.clearLegendElements();
            this.element.fadeOut();
        }
    }]);

    return CountryProfile;
}(Element);
//# sourceMappingURL=CountryProfile.js.map