var App = (function( window, document, $ ) {

    'use strict';

    var URL = 'https://api.github.com/';

    return {
        // Init function
        init: function() {
            new WOW().init();
            this.getGithubContrib();
            this.startTerminal();
        },
        startTerminal: function () {
            $('.mac-install').val('$ ')
               .typetype("rinco", {
                 callback: function() {
                   $('.mac-install').val($('.mac-install').val() + '\n[?] Choose an option (Use arrow keys)\n‣ New project\nDocumentation')
               },
                t:500,
                e:0

            }).delay(1400)
               .typetype("\n", {
                   callback:function () {
                       $('.mac-install').val($('.mac-install').val() + '[?] Choose an option: New project\n[?] Project name: ')
                },
                t:0,e:0
            }).delay(1000)
               .typetype("MyProject", {
                   callback:function () {
                       $('.mac-install').val($('.mac-install').val() + '\n[?] Select a template: (Use arrow keys)\n‣ Blank (default)\n  HTML5 Boilerplate')
                },
                t:100,e:0
            }).delay(1500)
                .typetype('\nCloning into "MyProject"...', {t:4,e:0})
                .delay(1500)
                .typetype('', {
                    callback:function () {
                       $('.mac-install').val('$ [?] Select a task: (Use arrow keys)\n‣ server\n  add\n  update\n  build\n  build-uncss')
                    }
                }).delay(1500)
                .typetype('', {
                    callback:function () {
                       $('.mac-install').val('$ info  - socket.io started\n-----------------------------------------\n* Server started on http://localhost:3000\n-----------------------------------------')
                    }
                }
            ).delay(3000)
            .typetype('', {
                callback:function () {
                   App.startTerminal();
                }
            });
        },
        // Getting the project's contributors
        getGithubContrib: function() {

            var $users = $('.users');
            if($users.length === 0) return
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
            $.get( URL + 'repos/rincojs/rinco-sg/contributors?client_secret=9f345d86b2fbe462def3e759f73d080d4e5d3f52', cb )
        },
        replaces: function () {
            var codejs = $('code');
            if(codejs.length === 0) return;
                codejs.each(function (i) {
                    codejs[i].innerHTML = codejs[i].innerHTML.replace(/\{\.\{/g, '{{');
                });
        }
    }

}( window, document, jQuery ));

// Starting the Application
App.init();
