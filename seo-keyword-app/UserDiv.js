import React, { useState } from 'react';
import axios from 'axios';

function UserDiv() {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [language, setLanguage] = useState('en');
  const [keywords, setKeywords] = useState([]);
  const [translatedKeywords, setTranslatedKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchPromptChange = (event) => {
    setSearchPrompt(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const fetchKeywords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/fetchKeywords?prompt=${searchPrompt}`);
      setKeywords(response.data);
    } catch (error) {
      console.error('Error fetching keywords:', error);
    }
    setLoading(false);
  };

  const translateKeywords = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/translateKeywords', {
        keywords,
        targetLanguage: language,
      });
      setTranslatedKeywords(response.data);
    } catch (error) {
      console.error('Error translating keywords:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={searchPrompt}
          onChange={handleSearchPromptChange}
          placeholder="Enter search prompt..."
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <select value={language} onChange={handleLanguageChange} className="p-2 border border-gray-300 rounded">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
      <div className="mb-4">
        <button onClick={fetchKeywords} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {loading ? 'Loading...' : 'Get Keywords'}
        </button>
      </div>
      <div className="mb-4">
        <button onClick={translateKeywords} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          {loading ? 'Translating...' : 'Translate Keywords'}
        </button>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Keywords</h3>
        <ul>
          {keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>
      {translatedKeywords.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Translated Keywords</h3>
          <ul>
            {translatedKeywords.map((keyword, index) => (
              <li key={index}>{keyword}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserDiv;
