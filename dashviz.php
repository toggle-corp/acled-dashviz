<?php

/*
Plugin Name: Dashboard Visualization
Description: Dashboard Visualization plugin for ACLED
Author: Togglecorp
Version: 1.0
*/

define( 'DASHVIZ__PLUGIN_DIR', plugin_dir_path( __FILE__ ) );


class DashboardVisualization{
    function init($template){
        if((is_page('Dashboard') || is_home())){
            new self;
            $page_check = get_page_by_title("Dashboard");
            $post_id = 0;
            $plugin_dir = '/acled-dashviz';
            $post_content = file_get_contents(plugins_url().$plugin_dir.'/main.html');
            $post_title = 'Dashboard';
            if(!isset($page_check->ID)){
                $page_dashboard = array(
                    'post_title' => $post_title,
                    'post_content' => $post_content,
                    'post_status' => 'publish',
                    'post_author' => 1,
                    'post_type' => 'page'
                );
                $post_id = wp_insert_post($page_dashboard);
            } else {
                $post_id = $page_check->ID;
                $page_dashboard = array(
                    'post_title' => $post_title,
                    'ID' => $page_check->ID,
                    'post_content' => $post_content,
                    'post_status' => 'publish',
                    'post_author' => 1,
                    'post_type' => 'page'
                );
                wp_update_post($page_dashboard);
            }
            global $wp_query;
            $pageid = $post_id;
            if ( $pageid > 0 ) {
                $wp_query = null;
                $wp_query = new WP_Query();
                $wp_query->query( 'page_id=' . $pageid );
                $wp_query->the_post();
                $template = get_page_template();
                rewind_posts();

                wp_enqueue_script("jquery-script", 'https://code.jquery.com/jquery-3.2.1.min.js', null, null, true);
                wp_enqueue_script("d3-script", 'https://cdnjs.cloudflare.com/ajax/libs/d3/4.8.0/d3.min.js', null, null, true);
                wp_enqueue_style("fa-style", 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
                wp_enqueue_script("mapbox-script", 'https://api.mapbox.com/mapbox.js/v3.0.1/mapbox.js', null, null, true);
                wp_enqueue_style("mapbox-style", 'https://api.mapbox.com/mapbox.js/v3.0.1/mapbox.css');
                // wp_enqueue_script("leaflet-cluster-script", 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.0.5/leaflet.markercluster.js', null, null, true);
                // wp_enqueue_style("leaflet-cluster-style", 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.0.5/MarkerCluster.css');
                // wp_enqueue_style("leaflet-cluster-default-style", 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.0.5/MarkerCluster.Default.css');

                wp_enqueue_script("selectize-script", plugins_url().$plugin_dir.'/static/js/selectize.js', null, null, true);
                wp_enqueue_script("utils-script", plugins_url().$plugin_dir.'/static/js/common/utils.js', null, null, true);
                wp_enqueue_script("element-script", plugins_url().$plugin_dir.'/static/js/common/Element.js', null, null, true);
                wp_enqueue_script("map-legend-script", plugins_url().$plugin_dir.'/static/js/common/MapLegend.js', null, null, true);

                wp_enqueue_script("dashboard-map-script", plugins_url().$plugin_dir.'/static/js/main-dashboard/DashboardMap.js', null, null, true);
                wp_enqueue_script("crisis-profile-script", plugins_url().$plugin_dir.'/static/js/main-dashboard/CrisisProfile.js', null, null, true);
                wp_enqueue_script("key-figures-script", plugins_url().$plugin_dir.'/static/js/main-dashboard/KeyFigures.js', null, null, true);
                wp_enqueue_script("main-dashboard-script", plugins_url().$plugin_dir.'/static/js/main-dashboard/MainDashboard.js', null, null, true);

                wp_enqueue_script("country-map-script", plugins_url().$plugin_dir.'/static/js/country-profile/CountryMap.js', null, null, true);
                wp_enqueue_script("country-report-script", plugins_url().$plugin_dir.'/static/js/country-profile/CountryReport.js', null, null, true);
                wp_enqueue_script("timeline-script", plugins_url().$plugin_dir.'/static/js/country-profile/Timeline.js', null, null, true);
                wp_enqueue_script("time-series-script", plugins_url().$plugin_dir.'/static/js/country-profile/TimeSeries.js', null, null, true);
                wp_enqueue_script("bar-chart-script", plugins_url().$plugin_dir.'/static/js/country-profile/BarChart.js', null, null, true);
                wp_enqueue_script("country-profile-script", plugins_url().$plugin_dir.'/static/js/country-profile/CountryProfile.js', null, null, true);

                wp_enqueue_script("dashboard-script", plugins_url().$plugin_dir.'/static/js/Dashboard.js', null, null, true);

                wp_enqueue_script("dashviz-main-script", plugins_url().$plugin_dir.'/static/js/main.js', null, null, true);
                wp_add_inline_script('dashviz-main-script', 'let pluginDir="'.plugins_url().$plugin_dir.'"', 'before');

                wp_enqueue_style("selectize-style", plugins_url().$plugin_dir.'/static/css/selectize.css');
                wp_enqueue_style("dashviz-style", plugins_url().$plugin_dir.'/static/css/main.css');
            }
        }

        // $conn = new mysqli('acled.ampersandstudio.uk', 'acleddat_acled', 'de+KhLk~wxVL', 'acleddat_acleddata');
        // if (!$conn) {
        //     die("Connection failed: " . mysqli_connect_error());
        // }
        // echo "Connected successfully";
        // var_dump(mysqli_query($conn,"SHOW TABLES"));
        // $conn->close();
        return $template;
    }

}

add_filter( 'template_include', array( 'DashboardVisualization', 'init' ) );

?>
