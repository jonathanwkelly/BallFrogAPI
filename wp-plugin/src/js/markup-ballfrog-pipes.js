
Mark.pipes.date = function(datetime, format)
{
	if(typeof format == "undefined" || format == null)
		format = "YYYY-MM-DD";

	return moment(datetime).format(format);
};
