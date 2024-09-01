import Navigation from '../../components/navigation/navigation';
import { useNavigate } from 'react-router-dom';
import './home.css';
import axios from 'axios';
import { useEffect, useState, useRef, useCallback } from 'react';
import MapComponent from '../../components/mapBox/mapComponent';
import Native_Ads from '../../components/adComponents/native_ads/native_ads';

const Home = () => {
    const navigate = useNavigate();
    let [get_addresses_state, setGet_addresses_state] = useState([]);
    let [suggestion_array_state, setSuggestion_array_state] = useState([]);
    let [from_input_state, setFrom_input_state] = useState('');
    let [to_input_state, setTo_input_state] = useState('');
    let [A_longitude_state, setA_longitude_state] = useState('');
    let [A_latitude_state, setA_latitude_state] = useState('');
    let [B_longitude_state, setB_longitude_state] = useState('');
    let [B_latitude_state, setB_latitude_state] = useState('');
    let [distanceText_state, setDistanceText_state] = useState('');
    let [timeText_state, setTimeText_state] = useState('');
    let [showSuggestionsFrom, setShowSuggestionsFrom] = useState(false);
    let [showSuggestionsTo, setShowSuggestionsTo] = useState(false);

    let data_for_find = {
        from_input_state, to_input_state, distanceText_state, timeText_state
    }

    const suggestionDivFromRef = useRef(null);
    const suggestionDivToRef = useRef(null);
    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);
    const toFindError = useRef(null);

    const get_addresses_dataBase = async () => {
        try {
            let addresses = await axios.get('https://idle-project-diff.onrender.com/addresses');
            setGet_addresses_state(addresses.data);
        } catch (error) {
            console.error(error);
        }
    };

    const input_function = (event) => {
        const { name, value } = event.target;

        if (name === "from_input") {
            setFrom_input_state(value);
            handleSuggestions(value, suggestionDivFromRef);
            setShowSuggestionsFrom(true);
        } else if (name === "to_input") {
            setTo_input_state(value);
            handleSuggestions(value, suggestionDivToRef);
            setShowSuggestionsTo(true);
        }
    };

    const handleSuggestions = (inputValue, suggestionDivRef) => {
        let array = get_addresses_state.map(item => [item.Address, item.Longitude, item.Latitude]);
        let results = array.filter(address =>
            address[0].toLowerCase().includes(inputValue.toLowerCase())
        );
        setSuggestion_array_state(results);
    };

    const suggestion_select = (event, inputName, Longitude, Latitude) => {
        const selectedValue = event.target.innerText;
        if (inputName === 'from_input') {
            setFrom_input_state(selectedValue);
            setA_longitude_state(Longitude);
            setA_latitude_state(Latitude);
            setShowSuggestionsFrom(false);
        } else if (inputName === 'to_input') {
            setTo_input_state(selectedValue);
            setB_longitude_state(Longitude);
            setB_latitude_state(Latitude);
            setShowSuggestionsTo(false);
        }
    };

    const exchange_input_values = () => {
        setFrom_input_state(prev => {
            setTo_input_state(prev);
            return to_input_state;
        });
    };

    const distanceText_timeText = (distanceText, timeText) => {
        setTimeText_state(timeText)
        setDistanceText_state(distanceText)
    }

    useEffect(() => {
        get_addresses_dataBase();
    }, []);

    const find_selected_value = () => {
        let from_input = get_addresses_state.find((value) => value.Address.toLowerCase() === from_input_state.toLowerCase());
        let to_input = get_addresses_state.find((value) => value.Address.toLowerCase() === to_input_state.toLowerCase());

        if (from_input && to_input) {
            navigate('/find', { state: data_for_find });
        } else {
            toFindError.current.classList.remove('d-none')
            setTimeout(() => {
                toFindError.current.classList.add('d-none')
            }, 2000);
        }
    }

    const handleClickOutside = useCallback((event) => {
        if (
            fromInputRef.current && !fromInputRef.current.contains(event.target) &&
            suggestionDivFromRef.current && !suggestionDivFromRef.current.contains(event.target)
        ) {
            setShowSuggestionsFrom(false);
        }
        if (
            toInputRef.current && !toInputRef.current.contains(event.target) &&
            suggestionDivToRef.current && !suggestionDivToRef.current.contains(event.target)
        ) {
            setShowSuggestionsTo(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    return (
      <div id="home">
        <Navigation />
        <div
          ref={toFindError}
          className="alert alert-warning vibration alert-dismissible fade show position-absolute w-100 py-1 d-none"
          role="alert"
        >
          <strong>Please Select Your Location</strong>
          <button
            type="button"
            className="close py-1"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="home_select_div">
          <MapComponent
            distanceText_timeText={distanceText_timeText}
            A_latitude_state={A_latitude_state}
            A_longitude_state={A_longitude_state}
            B_latitude_state={B_latitude_state}
            B_longitude_state={B_longitude_state}
          />
        </div>
        <div className="home_input_div">
          <div style={{ position: "relative" }}>
            <div
              id="suggestion_search_div_from"
              ref={suggestionDivFromRef}
              className={`suggestion-box ${
                showSuggestionsFrom ? "" : "d-none"
              }`}
            >
              {suggestion_array_state.map((value, index) => (
                <div
                  key={index}
                  onClick={(event) =>
                    suggestion_select(event, "from_input", value[1], value[2])
                  }
                >
                  {value[0]}
                  <hr />
                </div>
              ))}
            </div>
            <div id="home_from_div">
              <input
                type="text"
                name="from_input"
                placeholder="From"
                value={from_input_state}
                onChange={input_function}
                ref={fromInputRef}
                autoComplete="off"
              />
            </div>
          </div>
          <div id="home_exchange_icon" onClick={exchange_input_values}>
            <i className="fa-solid fa-arrow-down-arrow-up"></i>
          </div>
          <div style={{ position: "relative" }}>
            <div
              id="suggestion_search_div_to"
              ref={suggestionDivToRef}
              className={`suggestion-box ${showSuggestionsTo ? "" : "d-none"}`}
            >
              {suggestion_array_state.map((value, index) => (
                <div
                  key={index}
                  onClick={(event) =>
                    suggestion_select(event, "to_input", value[1], value[2])
                  }
                >
                  {value[0]}
                  <hr />
                </div>
              ))}
            </div>
            <div id="home_to_div">
              <input
                type="text"
                name="to_input"
                placeholder="To"
                value={to_input_state}
                onChange={input_function}
                ref={toInputRef}
                autoComplete="off"
              />
            </div>
          </div>
          <div>
            <input
              type="button"
              onClick={find_selected_value}
              className="btn btn-success"
              value="Find"
            />
          </div>
        </div>
        <div className="home_ads">
          <Native_Ads
            scriptSrc="//pl24226264.cpmrevenuegate.com/2f89d6834764b4d0df44e97126de1678/invoke.js"
            containerId="container-2f89d6834764b4d0df44e97126de1678"
          />
        </div>
      </div>
    );
}

export default Home;
