"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoadingAnimation = function (_Element) {
    _inherits(LoadingAnimation, _Element);

    function LoadingAnimation() {
        _classCallCheck(this, LoadingAnimation);

        return _possibleConstructorReturn(this, (LoadingAnimation.__proto__ || Object.getPrototypeOf(LoadingAnimation)).call(this, "\n            <div class=\"loading-animation\" hidden>\n                <span class=\"fa fa-circle-o-notch fa-spin\"></span>\n            </div>\n        "));
    }

    _createClass(LoadingAnimation, [{
        key: "show",
        value: function show() {
            if (this.element) {
                this.element.show();
            }
        }
    }, {
        key: "hide",
        value: function hide() {
            if (this.element) {
                this.element.hide();
            }
        }
    }]);

    return LoadingAnimation;
}(Element);
//# sourceMappingURL=LoadingAnimation.js.map