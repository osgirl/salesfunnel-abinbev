function getFunnelChart() {

    var pykChart = {};

    function createFunnelChart(chartName, funnelChartData) {
        return new PykCharts.oneD.funnel({
            "selector": "#" + chartName,
            "data": [
                {
                    "name": "visits",
                    "weight": funnelChartData.visits,
                    "tooltip": "<b>Total visits:</b> " + funnelChartData.visits
                },
                {
                    "name": "proposals",
                    "weight": funnelChartData.proposals,
                    "tooltip": "<b>Total proposals:</b> " + funnelChartData.proposals
                }, {
                    "name": "prospects",
                    "weight": funnelChartData.negos,
                    "tooltip": "<b>Total prospects:</b> " + funnelChartData.negos
                }, {
                    "name": "deals",
                    "weight": funnelChartData.deals,
                    "tooltip": "<b>Total deals:</b> " + funnelChartData.deals
                }
            ],
            "color_mode": "shade",
            "shade_color": "#ffb300",
            "credit_my_site_name": "Cazamundo GCV",
            "credit_my_site_url": "http://www.cazamundo.be",
            "data_source_name": "AB Inbev",
            "data_source_url": "http://www.ab-inbev.com/"
        });
    }

    function init(funnelChartData) {
        window.PykChartsInit = function (e) {
            pykChart = createFunnelChart("my_chart", funnelChartData);
            pykChart.execute();
            window.pykChart = pykChart;
        };
    }

    function updateData(funnelChartData) {
        pykChart = createFunnelChart("my_chart", funnelChartData);
        pykChart.execute();
    }

    return {
        init: init,
        updateData: updateData
    }
}