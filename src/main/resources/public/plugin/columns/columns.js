/*** 
  * Copyright (c) 2014 
  * Licensed under the MIT License.
  *
  * Author: Michael Eisenbraun
  * Version: 2.2.2
  * Requires: jQuery 1.7.2+
  * Documentation: http://eisenbraun.github.io/columns/
  */

/*** 
 * Copyright (c) 2014 
 * Licensed under the MIT License.
 *
 * Author: Michael Eisenbraun
 * Version: 2.2.2
 * Requires: jQuery 1.7.2+
 * Documentation: http://eisenbraun.github.io/columns/
 */

if (!window.console) {
    var console = {
        log: function() { }
    };
}

(function($) {
    $.fn.columns = function(options) {
        var val = [];
        var args = Array.prototype.slice.call(arguments, 1);
    
        if (typeof options === 'string') {
            this.each(function() {
            
                var instance = $.data(this, 'columns');
                if (typeof instance !== 'undefined' && $.isFunction(instance[options])) {
                    var methodVal = instance[options].apply(instance, args);
                    if (methodVal !== undefined && methodVal !== instance) {
                        val.push(methodVal);
                    }
                } else {
                    return $.error('No such method "' + options + '" for Columns');
                }
            });
                
        } else {
            this.each(function() {
                if (!$.data(this, 'columns')) {
                    $.data(this, 'columns', new Columns(this, options));
                }
            });
        }
    
        if (val.length === 0) {
            return this.data('columns');
        } else if (val.length === 1) {
            return val[0];
        } else {
            return val;
        }
    };

    var Columns = function(element, options) {
        this.$el = $(element);
                
        if (options) {
            $.extend( this, options );
        }
        
        /** PLUGIN CONSTANTS */
        this.VERSION = '2.2.2';

        /** PLUGIN METHODS */

        /**
        * SORT:
        * Arranges the data object in the order based on the object key
        * stored in the variable `sortBy` and the direction stored in the 
        * variable `reverse`.
        *
        * A date primer has been created. If the object value matches the 
        * date pattern, it be sorted as a date instead or a string or number.
        */
        this.sort = function() {
            var $this = this;
            var date = /^(Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|September|Oct|October|Nov|November|Dec|December|(0?\d{1})|(10|11|12))(-|\s|\/|\.)(0?[1-9]|(1|2)[0-9]|3(0|1))(-|\s|\/|\.|,\s)(19|20)?\d\d$/i;
            
            function objectSort(field, reverse, primer){
                reverse = (reverse) ? -1 : 1;
                
                return function(a,b){
                
                    a = a[field];
                    b = b[field];
            
                    if (date.test(a) && date.test(b)) {
                        a = new Date(a);
                        a = Date.parse(a);
                        
                        b = new Date(b);
                        b = Date.parse(b);
                    } else if (typeof(primer) !== 'undefined'){
                        a = primer(a);
                        b = primer(b);
                    }
            
                    if (a<b) {
                        return reverse * -1;
                    }
                    
                    if (a>b) {
                        return reverse * 1;
                    }

                    return 0;
                };
            }
            
            if ($this.total && $this.sortBy && typeof $this.data[0][$this.sortBy] !== 'undefined') {
                $this.data.sort(objectSort($this.sortBy, $this.reverse));
            }
        };

        /**
        * FILTER: 
        * Filters out all row from the data object that does not match the 
        * the search query stored in the `query`. 
        * 
        * If the data object value is a string, the query can be anywhere in value
        * regardless of case. 
        *
        * If the data object value is a number, the query must match value only, not
        * data type. 
        */
        this.filter = function() {
            var $this = this,
            length = $this.searchableFields.length;

            if ($this.query) {
                var re = new RegExp($this.query, "gi");

                $this.data = $.grep($this.data, function(obj) {
                    for (var key = 0; key < length; key++) {
                        if (typeof obj[$this.searchableFields[key]] === 'string') {
                            if (obj[$this.searchableFields[key]].match(re)) {
                                return true;
                            }
                        } else if (typeof obj[$this.searchableFields[key]] === 'number') {
                            if (obj[$this.searchableFields[key]] == $this.query) {
                                return true;
                            }
                        }
                    }
                    return false;
                });
            }

            /** setting data total */ 
            $this.total = $this.data.length;
        };

        /**
        * PAGINATE: 
        * Calculates the number of pages, the current page number and the exact
        * rows to display. 
        */
        this.paginate = function() {
            var $this = this;

            /** calculate the number of pages */
            $this.pages = Math.ceil($this.data.length/$this.size);
            
            /** retrieve page number */
            $this.page = ($this.page <= $this.pages ? $this.page : 1);
            
            /** set range of rows */ 
            $this.setRange(); 
            
            $this.data = $this.data.slice($this.range.start-1,$this.range.end);

        };

        /**
        * CONDITION: 
        * Only displays the data object rows that meet the given criteria.
        * 
        * Condition vs Filter: 
        * Condition is true if the value meets a determined conditional statement, 
        * which is found in the schema. Condition is column specific. Since conditions 
        * are not subject to the end users actions, condition is only checked once during
        * initialization.
        *
        * Filter is true if the value matches the query. A query is compared across 
        * all searchable columns. Filter is checked every time there is a query value.
        *
        *
        */
        this.condition = function() {
            var $this = this,
            schema = [];

            if ($this.schema) {
                var dataLength = $this.data.length,
                schemaLength = $this.schema.length;

                for (var row = 0; row < dataLength; row++) {
                    var data = $this.data[row],
                    temp = {};
                    
                    for (var key = 0; key < schemaLength; key++) {
                        var val = $this.schema[key]; 

                        if(val.condition) {
                            if(!val.condition(data[val.key])) {
                                temp = null;
                                break;
                            }
                        }
                        
                        temp[val.key] = data[val.key];
                    }
                    
                    if (temp) {
                        schema.push(temp);
                    }
                }
                
                $this.data = schema;
            }
        };

        /**
        * CHEVRON
        * This a shortcut for compiling and render a Mustache template and data.
        */
        this.chevron = function(template, data) {
            return Mustache.render(template, data);
        };
        
        this.create = function() {
            var $this = this;

            //Building Data
            $this.resetData();

            if($this.searching) {
                $this.filter();
            }

            if($this.sorting) { 
                $this.sort();
            }
            
            if($this.paginating) {
                $this.paginate();
            }
            

            /** Building Column Elements */
            function buildThead() {
                $this.thead = [];
                
                $.each($this.schema, function(key, col) {
                    if (!col.hide) {
                        var th = {};
                        
                        if ($.inArray(col.key,$this.sortableFields) === -1) {
                            th.notSortable = true;
                        } else if ($this.sortBy === col.key) {
                            if ($this.reverse) {
                                th.sortedDown = true;
                            } else {
                                th.sortedUp = true;
                            }
                        } else {
                            th.sortable = true;
                        }
                        
                        th.key = col.key;
                        th.header = col.header;
                        
                        $this.thead.push(th);
                    }
                });
            }

            function buildRows(key, row) {
                var tr = [];
                
                if (key%2 === 0) {
                    tr.push('<tr data-columns-row-id="'+key+'" class="'+$this.evenRowClass+'">');
                } else {
                    tr.push('<tr data-columns-row-id="'+key+'" class="'+$this.oddRowClass+'">');
                }
                 
                $.each($this.schema, function(key, col) {
                    if (!col.hide) {
                        if (col.template) {
                            tr.push('<td>'+$this.chevron(col.template, row)+'</td>');
                        } else {                        	
                        	if(Array.isArray(row[col.key]) && !($.type(row[col.key][0]) === "string")){
                        		try{
                        			var results = row[col.key];
	                                
                        			var tempTable =$('<table/>');
	                        		var tempDiv= $("<div/>");
	                        		
	                        		var keys=[];
	                                results.forEach(function(result){for(var key in result){if(key!="_id"){if(!keys.includes(key)){keys.push(key)}}}});
	                            	var tempth = $('<tr/>');
	                                keys.forEach(function(key){
	                                	tempth.append("<th>" +key+ "</th>");
	                                });
	                                tempTable.append(tempth);
	                                results.forEach(function(resultrow){
	                                	var temptr = $('<tr/>');
	                                	keys.forEach(function(resultkey){
	                                		temptr.append("<td>" + resultrow[resultkey] + "</td>");
	                                	});
	                                	tempTable.append(temptr);
	                                });
	                                tempDiv.append(tempTable);
	                        		tr.push('<td>'+tempDiv[0].innerHTML+'</td>');
                        		}
                        		catch(e)
                        		{
                        			tr.push('<td>'+(row[col.key]?row[col.key]:'')+'</td>');	
                        		}
                        	}
                        	else{	
                        		tr.push('<td>'+(row[col.key]?row[col.key]:'')+'</td>');
                        	}
                        }
                    }
                });
                
                tr.push('</tr>');
                
                return tr;
            }

            function buildShowRowsMenu() {
                var menu = [];
                
                menu.push('<select>');
                
                $.each($this.showRows, function(key, val) {
                    var option = '<option value="'+val+'"';
                    
                    if(val === $this.size) {
                        option += 'selected="selected"';
                    }
                    
                    option += '>'+val+'</option>';
                    
                    menu.push(option);
                });
                
                menu.push('</select>');

                $this.showRowsMenu = menu.join('');
            }
            
            function buildTable() {
                $this.rows = [];

                if($this.total) {
                    $.each($this.data, function(key, row) {
                        if (key === 0) {
                            buildThead();
                        }
                        $this.rows.push(buildRows(key, row).join(''));
                    });
                } else { 
                    $this.rows.push('<tr class="'+$this.evenRowClass+'"><td colspan="'+$this.schema.length+'"><em>No Results</em></td>');

                }
            }
            
            buildTable();
            buildShowRowsMenu();
            
            /** Creating Table from Mustache Template */
            var view = {
                prevPage: $this.page-1,
                nextPage: $this.page+1,
                prevPageExists: $this.pageExists($this.page-1),
                nextPageExists: $this.pageExists($this.page+1),
                resultRange: $this.range,
                tableTotal: $this.total,
                showRowsMenu: $this.showRowsMenu,
                rows: $this.rows,
                headers: $this.thead,
                query: $this.query,
                search: $this.search,
                table: $this.table
            };

            $.extend($this.view, view);

            /** Calling plugins, if any */
            if ($this.plugins) {
                $.each($this.plugins, function(key, val) {
                    if (typeof ColumnsPlugins !== 'undefined') {
                        if (typeof ColumnsPlugins[val] !== 'undefined') {
                            ColumnsPlugins[val].create.call($this);
                        }
                    }
                });
            }

            if ($this.search) {
                $this.$el.html($this.chevron($this.template, $this.view));
                $this.search = false;
            } else {
                $('[data-columns-table]', $this.$el).remove();
                $this.$el.append($this.chevron($this.template, $this.view));
            }

            return true;
        };
        
        this.init = function() {
            var $this = this;

            function buildSchema() {
                $this.schema = [];
                $.each($this.data[0], function(key) {
                    $this.schema.push({"header":key, "key":key});
                });
            }
            
            function buildSearchableFields() {
                $this.searchableFields = [];
                $.each($this.data[0], function(key) {
                    $this.searchableFields.push(key);
                });
            }
            
            function buildSortableFields() {
                $this.sortableFields = [];
                $.each($this.data[0], function(key) {
                    $this.sortableFields.push(key);
                });
            }
            
            function getTemplateFile() {
                $.ajax({
                    url: $this.templateFile,
                    async: false,
                    success: function(template) {
                        $this.template = template;
                    },
                    error: function() {
                        $.error('Template could not be found.');
                    }
                });
            }
            
            if ($.isArray($this.data)) {
                $this.master = [];
                $this.view = {};
                
                /** setting up DOM */
                $this.$el.addClass('columns');

                /** creating listeners */

                /** sort listener */
                $this.$el.on('click', '.ui-table-sortable', function(event) {
                    var sortBy = $(this).data('columns-sortby');
                    
                    if ($this.sortBy === sortBy) {
                        $this.reverse = ($this.reverse) ? false : true;
                    }

                    $this.sortBy = sortBy

                    $this.sortHandler(event);
                });

                /** page listener */
                $this.$el.on('click', '.ui-table-control-next, .ui-table-control-prev', function(event) {
                    $this.page = $(this).data('columns-page');
                    
                    $this.pageHandler(event);
                });

                /** search listener */
                $this.$el.on('keyup', '.ui-table-search', function(event) {
                    $this.query = $(this).val();
                    
                    $this.searchHandler(event); 
                });

                /** size listener */
                $this.$el.on('change', '.ui-table-size select', function(event) {
                    $this.size = parseInt($(this).val());
                    
                    $this.sizeHandler(event);
                });

                /** Calling plugins, if any */
                if ($this.plugins) {
                    $.each($this.plugins, function(key, val) {
                        if (typeof ColumnsPlugins !== 'undefined') {
                            if (typeof ColumnsPlugins[val] !== 'undefined') {
                                ColumnsPlugins[val].init.call($this);
                            }
                        }
                    });
                }

                /** condition never change, so only checked once. */
                if($this.conditioning) {
                    $this.condition();
                }

                /** updating defaults */
                if (!$this.schema) {
                    buildSchema();
                }
                
                if (!$this.searchableFields) {
                    buildSearchableFields();
                }
                
                if (!$this.sortableFields) {
                    buildSortableFields();
                }
                
                if ($this.templateFile) {
                    getTemplateFile();
                }

                /** making a master copy of data */
                $.extend($this.master, $this.data);

                /** creating columns table */
                $this.create();

            } else {
                $.error('The "data" parameter must be an array.');
            }
        
        };
        
        this.init();
    };

    Columns.prototype = {

        //defaults
        evenRowClass: "ui-table-rows-even",
        oddRowClass: "ui-table-rows-odd",
        liveSearch: true,
        page: 1,
        pages: 1,
        plugins: null,
        query: null,
        reverse: false,
        pagination: true,
        schema: null,
        search: true,
        searchableFields: null,
        showRows: [5, 10, 25, 50,1000],
        size: 5,
        sortableFields: null,
        sortBy: null,
        table: true,
        templateFile: null,
        template: '<!-- Search Box: Only rendered while search is true --> {{#search}} <div class="ui-columns-search"> <input class="ui-table-search" placeholder="Search" type="text" name="query" data-columns-search="true" value="{{query}}" /> </div> {{/search}} <!-- Search Box: Only rendered while search is true --> <!-- Columns Table: Only rendered while table is true --> {{#table}} <div class="ui-columns-table" data-columns-table="true"> <table class="ui-table"> <!-- Columns Table Head: Headers have 4 possible states (sortable, notSortable, sortedUp, sortedDown) --> <thead> {{#headers}} {{#sortable}} <th class="ui-table-sortable" data-columns-sortby="{{key}}">{{header}}</th> {{/sortable}} {{#notSortable}} <th class="">{{header}}</th> {{/notSortable}} {{#sortedUp}} <th class="ui-table-sort-up ui-table-sortable" data-columns-sortby="{{key}}">{{header}} <span class="ui-arrow">&#x25B2;</span></th> {{/sortedUp}} {{#sortedDown}} <th class="ui-table-sort-down ui-table-sortable" data-columns-sortby="{{key}}">{{header}} <span class="ui-arrow">&#x25BC;</span></th> {{/sortedDown}} {{/headers}} </thead> <!-- Columns Table Head: Headers have 4 possible states (sortable, notSortable, sortedUp, sortedDown) --> <!-- Columns Table Body: Table columns are rendered outside of this template  --> <tbody> {{#rows}} {{{.}}} {{/rows}} </tbody> <!-- Columns Table Body: Table columns are rendered outside of this template  --> </table> <!-- Columns Controls  --> <div class="ui-table-footer"> <span class="ui-table-size">Show rows: {{{showRowsMenu}}}</span> <span class="ui-table-results">Results: <strong>{{resultRange.start}} &ndash; {{resultRange.end}}</strong> of <strong>{{tableTotal}}</strong> </span> <span class="ui-table-controls"> {{#prevPageExists}} <span class="ui-table-control-prev" data-columns-page="{{prevPage}}"> <img src="images/arrow-left.png"> </span> {{/prevPageExists}} {{^prevPageExists}} <span class="ui-table-control-disabled"> <img src="images/arrow-left.png"> </span> {{/prevPageExists}} {{#nextPageExists}} <span class="ui-table-control-next" data-columns-page="{{nextPage}}"> <img src="images/arrow-right.png"> </span> {{/nextPageExists}} {{^nextPageExists}} <span class="ui-table-control-disabled"> <img src="images/arrow-right.png"> </span> {{/nextPageExists}} </span> </div> <!-- Columns Controls  --> </div> {{/table}} <!-- Columns Table: Only rendered while table is true -->',

        //functionality
        conditioning: true,
        paginating: true,
        searching: true,
        sorting: true,


        //Handlers
        pageHandler: function() {
            this.create();
        },
        searchHandler: function(event) { 
            if(this.liveSearch) {
                this.create();
            } else {
                if(event.keyCode == '13') {
                    this.create();
                }
            }
        },
        sizeHandler: function() {
            this.create();
        },
        sortHandler: function() {
            this.page = 1;
            this.create();
        },

        //API
        destroy: function() {
            this.$el.data('columns', null);
            this.$el.empty();
            return true;
        }, 
        getObject: function() {
            return this;
        },
        getPage: function() {
            return this.page;
        },
        getQuery: function() {
            return this.query;
        },
        getRange: function() {
            return this.range;
        },
        getRows: function() {
            return this.rows;
        },
        getShowRowsMenu: function() {
            return this.showRowsMenu;
        },
        getTemplate: function() {
            return this.template;
        },
        getThead: function() {
            return this.thead;
        },
        getTotal: function() {
            return this.total;
        },
        getVersion: function() {
            return this.VERSION;
        },
        getView: function() {
            return this.view;
        },
        gotoPage: function(p) {
            if(this.pageExists(p)) {
                this.page = p;
                this.create();
                return true;
            }
            
            return false;
        },
        pageExists: function(p) {
            return (p > 0 && p <= this.pages) ? true : false;
        },
        resetData: function(d) {
            this.data = this.master.slice(0);
            return this.data;
        },
        setMaster: function(d) {
            if ($.isArray(d)) {
                this.master = d;
                return true;
            } 

            return false;
        },
        setPage: function(p) { 
            this.page = (this.pageExists(p) ? p : this.page); 
            return this.page; 
        },
        setRange: function() { 
            var start = ((this.page -1) * (this.size));
            var end = (start + this.size < this.total) ? start + this.size : this.total;
        
            this.range = {"start":start+1, "end":end};
        },
        setTotal: function(t) {
            this.total = t;

            return true;
        },

        //performance tracking
        startTime: null, 
        endTime: null,
        startTimer: function() { 
            var now = new Date();
            this.startTime =  now.getTime(); 
        }, 
        endTimer: function() {
            var now = new Date(); 
            this.endTime =  now.getTime();
        },
        getTimer: function() { 
            console.log((this.endTime - this.startTime)/1000);
        }
    };
    
})(jQuery);




