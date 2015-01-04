/**
 * Define a custom pipe for Markup.js for formatting dates using Moment.js
 */
Mark.pipes.date = function(datetime, format)
{
	if(typeof format == "undefined" || format == null)
		format = "YYYY-MM-DD";

	return moment(datetime).format(format);
};

/* 

	Add your custom code here 

*/