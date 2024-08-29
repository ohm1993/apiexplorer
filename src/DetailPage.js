import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailPage.css';

function DetailPage() {
  const { provider } = useParams();
  const navigate = useNavigate();
  const [apiDetails, setApiDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/${provider}.json`)
      .then(response => {
        const apis = response.data.apis;
        const selectedProvider = apis[provider] || apis[Object.keys(apis)[0]];
        setApiDetails(selectedProvider);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [provider]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!apiDetails) {
    return <div>No API details available</div>;
  }

  return (
    <div className="details-page">
      <div className="header">
        <img src={apiDetails.info['x-logo'].url} alt="Logo" className="logo" />
        <h1>{apiDetails.info.title}</h1>
      </div>
      <div className="content-section">
        <div className="swagger-section">
          <h3>Description</h3>
          <p>{apiDetails.info.description}</p>
        </div>
        <div className="swagger-section">
          <h3>Swagger</h3>
          <a href={apiDetails.swaggerUrl} target="_blank" rel="noopener noreferrer">
            {apiDetails.swaggerUrl}
          </a>
        </div>
        <div className="contact-section">
          <h3>Contact</h3>
          <p><strong>Email:</strong> {apiDetails?.info?.contact?.email ? (
            <a href={`mailto:${apiDetails.info.contact.email}`}>{apiDetails.info.contact.email}</a>
          ) : (
            ''
          )}</p>
          <p><strong>Name:</strong> {apiDetails?.info?.contact?.name ? apiDetails.info.contact.name : ''}</p>
          <p>
            <strong>URL:</strong> {apiDetails?.info?.contact?.url ? (
              <a href={apiDetails.info.contact.url} target="_blank" rel="noopener noreferrer">
                {apiDetails.info.contact.url}
              </a>
            ) : (
              ''
            )}
          </p>
        </div>
      </div>
      <button className="explore-button" onClick={() => navigate('/')}>Explore more APIs</button>
    </div>
  );
}

export default DetailPage;
