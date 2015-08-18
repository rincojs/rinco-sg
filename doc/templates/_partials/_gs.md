<a name="install"></a>
### Install
```javascript
npm install rinco -g
```

<a name="new"></a>
### Create a new project
```javascript
$ rinco
```

<a name="template"></a>
### Templates

Rinco supports templates, but for now, we have only one (blank template).

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

<a name="include"></a>
### Include

To include a file, use <code>r-include </code> tag:

```markup
<r-include _file.html> // include _file.html from (templates)
<r-include _path/_file.html> // include _file.html from (templates/_path)
<r-include _articles/_somearticle.md> // include _somearticle.md from (templates/_articles)
```

<a name="data"></a>
### Data

To import a data file into your page use <code>r-data</code> tag:

```markup
<r-data file.json> // include file.html from (data)
<r-data path/file.json> // include file.html from (data/path)
```

You can create a alias for an imported file and use it in your template:
```markup
<r-data file.json = myalias> // include file.html from (data)
```

```markup
...
	<r-data en-en.json = data>
	<h1><!code!></h1>
...
```


<a name="css"></a>
### CSS

**Rinco** supports many CSS extension languages like sass, less and stylus. To use it, just change the extension to your prefered language and **Rinco** compile it to you. Don't worry about the choice, you can use all together.
To link a css file use the css filename changing the extention to <code>.css</code>.

```markup
<!-- refers to file assets/css/styles.sass -->
<r-css styles.sass>
<!-- refers to file assets/css/colors.less -->
<r-css colors.less>
<!-- refers to file assets/css/custom.styl -->
<r-css custom.styl>
```


<a name="javascript"></a>
### Javascript

**Rinco** allows you to code in **coffeescript**, and **ES6 with Babel** language, it's similar of the CSS compile behavior, so you just need to change the file extension to <code>.coffee</code>, <code>.ts</code> and <code>.babel</code>. To link it on page, change the extension to <code>.js</code>.

```markup
<!-- refers to file assets/js/app.coffee -->
<r-js app.coffee>
<!-- refers to file assets/js/es6.babel -->
<r-js es6.babel>
```
<a name="ignorefiles"></a>
### Ignoring files
You can ignore a file putting <code>_</code> at the beginning of the filename like this:
```javascript
_variables.sass
```
This is helpful to CSS imported files.

<a name="example"></a>
### Example

- index.html (refers to file <code>templates/index.html</code>)

```markup
<!-- data usage -->
<r-data site.json>
<r-data areas.json => menu>

<!-- include usage -->
<r-include _header.html>
<r-include _content.html>
<r-include _footer.html>

```
- header.html (refers to file <code>templates/_header.html</code>)


```markup
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><!code!></title>
	<r-css styles.scss>
</head>

```

- content.html (refers to file <code>templates/_content.html</code>)

```markup
<section>
    <figure class="logo-wrapper">
        <img src="assets/img/logo.png" alt="">
    </figure>
</section>

<r-include _content/_welcome.md>

```
- footer.html (refers to file <code>templates/_footer.html</code>)

```markup
<footer>
    <nav>
        <!code!>
    </nav>
</footer>
<r-js app.coffee>
</body>
</html>
```
- welcome&#46;md (refers to file <code>templates/_content/_welcome.md</code>)

```markup
# Rinco Static Generator
You're using a **BETA** version of the application, so if you find a bug, please, [send to us](https://github.com/rincojs/rinco-staticgen/issues).
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
