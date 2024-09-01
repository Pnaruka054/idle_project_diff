import { useLocation } from 'react-router-dom';
import './route_detail.css';
import React, { useEffect, useState } from 'react';
import Navigation from '../../components/navigation/navigation';

const RouteDetail = () => {
    let location = useLocation();
    let [from_input_state_state, setFrom_input_state_state] = useState('');
    let [to_input_state_state, setTo_input_state_state] = useState('');
    let { from_input_state, to_input_state, distanceText_state, timeText_state, route } = location.state || {};

    useEffect(() => {
        if (from_input_state && to_input_state) {
            let from_input = from_input_state.split(')')[1];
            let to_input = to_input_state.split(')')[1];
            setFrom_input_state_state(from_input);
            setTo_input_state_state(to_input);
        }
    }, [from_input_state, to_input_state]);

    return (
      <div id="route_detail_main_div">
        <Navigation />
        <div id="find_top">
          <div>
            <p>{from_input_state_state}</p>
          </div>
          <div>
            <i className="fa-sharp fa-solid fa-arrow-left"></i>{" "}
            <b>{distanceText_state}</b>{" "}
            <i className="fa-sharp fa-solid fa-arrow-right"></i>
          </div>
          <div>
            <p>{to_input_state_state}</p>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#90E0EF",
            fontSize: "15px",
            textAlign: "center",
          }}
        >
          <div>
            Estimated Travel Time: <b>{timeText_state}</b>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#CAF0F8",
            fontSize: "15px",
            textAlign: "center",
          }}
        >
          <div id="route_detail_table">
            <table>
              <thead>
                <tr>
                  <th colSpan="3">Total Cost</th>
                </tr>
                <tr>
                  <th>Gents</th>
                  <th>Ladies</th>
                  <th>ST</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>₹20</td>
                  <td>₹20</td>
                  <td>₹20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div id="route_detail_div">
          <div style={{ position: "relative" }}>
            {route.map((routeSegment, routeIndex) => (
              <div key={routeIndex}>
                {routeIndex === 0 && (
                  <div className="route_detail_location_point">
                    <div></div>
                    <div>
                      <p>&#x1F518; &nbsp;Starting Point&nbsp; &#x1F518;</p>
                    </div>
                  </div>
                )}
                {routeSegment.map((value, index) => (
                  <div key={index}>
                    {index === 0 && (
                      <div className="route_detail_starting_point">
                        <div>
                          <i className="fa-solid fa-bus"></i>{" "}
                          <p>{value.Taxi_Number}</p>
                        </div>
                        <div>
                          <div></div>
                          <div></div>
                        </div>
                        <div>
                          <p>{value.Address.split(")")[1]}</p>
                        </div>
                      </div>
                    )}
                    {index > 0 && index < routeSegment.length - 1 && (
                      <div className="route_detail_point">
                        <div></div>
                        <div>
                          <div></div>
                          <div></div>
                        </div>
                        <div>
                          <p>{value.Address.split(")")[1]}</p>
                        </div>
                      </div>
                    )}
                    {index === routeSegment.length - 1 && (
                      <div className="route_detail_ending_point">
                        <div>
                          <i className="fa-solid fa-bus"></i>{" "}
                          <p>{value.Taxi_Number}</p>
                        </div>
                        <div>
                          <div></div>
                          <div></div>
                        </div>
                        <div>
                          <p>{value.Address.split(")")[1]}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {routeIndex !== route.length - 1 && (
                  <div className="route_detail_exchange_point">
                    <div></div>
                    <div>
                      <p>&#11015; &nbsp;Change&nbsp; &#11015;</p>
                    </div>
                  </div>
                )}
                {routeIndex === route.length - 1 && (
                  <div className="route_detail_location_point">
                    <div></div>
                    <div>
                      <p>&#x1F4CD; &nbsp;Your Destination&nbsp; &#x1F4CD;</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}

export default RouteDetail;
