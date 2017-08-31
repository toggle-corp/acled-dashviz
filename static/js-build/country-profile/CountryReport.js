'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CountryReport = function (_Element) {
    _inherits(CountryReport, _Element);

    function CountryReport() {
        _classCallCheck(this, CountryReport);

        var _this = _possibleConstructorReturn(this, (CountryReport.__proto__ || Object.getPrototypeOf(CountryReport)).call(this, '<div id="country-report-container"></div>'));

        _this.header = new Element('<header><h4>Report</h4></header>');
        _this.emptyElement = new Element('<div id="country-report-empty">Not available</div>');
        _this.content = new Element('\n            <div class="content" hidden>\n                <div class="preview">\n                    <img>\n                </div>\n                <div class="details">\n                    <h5></h5>\n                    <date></date>\n                    <p></p>\n                    <a>Go to report</a>\n                </div>\n            </div>\n            ');

        _this.childElements.push(_this.header);
        _this.childElements.push(_this.emptyElement);
        _this.childElements.push(_this.content);

        return _this;
    }

    _createClass(CountryReport, [{
        key: 'load',
        value: function load(country) {
            var re = this.content.element;

            re.find('h5').text('');
            re.find('p').text('');
            re.find('date').text('');
            re.find('img')[0].src = '';
            re.find('a')[0].href = '';

            var that = this;

            $.ajax({
                type: 'GET',
                url: homeUrl + '/?pagename=report_country__' + getCountryKey(country),
                success: function success(response) {
                    var report = JSON.parse(response);

                    if (report && report.title) {
                        re.find('h5').text(report.title);
                        re.find('p').text(report.summary);
                        re.find('date').text(report.date);
                        re.find('img').prop('src', report.img);
                        re.find('a').prop('href', report.url);

                        that.emptyElement.element[0].style.display = 'none';
                        that.content.element[0].style.display = 'flex';
                    } else {
                        that.content.element[0].style.display = 'none';
                        that.emptyElement.element[0].style.display = 'flex';
                    }
                }
            });
        }
    }]);

    return CountryReport;
}(Element);
//# sourceMappingURL=CountryReport.js.map