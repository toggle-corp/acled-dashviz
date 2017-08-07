'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dashboard = function (_Element) {
    _inherits(Dashboard, _Element);

    function Dashboard() {
        _classCallCheck(this, Dashboard);

        var _this = _possibleConstructorReturn(this, (Dashboard.__proto__ || Object.getPrototypeOf(Dashboard)).call(this, '<div id="dashboard-container"></div>'));

        _this.mainDashboard = new MainDashboard();
        _this.childElements.push(_this.mainDashboard);
        _this.countryProfile = new CountryProfile();
        _this.childElements.push(_this.countryProfile);
        return _this;
    }

    _createClass(Dashboard, [{
        key: 'loadMainMap',
        value: function loadMainMap() {
            this.childElements[0].loadMap();
        }
    }, {
        key: 'show',
        value: function show(country) {
            this.countryProfile.show(country);
        }
    }, {
        key: 'load',
        value: function load() {
            this.mainDashboard.load();
        }
    }]);

    return Dashboard;
}(Element);
//# sourceMappingURL=Dashboard.js.map