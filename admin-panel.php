<div id="dashboard-form">

    <h1>ACLED dashboard</h1>

    <div class="tabs">
        <!--
        <a class="tab" data-target="#carousel">Carousel</a>
        -->
        <a class="tab" data-target="#crisis-profile-report">Crisis Profile</a>
        <a class="tab" data-target="#country-reports">Country Report</a>
        <a class="tab" data-target="#timeline">Timeline</a>
    </div>

    <!--
    <section id="carousel">
        <h2>Carousel</h2>
        <div class="input-group" id="image-1-container">
            <label>Image #1</label>
            <input type="file" name="image-1" accept="image/*" data-target-input="#image-1-input">
            <img class="preview" alt="no preview available">
            <input type="text"  id="carousel-url-1-input" placeholder="Url">
             
            <div class="save-button-container">
                <i class="fa fa-save"></i>
                <i class="fa fa-spin fa-circle-o-notch" hidden></i>
                <button onclick="submitCarouselData(this, '#carousel-image1-form', '#carousel-url-1-input')">Save</button>
            </div>
        </div>
        <div class="input-group" id="image-2-container">
            <label>Image #2</label>
            <input type="file" name="image-2" accept="image/*" data-target-input="#image-2-input">
            <img class="preview" alt="no preview available">
            <input type="text" name="url-2" id="carousel-url-2-input" placeholder="Url">
             
            <div class="save-button-container">
                <i class="fa fa-save"></i>
                <i class="fa fa-spin fa-circle-o-notch" hidden></i>
                <button onclick="submitCarouselData(this, '#carousel-image2-form', '#carousel-url-2-input')">Save</button>
            </div>
        </div>
        <div class="input-group" id="image-3-container">
            <label>Image #3</label>
            <input type="file" name="image-3" accept="image/*" data-target-input="#image-3-input">
            <img class="preview" alt="no preview available">
            <input type="text" name="url-3" id="carousel-url-3-input" placeholder="Url">
             
             <div class="save-button-container">
                 <i class="fa fa-save"></i>
                 <i class="fa fa-spin fa-circle-o-notch" hidden></i>
                 <button onclick="submitCarouselData(this, '#carousel-image3-form', '#carousel-url-3-input')">Save</button>
             </div>
        </div>
    </section>
    -->

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
                <label class="criris-recent-event">Recent Event</label>
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
<!--
    <section id="recent-event">
        <header>
            <h2>Recent event</h2>
        </header>
        <div class="content">
            <div class="input-group">
                <label>Url</label>
                <input type="text" id="recent-event-url-input">
            </div>
            <div class="input-group"
                <label>Image</label>
                <input type="file"  accept="image/*" id="recent-event-image-input">
            </div>
            <img id="recent-event-image-preview" class="preview" alt="no preview available">
            <div class="save-button-container">
                <i class="fa fa-save"></i>
                <i class="fa fa-spin fa-circle-o-notch" hidden></i>
                <button onclick="submitRecentEvent(this)">Save</button>
            </div>
        </div>
    </section>
-->
     
    <section id="country-reports">
        <header>
            <h2>Country reports</h2>
<!--
            <button onclick="showModal('#add-report-country-modal');">Add country</button>
-->
        </header>
        <div class="content">
            <div class="input-group">
                <label>Country</label>
                <select id="report-country-select" data-target="<?php echo get_home_url().'/?pagename=report_country__'; ?>">
                    <option value="">Select country</option>
                    <?php
                        $report_countries = get_option('report_countries', array());
                        foreach($report_countries as $rk => $rn) {
                            echo '<option value="'.$rk.'">'.$rn.'</option>';
                        }
                    ?>
                </select>
            </div>
            <div class="input-group">
                <label>Title</label>
                <input type="text" id="report-title-input">
            </div>
            <div class="input-group">
                <label>Summary</label>
                <input type="text" id="report-summary-input">
            </div>
            <div class="input-group">
                <label>Date</label>
                <input type="date" id="report-date-input">
            </div>
            <div class="input-group">
                <label>Url</label>
                <input type="text" id="report-url-input">
            </div>
            <div class="input-group">
                <label>Image</label>
                <input type="file"  accept="image/*" id="report-image-input">
            </div>
            <img id="report-img-preview" class="preview" alt="no preview available">
            <div class="save-button-container">
                <i class="fa fa-save"></i>
                <i class="fa fa-spin fa-circle-o-notch" hidden></i>
                <button onclick="submitReportCountry(this)">Save</button>
            </div>
        </div>
    </section>   

    <section id="timeline">
        <header>
            <h2>Timeline</h2>
