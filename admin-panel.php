<div id="dashboard-form">

    <h1>ACLED dashboard</h1>

    <section id="carousel">
        <h2>Carousel</h2>
        <div class="input-group" id="image-1-container">
            <label>Image #1</label>
            <input type="file" name="image-1" accept="image/*">
            <img class="preview" alt="no preview available">
        </div>
        <div class="input-group" id="image-2-container">
            <label>Image #2</label>
            <input type="file" name="image-2" accept="image/*">
            <img class="preview" alt="no preview available">
        </div>
        <div class="input-group" id="image-3-container">
            <label>Image #3</label>
            <input type="file" name="image-3" accept="image/*">
            <img class="preview" alt="no preview available">
        </div>
    </section>

    <section id="crisis-profile-report">
        <h2>Crisis profile</h2>
        <div id="crisis-profile-list">
        </div>
        <div id="add-crisis">
            <div class="input-group">
                <label>Select ciris</label>
                <select>
                    <option val="country-1">Country #1</option>
                    <option val="country-2">Country #2</option>
                </select>
            </div>
            <div class="input-group">
                <label>Country</label>
                <input type="text" name="country-name">
            </div>
            <div class="input-group">
                <label>Date</label>
                <input type="date" name="date">
            </div>
            <div class="input-group">
                <label>Description</label>
                <input type="text" name="description">
            </div>
        </div>
    </section>

    <form method="POST" id="dashboard-form"> 
        <input type="text" value="" name="dashboard-data" id="data-input" hidden>
        <input type="submit" class="btn btn-primary">
    </form>

</div>
<div class="crisis-profile-template" hidden>
    <div class="crisis-name"></div>
    <date class="crisis-date"></date>
    <div class="crisis-description"></div>
</div> 
