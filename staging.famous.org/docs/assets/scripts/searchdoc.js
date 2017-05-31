Searchdoc = {};

Searchdoc.Navigation = new function() {
    this.initNavigation = function() {
        var _this = this;
        
        $(document).keydown(function(e) {
            _this.onkeydown(e);
        }).keyup(function(e) {
            _this.onkeyup(e);
        });
        
        this.navigationActive = true;
    }
    
    this.setNavigationActive = function(state) {
        this.navigationActive = state;
        this.clearMoveTimeout();
    }

    this.onkeyup = function(e) {
        if (!this.navigationActive) return;
        switch(e.keyCode) {
            case 37: //Event.KEY_LEFT:
            case 38: //Event.KEY_UP:
            case 39: //Event.KEY_RIGHT:
            case 40: //Event.KEY_DOWN:
            case 73: // i - qwerty
            case 74: // j
            case 75: // k
            case 76: // l
            case 67: // c - dvorak
            case 72: // h 
            case 84: // t
            case 78: // n
                this.clearMoveTimeout();
                break;
            }
    }

    this.onkeydown = function(e) {
        if (!this.navigationActive) return;
        switch(e.keyCode) {
            case 37: //Event.KEY_LEFT:
            case 74: // j (qwerty)
            case 72: // h (dvorak)
                if (this.moveLeft()) e.preventDefault();
                break;
            case 38: //Event.KEY_UP:
            case 73: // i (qwerty)
            case 67: // c (dvorak)
                if (e.keyCode == 38 || e.ctrlKey) {
                    if (this.moveUp()) e.preventDefault();
                    this.startMoveTimeout(false);
                }
                break;
            case 39: //Event.KEY_RIGHT:
            case 76: // l (qwerty)
            case 78: // n (dvorak)
                if (this.moveRight()) e.preventDefault();
                break;
            case 40: //Event.KEY_DOWN:
            case 75: // k (qwerty)
            case 84: // t (dvorak)
                if (e.keyCode == 40 || e.ctrlKey) {
                    if (this.moveDown()) e.preventDefault();
                    this.startMoveTimeout(true);
                }
                break;
            case 9: //Event.KEY_TAB:
            case 13: //Event.KEY_RETURN:
                if (this.$current) this.select(this.$current);
                break;
            case 83: // s (qwerty)
            case 79: // o (dvorak)
                if (e.ctrlKey) {
                    $('#search').focus();
                    e.preventDefault();
                }
                break;
        }
        if (e.ctrlKey && e.shiftKey) this.select(this.$current);
    }

    this.clearMoveTimeout = function() {
        clearTimeout(this.moveTimeout); 
        this.moveTimeout = null;
    }

    this.startMoveTimeout = function(isDown) {
        if (!$.browser.mozilla && !$.browser.opera) return;
        if (this.moveTimeout) this.clearMoveTimeout();
        var _this = this;
    
        var go = function() {
            if (!_this.moveTimeout) return;
            _this[isDown ? 'moveDown' : 'moveUp']();
            _this.moveTimout = setTimeout(go, 100);
        }
        this.moveTimeout = setTimeout(go, 200);
    }    
    
    this.moveRight = function() {
    }
    
    this.moveLeft = function() {
    }

    this.move = function(isDown) {
    }

    this.moveUp = function() {
        return this.move(false);
    }

    this.moveDown = function() {
        return this.move(true);
    }    
}


// scrollIntoView.js --------------------------------------

function scrollIntoView(element, view) {
    var offset, viewHeight, viewScroll, height;
    offset = element.offsetTop;
    height = element.offsetHeight;
    viewHeight = view.offsetHeight;
    viewScroll = view.scrollTop;
    if (offset - viewScroll + height > viewHeight) {
        view.scrollTop = offset - viewHeight + height;
    }
    if (offset < viewScroll) {
        view.scrollTop = offset;
    }
}

// panel.js -----------------------------------------------

Searchdoc.Panel = function(element, data, tree, frame, baseUrl) {
    this.$element = $(element);
    this.$input = $('input', element).eq(0);
    this.$result = $('.results ul', element).eq(0);
    this.frame = frame;
    this.baseUrl = baseUrl;
    this.$current = null;
    this.$view = this.$result.parent();
    this.data = data;
    this.searcher = new Searcher(data.index);
    this.tree = new Searchdoc.Tree($('.menu', element), tree, this, baseUrl);
    this.init();
}

