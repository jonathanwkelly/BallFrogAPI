
window.ballfrog = window.ballfrog || {};

// ---------------

window.ballfrog.load = (function(BF, $)
{
	var refreshTimeouts = {};

	var elemAttrs = function(element, filter)
	{
		var attrs = {},
			cleanKey = function(rawKey)
			{
				return rawKey.replace("data-bfconfig-", "").replace("data-", "");
			};

		$.each(element.attributes, function(index, attr)
		{
			if(attr.name != "class" && attr.name != "id")
			{
				var key = cleanKey(attr.name);

				if(!filter || (key != "ballfrog" && key != "type" && key != "template"))
					attrs[key] = attr.value;
			}
		});

		return attrs;
	};

	// ----

	var doApiCall = function(type, params, callback)
	{
		$.ajax({
			url: "https://v4-api.ballfrog.com/api/" + type,
			type: "GET",
			dataType: "json",
			headers: {
				"bfappsite": "tnhsf",
				"X-Authorization": BF.apiKey
			},
			data: params,
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

	var populateElement = function($element)
	{
		if(!$element.size())
			return;

		if(typeof refreshTimeouts[$element.attr("id")] != "undefined")
			clearTimeout(refreshTimeouts[$element.attr("id")]);

		if(!$element.attr("id"))
			$element.attr("id", "bf-element-" + Math.floor((Math.random() * 100000) + 1));

		var id = $element.attr("id"),
			params = elemAttrs($element.get(0), false),
			paramsFiltered = elemAttrs($element.get(0), true);

		$element.addClass("ballfrog-api-output");
		doApiCall(
			params.type,
			paramsFiltered,
			function(json)
			{
				$element
					.find(":not(.ballfrog-powered-by)").remove()
				.end()
				.prepend(
					Mark.up(
						BF.templates[$element.attr("data-bfconfig-template")],
						{
							refresh_button: '<div class="ballfrog-refresh" class="bf-hide"><a href="#" title="Click to refresh"></a></div>',
							rows: json.data
						}
					)
				);

				initRefresh($element);
			}
		);
	};

	// ----

	var initRefresh = function($element)
	{
		var $btn = $element.find(".ballfrog-refresh"),
			$a = $btn.children("a");

		$a.text("Updated at " + moment().format("h:mma"));

		$btn
			.removeClass("bf-hide")
			.on("click", function()
			{
				$a
					.addClass("bf-refresh-loading")
					.text("Refreshing...");

				populateElement($element);

				return false;
			});

		refreshTimeouts[$element.attr("id")] = setTimeout(function()
		{
			populateElement($element);
		}, 300000);
	};

	// ----

	/* init each api output element */

	$("[data-ballfrog='team'],[data-ballfrog='org'],[data-ballfrog='games'],[data-ballfrog='game'],[data-ballfrog='game_activity']").each(function()
	{
		populateElement($(this));
	});

})(window.ballfrog, jQuery);
