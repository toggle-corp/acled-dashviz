'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainDashboard = function (_Element) {
    _inherits(MainDashboard, _Element);

    function MainDashboard() {
        _classCallCheck(this, MainDashboard);

        var _this = _possibleConstructorReturn(this, (MainDashboard.__proto__ || Object.getPrototypeOf(MainDashboard)).call(this, '<div id="main-dashboard"></div>'));

        _this.header = new Element('<header><h2>Acled Dashboard</h2><button id="apply-filter-main-btn"><i class="fa fa-filter"></i>Apply filters</button></header>');

        _this.leftSection = new Element('<div id="left-section"></div>');
        _this.rightSection = new Element('<div id="right-section"></div>');

        _this.childElements.push(_this.header);
        _this.childElements.push(_this.leftSection);
        _this.childElements.push(_this.rightSection);

        _this.dashboardMap = new DashboardMap();
        _this.leftSection.childElements.push(_this.dashboardMap);

        _this.graphs = new MainPageGraphs();
        _this.leftSection.childElements.push(_this.graphs);

        /*
        this.carousel = new Element(
            `
            <div id="carousel-container">
                <button id="carousel-left"><i class="fa fa-chevron-left"></i></button>
                <button id="carousel-right"><i class="fa fa-chevron-right"></i></button>
                <div class="carousel">
                </div>
                <div class="loader"><i class="fa fa-circle-o-notch fa-spin"></i></div>
            </div>
            `
        );
         
        this.leftSection.childElements.push(this.carousel);
        let imgContainer = this.carousel.element.find('.carousel');
         
        if (carouselImage1) {
            $('<a href="'+carouselUrl1+'" hidden><img src="'+ carouselImage1 +'"></a>').appendTo(imgContainer);
        }
        if (carouselImage2) {
            $('<a href="'+carouselUrl2+'" hidden><img src="'+ carouselImage2 +'"></a>').appendTo(imgContainer);
        }
        if (carouselImage3) {
            $('<a href="'+carouselUrl3+'" hidden><img src="'+ carouselImage3 +'"></a>').appendTo(imgContainer);
        }
        
        setTimeout(() => { imgContainer.find('a').eq(0).addClass('active').show(); }, 0);
        let leftButton = this.carousel.element.find('#carousel-left');
        let rightButton = this.carousel.element.find('#carousel-right');
         this.carousel.element.find('.loader').hide();
         let skipSlide = false;
         rightButton.on('click', function(e) {
            e.stopPropagation();
             let parent = $(this).closest('#carousel-container');
             parent.find('a.active').fadeOut(function(){
                $(this).removeClass('active');
                if( $(this).is(parent.find('a').last()) ){
                    parent.find('a').first().fadeIn().addClass('active');
                } else {
                    $(this).next().fadeIn().addClass('active');
                }
            });
             skipSlide = true;
        });
         leftButton.on('click', function(e) {
            e.stopPropagation();
             let parent = $(this).closest('#carousel-container');
             parent.find('a.active').fadeOut(function(){
                $(this).removeClass('active');
                if( $(this).is(parent.find('a').first()) ){
                    parent.find('a').last().fadeIn().addClass('active');
                } else {
                    $(this).prev().fadeIn().addClass('active');
                }
            });
             skipSlide = true;
        });
         // set carousel to automatically change in 5sec
        setInterval(function() {
            if(skipSlide) {
                skipSlide = false;
            } else {
                rightButton.click();
            }
        }, 5000);
        */

        _this.crisisProfile = new CrisisProfile();
        _this.rightSection.childElements.push(_this.crisisProfile);

        _this.filterWrapper = new FilterWrapper('main');
        _this.childElements.push(_this.filterWrapper);
        return _this;
    }

    _createClass(MainDashboard, [{
        key: 'process',
        value: function process() {
            var that = this;

            this.filterWrapper.init();
            this.graphs.init();

            this.header.element.find('#apply-filter-main-btn').on('click', function () {
                that.filterWrapper.show();
            });

            this.filterWrapper.element.find('.btn-apply-filter').on('click', function () {
                syncCheckboxes(that.filterWrapper.element.find('.filter-event-type .content'), that.dashboardMap.mapLegend.element, true);
                syncCheckboxes(that.filterWrapper.element.find('.filter-event-type .content'), that.graphs.mapLegend.element, true);
                that.applyFilters();
                that.filterWrapper.hide();
            });

            this.filterWrapper.element.find('.btn-cancel').on('click', function () {
                that.filterWrapper.hide();
            });

            this.filterWrapper.element.find('.btn-reset').on('click', function () {
                that.filterWrapper.init();
            });

            this.dashboardMap.element.on('worldmap:filterclick', function () {
                syncCheckboxes(that.dashboardMap.mapLegend.element, that.filterWrapper.element.find('.filter-event-type .content'));
                syncCheckboxes(that.dashboardMap.mapLegend.element, that.graphs.mapLegend.element, true);
                that.applyFilters();
            });

            this.graphs.element.on('graphs:filterclick', function () {
                syncCheckboxes(that.graphs.mapLegend.element, that.filterWrapper.element.find('.filter-event-type .content'));
                syncCheckboxes(that.graphs.mapLegend.element, that.dashboardMap.mapLegend.element, true);
                that.applyFilters();
            });
        }
    }, {
        key: 'applyFilters',
        value: function applyFilters() {
            // this.filteredData = $.extend(true, [], this.data);
            this.filteredData = [];
            this.filterByEvents();
            this.filterByInteraction();
            this.filterByYear();
            this.filterByFatalities();
            this.render();
        }
    }, {
        key: 'filterByEvents',
        value: function filterByEvents() {
            var container = this.filterWrapper.element.find('.filter-event-type .content');
            var requiredEvents = container.find('input[type="checkbox"]:checked').map(function () {
                return $(this).data('target');
            }).get();

            for (var i = 0; i < requiredEvents.length; i++) {
                this.filteredData = this.filteredData.concat(this.eventGroupedData[requiredEvents[i]]);
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

            function isDateYearInRange(d, d1, d2) {
                return d >= d1 && d <= d2;
            }

            this.filteredData = this.filteredData.filter(function (x) {
                return isDateYearInRange(new Date(x.event_date), startYear, endYear);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var mapData = d3.nest().key(function (d) {
                return d.latitude + ' ' + d.longitude;
            }).key(function (d) {
                return d.event_type;
            }).object(this.filteredData);

            setTimeout(function () {
                return _this2.dashboardMap.refreshMap(mapData);
            }, 0);
            setTimeout(function () {
                return _this2.graphs.render(_this2.filteredData);
            }, 0);
        }
    }, {
        key: 'loadData',
        value: function loadData(data) {
            this.data = data;

            this.eventGroupedData = d3.nest().key(function (d) {
                return d.event_type;
            }).object(data);

            this.loadMap(data);
            this.loadCrisisProfile();
        }
    }, {
        key: 'loadMap',
        value: function loadMap(data) {
            this.dashboardMap.init();
            this.applyFilters();
        }
    }, {
        key: 'loadCrisisProfile',
        value: function loadCrisisProfile() {
            this.crisisProfile.load();
        }
    }, {
        key: 'processRawData',
        value: function processRawData(data) {
            this.dashboardMap.processData(data);
        }
    }]);

    return MainDashboard;
}(Element);
//# sourceMappingURL=MainDashboard.js.map