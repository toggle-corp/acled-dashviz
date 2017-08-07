'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Timeline = function (_Element) {
    _inherits(Timeline, _Element);

    function Timeline() {
        _classCallCheck(this, Timeline);

        var _this = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this, '<div id="timeline-container"></div>'));

        _this.header = new Element('<header><h4>Timeline</h4></header>');

        _this.staticImage = new Element('<img id="timeline-static-image" hidden>');
        _this.timelineElements = new Element('<div id="timeline-elements" hidden></div>');
        _this.emptyElement = new Element('<div id="timeline-empty">Not available</div>');

        _this.timelineElementTemplate = $('<div class="timeline-element"><div class="number"><span></span></div><div class="description"><h5></h5><p></p></div><img></div>');

        _this.childElements.push(_this.header);
        _this.childElements.push(_this.staticImage);
        _this.childElements.push(_this.timelineElements);
        _this.childElements.push(_this.emptyElement);
        return _this;
    }

    _createClass(Timeline, [{
        key: 'getTimelineElement',
        value: function getTimelineElement(num, title, descText, imgUri) {
            var elem = this.timelineElementTemplate.clone();
            elem.find('.number > span').text(num);
            elem.find('h5').text(title);
            elem.find('p').text(descText);

            if (imgUri && imgUri.length > 0) {
                elem.find('img').prop('src', imgUri);
            } else {
                elem.addClass('no-img');
            }
            return elem;
        }
    }, {
        key: 'load',
        value: function load(country) {
            var that = this;
            $.ajax({
                type: 'GET',
                url: homeUrl + '/?pagename=timeline_country__' + country,
                success: function success(response) {
                    var timelineData = JSON.parse(response);

                    if ($.isArray(timelineData)) {
                        timelineData = { 'staticImage': false, 'timelineElements': timelineData };
                    }

                    if (timelineData.staticImage) {
                        that.staticImage.element.prop('src', timelineData.img);

                        that.timelineElements.element[0].style.display = 'none';
                        that.emptyElement.element[0].style.display = 'none';
                        that.staticImage.element.show();
                    } else if (timelineData.timelineElements) {
                        that.timelineElements.element.empty();
                        var timeElements = timelineData.timelineElements;

                        for (var i = 0; i < timeElements.length; i++) {
                            var cd = timeElements[i];
                            that.getTimelineElement(cd.num, cd.title, cd.description, cd.img).appendTo(that.timelineElements.element);
                        }

                        if (timeElements.length === 0) {
                            that.timelineElements.element[0].style.display = 'none';
                            that.staticImage.element.hide();
                            that.emptyElement.element[0].style.display = 'flex';
                        } else {
                            that.staticImage.element.hide();
                            that.emptyElement.element[0].style.display = 'none';
                            that.timelineElements.element[0].style.display = 'flex';
                        }
                    } else {
                        that.timelineElements.element[0].style.display = 'none';
                        that.staticImage.element.hide();
                        that.emptyElement.element[0].style.display = 'flex';
                    }
                }
            });
        }
    }]);

    return Timeline;
}(Element);
//# sourceMappingURL=Timeline.js.map