class FilterWrapper extends Element {
    constructor(name) {
        super(`
            <div class="filter-wrapper" hidden>
                <div class="container">
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
                                <label class="checkbox-input"><input type="checkbox"><span class="name">Riots/protests</span></label>
                                <label class="checkbox-input"><input type="checkbox"><span class="name">Others</span></label>
                            </div>
                        </section>
                        <section class="filter-interaction">
                            <header><h5>Interaction</h5></header>
                            <div class="content">
                                <label class="radio-input"><input type="radio" data-value="all" checked="true" name="${name}-filter-interaction-input">All</label>
                                <label class="radio-input"><input type="radio" data-value="less than 100" name="${name}-filter-interaction-input">Less than 100</label>
                                <label class="radio-input"><input type="radio" data-value="100 - 1000" name="${name}-filter-interaction-input">100 - 1,000</label>
                                <label class="radio-input"><input type="radio" data-value="1000 - 10000" name="${name}-filter-interaction-input">1,000 - 10,000</label>
                                <label class="radio-input"><input type="radio" data-value="more than 10000" name="${name}-filter-interaction-input">More than 10,000</label>
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
                                <label class="radio-input"><input type="radio" data-value="100 - 1000" name="${name}-filter-fatalities-input">100 - 1,000</label>
                                <label class="radio-input"><input type="radio" data-value="1000 - 10000" name="${name}-filter-fatalities-input">1,000 - 10,000</label>
                                <label class="radio-input"><input type="radio" data-value="10000 - 100000" name="${name}-filter-fatalities-input">10,000 - 100,000</label>
                                <label class="radio-input"><input type="radio" data-value="more than 100000" name="${name}-filter-fatalities-input">More than 100,000</label>
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

    process() {
        let container = this.element.find('.selected-admin1s');
        this.element.find('.admin1-select').on('click', function() {
            let val = jQ3(this).val();
            let text = jQ3(this).find(`option[value="${val}"]`).text();

            if (val && container.find(`.selected-admin1[data-val="${val}"]`).length === 0) {
                let elem = jQ3('<div data-val="'+val+'" class="selected-admin1"><span class="name">'+text+'</span><button><i class="fa fa-times"></i></button></div>');
                elem.appendTo(container);
                elem.find('button').on('click', function() {
                    jQ3(this).closest('.selected-admin1').remove();         
                });
            }
             
            jQ3(this).val('');
        });
    }

    init (admin1s) {
        let name = this.name; 
        let container = this.element.find('.filter-event-type .content');
        container.empty();

        for (let eventName in acledEvents) {
            jQ3('<label class="checkbox-input"><input type="checkbox" data-target="'+eventName+'" checked="true"><span class="name">'+eventName+'</span></label>').appendTo(container);
        }

        this.element.find(`input[name="${name}-filter-interaction-input"]`).eq(0).prop('checked', true);
        this.element.find(`input[name="${name}-filter-fatalities-input"]`).eq(0).prop('checked', true);

        this.element.find('input[type="text"]').val('');

        this.element.find('.selected-admin1s').empty();
         
        let admin1select = this.element.find('.admin1-select');
         
        if (admin1s) {
            admin1select.empty();
            admin1select.append(`<option value="">Select admin1</option>`);
             
            for (let i=0; i<admin1s.length; i++) {
                admin1select.append(`<option value="${i+1}">${admin1s[i]}</option>`);
            }

        }
        admin1select.val('');
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
        
}
