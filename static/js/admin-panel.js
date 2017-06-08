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
        

        // if(crisisProfiles) {
        //    crisisProfiles = [];
        // } 
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
 
function showProgress(buttonSelector) {
    $(buttonSelector).prop('disabled', false);
    $(buttonSelector).closest('.save-button-container').find('.fa-spin').hide();
    $(buttonSelector).closest('.save-button-container').find('.fa-save').show();
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
            }
        },
        error: function(error) {
            let errorMsg = $('<p class="error-msg">Failed to save!</p>').appendTo($(caller).closest('.input-group'));
            setTimeout(()=>{errorMsg.hide();}, 1000);
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
            }
        },
        error: function(error) {
            let errorMsg = $('<p class="error-msg">Failed to save!</p>').appendTo($(caller).closest('#crisis-profile-report'));
            setTimeout(()=>{errorMsg.hide();}, 1000);
        }
    });
}
