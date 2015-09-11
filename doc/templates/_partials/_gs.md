<a name="install"></a>
### Install
```javascript
$ npm install -g rinco
```

<a name="new"></a>
### Create a new project
```javascript
$ rinco
```

<a name="cli"></a>
### CLI Commands

```javascript
$ rinco (command)
    server // Development server
    add // Add a library from CDNJS
    update // Update library list from CDNJS
    build // Generate the static files
    build-uncss // Generate the static files with CSS optimization
```

<a name="cdnjs"></a>
### CDNJS

To add a library from CDNJS use the command <code>add</code> in rinco cli .

```javascript
$ rinco add jquery
```
After to chose your library, you need to select the pages that the library will be included.

<a name="server"></a>
### Development server

To run the development server use:

```javascript
// within of your project's folder
$ rinco server port(optional)
```
The default port is <code>3000</code>.

<a name="structure"></a>
### Structure

Rinco has a simple path convention that you need to follow:

```javascript
Rinco Project  // path of your project
  assets       // assets path
     css       // stylus, sass, less or pure css
     img       // images
     js        // coffescript, babel or pure js
  data         // json to be imported
  build        // generated static files (build)
  Public       // Public files like robots.txt, favicon.ico etc.
  templates    // main pages and partials (.html|.md) to be imported
```

<a name="path"></a>
### r-path

To ensure that all links and assets will be called correctly, you need to configure the path variable in your **rconf.js** file.

```javascript
module.exports = {
     path_dev: '',
     path_build: '/sg' // empty for root folder ex: rincojs.com
};
```
In this example, the **path_build** was configured to **/sg folder**, it means that the project will be hosted inside the folder **/sg**.

```javascript
http://rincojs.com/sg
```

To use it within the project, use the <code>r-path</code> tag:

```markup
<ul class="navbar-nav">
    <li><a href="<r-path/>/index.html">About</a></li>
    <li><a href="<r-path/>/documentation/variables/index.html">Variables</a></li>
</ul>
```

Loading images:

```markup
<img width="200" src="<r-path/>/assets/img/pagespeed.png" alt="pagespeed">
```

CSS and Javascript files:

```css
background-image: url("<r-path/>/assets/img/bg.png"), radial-gradient(circle at 0 0, #0F3476, #87B9D7);
```

<a name="include"></a>
### r-include

To include a file, use <code>r-include </code> tag:

```markup
<r-include _file.html/> // include _file.html from (templates)
<r-include _path/_file.html/> // include _file.html from (templates/_path)
<r-include _articles/_somearticle.md/> // include _somearticle.md from (templates/_articles)
```

<a name="render"></a>
### r-render

Similar from <code>r-include</code> tag, you can render a partial page with a specific data, just passing through the tag as a json:

```markup
<r-render _user.html {"data":{"name":"John Doe"}}/> // include _user.html from (templates)
```

<a name="data"></a>
### r-data

To import a data file into your page use <code>r-data</code> tag:

```markup
<r-data file.json/> // include file.json from (data)
<r-data path/file.json/> // include file.json from (data/path)
```

You can create a alias for an imported file and use it in your template:
```markup
<r-data file.json => myalias/> // include file.json from (data)
```

```markup
...
	<r-data en-en.json => data/>
	<h1>{.{data.title}}</h1>
...
```

<a name="object"></a>
### r-object

Instead you import a data with <code>r-data</code> tag,  you can return a javascript object as data in your page. This object need to have two properties, name and data, which name is the key to access the value into the mustache template and data as the content of this object.

```javascript
...
<r-object>
    return {
        data: {
            name:"Rinco"
        },
        name: 'newObj'
    }
</r-object>

<h1>{.{newObj.name}}</h1>
...
```

You can also use the values of the imported data (global data) like this:

```javascript
...
<r-data config.json/>
<r-object>
    var name = global.config.name.replace(/a/g,'e');
    return {
        data: {
            name:name
        },
        name: 'newObj'
    }
</r-object>

<h1>{.{newObj.name}}</h1>
...
```
The <code>global</code> variable refers to global data.

