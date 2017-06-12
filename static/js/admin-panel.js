let timelineData = [];

$(document).ready(function() {
    $('#carousel input').on('change', function() {
        if (this.files && this.files[0]) {

            var fr = new FileReader();

            let that = this;

            fr.addEventListener("load", function(e) {
                $(that).closest('.input-group').find('.preview')[0].src = e.target.result;
                $($(that).data('target-input')).val(e.target.result);
            }); 

            fr.readAsDataURL(this.files[0]);
        }
    });


    $('#add-crisis-btn').on('click', function() {
        let newCrisis = $('#add-crisis-modal .content');
        let newCrisisTitleInput = newCrisis.find('.crisis-title');
        let newCrisisDateInput = newCrisis.find('.crisis-date');
        let newCrisisCountryInput = newCrisis.find('.crisis-country');
        let newCrisisDescriptionInput = newCrisis.find('.crisis-description');
        
        crisisProfiles.push({'title': newCrisisTitleInput.val(), 'date': newCrisisDateInput.val(), 'country': newCrisisCountryInput.val(), 'description': newCrisisDescriptionInput.val()}); 
        // crisisProfiles.sort(function(a, b) { return a.country - b.country; });
        refreshCrisisList();

        newCrisis.find('input').val('');
        hideModal();
    });

    $('#add-timeline-country-btn').on('click', function() {
        hideModal('#add-timeline-country-modal');
         
        newCountryName = $('#timeline-country-input').val();
        $('#timeline-country-input').val('');
         
        if($('#timeline-country-select option[value="'+getCountryKey(newCountryName)+'"]').length > 0) {
            alert('Country already exists');
        } else {
            $('<option value="'+getCountryKey(newCountryName)+'">'+newCountryName+'</option>').appendTo($('#timeline-country-select'));
        }
    });

    $('#timeline-country-select').on('change', function() {
        if($(this).val()) {
            $('#add-timeline-element-btn').prop('disabled', false);
            $.ajax({
                type: "GET",
                url: $(this).data('target')+$(this).val(), 
                success: function(response) {
                    timelineData = JSON.parse(response);
                    loadTimelineData();

                }
            });

        } else {
            $('#add-timeline-element-btn').prop('disabled', true);
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

     
    $('#add-timeline-element-btn').prop('disabled', true);
    loadData();

    function loadData() {
        if(carouselImage1) { 
            $('#carousel #image-1-container .preview')[0].src = carouselImage1;
            $('#image-1-input').val(carouselImage1);
        }
        if(carouselImage2) {
            $('#carousel #image-2-container .preview')[0].src = carouselImage2;
            $('#image-2-input').val(carouselImage2);
        }
        if(carouselImage3) {
            $('#carousel #image-3-container .preview')[0].src = carouselImage3;
            $('#image-3-input').val(carouselImage3);
        }
        

        refreshCrisisList();
    }
     
    function addCrisisElement(title, date, country, description){
        let crisisElement = $('.crisis-profile-template').clone().removeClass('crisis-profile-template').addClass('crisis-profile').appendTo($('#crisis-profile-list .content'));
         
        crisisElement.find('.crisis-title').text(title);
        crisisElement.find('.crisis-date').text(date);
        crisisElement.find('.crisis-country').text(country);
        crisisElement.find('.crisis-description').text(description);
         
        crisisElement.css('display', 'flex');
    }
     
    function refreshCrisisList(){
        $('#crisis-profile-list .content').empty();

        for (let i=0; i<crisisProfiles.length; i++) {
            let ccp = crisisProfiles[i];
            addCrisisElement(ccp.title, ccp.date, ccp.country, ccp.description);
        }
    }

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

function submitCarouselData(caller, formSelector) {
    showProgress(caller);
     
    $.ajax({
        type: 'POST',
        url: $(formSelector).data('target'),
        data: $(formSelector).serialize(),
        success: function(response) {
            if(response && response=='success') {
                let successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('.input-group'));
                setTimeout(()=>{successMsg.hide();}, 1000);
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
            console.log(response);
            if(response && response=='success') {
                let successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('#crisis-profile-report'));
                setTimeout(()=>{successMsg.hide();}, 1000);
                hideProgress(caller);
            }
        },
        error: function(error) {
            let errorMsg = $('<p class="error-msg">Failed to save!</p>').appendTo($(caller).closest('#crisis-profile-report'));
            setTimeout(()=>{errorMsg.hide();}, 1000);
            hideProgress(caller);
        }
    });
}

function submitTimelineCountry(caller) {
    console.log($('#timeline-country-form').data('target') + $('#timeline-country-select').val());
    if(!$('#timeline-country-select').val()) {
        console.log('bye');
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
            console.log(response);
            if(response && response=='success') {
                let successMsg = $('<p class="success-msg">Saved successfully!</p>').appendTo($(caller).closest('#timeline'));
                setTimeout(()=>{successMsg.hide();}, 1000);
                hideProgress(caller);
            }
        }
    });        
}

function addTimelineElement(num='00', title='Title', description='Description', img=null) {
    let newElement = $('.timeline-element-template').clone().removeClass('timeline-element-template').addClass('timeline-element');
    newElement.appendTo($('#timeline-elements'));
    newElement.find('.number').find('span').text(num);
    newElement.find('h5').text(title);
    newElement.find('p').text(description);
    if(img) {
        newElement.find('img').prop('src', img);
    }
}

function loadTimelineData() {
    $('#timeline-elements').empty();
    for(let i=0; i<timelineData.length; i++) {
        let cd=timelineData[i];
        addTimelineElement(cd.num, cd.title, cd.description, cd.img);
    }
}

function grabTimelineData() {
    timelineData = [];
    $('.timeline-element').each(function() {
        el = $(this);
        timelineData.push({
            'num': el.find('.number').find('span').text(),
            'title': el.find('h5').text(),
            'description': el.find('p').text(),
            'img': el.find('img').prop('src')
        });
    });
}