/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/

(function (global, factory) {
    global.Mustache = factory({}); // <script>
}(this, function (mustache) {

  var Object_toString = Object.prototype.toString;
  var isArray = Array.isArray || function (object) {
    return Object_toString.call(object) === '[object Array]';
  };

  function isFunction(object) {
    return typeof object === 'function';
  }

  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var RegExp_test = RegExp.prototype.test;
  function testRegExp(re, string) {
    return RegExp_test.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }
  
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate(template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags(tags) {
      if (typeof tags === 'string')
        tags = tags.split(spaceRe, 2);

      if (!isArray(tags) || tags.length !== 2)
        throw new Error('Invalid tags: ' + tags);

      openingTagRe = new RegExp(escapeRegExp(tags[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tags[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tags[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
      case '^':
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case '/':
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var index = this.tail.search(re), match;

    switch (index) {
    case -1:
      match = this.tail;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context(view, parentContext) {
    this.view = view == null ? {} : view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function (name) {
    var cache = this.cache;

    var value;
    if (name in cache) {
      value = cache[name];
    } else {
      var context = this, names, index;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          while (value != null && index < names.length)
            value = value[names[index++]];
        } else {
          value = context.view[name];
        }

        if (value != null)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer() {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function (tokens, context, partials, originalTemplate) {
    var buffer = '';

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    var self = this;
    function subRender(template) {
      return self.render(template, context, partials);
    }

    var token, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
        value = context.lookup(token[1]);

        if (!value)
          continue;

        if (isArray(value)) {
          for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
            buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
          }
        } else if (typeof value === 'object' || typeof value === 'string') {
          buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
        } else if (isFunction(value)) {
          if (typeof originalTemplate !== 'string')
            throw new Error('Cannot use higher-order sections without the original template');

          // Extract the portion of the original template that the section contains.
          value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

          if (value != null)
            buffer += value;
        } else {
          buffer += this.renderTokens(token[4], context, partials, originalTemplate);
        }

        break;
      case '^':
        value = context.lookup(token[1]);

        // Use JavaScript's definition of falsy. Include empty arrays.
        // See https://github.com/janl/mustache.js/issues/186
        if (!value || (isArray(value) && value.length === 0))
          buffer += this.renderTokens(token[4], context, partials, originalTemplate);

        break;
      case '>':
        if (!partials)
          continue;

        value = isFunction(partials) ? partials(token[1]) : partials[token[1]];

        if (value != null)
          buffer += this.renderTokens(this.parse(value), context, partials, value);

        break;
      case '&':
        value = context.lookup(token[1]);

        if (value != null)
          buffer += value;

        break;
      case 'name':
        value = context.lookup(token[1]);

        if (value != null)
          buffer += mustache.escape(value);

        break;
      case 'text':
        buffer += token[1];
        break;
      }
    }

    return buffer;
  };

  mustache.name = "mustache.js";
  mustache.version = "0.8.1";
  mustache.tags = [ "{{", "}}" ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function (template, view, partials) {
    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.
  mustache.to_html = function (template, view, partials, send) {
    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;

}));