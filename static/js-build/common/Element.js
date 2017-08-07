"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = function () {
    function Element() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        _classCallCheck(this, Element);

        this.childElements = [];
        this.element = $(element);
    }

    _createClass(Element, [{
        key: "initDom",
        value: function initDom(parent) {
            if (this.element && parent && parent.element) {
                this.element.appendTo(parent.element);
            }
        }
    }, {
        key: "initDomAll",
        value: function initDomAll(parent) {
            if (!this.element) {
                return;
            }
            this.initDom(parent);

            for (var i = 0; i < this.childElements.length; i++) {
                this.childElements[i].initDomAll(this);
            }
        }
    }, {
        key: "process",
        value: function process() {}
    }, {
        key: "processAll",
        value: function processAll() {
            this.process();

            for (var i = 0; i < this.childElements.length; i++) {
                this.childElements[i].processAll();
            }
        }
    }, {
        key: "render",
        value: function render() {}
    }]);

    return Element;
}();
//# sourceMappingURL=Element.js.map