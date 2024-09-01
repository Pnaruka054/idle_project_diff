import { Link, useLocation } from 'react-router-dom';
import Navigation from '../../components/navigation/navigation';
import './find.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdComponent2 from '../../components/adComponents/adComponent2/adComponent2';
import Display_Ads from '../../components/adComponents/Display_Ads/display_ads';

const Find = () => {
    const [total_Route_state, setTotal_Route_state] = useState([]);
    const [from_input_state_state, setFrom_input_state_state] = useState('');
    const [to_input_state_state, setTo_input_state_state] = useState('');

    const location = useLocation();
    const { from_input_state, to_input_state, distanceText_state, timeText_state } = location.state || {};

    const get_Texi_Routes = async (input_obj) => {
        try {
          const response = await axios.post(
            "https://idle-project-diff.onrender.com/common_multipal_vehicle_details",
            input_obj
          );
          setTotal_Route_state(response.data); 
        } catch (error) {
            console.error("Error processing taxi routes:", error);
        }
    };

    useEffect(() => {
        if (from_input_state && to_input_state) {
            const from_input = from_input_state.split(")")[1];
            const to_input = to_input_state.split(")")[1];

            get_Texi_Routes({
                from_input_state,
                to_input_state,
            });

            setFrom_input_state_state(from_input);
            setTo_input_state_state(to_input);
        }
    }, [from_input_state, to_input_state]);


    if (total_Route_state.length === 0) {
        return (
          <div>
            <div id="finding_please_wait">
              <div className="loading-container">
                <div id="finding_route_gif">
                  <img src="finding_route.gif" alt="finding route" />
                </div>
                <div>Finding For You Please Wait</div>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
            <div className="Display_ads">
              <Display_Ads />
            </div>
          </div>
        );
    }
    

    
    const randomIndex = Math.floor((Math.random() * (total_Route_state[0].length - 1)) + 1);

    const objWithAds = [
      ...total_Route_state[0].slice(0, randomIndex),
      { ads: "hello" },
      ...total_Route_state[0].slice(randomIndex),
    ];
    
    return (
        <div id='find_main_div'>
            <Navigation />
            <div id='find_top'>
                <div><p>{from_input_state_state}</p></div>
                <div>
                    <i className="fa-sharp fa-solid fa-arrow-left"></i> 
                    <b>{distanceText_state}</b> 
                    <i className="fa-sharp fa-solid fa-arrow-right"></i>
                </div>
                <div><p>{to_input_state_state}</p></div>
            </div>
            <div style={{ backgroundColor: '#CAF0F8', fontSize: "15px", textAlign: 'center' }}>
                <div>Estimated Travel Time: <b>{timeText_state}</b></div>
            </div>
            <div id='find_vehicle_main_div'>
                {objWithAds.map((route, routeIndex) => {
                    // Check if the current route is an ad
                    if (route.ads) {
                        return (
                          <div key={routeIndex} className="ad_section">
                            <AdComponent2
                              adKey="44d6ac06673ec26f6b011eadab55f567"
                              height="50"
                              width="320"
                            />
                          </div>
                        );
                    }

                    // Determine if it's a direct transport
                    const isDirectTransport = route.length === 1;
                    const routeDetails = isDirectTransport ? route[0][0] : null;

                    return (
                        <Link
                            key={routeIndex}
                            state={{ from_input_state, to_input_state, distanceText_state, timeText_state, route }}
                            to="/details"
                        >
                            <div className='outer_find_vehicle_div'>
                                <div className='find_vehicle_div'>
                                    <p className={isDirectTransport ? 'find_vehical_icon_number_single' : 'find_vehical_icon_number_multi'}>
                                        {isDirectTransport ? (
                                            <>
                                                <i className="fa-solid fa-bus"></i> {routeDetails.Taxi_Number}
                                            </>
                                        ) : (
                                            total_Route_state[1]?.map((innerValue, innerIndex) => (
                                                <span key={innerIndex}>
                                                    {(innerValue === total_Route_state[1][0]) ? <i className="fa-solid d-none fa-angle-right"></i> : <i className="fa-solid fa-angle-right"></i>}
                                                    &nbsp;<i className="fa-solid fa-bus"></i> {innerValue}
                                                </span>
                                            ))
                                        )}
                                    </p>
                                    <div>
                                        <table>
                                            <thead>
                                                <tr><th colSpan="3">{isDirectTransport ? 'Ticket Price' : 'Total Cost'}</th></tr>
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
                                <div>
                                    <p className={isDirectTransport ? 'bg-success' : 'bg-danger'}>
                                        <i className={`fa-solid fa-${isDirectTransport ? 'check' : 'ban'}`}></i> 
                                        {isDirectTransport ? 'Direct transport' : 'Indirect transport'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Find;
