/* jslint node: true */

/*!
 * rinco - include templates
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var rinco = require('../rinco'),
    config = require('../constants'),
    Markdown = require( 'markdown' ).markdown,
    path = require('path');

// Parse templates files
rinco.registerMiddleware( function rinco_template( next, content ) {

    parse_template( content );

    function parse_template( content ) {

        if ( content.toString().match( /\@include\((.*?)\)/g ) ) {

            // Replace include tags to templates files contents
            content = content.toString().replace(/\@include\((.*?)\)/g, function ( match, contents, offset, s ) {

                var tmpTemplate = rinco.getFileContent( null, path.join( config.INCLUDE_DIR, contents ) );
                console.log( 'file -- ' ,  path.extname( contents ) );

                if( tmpTemplate ) {
                    // check Markdown
                    if( path.extname( contents ) === ".md" ) {
                        console.log( tmpTemplate );
                        // compile markdown
                        tmpTemplate = Markdown.toHTML( tmpTemplate.toString() );
                    }

                    // Prevents that the template includes itself
                    tmpTemplate = tmpTemplate.toString().replace(/\@include\((.*?)\)/g, function( m, f ) {
                        return ( f === contents ) ? "" : m;
                    });
                    return tmpTemplate;
                } else {
                    return config.SERVER_TEMPLATE_NOT_FOUND + " File: " + path.join( config.INCLUDE_DIR, contents );
                }
            });

            // Call recursive function
            parse_template( content );

        } else {
            next( content );
        }
    }
});