<!--
            <button onclick="showModal('#add-timeline-country-modal');">Add country</button>
-->
        </header>
        <div class="content">
            <div class="input-group">
            <label>Select country:</label>
                <select id="timeline-country-select" data-target="<?php echo get_home_url().'/?pagename=timeline_country__'; ?>">
                    <option value="">Select country</option>
                    <?php
                        $timeline_countries = get_option('timeline_countries', array());
                        foreach($timeline_countries as $ck => $cn) {
                            echo '<option value="'.$ck.'">'.$cn.'</option>';
                        }
                    ?>
                </select>
            </div>
            <label id="timeline-use-static-check-container"><input type="checkbox" id="timeline-use-static-check">Use static image</label>
            <div id="timeline-static-image">
                <input type="file" accept="image/*" id="timeline-static-image-input">
                <img class="preview" id="timeline-static-image-preview" alt="no preview available">
            </div> 
            <div id="timeline-elements">
            </div>
            <button id="add-timeline-element-btn" onclick="addTimelineElement()">Add timeline element</button>
            <div class="timeline-element-template" hidden>
                <div class="number"><span contenteditable="true">00</span></div>
                <div class="description">
                    <h5 contenteditable="true">Title</h5>
                    <p contenteditable="true">Description</p>
                </div>
                <img alt="click to add image">
                <input type="file" accept="image/*" hidden>
                <button><i class="fa fa-times"></i></button> 
            </div>
            <div class="save-button-container">
                <i class="fa fa-save"></i>
                <i class="fa fa-spin fa-circle-o-notch" hidden></i>
                <button onclick="submitTimelineCountry(this);">Save</button>
            </div>
        </div>
    </section>

    <form id="carousel-image1-form" method="POST" data-target="<?php echo get_home_url().'/?pagename=post__carousel_image1'; ?>"/>
        <input class="url-input" type="text" value="" name="carousel-url1" id="url-1-input" hidden>
        <input type="text" value="" name="carousel-image1" id="image-1-input" hidden> 
    </form>
     
    <form id="carousel-image2-form" method="POST" data-target="<?php echo get_home_url().'/?pagename=post__carousel_image2'; ?>">
        <input class="url-input" type="text" value="" name="carousel-url2" id="url-2-input" hidden>
        <input type="text" value="" name="carousel-image2" id="image-2-input" hidden> 
    </form>
     
    <form id="carousel-image3-form" method="POST" data-target="<?php echo get_home_url().'/?pagename=post__carousel_image3'; ?>">
        <input class="url-input" type="text" value="" name="carousel-url3" id="url-3-input" hidden>
        <input type="text" value="" name="carousel-image3" id="image-3-input" hidden> 
    </form>
     
    <form id="crisis-profiles-form" method="POST" data-target="<?php echo get_home_url().'/?pagename=post__crisis_profiles'; ?>">
        <input type="text" value="" name="crisis-profiles" id="crisis-profiles-input" hidden>
    </form>
     
    <form id="recent-event-form" method="POST" data-target="<?php echo get_home_url().'/?pagename=post__recent_event'; ?>">
        <input type="text" value="" name="recent-event-data" id="recent-event-data-input" hidden>
    </form>
         
    <form id="report-country-form" method="POST" data-target="<?php echo get_home_url().'/?pagename=post__report_country___'; ?>">
        <input type="text" value="" name="report-country-data" id="report-country-data-input" hidden>
        <input type="text" value="" name="report-country-name" id="report-country-name-input" hidden>
    </form>
         
    <form id="timeline-country-form" method="POST" data-target="<?php echo get_home_url().'/?pagename=post__timeline_country___'; ?>">
        <input type="text" value="" name="timeline-country-data" id="timeline-country-data-input" hidden>
        <input type="text" value="" name="timeline-country-name" id="timeline-country-name-input" hidden>
    </form>
