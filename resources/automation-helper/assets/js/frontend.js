/**
 * Automation Helper - Frontend JavaScript
 * Handles table display, pagination, search, and sorting functionality
 */

(function ($) {
  "use strict";

  /**
   * Table Display Class
   */
  class AHJAH_TableDisplay {
    constructor(container) {
      this.container = $(container);
      this.tableName = this.container.data("table");
      this.containerId = this.container.attr("id");
      this.currentPage = 1;
      this.perPage = 20;
      this.search = "";
      this.orderBy = "";
      this.order = "ASC";
      this.isLoading = false;
      this.searchTimeout = null;

      this.init();
    }

    /**
     * Initialize the table display
     */
    init() {
      this.bindEvents();
      this.loadTable();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
      const self = this;

      // Search functionality with debounce
      this.container.find(".ahjah-search").on("input", function () {
        clearTimeout(self.searchTimeout);
        const searchValue = $(this).val();

        self.searchTimeout = setTimeout(function () {
          self.search = searchValue;
          self.currentPage = 1;
          self.loadTable();
        }, 500);
      });

      // Pagination click events (using delegation)
      this.container.on("click", ".ahjah-pagination-btn", function (e) {
        e.preventDefault();

        if ($(this).hasClass("ahjah-disabled")) {
          return;
        }

        const page = $(this).data("page");
        if (page && page !== self.currentPage) {
          self.currentPage = parseInt(page);
          self.loadTable();
        }
      });

      // Column sorting events (using delegation)
      this.container.on("click", ".ahjah-sortable", function (e) {
        e.preventDefault();

        const column = $(this).data("column");

        if (self.orderBy === column) {
          // Toggle sort order
          self.order = self.order === "ASC" ? "DESC" : "ASC";
        } else {
          // New column
          self.orderBy = column;
          self.order = "ASC";
        }

        self.currentPage = 1;
        self.loadTable();
      });

      // Cell content expansion (using delegation)
      this.container.on("click", ".ahjah-long-content", function (e) {
        e.preventDefault();
        $(this).toggleClass("ahjah-expanded");
      });

      // Expandable data content (using delegation)
      this.container.on("click", ".ahjah-expand-btn", function (e) {
        e.preventDefault();
        const btn = $(this);
        const content = btn.siblings(".ahjah-expanded-content");

        if (content.hasClass("ahjah-show")) {
          content.removeClass("ahjah-show");
          btn.text("Show");
        } else {
          content.addClass("ahjah-show");
          btn.text("Hide");
        }
      });

      // Serialized/JSON data expansion
      this.container.on("click", ".ahjah-serialized-data, .ahjah-json-data", function (e) {
        e.preventDefault();
        self.expandDataContent($(this));
      });

      // Keyboard navigation for pagination
      $(document).on("keydown", function (e) {
        if (!self.container.is(":visible")) return;

        // Arrow keys for pagination when focused within container
        if (self.container.find(":focus").length > 0) {
          if (e.key === "ArrowLeft" && self.currentPage > 1) {
            e.preventDefault();
            self.currentPage--;
            self.loadTable();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            const nextBtn = self.container.find('.ahjah-pagination-btn[data-page="' + (self.currentPage + 1) + '"]');
            if (nextBtn.length && !nextBtn.hasClass("ahjah-disabled")) {
              self.currentPage++;
              self.loadTable();
            }
          }
        }
      });
    }

    /**
     * Load table data via AJAX
     */
    loadTable() {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      this.showLoading();

      const data = {
        action: "ahjah_get_table_data",
        nonce: ahjah_frontend.nonce,
        table: this.tableName,
        page: this.currentPage,
        per_page: this.perPage,
        search: this.search,
        orderby: this.orderBy,
        order: this.order,
      };

      $.post(ahjah_frontend.ajax_url, data)
        .done((response) => {
          this.handleLoadSuccess(response);
        })
        .fail((xhr, status, error) => {
          this.handleLoadError(xhr, status, error);
        })
        .always(() => {
          this.isLoading = false;
          this.hideLoading();
        });
    }

    /**
     * Handle successful data load
     */
    handleLoadSuccess(response) {
      if (response.success) {
        this.renderTable(response.data.data, response.data.columns);
        this.renderPagination(response.data.pagination);
      } else {
        this.showError(response.data || ahjah_frontend.strings.error);
      }
    }

    /**
     * Handle data load error
     */
    handleLoadError(xhr, status, error) {
      console.error("AHJAH Table Load Error:", { xhr, status, error });

      let errorMessage = ahjah_frontend.strings.error;

      if (xhr.responseJSON && xhr.responseJSON.data) {
        errorMessage = xhr.responseJSON.data;
      } else if (status === "timeout") {
        errorMessage = "Request timed out. Please try again.";
      } else if (status === "abort") {
        errorMessage = "Request was cancelled.";
      }

      this.showError(errorMessage);
    }

    /**
     * Render table HTML
     */
    renderTable(data, columns) {
      const tableContent = this.container.find(".ahjah-table-content");

      if (!data || data.length === 0) {
        tableContent.html(this.getNoDataHTML());
        return;
      }

      let html = '<table class="ahjah-data-table" data-testid="ahjah-data-table">';

      // Table header
      html += "<thead><tr>";
      columns.forEach((column) => {
        const sortClass = this.getSortClass(column);
        const sortAttr = this.getSortAttribute(column);

        html += `<th class="ahjah-sortable ${sortClass}" data-column="${column}" ${sortAttr} data-testid="ahjah-header-${column}">
                    ${this.escapeHtml(column)}
                </th>`;
      });
      html += "</tr></thead>";

      // Table body
      html += "<tbody>";
      data.forEach((row, index) => {
        html += `<tr data-testid="ahjah-row-${index}">`;
        columns.forEach((column) => {
          const cellData = row[column];
          const cellContent = this.formatCellContent(cellData, column, index);

          html += `<td data-testid="ahjah-cell-${column}-${index}" class="${this.getCellClass(cellData)}">
                        ${cellContent}
                    </td>`;
        });
        html += "</tr>";
      });
      html += "</tbody></table>";

      tableContent.html(html);

      // Apply search highlighting if there's a search term
      if (this.search) {
        this.highlightSearchTerms();
      }
    }

    /**
     * Render pagination HTML
     */
    renderPagination(pagination) {
      const paginationWrapper = this.container.find(".ahjah-pagination-wrapper");

      // Pagination info
      const info = `${ahjah_frontend.strings.showing} ${pagination.start_item} ${ahjah_frontend.strings.to} ${pagination.end_item} ${ahjah_frontend.strings.of} ${pagination.total_items} ${ahjah_frontend.strings.entries}`;
      this.container.find(".ahjah-pagination-info").html(info);

      // Pagination controls
      let controlsHTML = "";

      // Previous button
      const prevDisabled = pagination.current_page <= 1 ? "ahjah-disabled" : "";
      controlsHTML += `<button class="ahjah-pagination-btn ${prevDisabled}" data-page="${
        pagination.current_page - 1
      }" data-testid="ahjah-prev-btn">
                ${ahjah_frontend.strings.previous}
            </button>`;

      // Page numbers
      const startPage = Math.max(1, pagination.current_page - 2);
      const endPage = Math.min(pagination.total_pages, pagination.current_page + 2);

      // First page
      if (startPage > 1) {
        controlsHTML += `<button class="ahjah-pagination-btn" data-page="1" data-testid="ahjah-page-1">1</button>`;
        if (startPage > 2) {
          controlsHTML += `<span class="ahjah-pagination-ellipsis" data-testid="ahjah-ellipsis-start">...</span>`;
        }
      }

      // Page range
      for (let i = startPage; i <= endPage; i++) {
        const currentClass = i === pagination.current_page ? "ahjah-current" : "";
        controlsHTML += `<button class="ahjah-pagination-btn ${currentClass}" data-page="${i}" data-testid="ahjah-page-${i}">${i}</button>`;
      }

      // Last page
      if (endPage < pagination.total_pages) {
        if (endPage < pagination.total_pages - 1) {
          controlsHTML += `<span class="ahjah-pagination-ellipsis" data-testid="ahjah-ellipsis-end">...</span>`;
        }
        controlsHTML += `<button class="ahjah-pagination-btn" data-page="${pagination.total_pages}" data-testid="ahjah-page-${pagination.total_pages}">${pagination.total_pages}</button>`;
      }

      // Next button
      const nextDisabled = pagination.current_page >= pagination.total_pages ? "ahjah-disabled" : "";
      controlsHTML += `<button class="ahjah-pagination-btn ${nextDisabled}" data-page="${
        pagination.current_page + 1
      }" data-testid="ahjah-next-btn">
                ${ahjah_frontend.strings.next}
            </button>`;

      this.container.find(".ahjah-pagination-controls").html(controlsHTML);
    }

    /**
     * Get sort class for column header
     */
    getSortClass(column) {
      if (this.orderBy === column) {
        return this.order === "ASC" ? "ahjah-sorted-asc" : "ahjah-sorted-desc";
      }
      return "";
    }

    /**
     * Get sort attribute for accessibility
     */
    getSortAttribute(column) {
      if (this.orderBy === column) {
        return `aria-sort="${this.order === "ASC" ? "ascending" : "descending"}"`;
      }
      return 'aria-sort="none"';
    }

    /**
     * Show loading state
     */
    showLoading() {
      this.container.find(".ahjah-loading").show();
      this.container.find(".ahjah-table-content").css("opacity", "0.5");
    }

    /**
     * Hide loading state
     */
    hideLoading() {
      this.container.find(".ahjah-loading").hide();
      this.container.find(".ahjah-table-content").css("opacity", "1");
    }

    /**
     * Show error message
     */
    showError(message) {
      const errorHTML = `<div class="ahjah-error" data-testid="ahjah-error">${this.escapeHtml(message)}</div>`;
      this.container.find(".ahjah-table-content").html(errorHTML);
      this.container.find(".ahjah-pagination-wrapper").hide();
    }

    /**
     * Get no data HTML
     */
    getNoDataHTML() {
      return `<div class="ahjah-no-data" data-testid="ahjah-no-data">${ahjah_frontend.strings.no_data}</div>`;
    }

    /**
     * Escape HTML entities
     */
    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }

    /**
     * Truncate text to specified length
     */
    truncateText(text, maxLength) {
      if (!text || text.length <= maxLength) {
        return text;
      }
      return text.substring(0, maxLength) + "...";
    }

    /**
     * Format cell content based on data type
     */
    formatCellContent(cellData, column, index) {
      if (!cellData || typeof cellData === 'string') {
        // Legacy format - just display as text
        const cellValue = cellData || "";
        const cellClass = cellValue.length > 100 ? "ahjah-long-content" : "";
        return `<div class="ahjah-cell-content ${cellClass}" title="${this.escapeHtml(cellValue)}">
                  ${this.escapeHtml(this.truncateText(cellValue, 200))}
                </div>`;
      }

      // New format with metadata
      let content = cellData.display || '';

      if (cellData.expandable) {
        if (cellData.type === 'long_text' && cellData.full_text) {
          content += `<button class="ahjah-expand-btn" data-full-text="${this.escapeHtml(cellData.full_text)}">Show More</button>`;
        } else if (cellData.type === 'serialized' || cellData.type === 'json') {
          content += `<button class="ahjah-expand-btn" data-raw="${this.escapeHtml(JSON.stringify(cellData.raw))}">Expand</button>`;
        }
      }

      return `<div class="ahjah-cell-content" data-type="${cellData.type}">${content}</div>`;
    }

    /**
     * Get CSS class for cell based on data type
     */
    getCellClass(cellData) {
      if (!cellData || typeof cellData === 'string') {
        return '';
      }

      const classes = [];

      if (cellData.type === 'long_text') {
        classes.push('ahjah-long-cell');
      } else if (cellData.type === 'null' || cellData.type === 'empty') {
        classes.push('ahjah-short-cell');
      }

      return classes.join(' ');
    }

    /**
     * Highlight search terms in the table
     */
    highlightSearchTerms() {
      if (!this.search || this.search.length < 2) {
        return;
      }

      const searchTerm = this.search.toLowerCase();
      const tableContent = this.container.find('.ahjah-table-content');

      // Find all text nodes and highlight matches
      this.highlightInElement(tableContent[0], searchTerm);
    }

    /**
     * Recursively highlight search terms in an element
     */
    highlightInElement(element, searchTerm) {
      if (element.nodeType === Node.TEXT_NODE) {
        const text = element.textContent;
        const lowerText = text.toLowerCase();

        if (lowerText.includes(searchTerm)) {
          const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
          const highlightedHTML = text.replace(regex, '<span class="ahjah-search-highlight">$1</span>');

          if (highlightedHTML !== text) {
            const wrapper = document.createElement('span');
            wrapper.innerHTML = highlightedHTML;
            element.parentNode.replaceChild(wrapper, element);
          }
        }
      } else if (element.nodeType === Node.ELEMENT_NODE) {
        // Skip highlighting in certain elements
        if (element.classList && (
          element.classList.contains('ahjah-data-type') ||
          element.classList.contains('ahjah-expand-btn')
        )) {
          return;
        }

        // Process child nodes
        const children = Array.from(element.childNodes);
        children.forEach(child => this.highlightInElement(child, searchTerm));
      }
    }

    /**
     * Escape special regex characters
     */
    escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Expand data content (for serialized/JSON data)
     */
    expandDataContent(element) {
      const rawData = element.find('.ahjah-expand-btn').data('raw');
      if (!rawData) return;

      try {
        const parsed = JSON.parse(rawData);
        const formatted = this.formatExpandedData(parsed);

        // Create or toggle expanded content
        let expandedDiv = element.siblings('.ahjah-expanded-content');
        if (expandedDiv.length === 0) {
          expandedDiv = $(`<div class="ahjah-expanded-content">${formatted}</div>`);
          element.parent().append(expandedDiv);
        }

        expandedDiv.toggleClass('ahjah-show');
      } catch (e) {
        console.error('Error expanding data:', e);
      }
    }

    /**
     * Format expanded data for display
     */
    formatExpandedData(data) {
      if (typeof data === 'string') {
        return this.escapeHtml(data);
      }

      try {
        return this.escapeHtml(JSON.stringify(data, null, 2));
      } catch (e) {
        return this.escapeHtml(String(data));
      }
    }
  }

  /**
   * Initialize all table displays on the page
   */
  function ahjah_init_table_displays() {
    $(".ahjah-table-container").each(function () {
      if (!$(this).data("ahjah-initialized")) {
        new AHJAH_TableDisplay(this);
        $(this).data("ahjah-initialized", true);
      }
    });
  }

  /**
   * Document ready and dynamic content handling
   */
  $(document).ready(function () {
    ahjah_init_table_displays();

    // Handle dynamically added content (for AJAX-loaded pages)
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "childList") {
          $(mutation.addedNodes)
            .find(".ahjah-table-container")
            .each(function () {
              if (!$(this).data("ahjah-initialized")) {
                new AHJAH_TableDisplay(this);
                $(this).data("ahjah-initialized", true);
              }
            });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
})(jQuery);
