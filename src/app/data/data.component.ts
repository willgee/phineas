import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import * as d3 from "d3";
import * as colorbrewer from "colorbrewer";
import * as d3sankey from "d3-sankey";

interface worldcup {
  team: string,
  region: string,
  win: string,
  loss: string,
  draw: string,
  points: string,
  gf: string,
  ga: string,
  cs: string,
  yc: string,
  rc: string
}
@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrls: ["./data.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class DataComponent implements OnInit {
  constructor() {}

  cupData: Array<{}>;
  tweetsData: Array<number>;
  histoChart = d3.histogram().domain([0,5])
  .thresholds([0,1,2,3,4,5])
  .value(d => d['favorites'].length);
  cardTen_xScale = d3.scaleLinear().domain([0,5]).range([0,500]);
  cardTen_yScale = d3.scaleLinear().domain([0,10]).range([400,0]);

  chapterOne() {
    d3.select("#cardOne")
      .select("svg")
      .style("width", "500px")
      .style("height", "500px")
      .style("background", "gray")
      .attr("class", "data-card");

    d3.select("#cardOne")
      .select("svg")
      .append("circle")
      .attr("r", 20)
      .attr("cx", 20)
      .attr("cy", 20)
      .style("fill", "red");

    d3.select("#cardOne")
      .select("svg")
      .append("circle")
      .attr("r", 100)
      .attr("cx", 400)
      .attr("cy", 400)
      .style("fill", "lightblue");

    d3.selectAll("circle").transition().duration(2000).attr("cy", 200);
  }

  chapterTwo() {
    let cardTwo = d3.select("#cardTwo").attr("class", "data-card");
    let cardThree = d3.select("#cardThree").attr("class", "data-card");
    let cardFour = d3.select("#cardFour").attr("class", "data-card")
    .select('svg')
    .style("width", "500px")
    .style("height", "550px")
    
    d3.csv("assets/data/cities.csv")
    .then(data => {
      // console.log(data);
      let minimum = d3.min(data, el => +el['population']);
      let maximum = d3.max(data, el => +el['population']);
      let mean = d3.mean(data, el => +el['population']);
      // console.log(minimum);
      // console.log(maximum);
      // console.log(mean);

      let yScale = d3.scaleLinear().domain([0, maximum]).range([0, 460]);

      cardTwo.select('svg')
      .style("width", "500px")
      .style("height", "500px")
      .selectAll('rect')
      .data(data).enter()
      .append('rect')
      .attr('width', 50)
      .attr('height', d => yScale(parseInt(d['population'])))
      .attr('x', (d,i) => i * 60)
      .attr('y', d => 480 - yScale(parseInt(d['population'])))
      .style("fill", "#FE9922")
      .style("stroke", "#9A8B7A")
      .style("stroke-width", "1px");


      // d3.select("#cardTwo").selectAll('div.cities')
      // .data(data).enter()
      // .append('div')
      // .attr('class', 'cities')
      // .html(d => d['label']);
    });
    
    d3.json("assets/data/tweets.json")
    .then(data => {
      // console.log(data);
      let nestedTweets = d3.nest().key(d => d['user']).entries(data['tweets']);         
      nestedTweets.forEach(
        d => { 
          d['numTweets'] = d['values'].length;
        }
      )

      let tweetData: Array<{}> = data['tweets'];
      tweetData.forEach(
        d => {
          d['impact'] = d['favorites'].length + d['retweets'].length;
          d['tweetTime'] = new Date(d['timestamp']);
        }
      )
      // console.log(nestedTweets);
      let maxTweets = d3.max(nestedTweets, d => d['numTweets']);
      let yScale = d3.scaleLinear().domain([0, maxTweets]).range([0, 500]);

      cardThree.select('svg')
      .style("width", "500px")
      .style("height", "550px")
      .selectAll('rect')
      .data(nestedTweets).enter()
      .append('rect')
      .attr('width', 50)
      .attr('height', d => yScale(d['numTweets']))
      .attr('x', (d,i) => i * 60)
      .attr('y', d => 525 - yScale(d['numTweets']))
      .style("fill", "#FE9922")
      .style("stroke", "#9A8B7A")
      .style("stroke-width", "1px");

      let maxImpact = d3.max(tweetData, d => d['impact']);
      let startEnd = d3.extent(tweetData, d => d['tweetTime']);
      let timeRamp = d3.scaleTime().domain(startEnd).range([0, 480]);
      let yScaleScatter = d3.scaleLinear().domain([0, maxImpact]).range([0, 460]);
      let radiusScale = d3.scaleLinear().domain([0, maxImpact]).range([1, 20]);
      let colorScale: d3.ScaleLinear<string, string> = d3.scaleLinear<string>();
      colorScale.domain([0, maxImpact]).range(["white","#75739F"]);
      

      let tweetGroup =  d3.select("#cardFour").select('svg').selectAll('g')
      .data(tweetData).enter()
      .append('g')
      .attr('transform', d => "translate(" + timeRamp(d['tweetTime']) + "," + (480 - yScaleScatter(d['impact'])) + ")");

      tweetGroup.append('circle')
      .attr('r', d => radiusScale(d['impact']))
      .style('fill', d => colorScale(d['impact']))
      .style('stroke', 'black')
      .style('stroke-width', '1px');

      tweetGroup.append('text')
      .text(d => d['user'] + "-" + d['tweetTime'].getHours());

      let filteredTweets = tweetData.filter(d => d['impact'] > 0);
      tweetGroup
      .data(filteredTweets, d => JSON.stringify(d))
      .exit()
      .remove();
    });

    let linearScaleString: d3.ScaleLinear<string, string> = d3.scaleLinear<string>();
    linearScaleString.domain([500000,13000000]).range(['blue', 'red']);
    // console.log(linearScaleString(1000000));
    // console.log(linearScaleString(9000000));
    
    let linearScale = d3.scaleLinear().domain([500000, 13000000]).range([0, 500]);
    // console.log(linearScale(1000000));
    // console.log(linearScale(9000000));
    // console.log(linearScale.invert(250));

    let sampleArray = [423,124,66,424,58,10,900,44,1];
    let quantileScale = d3.scaleQuantile().domain(sampleArray).range([0,1,2]);
    // console.log(quantileScale(423));
    // console.log(quantileScale(20));
    // console.log(quantileScale(10000));

    let quantileScaleString: d3.ScaleQuantile<string> = d3.scaleQuantile<string>();
    quantileScaleString.domain(sampleArray).range(['small', 'medium', 'large']);
    // console.log(quantileScaleString(68));
    // console.log(quantileScaleString(20));
    // console.log(quantileScaleString(10000));

    let testArray =  [88,10000,1,75,12,35];
    let minimum = d3.min(testArray, el => el);
    let maximum = d3.max(testArray, el => el);
    let mean = d3.mean(testArray, el => el);
    let extent = d3.extent(testArray, el => el);
    // console.log(minimum);
    // console.log(maximum);
    // console.log(mean);
    // console.log(extent);
    
  }

  chapterThree() {
    // console.log(colorbrewer.Blues[5]);
    d3.csv("assets/data/worldcup.csv").then(
      data => {
        // console.log(data);
        this.cupData = data;
        
        d3.select("#cardFive").select('svg')
        .append('g')
        .attr('id', 'teamsG')
        .attr('transform', "translate(50,300)")
        .selectAll('g')
        .data(data).enter()
        .append('g')
        .attr('class', 'overallG')
        .attr("transform", (d,i) => "translate(" + (i*50) + ",0)");

        let teamG = d3.selectAll('g.overallG');
        teamG.append('circle')
        .attr('r', 0)
        .transition()
        .delay((d,i) => i * 100)
        .duration(500)
        .attr('r', 40)
        .transition()
        .duration(500)
        .attr('r', 20);

        teamG.append('text')
        .attr('y', 30)
        .text(d => d['team']);

        // teamG.on('mouseover', this.highlightRegion);
        // teamG.on("mouseout", function() {
        //   teamG.select("circle").classed("inactive", false).classed("active", false)
        // })

        let dataKeys: Array<string> = data['columns'];
        const keys = dataKeys.filter( d => d !== 'team' && d !== 'region');

        d3.select('#controls').selectAll('buttons.teams')
        .data(keys).enter()
        .append('button')
        .on('click', this.onCategoryClick.bind(this))
        .html(d => d);        
      }
    )
  }

  chapterFour() {
    let cardSix = d3.select("#cardSix");
    const scatterData = [{friends: 5, salary: 22000},
      {friends: 3, salary: 18000}, {friends: 10, salary: 88000},
      {friends: 0, salary: 180000}, {friends: 27, salary: 56000},
      {friends: 8, salary: 74000}];

    const xExtent = d3.extent(scatterData, d => d['salary']);
    const yExtent = d3.extent(scatterData, d => d['friends']);
    const xScale = d3.scaleLinear().domain(xExtent).range([0,500]);
    const yScale = d3.scaleLinear().domain(yExtent).range([0,500]);
    const xAxis = d3.axisBottom(xScale);
    cardSix.select('svg').append('g').attr('id', 'xAxisG').call(xAxis);
    d3.selectAll('#xAxisG').attr('transform', 'translate(0,500)');
    const yAxis = d3.axisRight(yScale);
    cardSix.select('svg').append('g').attr('id', 'yAxisG').call(yAxis);
    
    cardSix.select('svg')
      .style("width", "520px")
      .style("height", "520px")
      .selectAll('circle')
      .data(scatterData).enter()
      .append('circle')
      .attr('r', 5)
      .attr('cx', d => xScale(d['salary']))
      .attr('cy', d => yScale(d['friends']));

    let cardSeven = d3.select("#cardSeven");
    
    d3.csv('assets/data/boxplot.csv').then(
      data => {
        const tickSize = 470; 
        // console.log(data);
        const xScale = d3.scaleLinear().domain([1, 8]).range([20, tickSize]);
        const xAxis = d3.axisBottom(xScale).tickSize(-tickSize).tickValues([1,2,3,4,5,6,7]);
        const yScale = d3.scaleLinear().domain([0, 100]).range([(tickSize + 10), 20]);
        const yAxis = d3.axisRight(yScale).ticks(8).tickSize(-tickSize);
        cardSeven.select('svg')
        .style("width", "520px")
        .style("height", "520px")
        .append('g')
        .attr('transform', `translate(${tickSize}, 0)`)
        .attr('id', 'yAxisG')
        .call(yAxis);
        cardSeven.select('svg')
        .append('g')
        .attr('transform', `translate(0, ${tickSize + 10})`)
        .attr('id', 'xAxisG')
        .call(xAxis);
        // cardSeven.select('svg')
        // .selectAll('circle.median')
        // .data(data).enter()
        // .append('circle')
        // .attr('class', 'tweets')
        // .attr('r', 5)
        // .attr('cx', d => xScale(parseInt(d['day'])))
        // .attr('cy', d => yScale(parseInt(d['median'])))
        // .style('fill', 'darkgray');
        cardSeven.select('svg').selectAll('g.box')
        .data(data).enter()
        .append('g')
        .attr('class', 'box')
        .attr('transform', d => `translate(${xScale(parseInt(d['day']))} , ${yScale(parseInt(d['median']))})`)
        .each(function(d,i) {
          d3.select(this)
          .append('line')
          .attr('class', 'range')         
          .attr('x1', 0)
          .attr('x2', 0)
          .attr('y1', yScale(+d['max']) - yScale(+d['median']))
          .attr('y2', yScale(+d['min']) - yScale(+d['median']))
          .style('stroke', 'black')
          .style('stroke-width', '4px');
          d3.select(this)
          .append('line')
          .attr('class', 'max')         
          .attr('x1', -10)
          .attr('x2', 10)
          .attr('y1', yScale(+d['max']) - yScale(+d['median']))
          .attr('y2', yScale(+d['max']) - yScale(+d['median']))
          .style('stroke', 'black')
          .style('stroke-width', '4px');
          d3.select(this)
          .append('line')
          .attr('class', 'min')    
          .attr('x1', -10)
          .attr('x2', 10)
          .attr('y1', yScale(+d['min']) - yScale(+d['median']))
          .attr('y2', yScale(+d['min']) - yScale(+d['median']))
          .style('stroke', 'black')
          .style('stroke-width', '4px');
          d3.select(this)
          .append('rect')
          .attr('width', 20)
          .attr('x', -10)
          .attr('y', yScale(+d['q3']) - yScale(+d['median']))
          .attr('height', yScale(parseInt( d['q1'])) - yScale(parseInt( d['q3'])))
          .style('fill', 'white')
          .style('stroke', 'black');
          d3.select(this)
          .append('line')                  
          .attr('x1', -10)
          .attr('x2', 10)
          .attr('y1', 0)
          .attr('y2', 0)
          .style('stroke', 'darkgray')
          .style('stroke-width', '4px');
        })
      }
    )

    const cardEight = d3.select("#cardEight");
    d3.csv('assets/data/tweetdata.csv').then(
      data => {
        cardEight.select('svg')
        .style("width", "520px")
        .style("height", "520px")
        // console.log(data);
        const blue = "#5eaec5", green = "#92c463", orange = "#fe9a22";
        
        const xScale = d3.scaleLinear().domain([1,10.5]).range([20, 480]);       
        const xAxis = d3.axisBottom(xScale).tickSize(480).tickValues([1,2,3,4,5,6,7,8,9,10]);
        cardEight.select('svg')
        .append('g')
        .attr('id', 'xAxisG')
        .call(xAxis);
        
        const yScale = d3.scaleLinear().domain([0, 35]).range([480, 20]);
        const yAxis = d3.axisRight(yScale).ticks(10).tickSize(480);
        cardEight.select('svg')
        .append('g')
        .attr('id', 'yAxisG')
        .call(yAxis);
        
        cardEight.select('svg')
        .selectAll('circle.tweets')
        .data(data).enter()
        .append('circle')
        .attr('class', 'tweets')
        .attr('r', 5)
        .attr('cx', d => xScale(+d['day']))
        .attr('cy', d => yScale(+d['tweets']))
        .style('fill', blue);

        const tweetLine = d3.line<any>().curve(d3.curveCardinal)
          .x(d => xScale(+d['day']))
          .y(d => yScale(+d['tweets']));
        cardEight.select('svg')
        .append('path')
        .attr('d', tweetLine(data))
        .attr('fill', 'none')
        .attr('stroke', blue)
        .attr('stroke-width', 2);

        cardEight.select('svg')
        .selectAll('circle.retweets')
        .data(data).enter()
        .append('circle')
        .attr('class', 'retweets')
        .attr('r', 5)
        .attr('cx', d => xScale(+d['day']))
        .attr('cy', d => yScale(+d['retweets']))
        .style('fill', green);

        const retweetLine = d3.line<any>().curve(d3.curveCardinal)
          .x(d => xScale(+d['day']))
          .y(d => yScale(+d['retweets']));
        cardEight.select('svg')
        .append('path')
        .attr('d', retweetLine(data))
        .attr('fill', 'none')
        .attr('stroke', green)
        .attr('stroke-width', 2);

        cardEight.select('svg')
        .selectAll('circle.favorites')
        .data(data).enter()
        .append('circle')
        .attr('class', 'favorites')
        .attr('r', 5)
        .attr('cx', d => xScale(+d['day']))
        .attr('cy', d => yScale(+d['favorites']))
        .style('fill', orange);

        const favLine = d3.line<any>().curve(d3.curveCardinal)
        .x(d => xScale(+d['day']))
        .y(d => yScale(+d['favorites']));
        cardEight.select('svg')
        .append('path')
        .attr('d', favLine(data))
        .attr('fill', 'none')
        .attr('stroke', orange)
        .attr('stroke-width', 2);
        
      }
    )

    const cardNine = d3.select("#cardNine");
    d3.csv('assets/data/movies.csv').then(
      data => {
        cardNine.select('svg')
        .style("width", "520px")
        .style("height", "520px");

        const fillScale = d3.scaleOrdinal<string>()
          .domain(["titanic", "avatar", "akira", "frozen", "deliverance", "avengers"])
          .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F", "#5eafc6", "#41a368"])

        const xScale = d3.scaleLinear().domain([1,10]).range([20, 480]);       
        const xAxis = d3.axisBottom(xScale).tickSize(480).tickValues([1,2,3,4,5,6,7,8,9,10]);
        cardNine.select('svg')
        .append('g')
        .attr('id', 'xAxisG')
        .attr('class', 'axis')       
        .call(xAxis);
        
        const yScale = d3.scaleLinear().domain([0, 55]).range([470, 20]);
        const yAxis = d3.axisRight(yScale).ticks(10).tickSize(480);
        cardNine.select('svg')
        .append('g')
        .attr('id', 'yAxisG')
        .attr('class', 'axis') 
        .call(yAxis);

        Object.keys(data[0]).forEach(
          key => {
            if (key != 'day') {
              let movieArea = d3.area<any>()
                .x(d => xScale(d['day']))
                .y0(d => yScale(this.simpleStacking(d, key) - d[key]))
                .y1(d => yScale(this.simpleStacking(d, key)))
                .curve(d3.curveCardinal);
              cardNine.select('svg')
              .append('path')
              .attr('id', key + 'Area')
              .attr('d', movieArea(data))
              .attr('fill', fillScale(key))
              .attr('stroke', 'black')
              .attr('stroke-width', 1);              
            }
          }
        );
      }
    )
  }

  chapterFive() {
    let cardTen = d3.select("#cardTen");    
    cardTen.select('svg')
    .style("width", "620px")
    .style("height", "520px");

    let cardEleven = d3.select("#cardEleven");    
    cardEleven.select('svg')
    .style("width", "520px")
    .style("height", "520px");

    let cardTwelve = d3.select("#cardTwelve");    
    cardTwelve.select('svg')
    .style("width", "520px")
    .style("height", "520px");

    let cardThirteen =  d3.select("#cardThirteen");    
    cardThirteen.select('svg')
    .style("width", "520px")
    .style("height", "520px");

    let cardFourteen =  d3.select("#cardFourteen");    
    cardFourteen.select('svg')
    .style("width", "520px")
    .style("height", "520px");

    let cardFifteen =  d3.select("#cardFifteen");    
    cardFifteen.select('svg')
    .style("width", "520px")
    .style("height", "520px");

    d3.json('assets/data/tweets.json').then(
      data => {
        this.tweetsData = data['tweets'];
        // let xScale = d3.scaleLinear().domain([0,5]).range([0,500]);
        let xAxis = d3.axisBottom(this.cardTen_xScale).ticks(5);
        // let yScale = d3.scaleLinear().domain([0,10]).range([400,0]);
        // let histoChart = d3.histogram();
        // this.histoChart.domain([0,5])
        // .thresholds([0,1,2,3,4,5])
        // .value(d => d['favorites'].length);

        let histoData = this.histoChart(this.tweetsData);
        console.log(histoData);

        cardTen.select('svg')
        .selectAll('rect')
        .data(histoData).enter()
        .append('rect')
        .attr('x', d => this.cardTen_xScale(d['x0']))
        .attr('y', d => this.cardTen_yScale(d.length))
        .attr('width', d => this.cardTen_xScale(d['x1'] - d['x0']) - 2)
        .attr('height', d => 400 - this.cardTen_yScale(d.length))
        .on('click', this.retweetsHistogram.bind(this))
        .style('fill', '#FCD88B');

        cardTen.select('svg')
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,400)')
        .call(xAxis);

        cardTen.select('g.axis')
        .selectAll('text')
        .attr('dx', 50);

        const nestedTweets = d3.nest()
        .key(d => d['user'])
        .entries(this.tweetsData);
        nestedTweets.forEach(
          d => {
            d['numTweets'] = d.values.length;
            d['numFavorites'] = d3.sum(d.values, p => p['favorites'].length);
            d['numRetweets'] = d3.sum(d.values, p => p['retweets'].length);
          }
        )

        const pieChart = d3.pie<any>();
        pieChart.sort(null);
        pieChart.value(d => d['numTweets']);
        const myPie = pieChart(nestedTweets);
        const newArc = d3.arc<any>();
        newArc.innerRadius(20)
        .outerRadius(100);
        const pieFillScale = d3.scaleOrdinal<number,string>().range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F"]);
        cardTwelve.select('svg')
        .append('g')
        .attr('transform', 'translate(250,250)')
        .selectAll('path')
        .data(myPie).enter()    
        .append('path')
        .attr('d', newArc)
        .style('fill', (d,i) => pieFillScale(i))
        .style('stroke', 'black')
        .style('stroke-width', '2px');

        pieChart.value(d => d['numFavorites']);
        cardTwelve.selectAll('path')
        .data(pieChart(nestedTweets))
        .transition()
        .duration(1000)
        .attr('d', newArc);

        // pieChart.value(d => d['numRetweets']);
        // cardTwelve.selectAll('path')
        // .data(pieChart(nestedTweets))
        // .transition()
        // .duration(1000)
        // .attr('d', newArc);

      }
    )

    d3.csv('assets/data/movies.csv').then(
      data => {
        const xScale = d3.scaleLinear().domain([0, 10]).range([0, 500]);
        const xBarScale = d3.scaleLinear().domain([0, 10]).range([0, 500]);
        const yScale = d3.scaleLinear().domain([-50, 50]).range([500, 0]);
        const yBarScale = d3.scaleLinear().domain([0, 60]).range([480, 0]);
        const heightScale = d3.scaleLinear().domain([0, 60]).range([0, 480]);
        const movies = ["titanic", "avatar", "akira", "frozen", "deliverance", "avengers"];
        const fillScale = d3.scaleOrdinal<any>().domain(movies).range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F", "#5eafc6","#41a368"]);
        const barStackLayout = d3.stack<any>().keys(movies);
        const stackLayout = d3.stack<any>().keys(movies);
        stackLayout.offset(d3.stackOffsetSilhouette).order(d3.stackOrderInsideOut);
        const stackArea = d3.area<any>()
          .x((d,i) => xScale(i))
          .y0((d => yScale(d[0])))
          .y1((d => yScale(d[1])));
        stackArea.curve(d3.curveBasis);


        cardThirteen.select('svg').selectAll('path')
        .data(stackLayout(data)).enter() 
        .append('path')
        .style('fill', d => fillScale(d['key']))
        .attr('d', d => stackArea(d));

        cardFourteen.select('svg').selectAll('g.bar')
        .data(stackLayout(data)).enter()
        .append('g')
        .attr('class', 'bar')
        .each(function(d) {
          d3.select(this).selectAll('react')
          .data(d).enter()
          .append('rect')
          .attr('x', (p,q) => xBarScale(q) + 30)
          .attr('y', p => yBarScale(p[1]))
          .attr('height', p => heightScale(p[1] - p[0]))
          .attr('width', 40)
          .style('fill', fillScale(d['key']));
        })
      }
    )

    const fillScale = d3.scaleOrdinal<number,string>().range(["#fcd88a", "#cf7c1c", "#93c464"]);
    const normal = d3.randomNormal();
    const sampleData1 = d3.range(100).map(d => normal());
    const sampleData2 = d3.range(100).map(d => normal());
    const sampleData3 = d3.range(100).map(d => normal());
    const histoViolin = d3.histogram();
    histoViolin.domain([-3, 3])
    .thresholds([-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3])
    .value(d => d);

    const cardEleven_yScale = d3.scaleLinear().domain([-3, 3]).range([400, 0]);
    const cardEleven_yAxis = d3.axisRight(cardEleven_yScale).tickSize(300)
    cardEleven.select('svg')
    .append('g')
    .call(cardEleven_yAxis);

    const area = d3.area<Array<number>>()
      .x0(d => -d.length)
      .x1(d => d.length)
      .y(d => cardEleven_yScale(d['x0']))
      .curve(d3.curveCatmullRom);

    cardEleven.select('svg')
    .selectAll('g.violin')
    .data([sampleData1,sampleData2,sampleData3])
    .enter()
    .append('g')
    .attr('class', 'violin')
    .attr('transform', (d,i) => `translate(${50 + i * 100},0)`)
    .append('path')
    .style('stroke', 'black')
    .style('fill', (d,i) => fillScale(i))
    .attr('d', d => area(histoViolin(d)));

    

  }

  retweetsHistogram() {    
    this.histoChart.value(d => d['retweets'].length);
    let histoData = this.histoChart(this.tweetsData);
    d3.select("#cardTen").select('svg')
    .selectAll('rect')
    .data(histoData)
    .transition().duration(500)
    .attr('x', d => this.cardTen_xScale(d.length))
    .attr('y', d => this.cardTen_yScale(d.length))
    .attr('height', d => 400 - this.cardTen_yScale(d.length));
  }

  simpleStacking(lineData, lineKey) {
    let newHeight = 0;
    Object.keys(lineData).every(
      key => {
        if (key !== 'day') {
          newHeight += parseInt(lineData[key]);
          if (key === lineKey) {
            return false;
          }          
        }
        return true;
      }   
    )
    return newHeight;
  }

  onCategoryClick(datapoint) {
    // console.log(this);
    let maxValue = d3.max(this.cupData, d => parseFloat(d[datapoint]));
    let radiusScale = d3.scaleLinear().domain([0, maxValue]).range([2, 20]);
    d3.select("#cardFive").selectAll('g.overallG')
    .select('circle').transition().duration(1000)
    .attr('r', d => radiusScale(d[datapoint]));
  }

  highlightRegion(d) {
    const teamColor = d3.rgb("#75739F");
    d3.select("#cardFive").selectAll('g.overallG')
    .select('circle')
    .style('fill', p => p['region'] === d['region'] ? teamColor.darker(0.75).toString() : teamColor.darker(0.75).toString());
  }

  barViz() {
    const data = {
      name: "A1",
      children: [
        {
          name: "B1",
          children: [
            {
              name: "C1",
              value: 100
            },
            {
              name: "C2",
              value: 300
            },
            {
              name: "C3",
              value: 200
            }
          ]
        },
        {
          name: "B2",
          value: 200
        }
      ]
    };

    let margin = {top: 30, right: 120, bottom: 0, left: 120};
    let width = 960 - margin.left - margin.right;
    let height = 500 - margin.top - margin.bottom;

    let xScale = d3.scaleLinear().range([0, width]);
    let barHeight = 20;
    let colorScale = d3.scaleOrdinal().range(["steelblue", "#ccc"]);
    let duration = 750;
    let delay = 25;

    /////////////////////////////// Partition layout practice
    let partitionLayout = d3.partition().size([500, 250]);
    let rootNode = d3.hierarchy(data);
    rootNode.sum(d => d['value']);

    partitionLayout(rootNode);
    d3.select("#barViz").select('svg')
    .append('g')
    .selectAll('rect')
    .data(rootNode.descendants())
    .enter()
    .append('rect')
    .attr('x', d => d['x0'] )
    .attr('y', d => d['y0'])
    .attr('width', d => (d['x1'] - d['x0']))
    .attr('height', d => (d['y1'] - d['y0']))

  }

  ngOnInit() {
    // this.chapterOne();
    // this.chapterTwo();
    // this.chapterThree();
    // this.chapterFour();
    // this.chapterFive();
    // this.barViz();
  }
}
