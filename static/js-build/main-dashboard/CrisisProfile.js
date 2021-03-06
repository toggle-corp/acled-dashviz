'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CrisisProfile = function (_Element) {
    _inherits(CrisisProfile, _Element);

    function CrisisProfile() {
        _classCallCheck(this, CrisisProfile);

        var _this = _possibleConstructorReturn(this, (CrisisProfile.__proto__ || Object.getPrototypeOf(CrisisProfile)).call(this, '<div id="crisis-profile-container"></div>'));

        jQ3('<header><h4>Crisis profile</h4></header>').appendTo(_this.element);
        _this.reportSection = new Element('<div id="report-section"></div>');
        _this.keyFiguresSection = new KeyFigures();

        _this.reportSelectContainer = new Element('\n            <div class="select-wrapper">\n                <i class="fa fa-search"></i>\n                <select id="report-search" placeholder="Select an event"></select>\n            </div>\n        ');

        _this.reportDetailContainer = new Element('\n            <div id="report">\n                <div class="report-header">\n                    <h5 class="title"></h5>\n                    <date></date>\n                </div>\n                <div class="description"></div>\n            <div>\n        ');

        _this.recentEventsSection = new Element('\n            <div id="recent-events-section">\n                <a hidden><img alt="Profile image"></a>\n                <div id="report-image-empty">Profile image not available</div>\n            </div>\n        ');

        // this.crisisProfileMap = new CrisisProfileMap();
        _this.loadingAnimation = new LoadingAnimation();

        _this.childElements.push(_this.reportSelectContainer);
        _this.reportSection.childElements.push(_this.reportDetailContainer);

        _this.childElements.push(_this.reportSection);
        _this.childElements.push(_this.keyFiguresSection);
        _this.childElements.push(_this.recentEventsSection);

        // this.crisisProfileMap.element.appendTo(this.reportDetailContainer.element.find('.map'));
        _this.childElements.push(_this.loadingAnimation);
        return _this;
    }

    _createClass(CrisisProfile, [{
        key: 'loadCrisisProfile',
        value: function loadCrisisProfile(cp) {
            this.reportDetailContainer.element.find('.title').text(cp.title).prop('title', cp.title);
            if (cp['end-date']) {
                this.reportDetailContainer.element.find('date').text(cp.date + ' to ' + cp['end-date']);
            } else {
                this.reportDetailContainer.element.find('date').text(cp.date + ' (ongoing)');
            }
            this.reportDetailContainer.element.find('.description').text(cp.description);
            // this.crisisProfileMap.load(cp.country);
        }
    }, {
        key: 'process',
        value: function process() {
            var that = this;
            // this.crisisProfileMap.process();

            for (var i = 0; i < crisisProfiles.length; i++) {
                crisisProfiles[i].id = i;
            }

            jQ3('#report-search').selectize({
                valueField: 'id',
                labelField: 'title',
                searchField: ['title', 'country'],
                maxOptions: 5,
                options: crisisProfiles,
                create: false,
                closeAfterSelect: true,
                //openOnFocus: false,
                render: {
                    option: function option(item, escape) {
                        return '\n                        <div class="crisis-profile-select-item">\n                            <div class="title">' + escape(item.title) + '</div>\n                            <div class="country">' + escape(acledCountriesISO[item.country] || '-') + '</div>\n                        </div>\n                    ';
                    }
                },
                onChange: function onChange(val) {
                    if (val) {
                        that.renderData(val);
                    }
                }
            });

            this.loadingAnimation.show();
        }
    }, {
        key: 'renderData',
        value: function renderData(index) {
            var cp = crisisProfiles[index];

            this.loadCrisisProfile(cp);
            // this.keyFiguresSection.load(cp.country, cp.date, cp['end-date']);
            this.keyFiguresSection.load(cp);

            if (cp['recent-event-url']) {
                this.recentEventsSection.element.find('a').prop('href', cp['recent-event-url']).css('display', 'block');
            } else {
                this.recentEventsSection.element.find('a').prop('href', '#').css('display', 'none');
            }

            if (cp['recent-event-img']) {
                this.recentEventsSection.element.find('img').prop('src', cp['recent-event-img']).removeClass('no-img');
                this.recentEventsSection.element.find('#report-image-empty').css('display', 'none');
                this.recentEventsSection.element.find('a').css('display', 'flex');
            } else {
                this.recentEventsSection.element.find('img').prop('src', '').addClass('no-img');
                this.recentEventsSection.element.find('a').css('display', 'none');
                this.recentEventsSection.element.find('#report-image-empty').css('display', 'flex');
            }
        }
    }, {
        key: 'load',
        value: function load() {
            this.loadingAnimation.hide();

            if (crisisProfiles.length > 0) {
                this.renderData(0);
            }
        }
    }]);

    return CrisisProfile;
}(Element);
//# sourceMappingURL=CrisisProfile.js.map