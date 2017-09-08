class FilterInfo {
    constructor(appliedFilters) {
        this.html = `
            ${this.getEventFilterHtml(appliedFilters)}
            ${this.getInteractionFilterHtml(appliedFilters)}
            ${this.getDateFilter(appliedFilters)}
            ${this.getFatalitiesFilter(appliedFilters)}
            ${this.getAdmin1Filters(appliedFilters)}
            <label class="filter-label">Applied Filters:<br><small>(hover for details)</small></label>
        `;
    }

    getEventFilterHtml(appliedFilters) {
        let event = appliedFilters['event-types'];
        let html = '';
        if (event) {
            html += `
                <div class="applied-filter">
                    <label class="filter-name">${event.name} (${event.filters.length})</label>
                    <div class="filter-list-container">
            `;

            for (let i=0; i<event.filters.length; i++) {
                html += `<div>${event.filters[i].capitalize()}</div>`;
            }
            html += `
                    </div>
                </div>
            `;
        }
        return html;
    }

    getInteractionFilterHtml(appliedFilters) {
        let actorTypes = appliedFilters['actor-types'];
        let html = '';
        if (actorTypes) {
            html += `
                <div class="applied-filter">
                    <label class="filter-name">${actorTypes.name} (${actorTypes.filters.length})</label>
                    <div class="filter-list-container">
            `;

            for (let i=0; i<actorTypes.filters.length; i++) {
                html += `<div>${actorTypes.filters[i].capitalize()}</div>`;
            }
            html += `
                    </div>
                </div>
            `;
        }
        return html;
    }

    getDateFilter(appliedFilters) {
        let date = appliedFilters['date'];
        let html = '';

        if (date) {
            html += `
                <div class="applied-filter">
                    <label class="filter-name">${date.name}</label>
                    <div class="filter-list-container">
                        <div><span>From: </span>${d3.timeFormat('%B, %Y')(date.filters.start)}</div>
                        <div><span>To: </span>${d3.timeFormat('%B, %Y')(date.filters.end)}</div>
                    </div>
                </div>
            `;
        }
        return html;
    }

    getFatalitiesFilter(appliedFilters) {
        let fatalities = appliedFilters['fatalities'];
        let html = '';

        if (fatalities) {
            html += `
                <div class="applied-filter">
                    <label class="filter-name">${fatalities.name}</label>
                    <div class="filter-list-container">
                        <div>${fatalities.filters}</div>
                    </div>
                </div>
            `;
        }
        return html;
    }

    getAdmin1Filters(appliedFilters) {
        let admin1s = appliedFilters['admin-levels'];

        let html = '';

        if (admin1s) {
            html += `
                <div class="applied-filter">
                    <label class="filter-name">${admin1s.name} (${admin1s.filters.length})</label>
                    <div class="filter-list-container">
            `;

            for (let i=0; i<admin1s.filters.length; i++) {
                html += `<div>${admin1s.filters[i].capitalize()}</div>`;
            }
            html += `
                    </div>
                </div>
            `;
        }
        return html;
    }
}
