
window.ballfrog = window.ballfrog || {};

// ---------------

window.ballfrog.load = (function(BF, $)
{
	var elemAttrs = function(element, filter)
	{
		var attrs = {},
			cleanKey = function(rawKey)
			{
				return rawKey.replace("data-bfconfig-", "").replace("data-", "");
			};

		$.each(element.attributes, function(index, attr)
		{
			var key = cleanKey(attr.name);

			if(!filter || (key != "ballfrog" && key != "type" && key != "template"))
				attrs[key] = attr.value;
		});

		return attrs;
	};

	// ----

	var doApiCall = function(type, params, callback)
	{
		$.ajax({
			url: "http://app.ballfrog.com/api/" + type,
			type: "POST",
			dataType: "json",
			data: $.extend(
				params,
				{key: BF.apiKey}
			),
			success: callback,
			error: function(error)
			{
				var json = JSON.parse(error.responseText);

				if(typeof console == "object")
					console.error('BallFrog API Error #' + json.errorCode + ' (' + json.errorName + ') ' + json.errorMsg);
			}
		});
	};

	// ----

	/* init each api output element */

	$("[data-ballfrog='team'],[data-ballfrog='org'],[data-ballfrog='game'],[data-ballfrog='game_activity']").each(function()
	{
		var $element = $(this),
			params = elemAttrs(this, false),
			paramsFiltered = elemAttrs(this, true);

		$element.addClass("ballfrog-api-output");

		doApiCall(
			params.type,
			paramsFiltered,
			function(json)
			{
				$element
					.children(".loader").remove()
				.end()
				.prepend(
					Mark.up(
						BF.templates[$element.attr("data-bfconfig-template")],
						{rows: json}
					)
				);
			}
		);
	});

})(window.ballfrog, jQuery);
