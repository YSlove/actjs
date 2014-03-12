/*
 * Author: Will
 * Blog: yslove.net
 * Depends on jQuery
 */
//Activity library
;(function(window, undefined, $){
var coreObj = {},
    coreHasOwn = coreObj.hasOwnProperty,
    coreToString = coreObj.toString,
    addoneMethods = {},

    //method: dialog, mask..., String
    //callback: arguments, Object
    VIPACT = function(method, callback) {
        var callback = callback || {};

        switch (typeof method) {
            //Add a new method
            case 'object':
                return methods.create.apply(this, arguments);
                break;
                //Instance a new object
            case 'string':
                var elActjsid;

                if (methods.apps[method]) {
                    //If it has actjsid, run the cache object. Must be DOM element, not jQuery
                    elActjsid = ( callback.el ? callback.el['actjsid'] : null );
                    
                    if(elActjsid){
                        return VIPACT.records[elActjsid]._init('update', VIPACT.extend(true, VIPACT.records[elActjsid], callback));
                    }

                    //Set a new object
                    var id = methods.guid(),
                        o = VIPACT.extend(true, {}, methods.apps[method].options, callback),
                        app = VIPACT.extend(true, {}, VIPACT.app, methods.apps[method], {
                            id: id
                        });

                    //Copy prototype to a new object
                    app.options = o;

                    VIPACT.records[id] = app;

                    // callback.el ? callback.el.setAttribute('data-actjsid', id) : null;
                    callback.el ? callback.el['actjsid'] = id : null;

                    //Initial instance
                    return VIPACT.records[id]._init('create');
                }
            default:
                return methods;
        }
    },
    //Static methods
    methods = {
        create: function() {
            var that = this,
                m = arguments[0],
                callback = arguments[1] && typeof arguments[1] === 'function' ? arguments[1] : undefined;

            $.each(m, function(n, v) {
                methods.apps[n] = $.extend(new VIPACT.app._init, v);
            });


            //VIPACT.bridge(m);

            //this._trigger.call(methods, callback);			
        },
        supplant: function(t, o) {
            return t.replace(/{([^{}]*)}/g, function(a, b) {
                var r = o[b];

                if (typeof r === 'number') {
                    r = r + '';
                }

                return (typeof r === "string" ? r : a);
            });
        },
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
        },
        trigger: function(callback) {
            return !($.isFunction(callback) &&
                callback.apply(this, Array.prototype.slice.call(arguments, 1)) === false);
        },
        apps: {

        }
    };

//Instance methods
VIPACT.app = VIPACT.prototype = {
    constructor: VIPACT,
    _init: function(method, callback) {
        var that = this;

        if (typeof method === 'string') {
            switch(method){
                case 'update':
                    this._setOptions(callback);
                    break;
                default:
                    this.init();
                    this._setOptions(this.options);                        
            }
        }

        return this;
    },
    options: {},
    setOption: function() {

    },
    _setOptions: function(options) {
        var o = this.options,
            that = this;

        $.each(options, function(n, v) {
            o[n] = v;
            that.setOption(n, v);
        });

        $.extend(true, this.options, options);
    },
    set: function(options) {
        $.extend(true, this.options, options);
        this._setOptions(options);

        return this;
    },
    get: function(option) {
        if (!this.options[option]) {
            return;
        }

        return this.options[option];
    },
    _trigger: methods.trigger,
    destory: function() {
        var id = this.id,
            record = VIPACT.records[this.id];

        //Remove HTML widget
        if (record.widget) {
            $.each(record.widget, function(n, v) {
                $(v).remove();
            });
        }

        if(record.el){
            delete record.el['actjsid'];
        }

        delete VIPACT.records[this.id];
    },
    widget: {},
    $el: {},
    el: '',
}

//... ... other internal methods... ...
/*
* VIPACT.extend({
* ... ...
* });
*/

VIPACT.app._init.prototype = VIPACT.app;

//Set VIPACT to global
window.V = window.VIPACT = VIPACT;

})(window, undefined, jQuery);
