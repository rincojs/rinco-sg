/*!
 * rinco - include templates
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var rinco = require('../rinco'),
	config = require('../constants');

// Parse templates files
rinco.registerPlugin( function rinco_template( next, content ) {
	
	    //Replace include tags to templates files contents
	    var responseString = content.toString().replace(/\@include\((.*?)\)/g, function(match, contents, offset, s) {
	        var tmpTemplate = rinco.getFileContent(config.TEMPLATE_DIR + contents);
	        if(tmpTemplate) {
	            return tmpTemplate;
	        } else {
	            return config.SERVER_TEMPLATE_NOT_FOUND + " File: " + config.TEMPLATE_DIR + contents;
	        }
	    });

	    next(responseString);
});
	  