
$(document).ready(function() {
    $('#carousel input').on('change', function() {
        if (this.files && this.files[0]) {

            var fr = new FileReader();

            let that = this;

            fr.addEventListener("load", function(e) {
                if (!data['carousel']) {
                    data['carousel'] = {'image-1': "", 'image-2': "", 'image-3': ""};
                }
                data.carousel[$(that).prop('name')] = e.target.result;
                $(that).closest('.input-group').find('.preview')[0].src = e.target.result;
                // document.getElementById("img").src = e.target.result;
            }); 

            fr.readAsDataURL(this.files[0]);
        }
    });

    $('#crisis-profile-report input').on('change', function() {
        if (!data['crisis-profile']) {
            data['crisis-profile'] = {};
        }
        let country = $(this).closest('#crisis-profile-report').find('select').val();
        if(!data['crisis-profile'][country]) {
            data['crisis-profile'][country] = {};
        }
        data['crisis-profile'][country][$(this).prop('name')] = $(this).val();
    });


    $('#dashboard-form').submit(function(e) {
        $('#data-input').val(JSON.stringify(data));
        return true;
    });

    loadData();

    function loadData() {
        if(data['carousel']) {
            if(data.carousel['image-1']) {
                $('#carousel #image-1-container .preview')[0].src = data.carousel['image-1'];
            }
            if(data.carousel['image-2']) {
                $('#carousel #image-2-container .preview')[0].src = data.carousel['image-2'];
            }
            if(data.carousel['image-3']) {
                $('#carousel #image-3-container .preview')[0].src = data.carousel['image-3'];
            }
        }
    }
});



