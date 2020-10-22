import React from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  FormSelect
} from "shards-react";
import * as Icons from "@material-ui/icons";
import { DatePicker } from "shards-react";
import Chart from "./chart";
import { registerLocale } from 'react-datepicker';
import enGB from "date-fns/locale/en-GB"
import dataAPI from "../../services/data.service";
import names from '../../data/names.json';

registerLocale("enGB", enGB); // register it with the name you want

const colorsLine = ['#23AAE01A', '#2646531A', '#2A9D8F1A', '#79D75A1A', '#E9C46A1A', '#F4A2611A', '#E83D3D1A', '#A84CE11A', '#F6BA611A'];
const colorsBLine = ['#23AAE0', '#264653', '#2A9D8F', '#79D75A', '#E9C46A', '#F4A261', '#E83D3D', '#A84CE1', '#F6BA61'];

function getNumberOfWeek(data) {
  const firstDayOfYear = new Date(data.getFullYear(), 0, 1);
  const pastDaysOfYear = (data - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

class ChartLine extends React.Component {
  constructor(props) {
    super(props);
    let labels = [];
    if (this.props.typePlot==="day"){
      labels = ["Mo","Tu","We","Th","Fr","Sa","Su"]
    }else{
      labels = Array.from(new Array(24), (_, i) => (i === 0 ? i : i))
    }

    this.state = {
      title: this.props.sbtitle,
      path: this.props.path,
      currentDay: new Date(),

      building: this.props.building,
      month: this.props.month,
      day: this.props.day,
      year: this.props.year,
      typePlot: this.props.typePlot,

      weekof: this.props.weekof,

      startDate: new Date(this.props.year,this.props.month,this.props.day), //TODO Update the values

      chartData: {
        labels:labels,
        datasets: []
      },
      seriesData : []
    }

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleInputBuilding = this.handleInputBuilding.bind(this);
    this.onClickButtonClear = this.onClickButtonClear.bind(this);
    this.getDateLabel = this.getDateLabel.bind(this);
    this.canvasRef = React.createRef();
  }

  getDateLabel(){
      let date = this.state.startDate;
      let month = date.getMonth() +1;//months from 1-12
      let day = date.getDate();
      let year = date.getFullYear();

      if (this.props.ticks === 7){
        return getNumberOfWeek(date);
      }else {
        if (this.state.currentDay.getMonth() === date.getMonth() &&
          this.state.currentDay.getDate() === date.getDate() &&
          this.state.currentDay.getFullYear() === date.getFullYear()) {
          return "Today";
        }
        return ('0' + day).slice(-2) + "/" + ('0' + month).slice(-2) + "/" + year;
    }
  }
  componentDidMount() {


    this.BlogUsersOverview = new Chart(this.canvasRef.current, {
      type: "LineWithLine",
      data: this.state.chartData,
      options: {
        ...{
        responsive: true,
        legend: {
          position: "top"
        },
        elements: {
          line: {
            // A higher value makes the line look skewed at this ratio.
            tension: 0.3
          },
          point: {
            radius: 0
          }
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: (this.props.ticks === 24 ? "Hours in GMT+0": "Day"),
              },

              gridLines: false,
              ticks: {
                callback(tick, index) {
                  // Jump every 7 values on the X axis labels to avoid clutter.
                  return index % 1 !== 0 ? "" : tick;
                }
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                suggestedMax: 100,
                callback(tick) {
                  if (tick === 0) {
                    return tick;
                  }
                  // Format the amounts using Ks for thousands.
                  return tick > 999 ? `${(tick / 1000).toFixed(1)}K` : tick;
                }
              }
            }
          ]
        },
        hover: {
          mode: "nearest",
          intersect: false
        },
        tooltips: {
          custom: false,
          mode: "nearest",
          intersect: false
        }
      }}

      });

    this.updateChartData();
    this.BlogUsersOverview.render();
  }
  handleInputBuilding(e){
    this.setState({ building: e.target.value}, function() {
      this.updateChartData();
    });
  }
  handleOnChange(val) {
    this.setState({
      startDate: new Date(val)
    });
    this.state.startDate =  new Date(val)
    this.updateChartData();
  }
  onClickButtonClear() {
    // console.log("Clearing data");
    this.state.seriesData = [];
    this.state.chartData.datasets = [];

    var newDatasets = {...this.state.chartData.datasets}
    newDatasets.flag = [];
    this.setState({newDatasets})

    this.BlogUsersOverview.data = this.state.chartData;
    this.BlogUsersOverview.update();
  }
  updateChartData(){
      var dataSerie = []
      if (this.state.typePlot === "day"){
          dataAPI.getSerieDay(
              this.state.building,
              this.state.year,
              this.state.month,
              this.state.day
          ).then(
              (response) => {
                let ldatasets = this.state.chartData.datasets.length;
                const newSerie = {
                  label: this.state.building+":"+this.getDateLabel(),
                  fill: "start",
                  data: response.data.data,
                  backgroundColor: colorsLine[ldatasets],
                  borderColor: colorsBLine[ldatasets],
                  pointBackgroundColor: "#ffffff",
                  pointHoverBackgroundColor: colorsBLine[ldatasets],
                  borderWidth: 1.5,
                  pointRadius: 0,
                  pointHoverRadius: 3
                }
                this.state.chartData.datasets.push(newSerie)
                this.BlogUsersOverview.data = this.state.chartData;
                this.BlogUsersOverview.update();

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
      }else{
        dataAPI.getSerieWeek(
            this.state.building,
            this.state.year,
            this.state.weekof,
        ).then(
            (response) => {
              // setContent(response.data);
              dataSerie = response.data.data
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

  render() {
    const title = this.state.title;
    return (
      <div style={{"marginTop":"-40px"}}>
      <Card className="h-25">
        <CardHeader className="border-bottom">
          <h5 className="m-0">{title}</h5>
        </CardHeader>
        <CardBody className="pt-0">
          <Row className="border-bottom py-1 bg-light">
            <Col sm="3" className="d-flex mr-0">
              <FormSelect
                name = "building"
                size="xs"
                style={{ maxWidth: "130px" }}
                disabled = {(this.state.chartData.datasets.length >8)}
                onChange={this.handleInputBuilding}
              >
                {
                   names.buildings.map((obj,idx) => {
                    return <option value={obj.acr} key={idx}>{obj.name}</option>
                  })
                }

              </FormSelect>
            </Col>
            {/*<Col sm="4" className="d-flex ml1-sm-0 mb-1 mb-sm-0">*/}
            <Col sm="4" className="d-flex ml1-sm-0 mb-1 mb-sm-0">
              <DatePicker
                className = "text-secondary"
                size="xs"
                dropdownMode="select"
                selected={this.state.startDate}
                locale="enGB"
                dateFormat="dd/MM/yyyy"
                disabled = {(this.state.chartData.datasets.length >8)}
                maxDate={new Date()}
                showWeekNumbers = {(this.props.typePlot === "day")}
                minDate={new Date("05/04/2020")}
                onChange={this.handleOnChange}
              />
            </Col>

            <Col>

              <Button
                size="xs"
                // className="d-flex btn-white ml-auto mr-auto ml-sm-auto mr-sm-0 mt-3 mt-sm-0"
                className="d-flex btn btn-secondary btn-sm ml-auto mr-auto"
                style={{float:"right"}}
                onClick={this.onClickButtonClear}
              >
                <Icons.DeleteOutline />
              </Button>
            </Col>
          </Row>
          <canvas
            height="175"
            ref={this.canvasRef}

          />
        </CardBody>
      </Card>
      </div>
    );
  }
}

// ChartLine.propTypes = {
//   /**
//    * The component's title.
//    */
//   title: PropTypes.string,
//   /**
//    * The chart dataset.
//    */
//   chartData: PropTypes.object,
//   /**
//    * The Chart.js options.
//    */
//   chartOptions: PropTypes.object
// };

export default ChartLine;

