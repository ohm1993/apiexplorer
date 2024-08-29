import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './App.css';

function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [providers, setProviders] = useState([]);
  const [expandedProvider, setExpandedProvider] = useState(null);
  const [apiDetails, setApiDetails] = useState({});
  const apiListRef = useRef(null);


  const handleClick = (event) => {
    event.stopPropagation()
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (apiListRef.current && !apiListRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/providers.json`)
        .then(response => {
          setProviders(response.data.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [isOpen]);

  const handleProviderClick = (provider) => {
    if (expandedProvider === provider) {
      setExpandedProvider(null);
      setApiDetails({});
    } else {
      setExpandedProvider(provider);
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/${provider}.json`)
        .then(response => {
          const apiData = response.data.apis;
          const apiKey = Object.keys(apiData)[0]; 
          const apiInfo = apiData[apiKey];
          setApiDetails({
            logo: apiInfo.info['x-logo'] ? apiInfo.info['x-logo'].url : '',
            title: apiInfo.info.title,
            link: apiInfo.link,
          });
        })
        .catch(error => {
          setApiDetails({});
        });
    }
  };

  return (
    <div className={`App ${isOpen ? 'dark-background' : ''}`}>
      <div className="centered-container">
        <button className="explore-button" onClick={handleClick}>Explore web APIs</button>
        {isOpen && (
          <div className="api-list" ref={apiListRef}>
            <h2>Select Provider</h2>
            <ul>
              {providers.length > 0 ? (
                providers.map((provider, index) => (
                  <li key={index} className="provider-item">
                    <div className="provider-header">
                      <span>{provider}</span>
                      <button onClick={() => handleProviderClick(provider)} className="arrow-button">
                        {expandedProvider === provider ? '▲' : '▼'}
                      </button>
                    </div>
                    {expandedProvider === provider && apiDetails && (
                      <div className="api-details">
                        {apiDetails.logo && <img src={apiDetails.logo} alt={apiDetails.title} className="api-logo" />}
                        {apiDetails.title && (
                          <Link
                            to={{
                              pathname: `/details/${provider}`,
                              state: { apiDetails }
                            }}
                            className="api-title-button"
                          >
                            {apiDetails.title}
                          </Link>
                        )}
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <li>No providers available</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
