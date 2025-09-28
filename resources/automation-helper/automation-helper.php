<?php

/**
 * Plugin Name: Automation Helper
 * Plugin URI: https://github.com/HurayraIIT/automation-helper
 * Description: A helpful tool for e2e automation testing with database table display functionality.
 * Version: 1.0.0
 * Author: Abu Hurayra
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: automation-helper
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('AHJAH_VERSION', '1.0.0');
define('AHJAH_PLUGIN_URL', plugin_dir_url(__FILE__));
define('AHJAH_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('AHJAH_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Main Automation Helper Class
 *
 * This class handles all the functionality for the Automation Helper plugin,
 * including database table display, AJAX handling, and admin interface.
 *
 * @since 1.0.0
 * @package AutomationHelper
 */
class AHJAH_Automation_Helper
{
    /**
     * Single instance of the class
     *
     * @var AHJAH_Automation_Helper|null
     * @since 1.0.0
     */
    private static $_instance = null;

    /**
     * Get single instance of the class (Singleton pattern)
     *
     * @since 1.0.0
     * @return AHJAH_Automation_Helper The single instance of the class
     */
    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Constructor - Private to prevent direct instantiation
     *
     * @since 1.0.0
     */
    private function __construct()
    {
        $this->ahjah_init_hooks();
    }

