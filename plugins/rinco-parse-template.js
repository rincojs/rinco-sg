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

	parse_template( content );
	
	function parse_template( content ) {

		if( content.toString().match( /\@include\((.*?)\)/g ) ) {

			// Replace include tags to templates files contents
			var content = content.toString().replace(/\@include\((.*?)\)/g, function(match, contents, offset, s) {

			    var tmpTemplate = rinco.getFileContent( config.TEMPLATE_DIR + contents );

			    if( tmpTemplate ) {			    	
			    	// Prevents that the template includes itself
			    	tmpTemplate = tmpTemplate.toString().replace(/\@include\((.*?)\)/g, function( m, f ) {
			    		return ( f === contents ) ? "" : m;
			    	});
			        return tmpTemplate;

			    } else {

			        return config.SERVER_TEMPLATE_NOT_FOUND + " File: " + config.TEMPLATE_DIR + contents;
			    }
			});
			// Call recursive function
			parse_template( content );

		} else {

	    	next( content );
		}
	}
});
	  