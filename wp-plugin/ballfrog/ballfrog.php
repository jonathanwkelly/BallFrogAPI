<?php
/**
 * @package BallFrog
 */
/*
Plugin Name: BallFrog
Plugin URI: https://github.com/jonathanwkelly/BallFrogAPI/
Description: BallFrog is a live scoring app for organizational and travel sports teams. This plugin provides the ability to display data pulled from the BallFrog API.
Version: 1.0.1
Author: Jonathan W. Kelly <jonathanwkelly@gmail.com>
*/

// No direct calling of script
if(!function_exists('add_action'))
	exit('Cannot call plugin script directly.');

// -------------

/**
 * Output a scoreboard element
 */
function ballfrog_api_output($args)
{
	$attrs = '';

    /* gotta have an API key */
    if(($apiKey = get_option('ballfrog_api_key')) == FALSE)
        return ballfrog_to_console('No API key present. The key can be configured in the WP settings menu.');

    /* gotta have a template to use */
    if(($tpl = ballfrog_load_template($args['template'])) == FALSE)
        return ballfrog_to_console('No valid template defined in shortcode.');

    /* get the contents of the template to be used */
    $out = '<script>' . 
        'window.ballfrog = window.ballfrog || {};' . 
        'window.ballfrog.apiKey = "'.$apiKey.'";' . 
        'window.ballfrog.templates = window.ballfrog.templates || {};' . 
        'window.ballfrog.templates["'.@$args['template'].'"] = "'.$tpl.'";' . 
        '</script>';

    /* add the arguments to the scoreboard element as data attributes */
	foreach($args as $key => $val)
		$attrs .= sprintf(
            ' data-bfconfig-%s="%s" ', 
            $key, 
            addslashes($val)
        );

    /* output the shell element into which the scoreboard will be loaded */
	$out .= sprintf(
        '<div data-ballfrog="%s" %s><span class="loader">Loading scoreboard...</span>%s</div>', 
        $args['type'],
        trim($attrs), 
        ballfrog_powered_by()
    );

    echo $out;
}

// -------------

/**
 * Register and enqueue the plugin front-end assets
 */
function ballfrog_add_assets() 
{
    wp_register_script(
        'ballfrog-api',
        plugin_dir_url( __FILE__ ) . '/js/ballfrog-api.js',
        FALSE,
        FALSE,
        TRUE
    );

    wp_enqueue_script('ballfrog-api');

    // ------

    wp_enqueue_style('ballfrog-api', plugin_dir_url(__FILE__) . 'css/ballfrog-api.css');
}

// -------------

/**
 * Get the contents of a template file
 */
function ballfrog_load_template($tpl='')
{
    $path = plugin_dir_path(__FILE__).'templates/'.$tpl.'.html';

    if(!is_readable($path))
        return FALSE;

    $html = file_get_contents($path);

    if(!$html)
        return FALSE;

    $html = preg_replace('/^\s+|\n|\r|\s+$/m', '', addslashes($html));

    return $html;
}

// -------------

/**
 * Send a message to the JS console
 */
function ballfrog_to_console($msg='')
{
    echo '<script>if(typeof console == "object") console.log("BALLFROG: '.$msg.'");</script>';
}

// -------------

/**
 * Output the "powered by" bit
 */
function ballfrog_powered_by()
{
	return '<a href="http://ballfrog.com" target="_blank" class="ballfrog-powered-by">Powered by BallFrog</a>';
}

// -------------

/**
 * Prepare the settings options
 */
function ballfrog_api_settings() {
    register_setting( 'ballfrog-api-settings-group', 'ballfrog_api_key' );
    add_options_page('BallFrog API Settings', 'BallFrog API', 'manage_options', 'plugin', 'ballfrog_api_settings_page');
}

// -------------

/**
 * Output the BallFrog API settings page
 */
function ballfrog_api_settings_page()
{
?>
    <div class="wrap">
        <h2>BallFrog API Settings</h2>
        <p>
            <em>To find out about how to get an API key, refer to the <a href="https://github.com/jonathanwkelly/BallFrogAPI/" target="_blank">API Documentation</a></em>
        </p>

        <form method="post" action="options.php">

            <?php settings_fields( 'ballfrog-api-settings-group' ); ?>
            <?php do_settings_sections( 'ballfrog-api-settings-group' ); ?>

            <table class="form-table">
                <tr valign="top">
                    <th scope="row">API Key</th>
                    <td>
                        <input type="text" name="ballfrog_api_key" value="<?php echo esc_attr( get_option('ballfrog_api_key') ); ?>" /><br>
                    </td>
                </tr>
            </table>
            
            <?php submit_button(); ?>

        </form>

    </div>
<?php
}

// -------------

add_action('wp_enqueue_scripts', 'ballfrog_add_assets');
add_action('admin_menu', 'ballfrog_api_settings');

add_shortcode('ballfrog_api_output', 'ballfrog_api_output');
