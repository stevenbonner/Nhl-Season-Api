var teamStats = [];

var chartStats = [
 
  {
    label: "Total wins ",
    key: 'wins',
    
  },
  {
    label: "Total losses",
    key: 'losses',
    
  },
  {
    label: "Total wins In OT",
    key: 'ot',
    
  },
  {
    label: "Total Points Of The Season",
    key: 'pts',
    
  },

  {
    label: "Goals Scored Per Game",
    key: 'goalsPerGame',
    
  },
  {
    label: "Goals Allowed Per Game",
    key: 'goalsAgainstPerGame',
    
  },
  
  {
    label: "PowerPlay Goals Scored",
    key: 'powerPlayGoals',
    
  },
  {
    label: "PowerPlay Goals Allowed",
    key: 'powerPlayGoalsAgainst',
    
  },
  {
    label: "PowerPlay Opportunities Per Game",
    key: 'powerPlayOpportunities',
    
  },
   {
    
    label: "Shots Per Game",
    key: 'shotsPerGame',
    
  },
  {
    label: "Shots Allowed Per Game",
    key: 'shotsAllowed',
  },
  {
    label: "Win After Scoring First",
    key: 'winScoreFirst',
  },
  {
    label: "Win After Opponent Scoring First",
    key: 'winOppScoreFirst',
  },
  {
    label: "Win After Having Lead At the End Of First Period",
    key: 'winLeadFirstPer',
  },
  {
    label: "Win After Having Lead At the End Of Second Period",
    key: 'winLeadSecondPer',
  },
  {
    label: "FaceOffs Taken PerGame",
    key: 'faceOffsTaken',
  },
  {
    label: "FaceOffs Won PerGame",
    key: 'faceOffsWon',
  },
  {
    label: "FaceOffs Lost PerGame",
    key: 'faceOffsLost',
  },


];

var teams = [
  { id: 1, name: ' New Jersey Devils' },
  { id: 2, name: 'New York Islanders' },
  { id: 3, name: 'New York Rangers' },
  { id: 4, name: 'Philadelphia Flyers' },
  { id: 5, name: 'Pittsburgh Penguins' },
  { id: 6, name: 'Boston Bruins' },
  { id: 7, name: 'Buffalo Sabres' },
  { id: 8, name: 'Montréal Canadiens' },
  { id: 9, name: 'Ottawa Senators' },
  { id: 10,name: 'Toronto Maple Leafs'},
  { id: 12, name: 'Carolina Hurricanes' },
  { id: 13, name: 'Florida Panthers' },
  { id: 14, name: 'Tampa Bay Lightning' },
  { id: 15, name: 'Washington Capitals' },
  { id: 16, name: 'Chicago Blackhawks' },
  { id: 17, name: 'Detroit Red Wings' },
  { id: 18, name: 'Nashville Predators' },
  { id: 20,name: 'Calgary Flames'},
  { id: 21, name: 'Colorado Avalanche' },
  { id: 22, name: 'Edmonton Oilers' },
  { id: 23, name: 'Vancouver Canucks' },
  { id: 24, name: 'Anaheim Ducks' },
  { id: 25, name: 'Dallas Stars' },
  { id: 26, name: 'Los Angeles Kings' },
  { id: 28, name: 'San Jose Sharks' },
  { id: 29, name: 'Columbus Blue Jackets' },
  { id: 30,name: 'Minnesota Wild'}
];

var chartData = {};
var tableChartData = {};

const app = function () {
  const button = document.getElementById('fetch-btn');


  button.addEventListener('click', function(){
    var interval = setInterval(function () {
      console.log('Checking stats');

      if (teamStats.length === teams.length) {
        clearInterval(interval);
        interval = null;
        populateList(teamStats);
      }
    }, 20);

    makeRequest(requestComplete);
  });
}

const makeRequest = function(callback) {
  _.each(teams, function ({ id, name }) {
    const url = `https://statsapi.web.nhl.com/api/v1/teams/${id}/stats`;

    const request = new XMLHttpRequest();
    request.open("GET", url);
    request.addEventListener('load', function () {
      if (this.status !== 200) return;
      callback(id, name, this.responseText);
    });

    request.send();
  });
}

const requestComplete = function (teamId, name, stats) {
  teamStats.push({
    teamId: teamId,
    teamName: name,
    data: JSON.parse(stats),
  });
  // populateList(stat.stats);
}

