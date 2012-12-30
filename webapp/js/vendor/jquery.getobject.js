/*
 * jQuery getObject - v1.1 - 12/24/2009
 * http://benalman.com/projects/jquery-getobject-plugin/
 *
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 *
 * Inspired by Dojo, which is Copyright (c) 2005-2009, The Dojo Foundation.
 */
(function(a,c){var $=a.jQuery||a.Cowboy||(a.Cowboy={}),b;$.getObject=b=function(g,d,f){if(typeof g==="string"){g=g.split(".")}if(typeof d!=="boolean"){f=d;d=c}f=f||a;var e;while(f&&g.length){e=g.shift();if(f[e]===c&&d){f[e]={}}f=f[e]}return f};$.setObject=function(d,f,e){var h=d.split("."),i=h.pop(),g=b(h,true,e);return g&&typeof g==="object"&&i?(g[i]=f):c};$.exists=function(d,e){return b(d,e)!==c}})(this);