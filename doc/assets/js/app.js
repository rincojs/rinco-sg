var App = (function( window, document, $ ) {

    'use strict';

    var URL = 'https://api.github.com/';

    return {
        // Init function
        init: function() {
            new WOW().init();
            this.getGithubContrib();
            this.addBrace();
            // $('code').addClass('language-javascript');
        },
        // Getting the project's contributors
        getGithubContrib: function() {

            // Callback function
            function cb( result ) {
                var i=0,
                    length = result.length,
                    str='',
                    obj;

                for ( ; i < length; i+=1 ) {
                    obj = result[ i ];

                    str += '<div class="user wow fadeInUp"><a href="' + obj.html_url + '"><img width="150" height="150" src="' + obj.avatar_url + '"><span>' + obj.login + '</span></a></div>';
                }

                $('.users').append( str );
            }

            // Doing the request
            $.get( URL + 'repos/rincojs/rinco-staticgen/contributors?client_secret=9f345d86b2fbe462def3e759f73d080d4e5d3f52', cb )
        },
        addBrace: function () {
            var codejs = $('code.language-javascript');
            var codem = $('code.language-markup');
            if(codejs.length === 0  && codem.length ===0) return;
            codejs[7].innerHTML = codejs[7].innerHTML.replace('&lt;!code!&gt;', '{{data.title}}');
            codem[3].innerHTML = codem[3].innerHTML.replace('&lt;!code!&gt;', '{{site.title}}');
            codem[5].innerHTML = codem[5].innerHTML.replace('&lt;!code!&gt;', '{{#menu.items}}\n         &lt;a href="{{link}}"&gt;{{name}}&lt;/a&gt;\n        {{/menu.items}}');
        }
    }

}( window, document, jQuery ));

// Starting the Application
App.init();
