<?php
/*
Plugin Name: Youtube Playlist Thumbs
Description: Use the [ypt] shortcode to show a Youtube playlist. Videos within playlist can be triggered by links in page content.
Version: 0.6.0
Author: Joseph Stiles
License: GPL2
*/

if( !defined( 'ABSPATH' ) )
exit;

//register the shortcode
add_shortcode(
"ypt", //The shortcode [ypt]
"ypt_function" //The function that activates when the shortcode is detected in content
);

$yptDefaults = array(
	'api_key' => 'AIzaSyArQNfmJDkjxP_ZyZIocbyuDeyTanf4Rl8',
	'valid' => false
);
$yptOptions = get_option('ypt_options', $yptDefaults);

global $apiKey;
global $apiKeyisValid;

$apiKey = $yptOptions['api_key'];
$apiKeyisValid = $yptOptions['valid'];

function ypt_admin_notice() {
	print '
	<div class="error">
	<p>Youtube Playlist Thumbs requires your attention. Please visit the <a href="options-general.php?page=ypt-settings">settings page</a>.</p>
	</div>
	';
}

if($apiKeyisValid != 1){
	add_action( 'admin_notices', 'ypt_admin_notice' );
}

function ypt_function($atts) {
	wp_enqueue_script( //load the script in the footer if shortcode is found
	'youtube-playlist-thumbs', //ID used in <script>
	plugin_dir_url( __FILE__ ) . 'assets/js/youtube-playlist-thumbs.min.js', //go get it
	array( 'jquery' ), //it needs jQuery
	'0.2', //version
	false //load it in the footer
);

$a = shortcode_atts( array( //these must be lowercase
	'playlist_id' => 'default' //default will be overwritten by the attribute value
), $atts );

$playlistId = $a['playlist_id'];

$ypt_output =  '
<div id="ypt_wrapper">
<div class="video">
<div id="player" data-pl="'.$playlistId.'"></div>
</div>
<ul id="ypt_thumbs"></ul>
</div>
';

return $ypt_output;
}

function ypt_assets() {
	wp_enqueue_style( 'youtube-playlist-thumbs', plugin_dir_url( __FILE__ ) . 'assets/css/youtube-playlist-thumbs.css' );
}

add_action( 'wp_enqueue_scripts', 'ypt_assets' );

add_action('wp_head','ypt_head');

function ypt_head()
{
	global $apiKey;
	global $apiKeyisValid;

	$output='<script>var yptKey="'.$apiKey.'"</script>';

	echo $output;
}

class YPTSettingsPage
{
	/**
	* Holds the values to be used in the fields callbacks
	*/
	private $options;

	/**
	* Start up
	*/
	public function __construct()
	{
		add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
		add_action( 'admin_init', array( $this, 'page_init' ) );
	}

	/**
	* Add options page
	*/
	public function add_plugin_page()
	{
		// This page will be under "Settings"
		add_options_page(
		'Settings Admin',
		'Youtube Playlist Thumbs', //Name shown in admin settings nav
		'manage_options',
		'ypt-settings',
		array( $this, 'create_admin_page' )
	);
}

/**
* Options page callback
*/
public function create_admin_page()
{
	// Set class property
	$this->options = get_option( 'ypt_options' );
	?>
	<div class="wrap">
		<h2>Youtube Playlist Thumbs</h2>
		<form method="post" action="options.php">
			<?php
			// This prints out all hidden setting fields
			settings_fields( 'ypt_setting_group' );
			do_settings_sections( 'ypt-settings' );
			submit_button();
			?>
		</form>
	</div>
	<?php
}

/**
* Register and add settings
*/
public function page_init()
{
	register_setting(
	'ypt_setting_group', // Option group
	'ypt_options', // Option name
	array( $this, 'sanitize' ) // Sanitize
);

add_settings_section(
'setting_section_id', // ID
'Plugin Settings', // Title
array( $this, 'print_section_info' ), // Callback
'ypt-settings' // Page
);

add_settings_field(
'api_key', // ID
'API Key', // Title
array( $this, 'api_key_callback' ), // Callback
'ypt-settings', // Page
'setting_section_id' // Section
);

add_settings_field(
'valid', // ID
'', // Title
array( $this, 'valid_callback' ), // Callback
'ypt-settings', // Page
'setting_section_id' // Section
);

wp_register_script(
'ypt_key_test',
plugins_url( '/key_test.js', __FILE__ )
);

wp_enqueue_script( 'ypt_key_test', true );

}

/**
* Sanitize each setting field as needed
*
* @param array $input Contains all settings fields as array keys
*/
public function sanitize( $input )
{
	$new_input = array();

	if( isset( $input['valid'] ) && isset( $input['api_key'] ) ){

		if($input['valid'] == 1){

			if($input['api_key'] != $yptDefaults['api_key']){

				$new_input['valid'] = sanitize_text_field( $input['valid'] );
				$new_input['api_key'] = sanitize_text_field( $input['api_key'] );
				return $new_input;
			}

		}
	}


}

/**
* Print the Section text
*/
public function print_section_info()
{
	print '
	This plugin requires a Youtube Data API key to work. A default API key is included but it may exceed quota and affect functionallity.<br /> To prevent future issues, please supply a valid API key.
	<a target="blank" href="https://developers.google.com/youtube/registering_an_application">Follow this guide</a>
	to get a Youtube API Browser Key and enter it below. Only valid keys will be accepted.
	';
}

/**
* Get the settings option array and print one of its values
*/
public function api_key_callback()
{
	printf(
	'<input type="text" id="api_key" name="ypt_options[api_key]" value="%s" />&nbsp;<span id="valid_notice">Key is not valid.</span>',
	isset( $this->options['api_key'] ) ? esc_attr( $this->options['api_key']) : ''
);
}

public function valid_callback(){
	printf(
	'<input type="hidden" id="ypt_valid" name="ypt_options[valid]" value="%s" />'
	,
	isset( $this->options['valid'] ) ? esc_attr( $this->options['valid']) : ''
);

}

}

if( is_admin() )
$my_settings_page = new YPTSettingsPage();
//key test is loaded on every admin page
//some way to limit key testing