</div>
 
<div class="crisis-profile-template" hidden>
    <div class="crisis-title"></div>
    <date class="crisis-date"></date>
    <div class="crisis-country"></div>
    <div class="crisis-description"></div>
    <div class="crisis-recent-event"><a><img></a></div>
    <div class="actions">
        <button class="btn-edit"><i class="fa fa-edit"></i></button>
        <button class="btn-delete"><i class="fa fa-trash"></i></button>
    </div>
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
<!--
                <input type="text" name="crisis-country" class="crisis-country">
-->
                <select name="crisis-country" class="crisis-country" id="add-crisis-country-select">
                </select>
            </div>
            <div class="input-group">
                <label>Start Date</label>
                <input type="date" name="crisis-date" class="crisis-date">
            </div>
            <div class="input-group">
                <label>End Date</label>
                <input type="date" name="crisis-end-date" class="crisis-end-date">
            </div>
            <div class="input-group"> 
                <label>Description</label>
                <input type="text" name="crisis-description" class="crisis-description">
            </div>
            <div class="input-group recent-event-input-group">
                <label>Recent event</label>
                <div>
                    <input type="text" class="crisis-recent-event-url" placeholder="Url (eg: http://www.example.com)">
                    <input type="file" accept="image/*" id="add-crisis-recent-event-image-input">
                </div>
                <img class="preview" id="add-crisis-recent-event-image-preview" alt="no preview available">
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
<!--
                <input type="text" name="crisis-country" class="crisis-country">
-->
                <select name="crisis-country" class="crisis-country" id="edit-crisis-country-select">
                </select>
            </div>
            <div class="input-group">
                <label>Start Date</label>
                <input type="date" name="crisis-date" class="crisis-date">
            </div>
            <div class="input-group">
                <label>End Date</label>
                <input type="date" name="crisis-end-date" class="crisis-end-date">
            </div>
            <div class="input-group"> 
                <label>Description</label>
                <input type="text" name="crisis-description" class="crisis-description">
            </div>
            <div class="input-group recent-event-input-group">
                <label>Recent event</label>
                <div>
                    <input type="text" class="crisis-recent-event-url" placeholder="Url (eg: http://www.example.com)">
                    <input type="file" accept="image/*" id="edit-crisis-recent-event-image-input">
                </div>
                <img class="preview" id="edit-crisis-recent-event-image-preview" alt="no preview available">
            </div> 
            <div class="action-buttons">
                <button onclick="hideModal()">Cancel</button>
                <button id="edit-crisis-btn">Save</button>
            </div>
        </div>
    </div>
     
    <div id="add-timeline-country-modal" class="modal" hidden>
        <header>
            <h3>Add country</h3>
        </header>
        <div class="content">
            <div class="input-group">
                <label>Name</label>
                <input type="text" name="timeline-country" id="timeline-country-input">
            </div>
            <div class="action-buttons">
                <button onclick="hideModal()">Cancel</button>
                <button id="add-timeline-country-btn">Add</button>
            </div>
        </div>
    </div>

    <div id="add-report-country-modal" class="modal" hidden>
        <header>
            <h3>Add country</h3>
        </header>
        <div class="content">
            <div class="input-group">
                <label>Name</label>
                <input type="text" name="report-country" id="report-country-input">
            </div>
            <div class="action-buttons">
                <button onclick="hideModal()">Cancel</button>
                <button id="add-report-country-btn">Add</button>
            </div>
        </div>
    </div>
</div>
