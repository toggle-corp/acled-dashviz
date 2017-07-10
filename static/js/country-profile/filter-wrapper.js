
class FilterWrapper extends Element {
    constructor(name) {
        super(`
            <div class="filter-wrapper">
                <header>
                    <h4>Add filter</h4>
                    <div class="action-buttons">
                        <button class="btn-cancel">Cancel</button>
                        <button class="btn-reset">Reset</button>
                        <button class="btn-apply-filter">Apply</button>
                    </div>
                </header>
                <div class="content">
                    <section class="filter-event-type">
                        <header><h5>Event type</h5></header>
                        <div class="content">
                            <label class="checkbox-input"><input type="checkbox">Riots/protests</label>
                            <label class="checkbox-input"><input type="checkbox">Others</label>
                        </div>
                    </section>
                    <section class="filter-interaction">
                        <header><h5>Interaction</h5></header>
                        <div class="content">
                            <label class="radio-input"><input type="radio" data-value="all" checked="true" name="${name}-filter-interaction-input">All</label>
                            <label class="radio-input"><input type="radio" data-value="less than 100" name="${name}-filter-interaction-input">Less than 100</label>
                            <label class="radio-input"><input type="radio" data-value="100 - 1000" name="${name}-filter-interaction-input">100 - 1000</label>
                            <label class="radio-input"><input type="radio" data-value="1000 - 10000" name="${name}-filter-interaction-input">1000 - 10000</label>
                            <label class="radio-input"><input type="radio" data-value="more than 10000" name="${name}-filter-interaction-input">More than 10000</label>
                        </div>
                    </section>
                    <section class="filter-year">
                        <header><h5>Year</h5></header>
                        <div class="content">
                            <div class="input-container">
                                <label>Start</label>
                                <input type="text" class="start-year">
                            </div>
                            <div class="input-container">
                                <label>End</label>
                                <input type="text" class="end-year">
                            </div>
                        </div>
                    </section>
                    <section class="filter-fatalities">
                        <header><h5>Fatalities</h5></header>
                        <div class="content">
                            <label class="radio-input"><input type="radio" data-value="all" checked="true" name="${name}-filter-fatalities-input">All</label>
                            <label class="radio-input"><input type="radio" data-value="less than 100" name="${name}-filter-fatalities-input">Less than 100</label>
                            <label class="radio-input"><input type="radio" data-value="100 - 1000" name="${name}-filter-fatalities-input">100 - 1000</label>
                            <label class="radio-input"><input type="radio" data-value="1000 - 10000" name="${name}-filter-fatalities-input">1000 - 10000</label>
                            <label class="radio-input"><input type="radio" data-value="10000 - 100000" name="${name}-filter-fatalities-input">10000 - 100000</label>
                            <label class="radio-input"><input type="radio" data-value="more than 100000" name="${name}-filter-fatalities-input">More than 100000</label>
                        </div> 
                    </section>
                </div>
            </div>
        `);
        
        this.name = name;

    }

    init () {
        let name = this.name; 
        let container = this.element.find('.filter-event-type .content');
        container.empty();

        for (let eventName in acledEvents) {
            $('<label class="checkbox-input"><input type="checkbox" data-target="'+eventName+'" checked="true">'+eventName+'</label>').appendTo(container);
        }

        this.element.find(`input[name="${name}-filter-interaction-input"]`).eq(0).prop('checked', true);
        this.element.find(`input[name="${name}-filter-fatalities-input"]`).eq(0).prop('checked', true);

        this.element.find('input[type="text"]').val('');
    }

    show() {
    }

    hide() {
    }
        
}
