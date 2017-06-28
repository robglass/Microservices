queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

function makeGraphs(error, recordsJson) {

	//Clean data
	var records = recordsJson;
	var dateFormat = d3.time.format('%m/%d/%y %H:%m');

	records.forEach(function(d) {
		d["timestamp"] = new Date( d["TriageDate"]);
		d["timestamp"].setMinutes(0);
		d["timestamp"].setSeconds(0);
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(records);

	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["timestamp"]; });
	var categoryDim = ndx.dimension(function(d) { return d["Category"]; });
	var accountDim = ndx.dimension(function(d) { return d["Account"]; });
	var plcDim = ndx.dimension(function(d) { return d["PLCVersion"]; });
	var plsDim = ndx.dimension(function(d) { return d["PLSVersion"]; });
	var escalationsDim = ndx.dimension(function(d) { return d["Escalated"]; });
	var handsonDim = ndx.dimension(function(d) { return d["HandsOnSupport"]; });
	var deviceDim = ndx.dimension(function(d) { return d["deviceType"]; });
	var regionDim = ndx.dimension(function(d) { return d["region"]; });
	var allDim = ndx.dimension(function(d) {return d;});


	//Group Data
	var numRecordsByDate = dateDim.group();
	var categoryGroup = categoryDim.group();
	var accountGroup = accountDim.group();
	var plcGroup = plcDim.group();
	var plsGroup = plsDim.group();
	var handsonGroup = handsonDim.group();
	var escalationsGroup = escalationsDim.group();
	var deviceGroup = deviceDim.group();
	var regionGroup = regionDim.group();
	var all = ndx.groupAll();


	//Define values (to be used in charts)
	var minDate = dateDim.bottom(1)[0]["timestamp"];
	var maxDate = dateDim.top(1)[0]["timestamp"];


    //Charts
    var numberRecordsND = dc.numberDisplay("#number-records-nd");
	var timeChart = dc.barChart("#time-chart");
	var categoryChart = dc.rowChart("#category-row-chart");
	var accountChart = dc.rowChart("#account-row-chart");
	var plcChart = dc.rowChart("#plc-version-row-chart")
	var plsChart = dc.rowChart("#pls-version-row-chart")
	var escalationsChart = dc.pieChart("#escalations-pie-chart")
	var handsonChart = dc.pieChart("#handson-pie-chart")
	var deviceChart = dc.rowChart("#device-row-chart")
	var regionChart = dc.rowChart("#region-row-chart")


	numberRecordsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);


	timeChart
		.width(950)
		.height(140)
		.margins({top: 10, right: 50, bottom: 20, left: 20})
		.dimension(dateDim)
		.group(numRecordsByDate)
		.transitionDuration(500)
		.controlsUseVisibility(true)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.yAxis().ticks(4);

	categoryChart
        .width(450)
        .height(2500)
        .dimension(categoryDim)
        .group(categoryGroup)
        .ordering(function(d) { return -d.value })
        .ordinalColors(['#6baed6'])
        .elasticX(true)
		.labelOffsetY(10)
        .xAxis().ticks(4);

	plcChart
        .width(450)
        .height(200)
        .dimension(plcDim)
        .group(plcGroup)
        .ordering(function(d) { return -d.value })
        .ordinalColors(['#6baed6'])
        .elasticX(true)
		.labelOffsetY(10)
        .xAxis().ticks(4);

	regionChart
        .width(450)
        .height(200)
        .dimension(regionDim)
        .group(regionGroup)
        .ordering(function(d) { return -d.value })
        .ordinalColors(['#6baed6'])
        .elasticX(true)
		.labelOffsetY(10)
        .xAxis().ticks(4);

	deviceChart
        .width(450)
        .height(200)
        .dimension(deviceDim)
        .group(deviceGroup)
        .ordering(function(d) { return -d.value })
        .ordinalColors(['#6baed6'])
        .elasticX(true)
		.labelOffsetY(10)
        .xAxis().ticks(4);

	plsChart
        .width(450)
        .height(600)
        .dimension(plsDim)
        .group(plsGroup)
        .ordering(function(d) { return -d.value })
        .ordinalColors(['#6baed6'])
        .elasticX(true)
		.labelOffsetY(10)
        .xAxis().ticks(4);

	handsonChart
        .width(450)
        .height(200)
        .dimension(handsonDim)
        .group(handsonGroup)
		.legend(dc.legend());

	escalationsChart
        .width(450)
        .height(200)
		.innerRadius(50)
        .dimension(escalationsDim)
        .group(escalationsGroup)
		.legend(dc.legend());


	accountChart
		.width(450)
		.height(8000)
        .dimension(accountDim)
        .group(accountGroup)
		.ordering(function(d) { return -d.value })
        .ordinalColors(['#6baed6'])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);

	dc.renderAll();

};