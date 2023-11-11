$(document).ready(function () {
    let data;
    // Toggle sidebar
    $("#toggleFiltersBtn").click(function () {
        $(".hamburger-icon").toggleClass("hidden");
        $(".cross-icon").toggleClass("hidden");


        $(".sidebar").toggleClass("show");
        $(".container-fluid").toggleClass("expanded-container");
        $("#toggleFiltersBtn").toggleClass("expanded");
    });

    $("#applyFiltersBtn").click(function () {
        var endYear = $('#endYearFilter').val();
        var startYear = $('#startYearFilter').val();
        var topics = $('#topicsFilter').val();
        var sector = $('#sectorFilter').val();
        var region = $('#regionFilter').val();
        var pest = $('#pestFilter').val();
        var source = $('#sourceFilter').val();
        var country = $('#countryFilter').val();

        var filteredData = data.filter(function (item) {
            return (endYear === 'all' || item.end_year === endYear) &&
                (startYear === 'all' || item.start_year === startYear) &&
                (topics === 'all' || item.topic === topics) &&
                (sector === 'all' || item.sector === sector) &&
                (region === 'all' || item.region === region) &&
                (pest === 'all' || item.pestle === pest) &&
                (source === 'all' || item.source === source) &&
                (country === 'all' || item.country === country);
        });
        showData(filteredData)
    });

    $('#resetFiltersBtn').on('click', function () {
        $('#endYearFilter, #startYearFilter, #topicsFilter, #sectorFilter, #regionFilter, #pestFilter, #sourceFilter, #countryFilter').val('all');
        showData(data)
    });

    // AJAX call to fetch data
    $.ajax({
        url: "http://localhost:8000/data/", // Replace with your actual URL
        method: "GET",
        dataType: "json",
        success: function (dataFromViews) {
            // Extract data from the response
            data = dataFromViews.data;
            showData(data);
        },
        error: function (error) {
            console.error("Error fetching data:", error);
        },
    });

    function sortArrayByX(arr) {
        return arr.sort((a, b) => a.x.localeCompare(b.x));
    }

    function showData(data) {
        var intensityData = data.reduce((acc, item) => {
            var existingItem = acc.find((entry) => entry.x === item.sector);
            if (existingItem) {
                existingItem.y += item.intensity;
            } else {
                acc.push({ x: item.sector, y: item.intensity });
            }
            return acc;
        }, []);
        intensityData = sortArrayByX(intensityData)

        var likelihoodDataBySector = data.reduce((acc, item) => {
            var existingItem = acc.find((entry) => entry.x === item.sector);
            if (existingItem) {
                existingItem.y += item.likelihood;
            } else {
                acc.push({ x: item.sector, y: item.likelihood });
            }
            return acc;
        }, []);
        likelihoodDataBySector = sortArrayByX(likelihoodDataBySector)

        var relevanceDataBySector = data.reduce((acc, item) => {
            var existingItem = acc.find((entry) => entry.x === item.sector);
            if (existingItem) {
                existingItem.y += item.relevance;
            } else {
                acc.push({ x: item.sector, y: item.relevance });
            }
            return acc;
        }, []);
        relevanceDataBySector = sortArrayByX(relevanceDataBySector)

        var intensityDataOverTime = data.reduce((acc, item) => {
            // var dateObject = new Date(item.published);
            // var year = dateObject.getFullYear();
            // console.log(year)
            var existingItem = acc.find((entry) => entry.x === item.start_year);
            if (existingItem) {
                existingItem.y += item.intensity;
            } else {
                acc.push({ x: item.start_year, y: item.intensity });
            }
            return acc;
        }, []);
        intensityDataOverTime = sortArrayByX(intensityDataOverTime)

        var sectorCountByRegion = data.reduce((acc, item) => {
            // Assuming you have a property called 'country' in your data
            var country = item.region;

            // Check if the country is already in the accumulator
            var existingCountry = acc.find((entry) => entry.x === country);

            if (existingCountry) {
                // Increment the sector count for the existing country
                existingCountry.y++;
            } else {
                // Add a new entry for the country with a count of 1
                acc.push({ x: country, y: 1 });
            }

            return acc;
        }, []);
        sectorCountByRegion = sortArrayByX(sectorCountByRegion)

        var metricsByCountry = data.reduce((acc, item) => {
            // Assuming you have a property called 'country' in your data
            var country = item.country;

            // Check if the country is already in the accumulator
            var existingCountry = acc.find((entry) => entry.x === country);

            if (existingCountry) {
                // Sum the metrics for the existing country
                existingCountry.likelihood += item.likelihood || 0;
                existingCountry.relevance += item.relevance || 0;
                existingCountry.intensity += item.intensity || 0;
            } else {
                // Add a new entry for the country with the metrics
                acc.push({
                    x: country,
                    likelihood: item.likelihood || 0,
                    relevance: item.relevance || 0,
                    intensity: item.intensity || 0,
                });
            }

            return acc;
        }, []);
        metricsByCountry = sortArrayByX(metricsByCountry)

        var dataForTopics = data.reduce((acc, item) => {
            // Assuming you have a property called 'country' in your data
            var country = item.topic;

            // Check if the country is already in the accumulator
            var existingCountry = acc.find((entry) => entry.x === country);

            if (existingCountry) {
                // Sum the metrics for the existing country
                existingCountry.likelihood += item.likelihood || 0;
                existingCountry.relevance += item.relevance || 0;
                existingCountry.intensity += item.intensity || 0;
            } else {
                // Add a new entry for the country with the metrics
                acc.push({
                    x: country,
                    likelihood: item.likelihood || 0,
                    relevance: item.relevance || 0,
                    intensity: item.intensity || 0,
                });
            }

            return acc;
        }, []);
        dataForTopics = sortArrayByX(dataForTopics)

        createAreaChart(
            "intensityChart",
            "Intensity Distribution By Sector",
            "Intensity",
            intensityData,
        );

        createBarChart(
            "likelihoodChartSector",
            "Likelihood By Sector",
            "Likelihood",
            likelihoodDataBySector
        );

        createBarChart(
            "relevanceChartBySector",
            "Relevance By Sector",
            "Relevance",
            relevanceDataBySector
        );

        createAreaChart(
            "intensityOverStartTime",
            "Intensity Over Start Time",
            "Intensity",
            intensityDataOverTime,
            false
        );

        createPieChart(
            "regionDistribution",
            "Count Of Sector Over Region",
            "Intensity",
            sectorCountByRegion,
        );

        createRadarChart('metricsByCountry', 'Metrics by Country', 'Metrics', metricsByCountry);

        createMultiLineChart('multiLineChart', 'Topics Distribution', dataForTopics);

        document.getElementById('preloader').style.display = 'none';

    }

    function createBarChart(chartId, chartTitle, label, data) {
        var ctx = document.getElementById(chartId);

        // Check if a chart instance already exists
        if (ctx.chart) {
            // Destroy the existing chart instance
            ctx.chart.destroy();
        }
        var colors = generateRandomColors(data.length);
        // Create a new chart instance
        ctx.chart = new Chart(ctx.getContext("2d"), {
            type: "bar",
            data: {
                labels: data.map((item) => (item.x != "" ? item.x : "(Blank)")),
                datasets: [
                    {
                        label: label,
                        data: data.map((item) => item.y),
                        backgroundColor: colors,
                        borderColor: colors.map((color) => color.replace("0.2", "1")),
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (tooltipItems) {
                                return chartTitle;
                            },
                            label: function (tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
                            },
                            footer: function (tooltipItems) {
                                var filters = getAppliedFilters();
                                return filters.join('\n');
                            },
                        },
                    },
                },
            },
        });
    }

    function createPieChart(chartId, chartTitle, label, data, chartType = 'doughnut') {
        var ctx = document.getElementById(chartId);

        // Check if a chart instance already exists
        if (ctx.chart) {
            // Destroy the existing chart instance
            ctx.chart.destroy();
        }

        // Create a new chart instance
        ctx.chart = new Chart(ctx.getContext("2d"), {
            type: chartType,
            data: {
                labels: data.map((item) => (item.x != "" ? item.x : "(Blank)")),
                datasets: [
                    {
                        label: label,
                        data: data.map((item) => item.y),
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.formattedValue}`;
                            },
                            footer: function (tooltipItems) {
                                var filters = getAppliedFilters(); // Assuming you have a function getAppliedFilters() to get applied filters
                                return filters.join("\n");
                            },
                        },
                    },
                },
            },
        });
    }

    function createAreaChart(chartId, chartTitle, label, data, isFill = true) {
        var ctx = document.getElementById(chartId);

        // Check if a chart instance already exists
        if (ctx.chart) {
            // Destroy the existing chart instance
            ctx.chart.destroy();
        }

        var colors = generateRandomColors(data.length);
        // Create a new chart instance
        ctx.chart = new Chart(ctx.getContext("2d"), {
            type: "line", // Use "line" type for area chart
            data: {
                labels: data.map((item) => (item.x != "" ? item.x : "(Blank)")),
                datasets: [
                    {
                        label: label,
                        data: data.map((item) => item.y),
                        backgroundColor: colors,
                        borderColor: colors.map((color) => color.replace("0.2", "1")),
                        borderWidth: 1,
                        fill: isFill, // Fill the area under the line
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.formattedValue}`;
                            },
                            footer: function (tooltipItems) {
                                var filters = getAppliedFilters(); // Assuming you have a function getAppliedFilters() to get applied filters
                                return filters.join("\n");
                            },
                        },
                    },
                },
            },
        });
    }

    function createRadarChart(chartId, chartTitle, label, data) {
        var ctx = document.getElementById(chartId);

        // Check if a chart instance already exists
        if (ctx.chart) {
            // Destroy the existing chart instance
            ctx.chart.destroy();
        }

        // Extract labels (countries) and metrics from the data
        var labels = data.map((item) => (item.x != "" ? item.x : "(Blank)"));
        var likelihoodData = data.map((item) => item.likelihood);
        var relevanceData = data.map((item) => item.relevance);
        var intensityData = data.map((item) => item.intensity);

        // Create a new chart instance
        ctx.chart = new Chart(ctx.getContext("2d"), {
            type: "radar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Likelihood",
                        data: likelihoodData,
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                        pointBackgroundColor: "rgba(75, 192, 192, 1)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
                    },
                    {
                        label: "Relevance",
                        data: relevanceData,
                        backgroundColor: "rgba(255, 99, 132, 0.2)", // Adjust color as needed
                        borderColor: "rgba(255, 99, 132, 1)", // Adjust color as needed
                        borderWidth: 1,
                        pointBackgroundColor: "rgba(255, 99, 132, 1)", // Adjust color as needed
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(255, 99, 132, 1)", // Adjust color as needed
                    },
                    {
                        label: "Intensity",
                        data: intensityData,
                        backgroundColor: "rgba(255, 205, 86, 0.2)", // Adjust color as needed
                        borderColor: "rgba(255, 205, 86, 1)", // Adjust color as needed
                        borderWidth: 1,
                        pointBackgroundColor: "rgba(255, 205, 86, 1)", // Adjust color as needed
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(255, 205, 86, 1)", // Adjust color as needed
                    },
                ],
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
                            },
                            footer: function (tooltipItems) {
                                var filters = getAppliedFilters(); // Assuming you have a function getAppliedFilters() to get applied filters
                                return filters.join("\n");
                            },
                        },
                    },
                },
            },
        });
    }

    function createMultiLineChart(chartId, chartTitle, data) {
        var ctx = document.getElementById(chartId);

        // Check if a chart instance already exists
        if (ctx.chart) {
            // Destroy the existing chart instance
            ctx.chart.destroy();
        }

        // Extract labels (topics) and metrics from the data
        var labels = data.map((item) => item.x);

        // Extract unique metrics (likelihood, relevance, intensity) from the data
        var uniqueMetrics = Object.keys(data[0]).filter((key) => key !== 'x');

        // Create datasets for each metric
        var datasets = uniqueMetrics.map((metric) => {
            return {
                label: metric.charAt(0).toUpperCase() + metric.slice(1), // Capitalize the first letter
                data: data.map((item) => item[metric]),
                // borderColor: generateRandomColors(), // Function to get a random color
                borderWidth: 1,
                fill: false,
            };
        });

        // Create a new chart instance
        ctx.chart = new Chart(ctx.getContext("2d"), {
            type: "line",
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
                            },
                            footer: function (tooltipItems) {
                                var filters = getAppliedFilters(); // Assuming you have a function getAppliedFilters() to get applied filters
                                return filters.join("\n");
                            },
                        },
                    },
                },
            },
        });
    }

    function getAppliedFilters() {
        var appliedFilters = [];
        var filterIds = [
            'endYearFilter',
            'startYearFilter',
            'topicsFilter',
            'sectorFilter',
            'regionFilter',
            'pestFilter',
            'sourceFilter',
            'countryFilter'
        ];

        filterIds.forEach(function (filterId) {
            var filterValue = $('#' + filterId).val();
            if (filterValue !== 'all') {
                appliedFilters.push(`${filterId.replace('Filter', '')}: ${filterValue}`);
            }
        });

        return appliedFilters;
    }

    function generateRandomColors(count) {
        var colors = [];
        for (var i = 0; i < count; i++) {
            var color = "rgba(" +
                Math.floor(Math.random() * 256) + "," +
                Math.floor(Math.random() * 256) + "," +
                Math.floor(Math.random() * 256) + ",0.2)";
            colors.push(color);
        }
        return colors;
    }



});