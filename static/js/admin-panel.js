let timelineData = [];
let reportData = {};

const acledCountriesByCode = {
    "012":"Algeria",
    "024":"Angola",
    "072":"Botswana",
    "108":"Burundi",
    "120":"Cameroon",
    "140":"Central African Republic",
    "148":"Chad",
    "178":"Republic of Congo",
    "180":"Democratic Republic of Congo",
    "204":"Benin",
    "226":"Equatorial Guinea",
    "231":"Ethiopia",
    "232":"Eritrea",
    "262":"Djibouti",
    "266":"Gabon",
    "270":"Gambia",
    "288":"Ghana",
    "324":"Guinea",
    "384":"Ivory Coast",
    "404":"Kenya",
    "426":"Lesotho",
    "430":"Liberia",
    "434":"Libya",
    "450":"Madagascar",
    "454":"Malawi",
    "466":"Mali",
    "478":"Mauritania",
    "504":"Morocco",
    "508":"Mozambique",
    "516":"Namibia",
    "562":"Niger",
    "566":"Nigeria",
    "624":"Guinea-Bissau",
    "646":"Rwanda",
    "686":"Senegal",
    "694":"Sierra Leone",
    "706":"Somalia",
    "710":"South Africa",
    "716":"Zimbabwe",
    "728":"South Sudan",
    "729":"Sudan",
    "748":"Swaziland",
    "768":"Togo",
    "788":"Tunisia",
    "800":"Uganda",
    "818":"Egypt",
    "834":"Tanzania",
    "854":"Burkina Faso",
    "894":"Zambia"
};
 
const addAcledCountry = (iso, name) => {
    if (!acledCountriesByCode[iso]) {
        acledCountriesByCode[iso] = name;
    }
}

