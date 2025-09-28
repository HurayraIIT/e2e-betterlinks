/**
 * Automation Helper - Enhanced Admin JavaScript
 * Handles the new admin interface with table listing, copy functionality, and row counts
 */

(function ($) {
  "use strict";

  /**
   * Admin Interface Class
   */
  class AHJAH_AdminInterface {
    constructor() {
      this.isLoadingCounts = false;
      this.copyTimeout = null;

      this.init();
    }

    /**
     * Initialize the admin interface
     */
    init() {
      this.bindEvents();
      this.loadTableCounts();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
      const self = this;

      // Copy button clicks
      $(document).on('click', '.ahjah-copy-btn', function(e) {
        e.preventDefault();
        const shortcode = $(this).data('shortcode');
        const tableName = $(this).data('table');
        self.copyShortcode(shortcode, tableName, $(this));
      });

      // Keyboard shortcuts
      $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
          self.hideNotification();
        }
      });
    }

    /**
     * Load table row counts via AJAX
     */
    loadTableCounts() {
      if (this.isLoadingCounts) {
        return;
      }

      this.isLoadingCounts = true;
      this.showLoadingIndicator();

      const data = {
        action: 'ahjah_get_table_counts',
        nonce: ahjah_ajax.nonce
      };

      $.post(ahjah_ajax.ajax_url, data)
        .done((response) => {
          this.handleCountsSuccess(response);
        })
        .fail((xhr, status, error) => {
          this.handleCountsError(xhr, status, error);
        })
        .always(() => {
          this.isLoadingCounts = false;
          this.hideLoadingIndicator();
        });
    }

    /**
     * Handle successful counts response
     */
    handleCountsSuccess(response) {
      if (response.success && response.data) {
        Object.keys(response.data).forEach(tableName => {
          const countData = response.data[tableName];
          const $countCell = $(`.ahjah-row-count[data-table="${tableName}"]`);

          if (countData.error) {
            $countCell.html(`<span class="ahjah-count-error">${countData.error}</span>`);
          } else {
            $countCell.html(countData.formatted || countData.count);
          }
        });
      } else {
        this.showCountsError('Failed to load table counts');
      }
    }

    /**
     * Handle counts loading error
     */
    handleCountsError(xhr, status, error) {
      console.error('AHJAH Admin - Counts Error:', { xhr, status, error });
      this.showCountsError('Error loading table information');
    }

    /**
     * Show counts error message
     */
    showCountsError(message) {
      $('.ahjah-row-count').html(`<span class="ahjah-count-error">${message}</span>`);
    }

    /**
     * Copy shortcode to clipboard
     */
    async copyShortcode(shortcode, tableName, $button) {
      if (!shortcode) {
        this.showNotification('No shortcode to copy', 'error');
        return;
      }

      try {
        // Modern clipboard API
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shortcode);
          this.showCopySuccess($button, tableName);
        } else {
          // Fallback for older browsers
          this.fallbackCopy(shortcode, $button, tableName);
        }
      } catch (error) {
        console.error('Copy failed:', error);
        this.fallbackCopy(shortcode, $button, tableName);
      }
    }

    /**
     * Fallback copy method for older browsers
     */
    fallbackCopy(text, $button, tableName) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          this.showCopySuccess($button, tableName);
        } else {
          this.showNotification('Failed to copy shortcode', 'error');
        }
      } catch (error) {
        console.error('Fallback copy failed:', error);
        this.showNotification('Failed to copy shortcode', 'error');
      }

      document.body.removeChild(textArea);
    }

    /**
     * Show copy success feedback
     */
    showCopySuccess($button, tableName) {
      // Update button state
      const originalText = $button.html();
      $button.addClass('ahjah-copied').html('<span class="dashicons dashicons-yes-alt"></span> Copied!');

      // Show notification
      this.showNotification(`Shortcode for "${tableName}" copied to clipboard!`, 'success');

      // Reset button after 2 seconds
      setTimeout(() => {
        $button.removeClass('ahjah-copied').html(originalText);
      }, 2000);
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'success') {
      const $notification = $('#ahjah-copy-notification');
      const $text = $notification.find('.ahjah-notification-text');

      $text.text(message);
      $notification.removeClass('ahjah-error').addClass(type === 'error' ? 'ahjah-error' : '').fadeIn(300);

      // Clear existing timeout
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout);
      }

      // Auto-hide after 4 seconds
      this.copyTimeout = setTimeout(() => {
        this.hideNotification();
      }, 4000);
    }

    /**
     * Hide notification
     */
    hideNotification() {
      $('#ahjah-copy-notification').fadeOut(200);
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout);
        this.copyTimeout = null;
      }
    }

    /**
     * Show loading indicator
     */
    showLoadingIndicator() {
      $('#ahjah-row-count-loading').show();
    }

    /**
     * Hide loading indicator
     */
    hideLoadingIndicator() {
      $('#ahjah-row-count-loading').hide();
    }
  }

  /**
   * Initialize admin interface on document ready
   */
  $(document).ready(function () {
    if ($('.ahjah-admin-table').length) {
      new AHJAH_AdminInterface();
    }
  });

})(jQuery);
