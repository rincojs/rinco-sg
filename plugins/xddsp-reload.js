/*!
 * xddsp - reload
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var xddsp = require('../xddsp'),
	config = require('../constants');

// Parse templates files
xddsp.registerPlugin(function(next, content) {
	
	    //Replace head tag to reload.js content + head 
	    var responseString = content.toString().replace(/(\<\/head\>)/, function( match, head ) {
	        
	        var script = xddsp.getFileContent("", __dirname + "/.." + config.TEMPLATE_DIR + "reload.js" );
	        
	        if( script ) {
	            return script + "\n" + head;
	        } else {
	            return config.SERVER_TEMPLATE_NOT_FOUND + " File: " + config.TEMPLATE_DIR + head;
	        }
	    });

	    next(responseString);
});
	  