$(document).ready(function() {
    $.ajax({
        url: 'https://api.acleddata.com/acled/read?limit=0&fields=iso|country',
        method: 'GET',
        success: function(response) {
            for (let i = 0; i < response.data.length; i++) {
                const cd = response.data[i];
                const iso = cd.iso.padStart(3, '0');
                addAcledCountry(iso, cd.country);
            }

            populateCountries('#timeline-country-select');
            populateCountries('#report-country-select');
            populateCountries('#edit-crisis-country-select');
            populateCountries('#add-crisis-country-select');
        },
    });

    const loadImage = function(input, targetSelector) {
        if (input.files && input.files[0]) {
            let fr = new FileReader();

            fr.addEventListener("load", function(e) {
                $(targetSelector)[0].src = e.target.result;
            }); 

            fr.readAsDataURL(input.files[0]);
        } 
    }

    $('#clear-report-img-preview-button').on('click', function() {
        $('#report-img-preview').attr('src', '');
    });


    $('#report-image-input').on('change', function() {
        loadImage(this, '#report-img-preview');
    });

    $('#recent-event-image-input').on('change', function() {
        loadImage(this, '#recent-event-image-preview');
    }); 
     
    $('#timeline-static-image-input').on('change', function() {
        loadImage(this, '#timeline-static-image-preview');
    });
     
    $('#add-crisis-recent-event-image-input').on('change', function() {
        loadImage(this, '#add-crisis-recent-event-image-preview');
    });
     
    $('#edit-crisis-recent-event-image-input').on('change', function() {
        loadImage(this, '#edit-crisis-recent-event-image-preview');
    }); 

    $('#add-crisis-btn').on('click', function() {
        let newCrisis = $('#add-crisis-modal .content');
        let newCrisisTitleInput = newCrisis.find('.crisis-title');
        let newCrisisDateInput = newCrisis.find('.crisis-date');
        let newCrisisEndDateInput = newCrisis.find('.crisis-end-date');
        let newCrisisCountryInput = newCrisis.find('.crisis-country option:selected');
        let newCrisisNumberOfEvents = newCrisis.find('.crisis-number-of-events');
        let newCrisisFatalities = newCrisis.find('.crisis-fatalities');
        let newCrisisNumberOfCivilianDeaths = newCrisis.find('.crisis-number-of-civilian-deaths');
        let newCrisisNumberOfArmedActiveAgents  = newCrisis.find('.crisis-number-of-armed-active-agents');
        let newCrisisDescriptionInput = newCrisis.find('.crisis-description');
         
        let url = newCrisis.find('.crisis-recent-event-url').val();
        let newCrisisRecentEventImage = newCrisis.find('.preview').attr('src');
        
        if (url) {
            url = (url.indexOf('://') === -1) ? 'http://' + url: url;
        }
        
        crisisProfiles.push({
            'title': newCrisisTitleInput.val(),
            'date': newCrisisDateInput.val(),
            'end-date': newCrisisEndDateInput.val(),
            'country': newCrisisCountryInput.val(),
            'number-of-events': newCrisisNumberOfEvents.val(),
            'fatalities': newCrisisFatalities.val(),
            'number-of-civilian-deaths': newCrisisNumberOfCivilianDeaths.val(),
            'number-of-armed-active-agents': newCrisisNumberOfArmedActiveAgents.val(),
            'description': newCrisisDescriptionInput.val(),
            'recent-event-url': url,
            'recent-event-img': newCrisisRecentEventImage
        }); 

        refreshCrisisList();

        newCrisis.find('input').val('');
        newCrisis.find('.preview').attr('src', '');

        hideModal();
    });

    $('#edit-crisis-btn').on('click', function() {
        let ecm = $('#edit-crisis-modal');
         
        let index = ecm.data('crisis-index');
        let cp = crisisProfiles[index];

        cp.title = ecm.find('.crisis-title').val(); 
        cp.country = ecm.find('.crisis-country option:selected').val();
        cp.date = ecm.find('.crisis-date').val();
        cp['end-date'] = ecm.find('.crisis-end-date').val();
        cp['number-of-events'] = ecm.find('.crisis-number-of-events').val();
        cp['fatalities'] = ecm.find('.crisis-fatalities').val();
        cp['number-of-civilian-deaths'] = ecm.find('.crisis-number-of-civilian-deaths').val();
        cp['number-of-armed-active-agents'] = ecm.find('.crisis-number-of-armed-active-agents').val();
        cp.description = ecm.find('.crisis-description').val();
         
        let url = ecm.find('.crisis-recent-event-url').val();
        if (url) {
            url = (url.indexOf('://') === -1) ? 'http://' + url: url;
        }

        cp['recent-event-url'] = url;
        cp['recent-event-img'] = ecm.find('.preview').attr('src');

        refreshCrisisList();
        hideModal();
    });

    function populateCountries(target) {
        const keys = Object.keys(acledCountriesByCode);
        keys.sort((a, b) => acledCountriesByCode[a].localeCompare(acledCountriesByCode[b]));

        keys.forEach(key => {
            if($(`${target} option[value="${key}"]`).length === 0) {
                $(`<option value="${key}">${acledCountriesByCode[key]}</option>`).appendTo($(target));
            }  
        });
    }

    $('#timeline-country-select').on('change', function() {
        if($(this).val()) {
            $('#add-timeline-element-btn').prop('disabled', false);
            $.ajax({
                type: "GET",
                url: $(this).data('target')+$(this).val(), 
                success: function(response) {
                    timelineData = JSON.parse(response);
                    if($.isArray(timelineData)) {
                        timelineData = {'staticImage': false, 'timelineElements': timelineData };
                    }
                    loadTimelineData();
                }
            });

        } else {
            $('#add-timeline-element-btn').prop('disabled', true);
        } 
    });
     
     $('#report-country-select').on('change', function() {
        if($(this).val()) {
            $('#country-reports input').prop('disabled', false);
            $('#country-reports button').prop('disabled', false);
            $.ajax({
                type: "GET",
                url: $(this).data('target')+$(this).val(), 
                success: function(response) {
                    reportData = JSON.parse(response);
                    loadReportData();
                }
            });

        } else {
            $('#country-reports input').prop('disabled', true);
            $('#country-reports button').prop('disabled', true);
        } 
    });

    $('#timeline-elements').on('click', '.timeline-element img', function() {
        $(this).closest('.timeline-element').find('input').click().on('change', function() {
            if (this.files && this.files[0]) {
                var fr = new FileReader();
                let that = this;

                fr.addEventListener("load", function(e) {
                    $(that).closest('.timeline-element').find('img')[0].src = e.target.result;
                }); 

                fr.readAsDataURL(this.files[0]);
            }
        });
    });

    $('#timeline-use-static-check').on('change', function() {
        if ($(this).prop('checked')) {
            $('#timeline-elements')[0].style.display = 'none';
            $('#timeline-static-image').show();
        } else {
            $('#timeline-static-image').hide();
            $('#timeline-elements')[0].style.display = 'flex';
        }
    }); 

    $('#add-timeline-element-btn').prop('disabled', true);
    $('#country-reports input').prop('disabled', true);
     
    refreshCrisisList();
    loadRecentEvent();

     
    function addCrisisElement(index, title, date, endDate, country, description, recentEventImage, recentEventUrl){
        let crisisElement = $('.crisis-profile-template').clone().removeClass('crisis-profile-template').addClass('crisis-profile').appendTo($('#crisis-profile-list .content'));
         
        crisisElement.find('.crisis-title').text(title);
        crisisElement.find('.crisis-date').text(date + ' to ' + (endDate? endDate : '-'));
        crisisElement.find('.crisis-country').text(acledCountriesByCode[country]);
        crisisElement.find('.crisis-description').text(description);
         
        crisisElement.css('display', 'flex');

        crisisElement.data('index', index);

        crisisElement.find('.btn-delete').on('click', function(){
            let index = $(this).closest('.crisis-profile').data('index');
            crisisProfiles.splice(index, 1);
            refreshCrisisList();
        });
        crisisElement.find('.btn-edit').on('click', function() {
            editCrisis(this);
        });

        if(recentEventImage) {
            let re = crisisElement.find('.crisis-recent-event');
            re.find('img').attr('src', recentEventImage);
            re.find('a').prop('href', recentEventUrl);
        }
    }
     
    function refreshCrisisList(){
        $('#crisis-profile-list .content').empty();

        for (let i=0; i<crisisProfiles.length; i++) {
            let ccp = crisisProfiles[i];
            addCrisisElement(i, ccp.title, ccp.date, ccp['end-date'], ccp.country, ccp.description, ccp['recent-event-img'], ccp['recent-event-url']);
        }
    }

    $('.tab').on('click', function() {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        let target = $(this).data('target');
        $(target).siblings('section').hide();
        $(target).show();
    });

    $('.tab').eq(0).trigger('click');
});

