class FilterWrapper extends Element {
    constructor(name) {
        super(`
            <div class="filter-wrapper" hidden>
                <div class="container">
                    <header>
                        <h4>Filters</h4>
                        <div class="action-buttons">
                            <button class="btn-cancel">Cancel</button> <button class="btn-reset">Reset</button>
                            <button class="btn-apply-filter">Apply</button>
                        </div>
                    </header>
                    <div class="content">
                        <section class="filter-event-type">
                            <header><h5>Event types</h5></header>
                            <div class="content"></div>
                        </section>
                        <section class="filter-interaction">
                            <header><h5>Actor types</h5></header>
                            <div class="content"></div>
                        </section>
                        <section class="filter-year">
                            <header><h5>Date range</h5></header>
                            <div class="content">
                                <div class="input-container">
                                    <label>From</label>
                                    <input type="text" class="start-year">
                                </div>
                                <div class="input-container">
                                    <label>To</label>
                                    <input type="text" class="end-year">
                                </div>
                            </div>
                        </section>
                        <section class="filter-fatalities">
                            <header><h5>Fatalities</h5></header>
                            <div class="content">
                                <label class="radio-input"><input type="radio" data-lowerlimit="0" data-upperlimit="Infinity" data-value="all" checked="true" name="${name}-filter-fatalities-input"><span class="name">All</span></label>
                                <label class="radio-input"><input type="radio" data-lowerlimit="0" data-upperlimit="10" data-value="less than 10" name="${name}-filter-fatalities-input"><span class="name">Less than 10</span></label>
                                <label class="radio-input"><input type="radio" data-lowerlimit="0" data-upperlimit="50" data-value="less than 50" name="${name}-filter-fatalities-input"><span class="name">Less than 50</span></label>
                                <label class="radio-input"><input type="radio" data-lowerlimit="0" data-upperlimit="100" data-value="less than 100" name="${name}-filter-fatalities-input"><span class="name">Less than 100</span></label>
                                <label class="radio-input"><input type="radio"  data-lowerlimit="0" data-upperlimit="1" data-value="none" name="${name}-filter-fatalities-input"><span class="name">None</span></label>
                            </div> 
                        </section>
                        <section class="filter-admin1">
                            <header><h5>Admin1</h5></header> 
                            <div class="content">
                                <div class="select-wrapper">
                                    <select class="admin1-select">
                                        <option value="">Select admin1</option>
                                    </select>
                                </div>
                                <div class="selected-admin1s">
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        `);
        
        this.name = name;

    }

    getAcledEventListElement() {
        let elem = '';
        for(let e in acledEvents) {
            elem += `<label class="checkbox-input"><input type="checkbox"><span class="name">${e}</span></label>`;
        }
    }

    process() {
        let container = this.element.find('.selected-admin1s');
        this.element.find('.admin1-select').on('click', function() {
            let val = $(this).val();
            let text = $(this).find(`option[value="${val}"]`).text();

            if (val && container.find(`.selected-admin1[data-val="${val}"]`).length === 0) {
                let elem = $('<div data-val="'+val+'" class="selected-admin1"><span class="name">'+text+'</span><button><i class="fa fa-times"></i></button></div>');
                elem.appendTo(container);
                elem.find('button').on('click', function() {
                    $(this).closest('.selected-admin1').remove();         
                });
            }
             
            $(this).val('');
        });

        let yearFilter = this.element.find('.filter-year');
        yearFilter.find('input').datepicker({
            language: "en",
            minView: "months",
            view: "years",
            dateFormat: "MM yyyy",
            multipleDatesSeparator: ' - ',
            minDate: new Date('January 1990'),
            maxDate: new Date(),
        });
    }

    init (admin1s) {
        let name = this.name; 
        let container = this.element.find('.filter-event-type .content');
        container.empty();

        for (let eventName in acledEvents) {
            $(`<label class="checkbox-input"><input type="checkbox" data-target="${eventName}" checked="true"><span class="name">${eventName}</span></label>`).appendTo(container);
        }
         
        container = this.element.find('.filter-interaction .content');
        container.empty();

        for (let actor in acledActors) {
            $(`<label class="checkbox-input"><input type="checkbox" data-target="${acledActors[actor]}" checked="true"><span class="name">${actor}</span></label>`).appendTo(container);
        }


        this.element.find(`input[name="${name}-filter-interaction-input"]`).eq(0).prop('checked', true);
        this.element.find(`input[name="${name}-filter-fatalities-input"]`).eq(0).prop('checked', true);

        this.element.find('input[type="text"]').val('');

        this.element.find('.selected-admin1s').empty();
         
        let admin1select = this.element.find('.admin1-select');
         
        if (admin1s) {
            this.element.find('.filter-admin1').show();
            admin1select.empty();
            admin1select.append(`<option value="">Select admin1</option>`);
             
            for (let i=0; i<admin1s.length; i++) {
                admin1select.append(`<option value="${i+1}">${admin1s[i]}</option>`);
            }

            admin1select.val('');
        } else {
            this.element.find('.filter-admin1').hide();
        }
    }

    show () {
        let that = this;
        this.element.fadeIn(200, function() {
            that.element.find('.container').slideDown(200);
        });
    }

    hide () {
        let that = this;
         
        this.element.find('.container').slideUp(200, function() {
            that.element.fadeOut(200);
        });
    }

    getAppliedFilters() {
        let appliedFilters = {};

        let container = this.element.find('.filter-event-type .content');
        let requiredEvents = container.find('input[type="checkbox"]:checked').map(function() {
            return $(this).data('target');
        }).get();

        if (requiredEvents.length < 5) {
            appliedFilters['event-types'] = {
                name: "Event types",
                filters: requiredEvents,
            };
        }
         
        container = this.element.find('.filter-interaction .content');
        let requiredActors = container.find('input[type="checkbox"]:checked').map(function() {
            return $(this).siblings('.name').text();
        }).get();

        if (requiredActors.length < 7) {
            appliedFilters['actor-types'] = {
                name: "Actor types",
                filters: requiredActors,
            };
        }

        container = this.element.find('.filter-fatalities .content');
        let input = container.find('input[type="radio"]:checked');
         
        let lowerLimit = input.data('lowerlimit');
        let upperLimit = input.data('upperlimit');

        if (lowerLimit > 0 || upperLimit < Infinity) {
            appliedFilters['fatalities'] = {
                name: "Fatalities",
                filters: input.siblings('.name').text(),
            };
        }

        container = this.element.find('.filter-admin1 .selected-admin1s');
        let requiredAdmin1s = container.find('.selected-admin1').map(function() {
            return $(this).find('.name').text();
        }).get();

        if (requiredAdmin1s.length > 0) {
            appliedFilters['admin-levels'] = {
                name: "Admin levels",
                filters: requiredAdmin1s,
            };
        }
         
         
        container = this.element.find('.filter-year');

        let startYear = container.find('.start-year').val(); 
        let endYear = container.find('.end-year').val();

        if (startYear || endYear) {
            startYear = startYear? (new Date(startYear)) : (new Date(0));
            endYear = endYear? (new Date(endYear)) : (new Date());

            appliedFilters['date'] = {
                name: "Date",
                filters: {start: startYear, end: endYear},
            };
        }

        return appliedFilters;
    }
}