// _.each(teams, function (team) {
//   // team.name
//   // team.data

//   _.each(team.data, populateList);
// });


const displaySeasonChart = function(data) {
    // const teamStats = _.map(data, {stat: "gamesPlayed"});
    _.each(data, function (data, key) {
      var element = document.createElement('div');
      element.id = `statKey${key}`;
      document.getElementById('statchart').appendChild(element);

      data.unshift(["Team", `${key}`]);

      const chartData = google.visualization.arrayToDataTable(data);

      const chart = new google.charts.Bar(document.getElementById(`statKey${key}`));
      chart.draw(chartData, {
        title: key,
        height: '500',titleTextStyle: {
          color: 'red'
        },
        
        hAxis: {
          title: 'Stat For All Teams',
          
          minValue: 0,
          
                },
      
        bars: 'horizontal'
      });

      var element = document.createElement('div');
      element.id = `tableKey${key}`;
      document.getElementById('statchart').appendChild(element);

      var tableData = new google.visualization.DataTable();
      tableData.addColumn('string', 'Team');
      tableData.addColumn('number', 'Ranking');
      tableData.addRows(tableChartData[key]);

      var table = new google.visualization.Table(document.getElementById(`tableKey${key}`));
      table.draw(tableData, { showRowNumber: true, width: '100%', height: '100%' });
    });
}


const populateList = function (stats) {
  _.each(stats, function ({ teamName, teamId, data }) {
    _.each(chartStats, function (chartStat) {
      if (!_.has(chartData, chartStat.key)) {
        chartData[chartStat.key] = new Array;
      }

      if (!_.has(tableChartData, chartStat.key)) {
        tableChartData[chartStat.key] = new Array;
      }

      chartData[chartStat.key].push([
        teamName,
        data.stats[0].splits[0].stat[chartStat.key]
      ]);

      var position = `${data.stats[1].splits[0].stat[chartStat.key]}`;

      tableChartData[chartStat.key].push(
        [teamName, { v: parseInt(position), f: position,  }],
      );
    })
  });

  displaySeasonChart(chartData);

  // const ul = document.getElementById('stats');
  // var numbers;
  // for (const stat of stats){
  //   const li = document.createElement('li');
    // console.log(stat.splits[0].stat);
    // const object = stat.splits[0].stat;
    // const newstring = _.replace(object.faceOffsWon, /\D/g, '');
    // console.log(newstring);

    // need to past the string through as an int
    // this methond does this var rankings = stats[1].splits[0].stat
    // for(ranking in rankings){console.log(rankings[ranking])}
    // get the value of the ranking ie const sanitisedRanking = _.replace(rankings[ranking], /\D/g,'');
    // rankings[ranking] = sanitisedRanking;


    // then need convert Object {} to array []

    // const ul = document.getElementById('rankings')
    // for(ranking in rankings){
    //
    //   const sanitisedRanking = _.replace(rankings[ranking], /\D/g,'');
    //   rankings[ranking] = sanitisedRanking;
    // }
    // debugger;

    // console.log(string);
    // console.log(newstring);
    // console.log(stat.splits[0].stat);

    // var faceOffsWon = stat.splits[0].stat.faceOffsWon;

    // We can assume that these rankings are provided as strings
    // if (stat.type.displayName === 'regularSeasonStatRankings') {
    //   faceOffsWon = parseInt(faceOffsWon);
      // faceOffsWon = parseInt(faceOffsWon.replace(/([0-9]+)[a-z]+$/g, '$1'));
    // }

    // console.log(faceOffsWon);

    // li.innerText = stat.goalsAgainstPerGame;
    // li.innerText = stat.powerPlayGoalsAgainst;
    // ul.appendChild(li);

    // numbers = _.map(stat.splits[0].stat, function (value, key) {
    //   return parseInt(value);
    // });

    // console.log(numbers);

    // const keys = Object.keys(stat.splits[0].stat);

    // for (let index = 0; index < keys.length; index++) {
    //   const element = stat.splits[0].stat[keys[index]];
    //   console.log('Num: ' + element);
    // }

  // };

  // displayGenderChart(numbers)
}

window.addEventListener('load', function () {
  google.charts.load('current', { packages: ['corechart', 'bar', 'table'] });
  google.charts.setOnLoadCallback(app);
});