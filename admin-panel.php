<div id="dashboard-form">

    <h1>ACLED dashboard</h1>

    <section id="carousel">
        <h2>Carousel</h2>
        <div class="input-group" id="image-1-container">
            <label>Image #1</label>
            <input type="file" name="image-1" accept="image/*" data-target-input="#image-1-input">
            <img class="preview" alt="no preview available">
            <div class="save-button-container">
                <i class="fa fa-save"></i>
                <i class="fa fa-spin fa-circle-o-notch" hidden></i>
                <button onclick="submitCarouselData(this, '#carousel-image1-form')">Save</button>
            </div>
        </div>
        <div class="input-group" id="image-2-container">
            <label>Image #2</label>
            <input type="file" name="image-2" accept="image/*" data-target-input="#image-2-input">
            <img class="preview" alt="no preview available">
             
            <div class="save-button-container">
                <i class="fa fa-save"></i>
                <i class="fa fa-spin fa-circle-o-notch" hidden></i>
                <button onclick="submitCarouselData(this, '#carousel-image2-form')">Save</button>
            </div>
        </div>
        <div class="input-group" id="image-3-container">
            <label>Image #3</label>
            <input type="file" name="image-3" accept="image/*" data-target-input="#image-3-input">
            <img class="preview" alt="no preview available">
             
             <div class="save-button-container">
                 <i class="fa fa-save"></i>
                 <i class="fa fa-spin fa-circle-o-notch" hidden></i>
                 <button onclick="submitCarouselData(this, '#carousel-image3-form')">Save</button>
             </div>
        </div>
    </section>

    <section id="crisis-profile-report">
        <header>
            <h2>Crisis profile</h2>
            <button onclick="showModal('#add-crisis-modal');">Add crisis</button>
        </header>
        <div id="crisis-profile-list">
            <header>
                <label class="crisis-title">Title</label>
                <label class="crisis-date">Date</label>
                <label class="crisis-country">Country</label>
                <label class="crisis-description">Description</label>
                <label class="actions">Actions</label>
            </header>
            <div class="content">
            </div>
        </div>
        <div class="save-button-container">
            <i class="fa fa-save"></i>
            <i class="fa fa-spin fa-circle-o-notch" hidden></i>
            <button onclick="submitCrisisProfiles(this);">Save</button>
        </div>
        
    </section>

    <form id="carousel-image1-form" method="POST" data-target="<?php echo get_home_url().'/?pagename=post__carousel_image1'; ?>"/>
        <input type="text" value="" name="carousel-image1" id="image-1-input" hidden> 
    </form>
    <form id="carousel-image2-form" method="POST" data-target="<?php echo get_home_url().'/?pagename=post__carousel_image2'; ?>">
        <input type="text" value="" name="carousel-image2" id="image-2-input" hidden> 
    </form>
    <form id="carousel-image3-form" method="POST" data-target="<?php echo get_home_url().'/?pagename=post__carousel_image3'; ?>">
        <input type="text" value="" name="carousel-image3" id="image-3-input" hidden> 
    </form>
    <form id="crisis-profiles-form" method="POST" data-target="<?php echo get_home_url().'/?pagename=post__crisis_profiles'; ?>">
        <input type="text" value="" name="crisis-profiles" id="crisis-profiles-input" hidden>
    </form>
</div>
 
<div class="crisis-profile-template" hidden>
    <div class="crisis-title"></div>
    <date class="crisis-date"></date>
    <div class="crisis-country"></div>
    <div class="crisis-description"></div>
    <div class="actions"></div>
</div> 

<div id="modal-container" hidden>
    <div id="add-crisis-modal" class="modal" hidden>
        <header>
            <h3>Add new crisis</h3>
        </header>
        <div class="content">
            <div class="input-group">
                <label>Title</label>
                <input type="text" name="crisis-title" class="crisis-title">
            </div>
            <div class="input-group">
                <label>Country</label>
                <input type="text" name="crisis-country" class="crisis-country">
            </div>
            <div class="input-group">
                <label>Date</label>
                <input type="date" name="crisis-date" class="crisis-date">
            </div>
            <div class="input-group"> 
                <label>Description</label>
                <input type="text" name="crisis-description" class="crisis-description">
            </div>
             <div class="action-buttons">
                <button onclick="hideModal()">Cancel</button>
                <button id="add-crisis-btn">Add crisis</button>
            </div>
        </div>
    </div>
     
    <div id="edit-crisis-modal" class="modal" hidden>
        <header>
            <h3>Edit crisis</h3>
        </header>
        <div class="content">
            <div class="input-group">
                <label>Title</label>
                <input type="text" name="crisis-title" class="crisis-title">
            </div>
            <div class="input-group">
                <label>Country</label>
                <input type="text" name="crisis-country" class="crisis-country">
            </div>
            <div class="input-group">
                <label>Date</label>
                <input type="date" name="crisis-date" class="crisis-date">
            </div>
            <div class="input-group"> 
                <label>Description</label>
                <input type="text" name="crisis-description" class="crisis-description">
            </div>
            <div class="action-buttons">
                <button onclick="hideModal()">Cancel</button>
                <button id="edit-crisis-btn">Save</button>
            </div>
        </div>
    </div>

</div>
