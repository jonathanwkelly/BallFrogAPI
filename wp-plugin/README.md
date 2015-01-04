# Overview

### Requirements

- WordPress version >= 2.7.0

### Installation
 
1. Move entire ballfrog folder into your wp-content/plugins folder

2. Activate the plugin from your WP admin

3. Add your API key in the WP admin under Settings -> BallFrog API (if you're unsure about how to get an API key, refer to the documentation at https://github.com/jonathanwkelly/BallFrogAPI)

### How it Works

Some basic HTML is output as a result of WP parsing a custom shortcode. This shortcode accepts parameters that are passed along to the API call itself. Using JavaScript, the response of the API call is injected into the page. 

# Usage

Before reading through this section, it would be a good idea to have open the [API Documentation](https://github.com/jonathanwkelly/BallFrogAPI) for reference.

The shortcode used to output API data is ``` [ballfrog_api_output] ```. Just including that tag wouldn't actually output anything because it needs more parameters to know exactly what calls should be made. For example, are we wanting Team or Game data? How should the raw data be formatted for output? These are handled with parameters. First, a description of the possible parameters.

```PARAM type="game" (required)```
*Possible options are team, org, game, and game_activity. These correspond to the distinct API calls available.*

```PARAM template="some-template-here" (required)```
*You'll notice a templates folder within the plugin folder (wp-content/plugins/ballfrog/templates). Individual templates are HTML files, so named like games.html. The templates are referenced as the file basename without the extension, e.g. template="games". See the section below on writing your own templates.*

In addition to these two parameters that define what call should be made and to what template the data should be passed, parameters for the particular API call can be passed. For instance, if you wanted to get the game schedule for team 320 and display it with template schedule.html, you could use the following: ``` [ballfrog_api_output type="game" template="schedule" team_id="320"] ```

The ``` team_id="320" ``` parameter in this example is referencing the parameter for the API call. Refer to the documentation for what parameters are available in each API call.

# Technical Reference

#### Templating

Template parsing is handled by [Markup.js](https://github.com/adammark/Markup.js/) and [Moment.js](http://momentjs.com/). 

Each template should start with a concept of multiple rows being returned. These will be sent to the template as a "rows" array. A simple example of iterating through these rows: 

```
<table>
	<tr>
		<th>Team Name</th>
		<th>State</th>
	</tr>
	{{rows}}
		<tr>
			<td>{{name.full}}</td>
			<td>{{state}}</td>
		</tr>
	{{/rows}}
</table>
```

A [custom pipe](https://github.com/adammark/Markup.js/#writing-custom-pipes) has been setup for Markup.js for easy formatting of dates using Moment.js. Because the datetimes that are returned in the API response are ATOM format, this can be sent straight through to Moment.js to read. An example of using this date formatting pipe:

```{{datetime|date>ddd, MMM D h:mma}}```

Assuming the raw datetime value is ``` 2014-12-30T16:15:00-06:00 ```, the output would be ``` Tue, Dec 30 4:15pm ```

You can add your own custom pipes in the file ```wp-plugin/src/js/custom.js``` 

#### Customizing Front-End Assets

All the source is available in ```wp-plugin/src/```. An overview of each file:

``` ballfrog-api.concat.js ```
*Holds all the non-uglified, concatenated source for the JS files*

``` custom.js ```
*Define any custom JS code you'd like to include in this file. By default, a custom pipe for date formatting should already be present.*

``` lib.ballfrog.js ```
*The handler file for automatically doing API calls and passing the response along to the template parser.*

``` markup-xxxx.js ```
*The raw, uncompressed Markup.js source*

``` moment-xxxx.js ```
*The raw, uncompressed Moment.js source*

#### Recompiling Front-End Assets

There are three [Grunt](http://gruntjs.com/) jobs that are used: [sass](https://github.com/gruntjs/grunt-contrib-sass), [concat](https://github.com/gruntjs/grunt-contrib-concat), and [uglify](https://github.com/gruntjs/grunt-contrib-uglify). To run all three in order: ```$ grunt sass concat uglify```

The resulting files should be output to the folder that is uploaded as the WP plugin: ```wp-plugin/ballfrog```

##### Custom Templates

Template files can be created at will and dropped into the ``` wp-plugin/ballfrog/templates ``` folder. Inside these templates, you can include any HTML and Markup.js syntax.

##### 
