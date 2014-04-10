'use strict';

var xddsp = require('../xddsp'),
	config = require('../constants');

// Parse templates files
xddsp.registerMiddleware(function(next, content) {
	
	    //Replace include tags to templates files contents
	    var responseString = content.toString().replace(/\@include\((.*?)\)/g, function(match, contents, offset, s) {
	        var tmpTemplate = xddsp.getFileContent(config.TEMPLATE_DIR + contents);
	        if(tmpTemplate) {
	            return tmpTemplate;
	        } else {
	            return config.SERVER_TEMPLATE_NOT_FOUND + " File: " + config.TEMPLATE_DIR + contents;
	        }
	    });	

	    next(responseString);
});