<a name="script"></a>
### script

Differently from <code>r-object</code> tag, the <code>script</code> tag returns a string:

```javascript
...
<h1>
<r-script>
    var name = "Rinco";
    return global.name.replace(/o/g,'a');
</r-script>
</h1>
...
```
Or the shorthand:
```javascript
...
<a href="<r-path/>/user.html" class="<r-script return _system.current_page == 'user.html' ? 'active' : ''/>">User</a>
...
```
You can also use the imported data:

```javascript
...
<r-data config.json/>
<h1><r-script return global.config.name.replace(/a/g,'e');/></h1>
...
```
<a name="css"></a>
### r-css

**Rinco** supports many CSS extension languages like sass, less and stylus. To use it, just change the extension to your prefered language and **Rinco** compile it to you. Don't worry about the choice, you can use all together.

```markup
<!-- refers to file assets/css/styles.sass -->
<r-css styles.sass/>
<!-- refers to file assets/css/colors.less -->
<r-css colors.less/>
<!-- refers to file assets/css/custom.styl -->
<r-css custom.styl/>
```

The order will be respected.

<a name="js"></a>
### r-js

**Rinco** allows you to code in **coffeescript**, and **ES6 with Babel** language, it's similar of the CSS compile behavior, so you just need to change the file extension to <code>.coffee</code> and <code>.babel</code>.

```markup
<!-- refers to file assets/js/app.coffee -->
<r-js app.coffee/>
<!-- refers to file assets/js/es6.babel -->
<r-js es6.babel/>
```

The order will be respected.

<a name="ignorefiles"></a>
### Ignoring files
You can ignore a file putting "<code> _ </code>" at the beginning of the filename like this:
```javascript
_head.html
_nav.html
_footer.html
```
This is helpful to avoid that partial files are generated.

<a name="example"></a>
### Example

- index.html (refers to file <code>templates/index.html</code>)

```markup
<!-- data usage -->
<r-data config.json/>
<r-data areas.json => menu/>

<!-- include usage -->
<r-include _header.html/>
<r-include _content.html/>
<r-include _footer.html/>

```
- header.html (refers to file <code>templates/_header.html</code>)


```markup
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>{.{config.title}}</title>
	<r-css styles.scss/>
</head>
<body>

```

- content.html (refers to file <code>templates/_content.html</code>)

```markup
<section>
    <figure class="logo-wrapper">
        <img src="<r-path/>/assets/img/logo.png" alt="">
    </figure>
</section>

<r-include _content/_welcome.md/>

```
- footer.html (refers to file <code>templates/_footer.html</code>)

```markup
<footer>
    <nav>
    {.{#menu.items}}
        <a href="<r-path/>/{.{link}}">{.{name}}</a>;
    {.{/menu.items}}
    </nav>
</footer>
<r-js app.coffee/>
</body>
</html>
```
- welcome&#46;md (refers to file <code>templates/_content/_welcome.md</code>)

```markup
# Rinco Static Generator
If you find a bug, please, [send to us](https://github.com/rincojs/rinco-staticgen/issues).
```
- site.json (refers to file <code>data/site.json</code>)

```javascript
{
	"title": "Rinco Static Generator",
	"github": "https://github.com/rincojs/rinco-staticgen"
}

```

- areas.json (refers to file <code>data/areas.json</code>)

```javascript
{
	"items": [
		{
			"link": "https://github.com/rincojs/rinco-staticgen",
			"name": "Github"
		},
		{
			"link": "https://rincojs.com/sg/",
			"name": "Documentation"
		}
	]
}
```


<a name="build"></a>
### Generate static files
There's two ways to generate the statics files.

- To generate the static files without **uncss** feature use the <code>build</code> task.

```javascript
$ rinco build
```
- To generate the static files with **uncss** feature use the <code>build-uncss</code> task.

```javascript
$ rinco build-uncss
```
The static files will be in **build** folder.
