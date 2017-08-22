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
                                <label class="radio-input"><input type="radio" data-lowerlimit="0" data-upperlimit="Infinity" data-value="all" checked="true" name="${name}-filter-fatalities-input">All</label>
                                <label class="radio-input"><input type="radio" data-lowerlimit="0" data-upperlimit="10" data-value="less than 10" name="${name}-filter-fatalities-input">Less than 10</label>
                                <label class="radio-input"><input type="radio" data-lowerlimit="0" data-upperlimit="50" data-value="less than 50" name="${name}-filter-fatalities-input">Less than 50</label>
                                <label class="radio-input"><input type="radio" data-lowerlimit="0" data-upperlimit="100" data-value="less than 100" name="${name}-filter-fatalities-input">Less than 100</label>
                                <label class="radio-input"><input type="radio"  data-lowerlimit="0" data-upperlimit="0" data-value="none" name="${name}-filter-fatalities-input">None</label>
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
        /*
        yearFilter.find('input').datepicker({
            dateFormat: "MM yy",
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
             
            onClose: function(dateText, inst) {
                function isDonePressed(){
                    return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
                }

                if (isDonePressed()){
                    var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                    var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                    $(this).datepicker('setDate', new Date(year, month, 1)).trigger('change');

                    $('.date-picker').focusout();
                }
            },
             
            beforeShow : function(input, inst) {
                inst.dpDiv.addClass('month_year_datepicker');
                let datestr = null;

                if ((datestr = $(this).val()).length > 0) {
                    year = datestr.substring(datestr.length-4, datestr.length);
                    month = datestr.substring(0, 2);
                    $(this).datepicker('option', 'defaultDate', new Date(year, month-1, 1));
                    $(this).datepicker('setDate', new Date(year, month-1, 1));
                    $(".ui-datepicker-calendar").hide();
                }
            }
        });
        */
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
        
}
 
/*
<div class="input-container">
                                    <label>End date</label>
                                    <input type="text" class="end-year">
                                </div>
                                */
