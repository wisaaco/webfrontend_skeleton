import React from "react";
import {
    Row,
    Col,
} from "shards-react";
import * as Icons from "@material-ui/icons";
import chartsOccupation from "../../data/occupation-charts.json";
import ApexChart from "react-apexcharts";
import dataAPI from "../../services/data.service";
import classNames from 'classnames/bind';

//0-Green, 1-Warning, 2-Red
const colorsFills =["rgba(82, 211, 39, 0.3)","rgba(224, 199, 87, 0.25)","rgba(252, 215, 206, .25)"]
const colorsSolid =["rgba(62, 159, 29, 1)","rgba(211, 180, 39, 1)","rgba(246, 121, 93)"]

const area = {
    options: {
        stroke: {
            show: true,
            curve: "smooth",
            width: 2,
        },
        chart: {
            height: 350,
            type: "area",
            toolbar: {
                show: false,
            },
        },
        fill: {
            type: 'solid',
            colors: ["rgba(252, 215, 206, .25)"]
        },
        colors: ["rgba(246, 121, 93)"],
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        xaxis: {
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
            },
        },
        yaxis: {
            show: false,
            labels: {
                show: false,
            },
        },
        grid: {
            padding: {
                left: 0,
                right: 0,
            },
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
        },
        tooltip: {
            enabled: false,
        }
    },
};

class WidChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            area: {...area},
            dataPlots : []
        }
    }
    componentDidMount(){
        for (const [ , obj] of chartsOccupation.plots.entries()){
            dataAPI.getCurrentOccupation(
                obj.area
            ).then(
                (response) => {
                    this.setState(
                        {dataPlots : [...this.state.dataPlots, response.data]}
                    )
                },
                (error) => {
                    const _content =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    console.log(_content)
                }
            );
        }
    }

    render(){
        return(
        <Row style={{"marginTop":"20px"}}>
            {
                this.state.dataPlots.map((obj,idx) => {

                    const trendDown = obj.step<0
                    let idxColorSignal = 0;
                    let stepClassName = classNames(
                        'mb-0',
                        'text-success'
                    );
                    if (obj.percentage>=40 && obj.percentage<60){
                        idxColorSignal = 1;
                        stepClassName = classNames(
                            'mb-0',
                            'text-warning'
                        );
                    }
                    if (obj.percentage>=60){
                        idxColorSignal = 2;
                        stepClassName = classNames(
                            'mb-0',
                            'text-danger'
                        );
                    }
                    let optionsCP = this.state.area.options
                    optionsCP.fill.colors[0] = colorsFills[idxColorSignal]
                    optionsCP.colors[0] = colorsSolid[idxColorSignal]

                    return  <Col className={"cardOccupation col-sm-5  col-md-5 col-lg-4 col-xl-4 "} key={idx}>
                        <Row className={`justify-content-between mt-3`}>
                            <Col sm={8} className={"d-flex align-items-center"}>
                                <h3 className={"fw-semi-bold mb-0"}>{obj.name}</h3>
                            </Col>
                            <Col sm={4} className={"d-flex align-items-center"}>
                                <h2 className={"fw-semi-bold mb-0"}>{obj.percentage}%</h2>
                            </Col>
                            <Col sm={6} className={"d-flex align-items-center"}>
                                <p className={"fw-semi-bold mb-0"}>{obj.current} de {obj.total}</p>
                            </Col>
                            <Col sm={6} className={"d-flex align-items-center justify-content-end"}>
                                <p className={"text-alert mb-0"}>5'</p>
                                {!trendDown && <Icons.TrendingUp alt="" className={"mr-1"}/>}
                                {trendDown && <Icons.TrendingDown alt="" className={"mr-1"}/>}

                                <p className={stepClassName}>{obj.step}%</p>
                            </Col>
                            <Col sm={12} style={{"marginTop":"-8%"}}>
                                <ApexChart
                                    className="sparkline-chart"
                                    height={80}
                                    series={obj.data}
                                    options={optionsCP}
                                    type={"area"}
                                />
                            </Col>
                        </Row>
                    </Col>
                })
            }
        </Row>
        );
    }
}

WidChart.defaultProps = {
    dataPlots: []
};

export default WidChart;