    /**
     * Initialize WordPress hooks and actions
     *
     * Sets up all the necessary WordPress hooks for the plugin functionality
     * including admin menu, AJAX handlers, shortcodes, and activation hooks.
     *
     * @since 1.0.0
     */
    private function ahjah_init_hooks()
    {
        // Core WordPress hooks
        add_action('init', array($this, 'ahjah_init'));
        add_action('admin_menu', array($this, 'ahjah_add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'ahjah_enqueue_admin_scripts'));

        // AJAX handlers for both logged-in and non-logged-in users
        add_action('wp_ajax_ahjah_get_table_data', array($this, 'ahjah_ajax_get_table_data'));
        add_action('wp_ajax_nopriv_ahjah_get_table_data', array($this, 'ahjah_ajax_get_table_data'));
        add_action('wp_ajax_ahjah_get_table_counts', array($this, 'ahjah_ajax_get_table_counts'));

        // Register shortcode
        add_shortcode('ahjah_db_display', array($this, 'ahjah_db_display_shortcode'));

        // Plugin lifecycle hooks
        register_activation_hook(__FILE__, array($this, 'ahjah_activate'));
        register_deactivation_hook(__FILE__, array($this, 'ahjah_deactivate'));
    }

    /**
     * Initialize plugin functionality
     *
     * Called on WordPress 'init' action. Handles any initialization
     * that needs to happen after WordPress is fully loaded.
     *
     * @since 1.0.0
     */
    public function ahjah_init()
    {
        // WordPress automatically loads translations for plugins hosted on WordPress.org
        // No need to manually call load_plugin_textdomain() since WordPress 4.6

        // Additional initialization can be added here if needed
    }

    /**
     * Add admin menu page
     *
     * Creates a new page under the Tools menu in WordPress admin.
     * Uses 'read' capability to allow all users to access the tool.
     *
     * @since 1.0.0
     */
    public function ahjah_add_admin_menu()
    {
        add_management_page(
            __('Automation Helper', 'automation-helper'),
            __('Automation Helper', 'automation-helper'),
            'read',
            'automation-helper',
            array($this, 'ahjah_admin_page_callback')
        );
    }

    /**
     * Enqueue admin scripts and styles
     *
     * Only loads scripts and styles on the plugin's admin page to avoid
     * unnecessary loading on other admin pages.
     *
     * @since 1.0.0
     * @param string $hook The current admin page hook
     */
    public function ahjah_enqueue_admin_scripts($hook)
    {
        // Only load on our plugin's admin page
        if ('tools_page_automation-helper' !== $hook) {
            return;
        }

        wp_enqueue_script(
            'ahjah-admin-script',
            AHJAH_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            AHJAH_VERSION,
            true
        );

        wp_enqueue_style(
            'ahjah-admin-style',
            AHJAH_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            AHJAH_VERSION
        );

        wp_localize_script('ahjah-admin-script', 'ahjah_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('ahjah_admin_nonce'),
            'strings' => array(
                'copy_success' => __('Shortcode copied to clipboard!', 'automation-helper'),
                'copy_error' => __('Failed to copy shortcode. Please copy manually.', 'automation-helper'),
                'loading' => __('Loading...', 'automation-helper'),
                'no_data' => __('No data found', 'automation-helper'),
                'error' => __('An error occurred while loading data', 'automation-helper')
            )
        ));
    }

    /**
     * Admin page callback - New enhanced interface
     *
     * Displays a comprehensive table with all database tables, their shortcodes,
     * copy buttons, and row counts for easy shortcode management.
     *
     * @since 1.0.0
     */
    public function ahjah_admin_page_callback()
    {
        $tables = $this->ahjah_get_database_tables();
?>
        <div class="wrap">
            <h1 data-testid="ahjah-page-title"><?php echo esc_html(get_admin_page_title()); ?></h1>

            <div class="ahjah-admin-container" data-testid="ahjah-admin-container">
                <div class="ahjah-admin-header">
                    <p class="ahjah-description">
                        <?php esc_html_e('Generate shortcodes for displaying database tables with advanced features like search, pagination, and sorting.', 'automation-helper'); ?>
                    </p>
                </div>

                <div class="ahjah-tables-card">
                    <div class="ahjah-card-header">
                        <h2><?php esc_html_e('Available Database Tables', 'automation-helper'); ?></h2>
                        <div class="ahjah-loading-indicator" id="ahjah-row-count-loading" style="display: none;">
                            <span class="spinner is-active"></span>
                            <?php esc_html_e('Loading table information...', 'automation-helper'); ?>
                        </div>
                    </div>

                    <?php if (empty($tables)): ?>
                        <div class="ahjah-no-tables">
                            <p><?php esc_html_e('No database tables found with WordPress prefix.', 'automation-helper'); ?></p>
                        </div>
                    <?php else: ?>
                        <div class="ahjah-tables-wrapper">
                            <table class="ahjah-admin-table" data-testid="ahjah-admin-table">
                                <thead>
                                    <tr>
                                        <th class="ahjah-col-table"><?php esc_html_e('Table Name', 'automation-helper'); ?></th>
                                        <th class="ahjah-col-shortcode"><?php esc_html_e('Shortcode', 'automation-helper'); ?></th>
                                        <th class="ahjah-col-copy"><?php esc_html_e('Copy', 'automation-helper'); ?></th>
                                        <th class="ahjah-col-count"><?php esc_html_e('Total Rows', 'automation-helper'); ?></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($tables as $index => $table): ?>
                                        <tr class="ahjah-table-row" data-table="<?php echo esc_attr($table); ?>" data-testid="ahjah-table-row-<?php echo esc_attr($table); ?>">
                                            <td class="ahjah-table-name">
                                                <strong><?php echo esc_html($table); ?></strong>
                                            </td>
                                            <td class="ahjah-shortcode-cell">
                                                <code class="ahjah-shortcode-display" data-testid="ahjah-shortcode-<?php echo esc_attr($table); ?>">
                                                    [ahjah_db_display table='<?php echo esc_attr($table); ?>']
                                                </code>
                                            </td>
                                            <td class="ahjah-copy-cell">
                                                <button type="button"
                                                        class="button button-secondary ahjah-copy-btn"
                                                        data-shortcode="[ahjah_db_display table='<?php echo esc_attr($table); ?>']"
                                                        data-table="<?php echo esc_attr($table); ?>"
                                                        data-testid="ahjah-copy-btn-<?php echo esc_attr($table); ?>">
                                                    <span class="dashicons dashicons-admin-page"></span>
                                                    <?php esc_html_e('Copy', 'automation-helper'); ?>
                                                </button>
                                            </td>
                                            <td class="ahjah-count-cell">
                                                <span class="ahjah-row-count"
                                                      data-table="<?php echo esc_attr($table); ?>"
                                                      data-testid="ahjah-count-<?php echo esc_attr($table); ?>">
                                                    <span class="ahjah-loading-dots">...</span>
                                                </span>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>

                <div class="ahjah-usage-card">
                    <h3><?php esc_html_e('How to Use', 'automation-helper'); ?></h3>
                    <div class="ahjah-usage-steps">
                        <div class="ahjah-step">
                            <span class="ahjah-step-number">1</span>
                            <div class="ahjah-step-content">
                                <strong><?php esc_html_e('Copy Shortcode', 'automation-helper'); ?></strong>
                                <p><?php esc_html_e('Click the "Copy" button next to any table to copy its shortcode.', 'automation-helper'); ?></p>
                            </div>
                        </div>
                        <div class="ahjah-step">
                            <span class="ahjah-step-number">2</span>
                            <div class="ahjah-step-content">
                                <strong><?php esc_html_e('Paste in Content', 'automation-helper'); ?></strong>
                                <p><?php esc_html_e('Paste the shortcode into any page, post, or widget where you want the table to appear.', 'automation-helper'); ?></p>
                            </div>
                        </div>
                        <div class="ahjah-step">
                            <span class="ahjah-step-number">3</span>
                            <div class="ahjah-step-content">
                                <strong><?php esc_html_e('Enjoy the Features', 'automation-helper'); ?></strong>
                                <p><?php esc_html_e('The table will display with search, pagination (20 rows per page), and sorting functionality.', 'automation-helper'); ?></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="ahjah-copy-notification" class="ahjah-notification" style="display: none;">
                    <span class="dashicons dashicons-yes-alt"></span>
                    <span class="ahjah-notification-text"></span>
                </div>
            </div>
        </div>
    <?php
    }

    /**
     * Get all database tables with WordPress prefix
     *
     * Retrieves a list of all database tables that start with the WordPress
     * table prefix. Results are cached for performance optimization.
     *
     * @since 1.0.0
     * @return array Array of table names with WordPress prefix
     */
    private function ahjah_get_database_tables()
    {
        global $wpdb;

        try {
            // Try to get from cache first for performance
            $cache_key = 'ahjah_wp_tables_' . $wpdb->prefix;
            $wp_tables = wp_cache_get($cache_key, 'ahjah_plugin');

            if (false === $wp_tables) {
                $tables = $wpdb->get_col("SHOW TABLES");

                // Check for database errors
                if ($wpdb->last_error) {
                    error_log('AHJAH Plugin - Database error getting tables: ' . $wpdb->last_error);
                    return array(); // Return empty array on error
                }

                $wp_tables = array();

                // Filter tables to only include those with WordPress prefix
                if (is_array($tables)) {
                    foreach ($tables as $table) {
                        if (is_string($table) && strpos($table, $wpdb->prefix) === 0) {
                            $wp_tables[] = $table;
                        }
                    }
                }

                // Sort alphabetically for consistent display
                sort($wp_tables);

                // Cache for 5 minutes to improve performance
                wp_cache_set($cache_key, $wp_tables, 'ahjah_plugin', 300);
            }

            return is_array($wp_tables) ? $wp_tables : array();
        } catch (Exception $e) {
            error_log('AHJAH Plugin - Exception in get_database_tables: ' . $e->getMessage());
            return array();
        }
    }

    /**
     * Database display shortcode handler
     *
     * Handles the [ahjah_db_display] shortcode to display database tables
     * with pagination, search, and sorting functionality.
     *
     * @since 1.0.0
     * @param array $atts Shortcode attributes
     * @return string HTML output for the table display
     */
    public function ahjah_db_display_shortcode($atts)
    {
        // Parse shortcode attributes with defaults
        $atts = shortcode_atts(array(
            'table' => $GLOBALS['wpdb']->prefix . 'options'
        ), $atts, 'ahjah_db_display');

        $table_name = sanitize_text_field($atts['table']);

        // Verify table exists and is accessible
        if (!$this->ahjah_table_exists($table_name)) {
            return '<div class="ahjah-error" data-testid="ahjah-table-error">' .
                esc_html__('Table does not exist or is not accessible.', 'automation-helper') .
                '</div>';
        }

        // Enqueue frontend scripts
        $this->ahjah_enqueue_frontend_scripts();

        $unique_id = 'ahjah_table_' . md5($table_name . time());

        ob_start();
    ?>
        <div class="ahjah-table-container" data-testid="ahjah-table-container" data-table="<?php echo esc_attr($table_name); ?>" id="<?php echo esc_attr($unique_id); ?>">
            <div class="ahjah-table-controls" data-testid="ahjah-table-controls">
                <div class="ahjah-search-wrapper">
                    <label for="<?php echo esc_attr($unique_id); ?>_search" data-testid="ahjah-search-label">
                        <?php esc_html_e('Search:', 'automation-helper'); ?>
                    </label>
                    <input type="text" id="<?php echo esc_attr($unique_id); ?>_search" class="ahjah-search"
                        placeholder="<?php esc_attr_e('Search table data...', 'automation-helper'); ?>"
                        data-testid="ahjah-search-input" />
                </div>
                <div class="ahjah-info" data-testid="ahjah-table-info">
                    <span class="ahjah-table-name" data-testid="ahjah-table-name"><?php echo esc_html($table_name); ?></span>
                </div>
            </div>

            <div class="ahjah-table-wrapper" data-testid="ahjah-table-wrapper">
                <div class="ahjah-loading" data-testid="ahjah-loading" style="display: none;">
                    <?php esc_html_e('Loading...', 'automation-helper'); ?>
                </div>
                <div class="ahjah-table-content" data-testid="ahjah-table-content">
                    <!-- Table content will be loaded here -->
                </div>
            </div>

            <div class="ahjah-pagination-wrapper" data-testid="ahjah-pagination-wrapper">
                <div class="ahjah-pagination-info" data-testid="ahjah-pagination-info"></div>
                <div class="ahjah-pagination-controls" data-testid="ahjah-pagination-controls"></div>
            </div>
        </div>
<?php
        return ob_get_clean();
    }

    /**
     * Check if table exists
     */
    private function ahjah_table_exists($table_name)
    {
        global $wpdb;

        try {
            // Validate table name format (only allow alphanumeric, underscore, and WordPress prefix)
            if (empty($table_name) || !is_string($table_name)) {
                return false;
            }

            if (!preg_match('/^' . preg_quote($wpdb->prefix, '/') . '[a-zA-Z0-9_]+$/', $table_name)) {
                return false;
            }

            $query = $wpdb->prepare("SHOW TABLES LIKE %s", $table_name);
            $result = $wpdb->get_var($query);

            // Check for database errors
            if ($wpdb->last_error) {
                error_log('AHJAH Plugin - Database error in table_exists: ' . $wpdb->last_error);
                return false;
            }

            return $result === $table_name;
        } catch (Exception $e) {
            error_log('AHJAH Plugin - Exception in table_exists: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * AJAX handler for getting table data
     */
    public function ahjah_ajax_get_table_data()
    {
        try {
            // Verify nonce
            if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'ahjah_nonce')) {
                wp_send_json_error(__('Security check failed', 'automation-helper'));
                return;
            }

            global $wpdb;

            // Validate and sanitize all input parameters
            $table_name = isset($_POST['table']) ? sanitize_text_field(wp_unslash($_POST['table'])) : '';
            $page = isset($_POST['page']) ? intval($_POST['page']) : 1;
            $page = max(1, $page); // Ensure page is at least 1
            $per_page = isset($_POST['per_page']) ? intval($_POST['per_page']) : 20;
            $per_page = max(1, min(1000, $per_page)); // Limit per_page between 1 and 1000
            $search = isset($_POST['search']) ? sanitize_text_field(wp_unslash($_POST['search'])) : '';
            $orderby = isset($_POST['orderby']) ? sanitize_text_field(wp_unslash($_POST['orderby'])) : '';
            $order = isset($_POST['order']) && in_array(strtoupper(sanitize_text_field(wp_unslash($_POST['order']))), array('ASC', 'DESC'))
                     ? strtoupper(sanitize_text_field(wp_unslash($_POST['order'])))
                     : 'ASC';

            // Validate required parameters
            if (empty($table_name)) {
                wp_send_json_error(__('Table name is required', 'automation-helper'));
                return;
            }

            // Verify table exists
            if (!$this->ahjah_table_exists($table_name)) {
                wp_send_json_error(__('Table does not exist or is not accessible', 'automation-helper'));
                return;
            }
        } catch (Exception $e) {
            error_log('AHJAH Plugin - Exception in AJAX handler initialization: ' . $e->getMessage());
            wp_send_json_error(__('An error occurred while processing your request', 'automation-helper'));
            return;
        }

        try {
            // Get table structure - table name is already validated in ahjah_table_exists()
            // Using esc_sql as additional protection for table name in DESCRIBE query
            $safe_table_name = esc_sql($table_name);

            // Try to get table structure from cache
            $structure_cache_key = 'ahjah_table_structure_' . md5($safe_table_name);
            $columns = wp_cache_get($structure_cache_key, 'ahjah_plugin');

            if (false === $columns) {
                $columns = $wpdb->get_results("DESCRIBE `$safe_table_name`");

                if (!empty($columns)) {
                    // Cache table structure for 1 hour
                    wp_cache_set($structure_cache_key, $columns, 'ahjah_plugin', 3600);
                }
            }

            if (empty($columns)) {
                wp_send_json_error(__('Unable to get table structure', 'automation-helper'));
                return;
            }

            // Check for database errors
            if ($wpdb->last_error) {
                error_log('AHJAH Plugin - Database error getting table structure: ' . $wpdb->last_error);
                wp_send_json_error(__('Database error occurred', 'automation-helper'));
                return;
            }

            // Build the query
            $offset = ($page - 1) * $per_page;
            $where = '';
            $search_params = array();

            // Add search functionality
            if (!empty($search)) {
                $search_conditions = array();
                foreach ($columns as $column) {
                    $search_conditions[] = "`{$column->Field}` LIKE %s";
                    $search_params[] = '%' . $wpdb->esc_like($search) . '%';
                }
                $where = 'WHERE ' . implode(' OR ', $search_conditions);
            }

            // Add ordering
            $order_clause = '';
            if (!empty($orderby)) {
                // Validate orderby column exists
                $column_names = array_column($columns, 'Field');
                if (in_array($orderby, $column_names)) {
                    $order_clause = "ORDER BY `$orderby` $order";
                }
            }

            // Get total count - using safe table name
            $count_query = "SELECT COUNT(*) FROM `$safe_table_name` $where";
            if (!empty($search_params)) {
                $total_items = $wpdb->get_var($wpdb->prepare($count_query, $search_params));
            } else {
                $total_items = $wpdb->get_var($count_query);
            }

            // Get data - using safe table name and prepared statements for LIMIT/OFFSET
            $data_query = "SELECT * FROM `$safe_table_name` $where $order_clause LIMIT %d OFFSET %d";
            if (!empty($search_params)) {
                // Combine search params with limit/offset params
                $all_params = array_merge($search_params, array($per_page, $offset));
                $results = $wpdb->get_results($wpdb->prepare($data_query, $all_params), ARRAY_A);
            } else {
                $results = $wpdb->get_results($wpdb->prepare($data_query, $per_page, $offset), ARRAY_A);
            }

            // Calculate pagination info
            $total_pages = ceil($total_items / $per_page);
            $start_item = $total_items > 0 ? $offset + 1 : 0;
            $end_item = min($offset + $per_page, $total_items);

            // Process data for better display
            $processed_data = array();
            foreach ($results as $row) {
                $processed_row = array();
                foreach ($row as $key => $value) {
                    $processed_row[$key] = $this->ahjah_format_cell_data($value, $key);
                }
                $processed_data[] = $processed_row;
            }

            wp_send_json_success(array(
                'data' => $processed_data,
                'columns' => array_column($columns, 'Field'),
                'pagination' => array(
                    'current_page' => $page,
                    'per_page' => $per_page,
                    'total_items' => $total_items,
                    'total_pages' => $total_pages,
                    'start_item' => $start_item,
                    'end_item' => $end_item
                )
            ));
        } catch (Exception $e) {
            error_log('AHJAH Plugin - Exception in AJAX handler: ' . $e->getMessage());
            wp_send_json_error(__('An error occurred while loading table data. Please try again.', 'automation-helper'));
        }
    }

    /**
     * AJAX handler for getting table row counts
     *
     * Returns the total number of rows for all WordPress tables.
     * Used by the admin interface to display table statistics.
     *
     * @since 1.0.0
     */
    public function ahjah_ajax_get_table_counts()
    {
        // Verify nonce for security
        if (!wp_verify_nonce($_POST['nonce'], 'ahjah_admin_nonce')) {
            wp_send_json_error(__('Security check failed', 'automation-helper'));
            return;
        }

        // Check user permissions
        if (!current_user_can('read')) {
            wp_send_json_error(__('Insufficient permissions', 'automation-helper'));
            return;
        }

        try {
            global $wpdb;

            $tables = $this->ahjah_get_database_tables();
            $counts = array();

            foreach ($tables as $table) {
                // Check cache first
                $cache_key = 'ahjah_table_count_' . md5($table);
                $count = wp_cache_get($cache_key, 'ahjah_plugin');

                if ($count === false) {
                    // Get count from database with error handling
                    $count_query = $wpdb->prepare("SELECT COUNT(*) FROM `%s`", $table);
                    $count = $wpdb->get_var($count_query);

                    if ($count === null) {
                        // Table might not be accessible
                        $counts[$table] = array(
                            'count' => 0,
                            'error' => __('Unable to access table', 'automation-helper')
                        );
                        continue;
                    }

                    // Cache for 5 minutes
                    wp_cache_set($cache_key, $count, 'ahjah_plugin', 300);
                }

                $counts[$table] = array(
                    'count' => intval($count),
                    'formatted' => number_format_i18n(intval($count))
                );
            }

            wp_send_json_success($counts);

        } catch (Exception $e) {
            error_log('AHJAH Plugin - Exception in table counts AJAX: ' . $e->getMessage());
            wp_send_json_error(__('An error occurred while loading table counts. Please try again.', 'automation-helper'));
        }
    }

    /**
     * Format cell data for better display
     *
     * Handles serialized data, JSON strings, long text, and special characters
     * to provide a better user experience in the frontend table display.
     *
     * @since 1.0.0
     * @param mixed $value The raw cell value from database
     * @param string $column_name The column name for context
     * @return array Formatted data with display value and metadata
     */
    private function ahjah_format_cell_data($value, $column_name = '')
    {
        // Handle null values
        if (is_null($value)) {
            return array(
                'display' => '<span class="ahjah-null-value">NULL</span>',
                'raw' => null,
                'type' => 'null'
            );
        }

        // Convert to string for processing
        $string_value = (string) $value;

        // Handle empty strings
        if ($string_value === '') {
            return array(
                'display' => '<span class="ahjah-empty-value">(empty)</span>',
                'raw' => $value,
                'type' => 'empty'
            );
        }

        // Try to detect and handle serialized data
        if ($this->ahjah_is_serialized($string_value)) {
            $unserialized = @unserialize($string_value);
            if ($unserialized !== false) {
                $formatted = $this->ahjah_format_serialized_data($unserialized);
                return array(
                    'display' => $formatted,
                    'raw' => $value,
                    'type' => 'serialized',
                    'expandable' => true
                );
            }
        }

        // Try to detect and handle JSON data
        if ($this->ahjah_is_json($string_value)) {
            $json_data = json_decode($string_value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $formatted = $this->ahjah_format_json_data($json_data);
                return array(
                    'display' => $formatted,
                    'raw' => $value,
                    'type' => 'json',
                    'expandable' => true
                );
            }
        }

        // Handle long text content
        $max_length = 100;
        if (strlen($string_value) > $max_length) {
            $truncated = substr($string_value, 0, $max_length);
            $escaped_full = esc_html($string_value);
            $escaped_truncated = esc_html($truncated);

            return array(
                'display' => $escaped_truncated . '<span class="ahjah-truncated">...</span>',
                'raw' => $value,
                'type' => 'long_text',
                'expandable' => true,
                'full_text' => $escaped_full
            );
        }

        // Handle binary data (detect non-printable characters)
        if ($this->ahjah_is_binary($string_value)) {
            $size = strlen($string_value);
            return array(
                'display' => '<span class="ahjah-binary-data">[Binary data: ' . $size . ' bytes]</span>',
                'raw' => $value,
                'type' => 'binary'
            );
        }

        // Default: escape HTML and return
        return array(
            'display' => esc_html($string_value),
            'raw' => $value,
            'type' => 'text'
        );
    }

    /**
     * Check if a string contains serialized data
     *
     * @since 1.0.0
     * @param string $data The string to check
     * @return bool True if the string appears to be serialized
     */
    private function ahjah_is_serialized($data)
    {
        // Check for serialized data patterns
        if (!is_string($data) || trim($data) === '') {
            return false;
        }

        // Common serialized data patterns
        $patterns = array(
            '/^a:\d+:\{.*\}$/',  // array
            '/^s:\d+:".*";$/',   // string
            '/^i:\d+;$/',        // integer
            '/^b:[01];$/',       // boolean
            '/^O:\d+:"[^"]+":/', // object
        );

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $data)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if a string contains valid JSON
     *
     * @since 1.0.0
     * @param string $string The string to check
     * @return bool True if the string is valid JSON
     */
    private function ahjah_is_json($string)
    {
        if (!is_string($string) || trim($string) === '') {
            return false;
        }

        // Must start with { or [
        $trimmed = trim($string);
        if (!in_array($trimmed[0], array('{', '['))) {
            return false;
        }

        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }

    /**
     * Check if a string contains binary data
     *
     * @since 1.0.0
     * @param string $string The string to check
     * @return bool True if the string appears to be binary
     */
    private function ahjah_is_binary($string)
    {
        // Check for null bytes or high percentage of non-printable characters
        if (strpos($string, "\0") !== false) {
            return true;
        }

        $length = strlen($string);
        if ($length === 0) {
            return false;
        }

        $non_printable = 0;
        for ($i = 0; $i < $length; $i++) {
            $char = ord($string[$i]);
            // Count non-printable characters (excluding common whitespace)
            if ($char < 32 && !in_array($char, array(9, 10, 13))) {
                $non_printable++;
            }
        }

        // If more than 30% non-printable, consider it binary
        return ($non_printable / $length) > 0.3;
    }

    /**
     * Format serialized data for display
     *
     * @since 1.0.0
     * @param mixed $data The unserialized data
     * @return string Formatted HTML representation
     */
    private function ahjah_format_serialized_data($data)
    {
        if (is_array($data)) {
            $count = count($data);
            $preview = $count > 0 ? $this->ahjah_array_preview($data, 3) : '(empty array)';
            return '<span class="ahjah-serialized-data" data-type="array" data-count="' . $count . '">' .
                   '<span class="ahjah-data-type">[Array: ' . $count . ' items]</span> ' .
                   '<span class="ahjah-data-preview">' . esc_html($preview) . '</span>' .
                   '</span>';
        } elseif (is_object($data)) {
            $class = get_class($data);
            $props = get_object_vars($data);
            $count = count($props);
            return '<span class="ahjah-serialized-data" data-type="object">' .
                   '<span class="ahjah-data-type">[Object: ' . esc_html($class) . ']</span> ' .
                   '<span class="ahjah-data-preview">(' . $count . ' properties)</span>' .
                   '</span>';
        } else {
            return '<span class="ahjah-serialized-data" data-type="primitive">' .
                   '<span class="ahjah-data-type">[Serialized]</span> ' .
                   '<span class="ahjah-data-preview">' . esc_html(print_r($data, true)) . '</span>' .
                   '</span>';
        }
    }

    /**
     * Format JSON data for display
     *
     * @since 1.0.0
     * @param mixed $data The decoded JSON data
     * @return string Formatted HTML representation
     */
    private function ahjah_format_json_data($data)
    {
        if (is_array($data)) {
            $count = count($data);
            $preview = $count > 0 ? $this->ahjah_array_preview($data, 3) : '(empty array)';
            return '<span class="ahjah-json-data" data-type="array" data-count="' . $count . '">' .
                   '<span class="ahjah-data-type">[JSON Array: ' . $count . ' items]</span> ' .
                   '<span class="ahjah-data-preview">' . esc_html($preview) . '</span>' .
                   '</span>';
        } elseif (is_object($data)) {
            $props = get_object_vars($data);
            $count = count($props);
            $preview = $count > 0 ? $this->ahjah_object_preview($data, 3) : '(empty object)';
            return '<span class="ahjah-json-data" data-type="object" data-count="' . $count . '">' .
                   '<span class="ahjah-data-type">[JSON Object: ' . $count . ' properties]</span> ' .
                   '<span class="ahjah-data-preview">' . esc_html($preview) . '</span>' .
                   '</span>';
        } else {
            return '<span class="ahjah-json-data" data-type="primitive">' .
                   '<span class="ahjah-data-type">[JSON]</span> ' .
                   '<span class="ahjah-data-preview">' . esc_html(json_encode($data)) . '</span>' .
                   '</span>';
        }
    }

    /**
     * Create a preview of array data
     *
     * @since 1.0.0
     * @param array $array The array to preview
     * @param int $max_items Maximum items to show in preview
     * @return string Preview string
     */
    private function ahjah_array_preview($array, $max_items = 3)
    {
        if (!is_array($array) || empty($array)) {
            return '';
        }

        $items = array();
        $count = 0;

        foreach ($array as $key => $value) {
            if ($count >= $max_items) {
                $items[] = '...';
                break;
            }

            $value_str = is_string($value) ? '"' . substr($value, 0, 20) . '"' :
                        (is_numeric($value) ? $value : gettype($value));
            $items[] = $key . ': ' . $value_str;
            $count++;
        }

        return '{' . implode(', ', $items) . '}';
    }

    /**
     * Create a preview of object data
     *
     * @since 1.0.0
     * @param object $object The object to preview
     * @param int $max_props Maximum properties to show in preview
     * @return string Preview string
     */
    private function ahjah_object_preview($object, $max_props = 3)
    {
        if (!is_object($object)) {
            return '';
        }

        $props = get_object_vars($object);
        $items = array();
        $count = 0;

        foreach ($props as $key => $value) {
            if ($count >= $max_props) {
                $items[] = '...';
                break;
            }

            $value_str = is_string($value) ? '"' . substr($value, 0, 20) . '"' :
                        (is_numeric($value) ? $value : gettype($value));
            $items[] = $key . ': ' . $value_str;
            $count++;
        }

        return '{' . implode(', ', $items) . '}';
    }

    /**
     * Enqueue frontend scripts
     */
    private function ahjah_enqueue_frontend_scripts()
    {
        static $enqueued = false;

        if ($enqueued) {
            return;
        }

        wp_enqueue_script(
            'ahjah-frontend-script',
            AHJAH_PLUGIN_URL . 'assets/js/frontend.js',
            array('jquery'),
            AHJAH_VERSION,
            true
        );

        wp_enqueue_style(
            'ahjah-frontend-style',
            AHJAH_PLUGIN_URL . 'assets/css/frontend.css',
            array(),
            AHJAH_VERSION
        );

        wp_localize_script('ahjah-frontend-script', 'ahjah_frontend', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('ahjah_nonce'),
            'strings' => array(
                'loading' => __('Loading...', 'automation-helper'),
                'no_data' => __('No data found', 'automation-helper'),
                'error' => __('An error occurred while loading data', 'automation-helper'),
                'showing' => __('Showing', 'automation-helper'),
                'to' => __('to', 'automation-helper'),
                'of' => __('of', 'automation-helper'),
                'entries' => __('entries', 'automation-helper'),
                'previous' => __('Previous', 'automation-helper'),
                'next' => __('Next', 'automation-helper')
            )
        ));

        $enqueued = true;
    }

    /**
     * Plugin activation
     */
    public function ahjah_activate()
    {
        // Create necessary database tables or perform setup tasks if needed
        // For now, this plugin doesn't need any custom tables
    }

    /**
     * Plugin deactivation
     */
    public function ahjah_deactivate()
    {
        // Clean up if necessary
    }
}

// Initialize the plugin
function ahjah_automation_helper()
{
    return AHJAH_Automation_Helper::instance();
}

// Start the plugin
ahjah_automation_helper();
