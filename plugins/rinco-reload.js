/*!
 * rinco - reload
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var rinco = require('../rinco'),
	path = require('path'),
	config = require('../constants');

// Parse templates files
rinco.registerPlugin(function rinco_reload( next, content ) {
	
	    //Replace head tag to reload.js content + head 
	    var responseString = content.toString().replace(/(\<\/head\>)/, function( match, head ) {
	        
	        var script = rinco.getFileContent(null,  path.join( config.RINCO_TEMPLATE_PATH, 'reload.js' ) );
	        
	        if( script ) {
	            return script + "\n" + head;
	        } else {
	            return config.SERVER_TEMPLATE_NOT_FOUND + " File: " + path.join( config.RINCO_TEMPLATE_PATH, 'reload.js' );
	        }
	    });

	    next(responseString);
});
	  