'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FilterInfo = function () {
    function FilterInfo(appliedFilters) {
        _classCallCheck(this, FilterInfo);

        this.html = '\n            ' + this.getEventFilterHtml(appliedFilters) + '\n            ' + this.getInteractionFilterHtml(appliedFilters) + '\n            ' + this.getDateFilter(appliedFilters) + '\n            ' + this.getFatalitiesFilter(appliedFilters) + '\n            ' + this.getAdmin1Filters(appliedFilters) + '\n            <label class="filter-label">Applied Filters:<br><small>(hover for details)</small></label>\n        ';
    }

    _createClass(FilterInfo, [{
        key: 'getEventFilterHtml',
        value: function getEventFilterHtml(appliedFilters) {
            var event = appliedFilters['event-types'];
            var html = '';
            if (event) {
                html += '\n                <div class="applied-filter">\n                    <label class="filter-name">' + event.name + ' (' + event.filters.length + ')</label>\n                    <div class="filter-list-container">\n            ';

                for (var i = 0; i < event.filters.length; i++) {
                    html += '<div>' + event.filters[i].capitalize() + '</div>';
                }
                html += '\n                    </div>\n                </div>\n            ';
            }
            return html;
        }
    }, {
        key: 'getInteractionFilterHtml',
        value: function getInteractionFilterHtml(appliedFilters) {
            var actorTypes = appliedFilters['actor-types'];
            var html = '';
            if (actorTypes) {
                html += '\n                <div class="applied-filter">\n                    <label class="filter-name">' + actorTypes.name + ' (' + actorTypes.filters.length + ')</label>\n                    <div class="filter-list-container">\n            ';

                for (var i = 0; i < actorTypes.filters.length; i++) {
                    html += '<div>' + actorTypes.filters[i].capitalize() + '</div>';
                }
                html += '\n                    </div>\n                </div>\n            ';
            }
            return html;
        }
    }, {
        key: 'getDateFilter',
        value: function getDateFilter(appliedFilters) {
            var date = appliedFilters['date'];
            var html = '';

            if (date) {
                html += '\n                <div class="applied-filter">\n                    <label class="filter-name">' + date.name + '</label>\n                    <div class="filter-list-container">\n                        <div><span>From: </span>' + d3.timeFormat('%B, %Y')(date.filters.start) + '</div>\n                        <div><span>To: </span>' + d3.timeFormat('%B, %Y')(date.filters.end) + '</div>\n                    </div>\n                </div>\n            ';
            }
            return html;
        }
    }, {
        key: 'getFatalitiesFilter',
        value: function getFatalitiesFilter(appliedFilters) {
            var fatalities = appliedFilters['fatalities'];
            var html = '';

            if (fatalities) {
                html += '\n                <div class="applied-filter">\n                    <label class="filter-name">' + fatalities.name + '</label>\n                    <div class="filter-list-container">\n                        <div>' + fatalities.filters + '</div>\n                    </div>\n                </div>\n            ';
            }
            return html;
        }
    }, {
        key: 'getAdmin1Filters',
        value: function getAdmin1Filters(appliedFilters) {
            var admin1s = appliedFilters['admin-levels'];

            var html = '';

            if (admin1s) {
                html += '\n                <div class="applied-filter">\n                    <label class="filter-name">' + admin1s.name + ' (' + admin1s.filters.length + ')</label>\n                    <div class="filter-list-container">\n            ';

                for (var i = 0; i < admin1s.filters.length; i++) {
                    html += '<div>' + admin1s.filters[i].capitalize() + '</div>';
                }
                html += '\n                    </div>\n                </div>\n            ';
            }
            return html;
        }
    }]);

    return FilterInfo;
}();
//# sourceMappingURL=FilterInfo.js.map