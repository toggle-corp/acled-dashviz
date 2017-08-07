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

        _this.leftSection = new Element('<div id="left-section"></div>');
        _this.rightSection = new Element('<div id="right-section"></div>');

        _this.childElements.push(_this.leftSection);
        _this.childElements.push(_this.rightSection);

        _this.dashboardMap = new DashboardMap();
        _this.leftSection.childElements.push(_this.dashboardMap);
        _this.carousel = new Element('\n            <div id="carousel-container">\n                <button id="carousel-left"><i class="fa fa-chevron-left"></i></button>\n                <button id="carousel-right"><i class="fa fa-chevron-right"></i></button>\n                <div class="carousel">\n                </div>\n                <div class="loader"><i class="fa fa-circle-o-notch fa-spin"></i></div>\n            </div>\n            ');
        _this.leftSection.childElements.push(_this.carousel);
        var imgContainer = _this.carousel.element.find('.carousel');

        if (carouselImage1) {
            $('<a href="' + carouselUrl1 + '" hidden><img src="' + carouselImage1 + '"></a>').appendTo(imgContainer);
        }
        if (carouselImage2) {
            $('<a href="' + carouselUrl2 + '" hidden><img src="' + carouselImage2 + '"></a>').appendTo(imgContainer);
        }
        if (carouselImage3) {
            $('<a href="' + carouselUrl3 + '" hidden><img src="' + carouselImage3 + '"></a>').appendTo(imgContainer);
        }

        setTimeout(function () {
            imgContainer.find('a').eq(0).addClass('active').show();
        }, 0);
        var leftButton = _this.carousel.element.find('#carousel-left');
        var rightButton = _this.carousel.element.find('#carousel-right');

        _this.carousel.element.find('.loader').hide();

        var skipSlide = false;

        rightButton.on('click', function (e) {
            e.stopPropagation();

            var parent = $(this).closest('#carousel-container');

            parent.find('a.active').fadeOut(function () {
                $(this).removeClass('active');
                if ($(this).is(parent.find('a').last())) {
                    parent.find('a').first().fadeIn().addClass('active');
                } else {
                    $(this).next().fadeIn().addClass('active');
                }
            });

            skipSlide = true;
        });

        leftButton.on('click', function (e) {
            e.stopPropagation();

            var parent = $(this).closest('#carousel-container');

            parent.find('a.active').fadeOut(function () {
                $(this).removeClass('active');
                if ($(this).is(parent.find('a').first())) {
                    parent.find('a').last().fadeIn().addClass('active');
                } else {
                    $(this).prev().fadeIn().addClass('active');
                }
            });

            skipSlide = true;
        });

        // set carousel to automatically change in 5sec
        setInterval(function () {
            if (skipSlide) {
                skipSlide = false;
            } else {
                rightButton.click();
            }
        }, 5000);

        _this.crisisProfile = new CrisisProfile();
        _this.rightSection.childElements.push(_this.crisisProfile);
        return _this;
    }

    _createClass(MainDashboard, [{
        key: 'loadMap',
        value: function loadMap() {
            this.dashboardMap.loadDataToMap();
        }
    }, {
        key: 'load',
        value: function load() {
            this.crisisProfile.load();
        }
    }]);

    return MainDashboard;
}(Element);
//# sourceMappingURL=MainDashboard.js.map