function showModal(modalSelector) {
    $('#modal-container').fadeIn('fast', function() {
        $(modalSelector).slideDown('fast');
    });
}
function hideModal() {
    $('.modal').slideUp('fast', function() {
        $('#modal-container').fadeOut('fast');
    });
}

function showProgress(buttonSelector) {
    $(buttonSelector).prop('disabled', true);
    $(buttonSelector).closest('.save-button-container').find('.fa-save').hide();
    $(buttonSelector).closest('.save-button-container').find('.fa-spin').show();
}
 
function hideProgress(buttonSelector) {
    $(buttonSelector).prop('disabled', false);
    $(buttonSelector).closest('.save-button-container').find('.fa-spin').hide();
    $(buttonSelector).closest('.save-button-container').find('.fa-save').show();
}

function getCountryKey(country) {
    return country.toLowerCase().split(' ').join('_');
}

function submitCarouselData(caller, formSelector, urlInputSelector) {
    showProgress(caller);
    let url = $(urlInputSelector).val();
    url = (url.indexOf('://') === -1) ? 'http://' + url: url;
    $(urlInputSelector).val(url);


    $(formSelector).find('.url-input').val(url);
     
    $.ajax({
        type: 'POST',
        url: $(formSelector).data('target'),
        data: $(formSelector).serialize(),
        success: function(response) {
            if(response && response=='success') {
                let successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('.input-group'));
                setTimeout(()=>{successMsg.remove();}, 1000);
                hideProgress(caller);
            }
        },
        error: function(error) {
            let errorMsg = $('<p class="error-msg">Failed to save!</p>').appendTo($(caller).closest('.input-group'));
            setTimeout(()=>{errorMsg.hide();}, 1000);
            hideProgress(caller);
        }
    });
}

function submitCrisisProfiles(caller) {
    showProgress(caller);
    
    $('#crisis-profiles-input').val(JSON.stringify(crisisProfiles)); 
     
    $.ajax({
        type: 'POST',
        url: $('#crisis-profiles-form').data('target'), 
        data: $('#crisis-profiles-form').serialize(),
        success: function(response) {
            console.info(response);
            if(response && response=='success') {
                let successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('#crisis-profile-report'));
                setTimeout(()=>{successMsg.remove();}, 1000);
                hideProgress(caller);
            }
        },
        error: function(error) {
            console.error(error);
            let errorMsg = $('<p class="error-msg">Failed to save!</p>').appendTo($(caller).closest('#crisis-profile-report'));
            setTimeout(()=>{errorMsg.remove();}, 1000);
            hideProgress(caller);
        }
    });
}

function submitTimelineCountry(caller) {
    if(!$('#timeline-country-select').val()) {
        return;
    }
    showProgress(caller);
    grabTimelineData();

    $('#timeline-country-data-input').val(JSON.stringify(timelineData));
    $('#timeline-country-name-input').val($('#timeline-country-select option:selected').text());

    $.ajax({
        type: 'POST',
        url: $('#timeline-country-form').data('target') + $('#timeline-country-select').val(),
        data: $('#timeline-country-form').serialize(),
        success: function(response) {
            console.info(response);
            if(response && response=='success') {
                let successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('#timeline'));
                setTimeout(()=>{successMsg.remove();}, 1000);
                hideProgress(caller);
            }
        }
    });        
}

function submitReportCountry(caller) {
    if(!$('#report-country-select').val()) {
        return;
    }

    if (grabReportData()) {
        showProgress(caller);

        $('#report-country-data-input').val(JSON.stringify(reportData));
        $('#report-country-name-input').val($('#report-country-select option:selected').text());

        $.ajax({
            type: 'POST',
            url: $('#report-country-form').data('target') + $('#report-country-select').val(),
            data: $('#report-country-form').serialize(),
            success: function(response) {
                console.info(response);
                if(response && response=='success') {
                    let successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('#country-reports'));
                    setTimeout(()=>{successMsg.remove();}, 1000);
                }
                hideProgress(caller);
                loadReportData();
            },
            error: function(error) {
                console.error(error);
                hideProgress(caller);
            }
        });
    }
}

function submitRecentEvent(caller) {
    if ( !grabRecentEventData() ) {
        return;
    }
    showProgress(caller);
    $('#recent-event-data-input').val(JSON.stringify(recentEvent));

    $.ajax({
        type: 'POST',
        url: $('#recent-event-form').data('target'),
        data: $('#recent-event-form').serialize(),
        success: function(response) {
            console.info(response);
            if(response && response=='success') {
                let successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('#recent-event'));
                setTimeout(()=>{successMsg.remove();}, 1000);
            }
            hideProgress(caller);
        },
        error: function(error) {
            console.error(error);
            hideProgress(caller);
        } 
    });
}

function addTimelineElement(num='00', title='Title', description='Description', img=null) {
    if ($('.timeline-element').length >= 6) {
        return;
    }
    let newElement = $('.timeline-element-template').clone().removeClass('timeline-element-template').addClass('timeline-element');
    newElement.appendTo($('#timeline-elements'));
    newElement.find('.number').find('span').text(num);

    let heading = newElement.find('h5');
    heading.text(title);
    heading.on('click', () => { document.execCommand('selectAll', false, null); });

    let desc = newElement.find('p');
    desc.text(description);
    desc.on('click', () => { document.execCommand('selectAll', false, null); });

    if(img) {
        newElement.find('img').attr('src', img);
    }
    newElement.find('button').on('click', function() {
        $(this).closest('.timeline-element').remove();
    });
}