Searchdoc.Panel.prototype = $.extend({}, Searchdoc.Navigation, new function() {
    var suid = 1;

    this.init = function() {
        var _this = this;
        var observer = function() {
            _this.search(_this.$input[0].value);
        };
        this.$input.keyup(observer);
        this.$input.click(observer); // mac's clear field
    
        this.searcher.ready(function(results, isLast) {
            _this.addResults(results, isLast);
        })

        this.initNavigation();
        this.setNavigationActive(false);
    }

    this.search = function(value, selectFirstMatch) {
        value = jQuery.trim(value).toLowerCase();
        this.selectFirstMatch = selectFirstMatch;
        if (value && value != "") {
            this.$element.removeClass('panel_tree').addClass('panel_results');
            this.tree.setNavigationActive(false);
            this.setNavigationActive(true);
        } else {
            this.$element.addClass('panel_tree').removeClass('panel_results');
            this.tree.setNavigationActive(true);
            this.setNavigationActive(false);
        }
        if (value != this.lastQuery) {
            this.lastQuery = value;
            this.firstRun = true;
            this.searcher.find(value);
        }
    }

    this.addResults = function(results, isLast) {
        var target = this.$result.get(0);
        if (this.firstRun && (results.length > 0 || isLast)) {
            this.$current = null;
            this.$result.empty();
        }
        for (var i=0, l = results.length; i < l; i++) {
            target.appendChild(renderItem.call(this, results[i]));
        };
        if (this.firstRun && results.length > 0) {
            this.firstRun = false;
            this.$current = $(target.firstChild);
            this.$current.addClass('current');
            if (this.selectFirstMatch) this.select();
            scrollIntoView(this.$current[0], this.$view[0])
        }
    }

    function renderItem(result) {

        var title = hlt(result.title);
        var description = truncate(result.snippet);

        var li = document.createElement('li');
        var a = document.createElement('a');
        a.setAttribute('href', this.baseUrl + result.path);

        var span = document.createElement('span');

        span.innerHTML = title;

        if (result.params && result.params.trim() != "") {
            span.innerHTML += '<i>' + result.params + '</i>';
        }

        if(result.namespace && result.namespace.trim() != "") {
            span.innerHTML += '<p class="namespace">' + hlt(result.namespace) + '</p>';
        }

        span.innerHTML += description;

        a.appendChild(span);
        li.appendChild(a);

        return li;
    }

    function truncate(s) {

        var MAX_CHARS = 100;

        if(s <= MAX_CHARS) {
            return s;
        }

        //add '...' if string doesn't end cleanly with an html tag
        var result = s.trim().substring(0, 100).trim();
        var endsWithTag = result.lastIndexOf(">") == result.length - 1;
        if(!endsWithTag) {
            result += "...";
        }

        return result;
    }

    function hlt(html) {
        return escapeHTML(html).replace(/\u0001/g, '<b>').replace(/\u0002/g, '</b>')
    }

    function escapeHTML(html) {
        return html.replace(/[&<>]/g, function(c) {
            return '&#' + c.charCodeAt(0) + ';';
        });
    }

}); 

// tree.js ------------------------------------------------


Searchdoc.Tree = function(element, tree, panel, baseUrl) {
    this.$element = $(element);
    this.$list = $('ul', element);
    this.tree = tree;
    this.panel = panel;
    this.baseUrl = baseUrl
    this.init();
}

Searchdoc.Tree.prototype = $.extend({}, Searchdoc.Navigation, new function() {
    this.init = function() {

        var container = this.$list[0];

        //create the menu tree
        for (var i=0, l = this.tree.length; i < l; i++) {
            var group = buildGroup(this.tree[i], this.baseUrl);
            container.appendChild(group);
        };

        this.initNavigation();
    }

    /**
     * Whether or not the specified URL is the current active URL.
     * @param url A URL to compare to the _window.location.pathname_ property
     * @returns _true_ if the URL matches _window.location.pathname_, _false_ if it does not
     */
    function isActive(url) {

        if(!url || url.trim() == "") {
            return false;
        }

        var path = window.location.pathname;
        return path.indexOf(url, path.length - url.length) !== -1;
    }

    /**
     * Build the menu link tree for a particular API group.
     * @param node
     * @param baseUrl
     * @returns {*|HTMLElement}
     */
    function buildGroup(node, baseUrl) {

        var groupName = node[2];
        var items = node[3];

        var container = document.createElement('li');
        var span = document.createElement('span');
        span.setAttribute('class', 'parent');
        span.appendChild(document.createTextNode(groupName));
        container.appendChild(span);

        var ul = document.createElement('ul');
        container.appendChild(ul);

        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            var name = item[0];
            var url = item[1];

            var li = document.createElement('li');
            var a = document.createElement('a');
            //console.log(a, url);
            a.setAttribute('href', baseUrl + url);
            a.appendChild(document.createTextNode(name));

            var active = isActive(url);

            //if active, add class 'active'
            if(active) {
                a.setAttribute('class', 'active');
            }

            li.appendChild(a);
            ul.appendChild(li);
        }

        return container;
    }
});