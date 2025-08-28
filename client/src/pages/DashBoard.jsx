import React, { useState } from "react";

const JourneyPage = () => {
  const [activeTab, setActiveTab] = useState("bus");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    people: 1,
    ticket: null,
    phone: "",
  });

  const [journeys, setJourneys] = useState([ ]);
  
  const [matches, setMatches] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Normalize route groups
  const normalizeLocation = (from, to, type) => {
    if (type === "bus") {
      if (
        (from === "College" && (to === "Pap Chowk" || to === "Bus Stand")) ||
        (from === "Pap Chowk" && to === "College") ||
        (from === "Bus Stand" && to === "College")
      ) {
        return { route: "College ↔ Pap Chowk/Bus Stand", reason: "Same bus route group" };
      }
    }
    if (type === "train") {
      if (
        (from === "College" && (to === "Jalandhar City" || to === "Jalandhar Cantt")) ||
        (from === "Jalandhar City" && to === "College") ||
        (from === "Jalandhar Cantt" && to === "College")
      ) {
        return { route: "College ↔ Jalandhar City/Cantt", reason: "Same train route group" };
      }
    }
    return { route: `${from}-${to}`, reason: null };
  };

  // Compare journeys
  const isSameRoute = (j1, j2) => {
    const sameType = j1.type === j2.type;
    const sameDate = j1.date === j2.date;

    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const timeDiff = Math.abs(toMinutes(j1.time) - toMinutes(j2.time));
    const n1 = normalizeLocation(j1.from, j1.to, j1.type);
    const n2 = normalizeLocation(j2.from, j2.to, j2.type);

    return {
      match: sameType && sameDate && timeDiff <= 60 && n1.route === n2.route,
      reason: n1.route === n2.route ? (timeDiff <= 60 ? "Within 1 hour window" : null) : null,
    };
  };

  // Create a journey
  const handleCreate = (e) => {
    e.preventDefault();
    const newJourney = { ...formData, type: activeTab };
    setJourneys([...journeys, newJourney]);
    alert("Journey created successfully!");
  };

  // Find matches only
  const handleFindMatches = (e) => {
    e.preventDefault();
    const currentJourney = { ...formData, type: activeTab };
    const foundMatches = journeys.filter((j) => isSameRoute(currentJourney, j).match);
    setMatches(foundMatches);
  };

  // Handle connect button click
  const handleConnect = (match) => {
    setSelectedMatch(match);
    setShowConnectModal(true);
    setCopied(false);
  };

  // Copy phone number to clipboard
  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(selectedMatch.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Different location options
  const busLocations = ["College", "Pap Chowk", "Bus Stand"];
  const trainLocations = ["College", "Jalandhar City", "Jalandhar Cantt"];
  const locations = activeTab === "bus" ? busLocations : trainLocations;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-charcoal mb-6">Plan Your Journey</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("bus")}
          className={`px-6 py-2 rounded-xl font-medium shadow-md ${
            activeTab === "bus"
              ? "bg-primary text-white"
              : "bg-white text-slate-600"
          }`}
        >
          Bus
        </button>
        <button
          onClick={() => setActiveTab("train")}
          className={`px-6 py-2 rounded-xl font-medium shadow-md ${
            activeTab === "train"
              ? "bg-primary text-white"
              : "bg-white text-slate-600"
          }`}
        >
          Train
        </button>
      </div>

      {/* Form */}
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-charcoal mb-6 text-center">
          {activeTab === "bus" ? "Bus Journey" : "Train Journey"}
        </h2>

        <form className="space-y-6">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-slate-gray">
              From
            </label>
            <select
              name="from"
              value={formData.from}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"
            >
              <option value="">Select starting point</option>
              {locations
                .filter((loc) => loc !== formData.to)
                .map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
            </select>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-slate-gray">
              To
            </label>
            <select
              name="to"
              value={formData.to}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"
            >
              <option value="">Select destination</option>
              {locations
                .filter((loc) => loc !== formData.from)
                .map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-gray">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-gray">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"
              />
            </div>
          </div>

          {/* Number of People */}
          <div>
            <label className="block text-sm font-medium text-slate-gray">
              Number of People
            </label>
            <input
              type="number"
              name="people"
              min="1"
              value={formData.people}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-gray">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>

          {/* Ticket */}
          <div>
            <label className="block text-sm font-medium text-slate-gray">
              Upload Ticket
            </label>
            <input
              type="file"
              name="ticket"
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleFindMatches}
              className="w-1/2 py-3 px-4 rounded-md font-medium text-white bg-primary hover:bg-orange-600"
            >
              Find Matches
            </button>
            <button
              onClick={handleCreate}
              className="w-1/2 py-3 px-4 rounded-md font-medium text-white bg-primary hover:bg-orange-600"
            >
              Create Journey
            </button>
          </div>
        </form>
      </div>

      {/* Matches Section */}
      <div className="w-full max-w-lg mt-8">
        {matches.length > 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Found Matches</h3>
            <ul className="space-y-3">
              {matches.map((m, i) => (
                <li
                  key={i}
                  className="p-4 border rounded-xl shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{m.from} → {m.to}</p>
                    <p className="text-sm text-slate-600">
                      {m.date}, {m.time} | {m.people} {m.people > 1 ? 'people' : 'person'}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleConnect(m)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
                  >
                    Connect
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-slate-500 text-center">No matches found yet.</p>
        )}
      </div>

      {/* Connect Modal */}
      {showConnectModal && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-charcoal">Connect with Traveler</h3>
              <button 
                onClick={() => setShowConnectModal(false)}
                className="text-slate-500 hover:text-slate-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-700 mb-2">Journey Details</h4>
                <p><span className="font-medium">Route:</span> {selectedMatch.from} → {selectedMatch.to}</p>
                <p><span className="font-medium">Date & Time:</span> {selectedMatch.date}, {selectedMatch.time}</p>
                <p><span className="font-medium">Travelers:</span> {selectedMatch.people} {selectedMatch.people > 1 ? 'people' : 'person'}</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-700 mb-2">Contact Information</h4>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">{selectedMatch.phone}</p>
                  <button
                    onClick={copyPhoneNumber}
                    className={`px-3 py-1 rounded-md text-sm ${copied ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-orange-600'}`}
                  >
                    {copied ? 'Copied!' : 'Copy Number'}
                  </button>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Copy the number and contact the traveler through your preferred method
                </p>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyPage;