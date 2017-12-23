"use strict";

var timelineData = [];
var reportData = {};

var acledCountriesByCode = {
    "012": "Algeria",
    "024": "Angola",
    "072": "Botswana",
    "108": "Burundi",
    "120": "Cameroon",
    "140": "Central African Republic",
    "148": "Chad",
    "178": "Republic of Congo",
    "180": "Democratic Republic of Congo",
    "204": "Benin",
    "226": "Equatorial Guinea",
    "231": "Ethiopia",
    "232": "Eritrea",
    "262": "Djibouti",
    "266": "Gabon",
    "270": "Gambia",
    "288": "Ghana",
    "324": "Guinea",
    "384": "Ivory Coast",
    "404": "Kenya",
    "426": "Lesotho",
    "430": "Liberia",
    "434": "Libya",
    "450": "Madagascar",
    "454": "Malawi",
    "466": "Mali",
    "478": "Mauritania",
    "504": "Morocco",
    "508": "Mozambique",
    "516": "Namibia",
    "562": "Niger",
    "566": "Nigeria",
    "624": "Guinea-Bissau",
    "646": "Rwanda",
    "686": "Senegal",
    "694": "Sierra Leone",
    "706": "Somalia",
    "710": "South Africa",
    "716": "Zimbabwe",
    "728": "South Sudan",
    "729": "Sudan",
    "748": "Swaziland",
    "768": "Togo",
    "788": "Tunisia",
    "800": "Uganda",
    "818": "Egypt",
    "834": "Tanzania",
    "854": "Burkina Faso",
    "894": "Zambia"
};

var addAcledCountry = function addAcledCountry(iso, name) {
    if (!acledCountriesByCode[iso]) {
        acledCountriesByCode[iso] = name;
    }
};

$(document).ready(function () {
    $.ajax({
        url: 'https://api.acleddata.com/acled/read?limit=0&fields=iso|country',
        method: 'GET',
        success: function success(response) {
            for (var i = 0; i < response.data.length; i++) {
                var cd = response.data[i];
                var iso = cd.iso.padStart(3, '0');
                addAcledCountry(iso, cd.country);
            }

            populateCountries('#timeline-country-select');
            populateCountries('#report-country-select');
            populateCountries('#edit-crisis-country-select');
            populateCountries('#add-crisis-country-select');
        }
    });

    var loadImage = function loadImage(input, targetSelector) {
        if (input.files && input.files[0]) {
            var fr = new FileReader();

            fr.addEventListener("load", function (e) {
                $(targetSelector)[0].src = e.target.result;
            });

            fr.readAsDataURL(input.files[0]);
        }
    };

    $('#report-image-input').on('change', function () {
        loadImage(this, '#report-img-preview');
    });

    $('#recent-event-image-input').on('change', function () {
        loadImage(this, '#recent-event-image-preview');
    });

    $('#timeline-static-image-input').on('change', function () {
        loadImage(this, '#timeline-static-image-preview');
    });

    $('#add-crisis-recent-event-image-input').on('change', function () {
        loadImage(this, '#add-crisis-recent-event-image-preview');
    });

    $('#edit-crisis-recent-event-image-input').on('change', function () {
        loadImage(this, '#edit-crisis-recent-event-image-preview');
    });

    $('#add-crisis-btn').on('click', function () {
        var newCrisis = $('#add-crisis-modal .content');
        var newCrisisTitleInput = newCrisis.find('.crisis-title');
        var newCrisisDateInput = newCrisis.find('.crisis-date');
        var newCrisisEndDateInput = newCrisis.find('.crisis-end-date');
        var newCrisisCountryInput = newCrisis.find('.crisis-country option:selected');
        var newCrisisDescriptionInput = newCrisis.find('.crisis-description');

        var url = newCrisis.find('.crisis-recent-event-url').val();
        var newCrisisRecentEventImage = newCrisis.find('.preview').prop('src');

        if (url) {
            url = url.indexOf('://') === -1 ? 'http://' + url : url;
        }

        crisisProfiles.push({ 'title': newCrisisTitleInput.val(), 'date': newCrisisDateInput.val(), 'end-date': newCrisisEndDateInput.val(), 'country': newCrisisCountryInput.val(), 'description': newCrisisDescriptionInput.val(), 'recent-event-url': url, 'recent-event-img': newCrisisRecentEventImage });
        refreshCrisisList();

        newCrisis.find('input').val('');
        newCrisis.find('.preview').prop('src', '');

        hideModal();
    });

    $('#edit-crisis-btn').on('click', function () {
        var ecm = $('#edit-crisis-modal');

        var index = ecm.data('crisis-index');
        var cp = crisisProfiles[index];

        cp.title = ecm.find('.crisis-title').val();
        cp.country = ecm.find('.crisis-country option:selected').val();
        cp.date = ecm.find('.crisis-date').val();
        cp['end-date'] = ecm.find('.crisis-end-date').val();
        cp.description = ecm.find('.crisis-description').val();

        var url = ecm.find('.crisis-recent-event-url').val();
        if (url) {
            url = url.indexOf('://') === -1 ? 'http://' + url : url;
        }

        cp['recent-event-url'] = url;
        cp['recent-event-img'] = ecm.find('.preview').prop('src');

        refreshCrisisList();
        hideModal();
    });

    function populateCountries(target) {
        var keys = Object.keys(acledCountriesByCode);
        keys.sort(function (a, b) {
            return acledCountriesByCode[a].localeCompare(acledCountriesByCode[b]);
        });

        keys.forEach(function (key) {
            if ($(target + " option[value=\"" + key + "\"]").length === 0) {
                $("<option value=\"" + key + "\">" + acledCountriesByCode[key] + "</option>").appendTo($(target));
            }
        });
    }

    $('#timeline-country-select').on('change', function () {
        if ($(this).val()) {
            $('#add-timeline-element-btn').prop('disabled', false);
            $.ajax({
                type: "GET",
                url: $(this).data('target') + $(this).val(),
                success: function success(response) {
                    timelineData = JSON.parse(response);
                    if ($.isArray(timelineData)) {
                        timelineData = { 'staticImage': false, 'timelineElements': timelineData };
                    }
                    loadTimelineData();
                }
            });
        } else {
            $('#add-timeline-element-btn').prop('disabled', true);
        }
    });

    $('#report-country-select').on('change', function () {
        if ($(this).val()) {
            $('#country-reports input').prop('disabled', false);
            $.ajax({
                type: "GET",
                url: $(this).data('target') + $(this).val(),
                success: function success(response) {
                    reportData = JSON.parse(response);
                    loadReportData();
                }
            });
        } else {
            $('#country-reports input').prop('disabled', true);
        }
    });

    $('#timeline-elements').on('click', '.timeline-element img', function () {
        $(this).closest('.timeline-element').find('input').click().on('change', function () {
            if (this.files && this.files[0]) {

                var fr = new FileReader();

                var that = this;

                fr.addEventListener("load", function (e) {
                    $(that).closest('.timeline-element').find('img')[0].src = e.target.result;
                });

                fr.readAsDataURL(this.files[0]);
            }
        });
    });

    $('#timeline-use-static-check').on('change', function () {
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

    function addCrisisElement(index, title, date, endDate, country, description, recentEventImage, recentEventUrl) {
        var crisisElement = $('.crisis-profile-template').clone().removeClass('crisis-profile-template').addClass('crisis-profile').appendTo($('#crisis-profile-list .content'));

        crisisElement.find('.crisis-title').text(title);
        crisisElement.find('.crisis-date').text(date + ' to ' + (endDate ? endDate : '-'));
        crisisElement.find('.crisis-country').text(acledCountriesByCode[country]);
        crisisElement.find('.crisis-description').text(description);

        crisisElement.css('display', 'flex');

        crisisElement.data('index', index);

        crisisElement.find('.btn-delete').on('click', function () {
            var index = $(this).closest('.crisis-profile').data('index');
            crisisProfiles.splice(index, 1);
            refreshCrisisList();
        });
        crisisElement.find('.btn-edit').on('click', function () {
            editCrisis(this);
        });

        if (recentEventImage) {
            var re = crisisElement.find('.crisis-recent-event');
            re.find('img').prop('src', recentEventImage);
            re.find('a').prop('href', recentEventUrl);
        }
    }

    function refreshCrisisList() {
        $('#crisis-profile-list .content').empty();

        for (var i = 0; i < crisisProfiles.length; i++) {
            var ccp = crisisProfiles[i];
            addCrisisElement(i, ccp.title, ccp.date, ccp['end-date'], ccp.country, ccp.description, ccp['recent-event-img'], ccp['recent-event-url']);
        }
    }

    $('.tab').on('click', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        var target = $(this).data('target');
        $(target).siblings('section').hide();
        $(target).show();
    });

    $('.tab').eq(0).trigger('click');
});

function showModal(modalSelector) {
    $('#modal-container').fadeIn('fast', function () {
        $(modalSelector).slideDown('fast');
    });
}
function hideModal() {
    $('.modal').slideUp('fast', function () {
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
    var url = $(urlInputSelector).val();
    url = url.indexOf('://') === -1 ? 'http://' + url : url;
    $(urlInputSelector).val(url);

    $(formSelector).find('.url-input').val(url);

    $.ajax({
        type: 'POST',
        url: $(formSelector).data('target'),
        data: $(formSelector).serialize(),
        success: function success(response) {
            if (response && response == 'success') {
                var successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('.input-group'));
                setTimeout(function () {
                    successMsg.hide();
                }, 1000);
                hideProgress(caller);
            }
        },
        error: function error(_error) {
            var errorMsg = $('<p class="error-msg">Failed to save!</p>').appendTo($(caller).closest('.input-group'));
            setTimeout(function () {
                errorMsg.hide();
            }, 1000);
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
        success: function success(response) {
            console.log(response);
            if (response && response == 'success') {
                var successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('#crisis-profile-report'));
                setTimeout(function () {
                    successMsg.hide();
                }, 1000);
                hideProgress(caller);
            }
        },
        error: function error(_error2) {
            var errorMsg = $('<p class="error-msg">Failed to save!</p>').appendTo($(caller).closest('#crisis-profile-report'));
            setTimeout(function () {
                errorMsg.hide();
            }, 1000);
            hideProgress(caller);
        }
    });
}

function submitTimelineCountry(caller) {
    if (!$('#timeline-country-select').val()) {
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
        success: function success(response) {
            console.log(response);
            if (response && response == 'success') {
                var successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('#timeline'));
                setTimeout(function () {
                    successMsg.hide();
                }, 1000);
                hideProgress(caller);
            }
        }
    });
}

function submitReportCountry(caller) {
    if (!$('#report-country-select').val()) {
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
            success: function success(response) {
                console.log(response);
                if (response && response == 'success') {
                    var successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('#country-reports'));
                    setTimeout(function () {
                        successMsg.hide();
                    }, 1000);
                }
                hideProgress(caller);
            },
            error: function error(_error3) {
                console.log(_error3);
                hideProgress(caller);
            }
        });
    }
}

function submitRecentEvent(caller) {
    if (!grabRecentEventData()) {
        return;
    }
    showProgress(caller);
    $('#recent-event-data-input').val(JSON.stringify(recentEvent));

    $.ajax({
        type: 'POST',
        url: $('#recent-event-form').data('target'),
        data: $('#recent-event-form').serialize(),
        success: function success(response) {
            console.log(response);
            if (response && response == 'success') {
                var successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('#recent-event'));
                setTimeout(function () {
                    successMsg.hide();
                }, 1000);
            }
            hideProgress(caller);
        },
        error: function error(_error4) {
            console.log(_error4);
            hideProgress(caller);
        }
    });
}

function addTimelineElement() {
    var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '00';
    var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Title';
    var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Description';
    var img = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    if ($('.timeline-element').length >= 6) {
        return;
    }
    var newElement = $('.timeline-element-template').clone().removeClass('timeline-element-template').addClass('timeline-element');
    newElement.appendTo($('#timeline-elements'));
    newElement.find('.number').find('span').text(num);

    var heading = newElement.find('h5');
    heading.text(title);
    heading.on('click', function () {
        document.execCommand('selectAll', false, null);
    });

    var desc = newElement.find('p');
    desc.text(description);
    desc.on('click', function () {
        document.execCommand('selectAll', false, null);
    });

    if (img) {
        newElement.find('img').prop('src', img);
    }
    newElement.find('button').on('click', function () {
        $(this).closest('.timeline-element').remove();
    });
}

function loadTimelineData() {
    if (timelineData.staticImage) {
        $('#timeline-static-image-preview').prop('src', timelineData.img);
        $('#timeline-use-static-check').prop('checked', true);
    } else {
        $('#timeline-use-static-check').prop('checked', false);
        $('#timeline-elements').empty();

        if (timelineData.timelineElements) {
            for (var i = 0; i < timelineData.timelineElements.length; i++) {
                var cd = timelineData.timelineElements[i];
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
        timelineData.img = $('#timeline-static-image-preview').prop('src');
    } else {
        timelineData.staticImage = false;
        timelineData.timelineElements = [];

        $('.timeline-element').each(function () {
            var el = $(this);
            timelineData.timelineElements.push({
                'num': el.find('.number').find('span').text(),
                'title': el.find('h5').text(),
                'description': el.find('p').text(),
                'img': el.find('img').prop('src')
            });
        });
    }
}

function loadReportData() {
    var cr = $('#country-reports');
    $('#country-reports input').val('');
    $('#country-reports .preview').prop('src', '');

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
        cr.find('#report-img-preview').prop('src', reportData.img);
    }
}

function grabReportData() {
    reportData = {};
    var cr = $('#country-reports');

    var title = cr.find('#report-title-input').val();
    var summary = cr.find('#report-summary-input').val();
    var date = cr.find('#report-date-input').val();
    var url = cr.find('#report-url-input').val();
    var img = cr.find('#report-img-preview').prop('src');

    if (title && summary && date && url && img) {
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

    var url = $('#recent-event-url-input').val();
    url = url.indexOf('://') === -1 ? 'http://' + url : url;
    $('#recent-event-url-input').val(url);

    var img = $('#recent-event-image-preview').prop('src');

    if (url && img) {
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
        $('#recent-event-image-preview').prop('src', recentEvent.img);
    }
}

function editCrisis(caller) {
    var index = $(caller).closest('.crisis-profile').data('index');
    var cp = crisisProfiles[index];

    var ecm = $('#edit-crisis-modal');

    ecm.find('.crisis-title').val(cp.title);
    ecm.find('.crisis-country').val(cp.country);
    ecm.find('.crisis-date').val(cp.date);
    ecm.find('.crisis-end-date').val(cp['end-date']);
    ecm.find('.crisis-description').val(cp.description);

    ecm.find('.crisis-recent-event-url').val(cp['recent-event-url']);
    ecm.find('.preview').prop('src', cp['recent-event-img'] || '');

    ecm.data('crisis-index', index);

    showModal('#edit-crisis-modal');
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
//# sourceMappingURL=admin-panel.js.map