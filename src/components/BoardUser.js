import React, { useState } from "react";
import Header from "./Header";
import ChartLine from "./stats/ChartLine";
import historicalCharts from "../data/historical-charts.json"
import WidChart from "./stats/WidChart";

const BoardUser = props => {
  const [content, setContent] = useState("current");

  return (
    <div>
      <Header setContent={setContent} />

      {content === "historical" && (
           <div className={"container-fluid"}>
               <div className="row">
                {
                    historicalCharts.plots.map((obj,idx) => {
                        return (
                            <div className="col-md-6" key={idx}>
                                <ChartLine
                                    sbtitle={obj.title}
                                    typePlot={obj.type}
                                    users={obj.users}
                                    building={obj.building}
                                    month={obj.month}
                                    day = {obj.day}
                                    year={obj.year}
                                />
                            </div>
                        )
                    })
                }
                </div>
            </div>
      )}

      {content === "current" && (
          <div className={"container-fluid"}>
             <WidChart />
          </div>
      )}
    </div>
  );
};

export default BoardUser;
