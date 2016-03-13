function getFunnelChart() {

    var funnelChartData = {};
    var pykChart = {};

    function init(data) {
        funnelChartData = data;
        window.PykChartsInit = function (e) {
            pykChart = new PykCharts.oneD.funnel({
                "selector": "#my_chart",
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
                        "name": "negos",
                        "weight": funnelChartData.negos,
                        "tooltip": "<b>Total negos:</b> " + funnelChartData.negos
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
            pykChart.execute();
        };
    }

    function updateData(data) {
        console.log("update data!: ");
        pykChart.
        pykChart.refresh(data);
    }

    return {
        init: init,
        updateData: updateData
    }
}