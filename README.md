# Overview
 
The [BallFrog](http://ballfrog.com) REST API provides read-only access to the same data that powers our mobile app. The purpose of exposing this data is to allow other entities to develop their own presentation of the real-time, official, sports data that we collect.

---

#### API Access
An API key can be generated for any active BallFrog account. This key will need to be sent with each request. If you don't have an active account, install our app from the [iOS App Store](https://itunes.apple.com/us/app/ballfrog/id681584485?mt=8) or [Google Play](https://play.google.com/store/apps/details?id=com.ballfrog.app&hl=en) and create one.

To get setup with a key, send your request to [questions@ballfrog.com](mailto:questions@ballfrog.com), including the following details:

 * Your full name
 * Email address associated with BallFrog account (if different) 
 * Phone number
 * Brief description of intended use of API

---

#### Available Data
Most of the Team, Organization, and Game data displayed within our app are available through the API. See the [Making Requests](#making-requests) section for endpoints and parameters.

---

#### Request Types
The API is currently read-only, so following the RESTful approach, `GET` requests are expected. 

---

#### Response Format
All responses are `JSON`

# Making Requests
#### API Base Endpoint
```
https://app.ballfrog.com/api
```

---

####Authentication
All requests must include your public API key.

```
GET https://app.ballfrog.com/api/team?id=320&key=123abc
```

---

#### Team Data

```
@PARAM id {number} One or multiple, comma-delimited ID's

@PARAM org_id {number} One or multiple, comma-delimited ID's

@PARAM state {string} Two-digit state short name, e.g. TN

@PARAM keyword {string} RFC 3986 ("URL Encoded")

@PARAM limit {number} 1-50; defaults to 10

@PARAM offset {number} 0-49; defaults to 0

---

GET /team?key=123abc&id=320

---

{
	320: {
    	id: "320",
		name: {
			short: "Football",
			full: "Columbia Academy Football"
		},
        color: "243F96", /* hex value */
		state: "TN",
		org: {
			id: "319",
    	    name: "Columbia Academy",
            mascot: "Bulldogs"
		}
	}
}
```
*Notice that some basic organization info comes back in the team data. A separate /org request using this org_id would return all the organization data available.*

---

#### Organization Data

```
@PARAM id {number} One or multiple, comma-delimited ID's

@PARAM state {string} Two-digit state short name, e.g. TN

@PARAM zip {number} One or multiple, comma-delimited zip codes

@PARAM keyword {string} RFC 3986 ("URL Encoded")

@PARAM limit {number} 1-50; defaults to 10

@PARAM offset {number} 0-49; defaults to 0

---

GET /org?key=123abc&state=TN&keyword=Columbia

---

[
	33: {
    	id: "33",
		name: "Columbia Central",
        shortname: "Columbia Ctr",
		mascot: "Lions",
		color: "903DD1",
		address: "921 Lion Parkway",
        city: "Columbia",
		state: "TN",
        zip: "38401",
        team_ids: {
			34: "Football",
			1535: "Basketball - Boys",
			1536: "Basketball - Girls",
			2817: "Soccer - Boys"
        }
	},
    319: {
		id: "319",
        name: "Columbia Academy",
        shortname: "CA",
        mascot: "Bulldogs",
        color: "243F96",
        address: "1101 W 7th",
        city: "Columbia",
        state: "TN",
        zip: "38401",
        team_ids: {
			320: "Football",
			1462: "Basketball - Boys",
			1463: "Basketball - Girls",
			3098: "Soccer - Boys"
        }
	},
	999041: {
		id: "999041",
		name: "Columbia Futbol Club",
		shortname: "CFC",
		mascot: "",
		color: "031129",
		address: "",
		city: "",
		state: "TN",
		zip: "",
		team_ids: {
			3324: "03 Lady Arsenal",
			3325: "04 Arsenal Red"
		}
	}
]
```

---

#### Game Data

```
@PARAM id {number} One or multiple, comma-delimited ID's

@PARAM team_id {number} One or multiple, comma-delimited ID's *

@PARAM org_id {number} One or multiple, comma-delimited ID's *

@PARAM state {string} Two-digit state short name, e.g. TN

@PARAM finals_only {number} 1 to show only ended games

@PARAM current_only {number} 1 to return a single game record - the "current game" for the team; for this param to be respected, it must be passed with a single team_id **

@PARAM include_activity {number} 1 to return the updates for each game; this would include status changes, score changes, notes submitted by a reporter.

@PARAM include_scoreboard {number} 1 to include all game statuses (even those that have not yet been played) and the score for that status. Useful for displaying a traditional scoreboard grid. ***

@PARAM include_past {number} 1 to show games prior to the current date; otherwise, only future games are returned

@PARAM date_after {string} YYYY-MM-DD format; games on or after date

@PARAM date_before {string} YYYY-MM-DD format; games on or before date

@PARAM limit {number} 1-50; defaults to 10

@PARAM offset {number} 0-49; defaults to 0

@PARAM sort {string} 
	OPT: update_datetime (default)
	OPT: start_datetime_asc
	OPT: start_datetime_desc

@PARAM id_index {number} 1 to have the results indexed by ID; otherwise, the results will be zero-indexed

---

GET /game?key=123abc&team_id=1375&include_activity=1&include_scoreboard=1&limit=1

---

[
	{
		id: "18033",
		datetime: "2014-12-30T16:15:00-06:00",
		teams: {
			0: {
				id: "0",
				name: "St. James",
				home_team: true,
				org_id: null
			},
			1375: {
				id: "1375",
				name: "Ravenwood Basketball",
				home_team: false,
				org_id: "117"
			}
		},
		matchup: "Ravenwood Basketball vs St. James",
		opponent: "St. James",
		location: "Home",
		sport: {
			id: "2",
			name: "Basketball"
		},
		status: "Final",
		scores: {
			0: "62",
			1375: "47",
			full: "47-62",
			result: "L"
		},
		scoreboard: [
			[ "", "Ravenwood Basketball", "St. James" ],
			[ "1", 8, 14 ],
			[ "2", 6, 8 ],
			[ "3", 8, 22 ],
			[ "4", 25, 18 ],
			[ "Final", 47, 62 ]
		],
		comments: null,
		activity: [
			{
				datetime: "2014-12-30T16:31:49-06:00",
				type: "score",
				scores: {
					0: "62",
					1375: "47"
				},
				summary: "Ravenwood Basketball: 47, St. James : 62 (Final)",
				comments: "Final"
			},
			{
				datetime: "2014-12-30T16:31:15-06:00",
				type: "score",
				scores: {
					0: "62",
					1375: "47"
				},
				summary: "Ravenwood Basketball: 47, St. James : 62 (4th Quarter)",
				comments: "End of 4Q"
			},
			{
				datetime: "2014-12-30T16:08:56-06:00",
				type: "score",
				scores: {
					0: "44",
					1375: "22"
				},
				summary: "Ravenwood Basketball: 22, St. James : 44 (3rd Quarter)",
				comments: "End of 3Q"
			},
			{
				datetime: "2014-12-30T15:41:27-06:00",
				type: "score",
				scores: {
					0: "22",
					1375: "14"
				},
				summary: "Ravenwood Basketball: 14, St. James : 22 (Halftime)",
				comments: "At the half"
			},
			{
				datetime: "2014-12-30T15:40:59-06:00",
				type: "score",
				scores: {
					0: "22",
					1375: "14"
				},
				summary: "Ravenwood Basketball: 14, St. James : 22 (2nd Quarter)",
				comments: "End of 2Q"
			},
			{
				datetime: "2014-12-30T15:26:05-06:00",
				type: "score",
				scores: {
					0: "14",
					1375: "8"
				},
				summary: "Ravenwood Basketball: 8, St. James : 14 (1st Quarter)",
				comments: "End of 1Q"
			}
		],
		last_update: "3 days ago"
	}
]

---

GET /game?key=123abc&team_id=1375&current_only=1

(The response below is an example of an unstarted game happening later in the day.)

---

[
	{
		id: "18034",
		datetime: "2015-01-01T19:30:00-06:00",
		teams: {
			1349: {
				id: "1349",
				name: "Franklin Basketball - Boys",
				home_team: false,
				org_id: "55"
			},
			1375: {
				id: "1375",
				name: "Ravenwood Basketball",
				home_team: true,
				org_id: "117"
			}
		},
		matchup: "Ravenwood Basketball vs Franklin Basketball - Boys",
		opponent: "Franklin Basketball - Boys",
		location: "Home",
		sport: {
			id: "2",
			name: "Basketball"
		},
		status: null,
		scores: {
			1349: "0",
			1375: "0",
			full: null,
			result: null
		},
		scoreboard: [],
		comments: null,
		activity: [],
		last_update: null
	}
]
```

**Each team manages their own schedule. What this means is that there could exist a game record for Team A vs. Team B, but also another for Team B vs. Team A. If Team ID(s) or School ID(s) are passed in, the API will just search for game records created under the passed in Teams/Schools, and not return games where those Teams/Schools are selected as the opponent.*

***There is logic within the BallFrog system to determine what game is considered "current" for a team. It may be a game happening later that day, or a game from the prior day if no game is on the schedule for the current day.*

****The scoreboard is imagined as a table/grid with a heading row, then a row for each team. This is the way in which the data is included in the scoreboard response. The first array would be the first column with no heading, then a team name in the next two rows in that column. The next array would be a shorthand indicator of the first period of the game (say, for 1st QTR a "1" is used,) then each team's score. The next array would be the second period, etc. until all scoring periods for that sport are included.*