function loadTimelineData() {
    if (timelineData.staticImage) {
        $('#timeline-static-image-preview').attr('src', timelineData.img);
        $('#timeline-use-static-check').prop('checked', true);
    } else {
        $('#timeline-use-static-check').prop('checked', false);
        $('#timeline-elements').empty();

        if(timelineData.timelineElements) {
            for(let i=0; i<timelineData.timelineElements.length; i++) {
                let cd=timelineData.timelineElements[i];
                addTimelineElement(cd.num, cd.title, cd.description, cd.img);
            }
        }
    }
    $('#timeline-use-static-check').trigger('change');
}

function grabTimelineData() {
    timelineData = {};
    if ($('#timeline-use-static-check').prop('checked')) {
        timelineData.staticImage = true;
        timelineData.img = $('#timeline-static-image-preview').attr('src');
    } else {
        timelineData.staticImage = false;
        timelineData.timelineElements = [];

        $('.timeline-element').each(function() {
            const el = $(this);
            timelineData.timelineElements.push({
                'num': el.find('.number').find('span').text(),
                'title': el.find('h5').text(),
                'description': el.find('p').text(),
                'img': el.find('img').attr('src')
            });
        });
    }
}

function loadReportData() {
    let cr = $('#country-reports');
    cr.find('input').val('');
    cr.find('#report-img-preview').attr('src', '');

    if (reportData.title) {
        cr.find('#report-title-input').val(reportData.title);
    }
    if (reportData.summary) {
        cr.find('#report-summary-input').val(reportData.summary);
    }
    if (reportData.date) {
        cr.find('#report-date-input').val(reportData.date);
    }

    if (reportData.url) {
        cr.find('#report-url-input').val(reportData.url);
    }
     
    if (reportData.img && reportData.img.length > 0) {
        cr.find('#report-img-preview').attr('src', reportData.img);
    }
}

function grabReportData() {
    reportData = {};
    const cr = $('#country-reports');
    
    let title = cr.find('#report-title-input').val();
    let summary = cr.find('#report-summary-input').val();
    let date = cr.find('#report-date-input').val();
    let url = cr.find('#report-url-input').val();
    url = (url.indexOf('://') === -1) ? 'http://' + url: url;

    let img = cr.find('#report-img-preview').attr('src');

    if(title && summary && date && url) {
        reportData.title = title;
        reportData.summary = summary;
        reportData.date = date;
        reportData.url = url;
        reportData.img = img;
        return true;
    } else {
        alert('please fill all the report data first');
    }
    return false;
}

function grabRecentEventData() {
    recentEvent = {};

    let url = $('#recent-event-url-input').val();
    url = (url.indexOf('://') === -1) ? 'http://' + url : url;
    $('#recent-event-url-input').val(url);

    let img = $('#recent-event-image-preview').attr('src');

    if(url && img) {
        recentEvent.url = url;
        recentEvent.img = img;

        return true;
    } else {
        alert('please fill all event data first');
    }

    return false;
}

function loadRecentEvent() {
    if (recentEvent.url) {
        $('#recent-event-url-input').val(recentEvent.url);
    }
    if (recentEvent.img && recentEvent.img.length > 0) {
        $('#recent-event-image-preview').attr('src', recentEvent.img);
    }
}

function editCrisis(caller) {
    let index = $(caller).closest('.crisis-profile').data('index');
    let cp = crisisProfiles[index];

    let ecm = $('#edit-crisis-modal');

    ecm.find('.crisis-title').val(cp.title);
    ecm.find('.crisis-country').val(cp.country);
    ecm.find('.crisis-date').val(cp.date);
    ecm.find('.crisis-end-date').val(cp['end-date']);
    ecm.find('.crisis-number-of-events').val(cp['number-of-events']);
    ecm.find('.crisis-fatalities').val(cp.fatalities);
    ecm.find('.crisis-number-of-civilian-deaths').val(cp['number-of-civilian-deaths']);
    ecm.find('.crisis-number-of-armed-active-agents').val(cp['number-of-armed-active-agents']);
    ecm.find('.crisis-description').val(cp.description);

    ecm.find('.crisis-recent-event-url').val(cp['recent-event-url']);
    ecm.find('.preview').attr('src', cp['recent-event-img'] || '');

    ecm.data('crisis-index', index);

    showModal('#edit-crisis-modal');
}
 
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
