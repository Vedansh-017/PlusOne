import React, { useState, useEffect, useContext } from "react";
// import your AppContext here
import axios from "axios";

const JourneyPage = () => {
  const [activeTab, setActiveTab] = useState("bus");
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    people: 1,
    ticket: null,
    phone: "",
  });

  const [journeys, setJourneys] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Placeholder: replace with your context or backend function
  const fetchJourneys = async () => {
    // const data = await axios.get("/journeys");
    // setJourneys(data.data);
  };

  const createJourneyBackend = async (newJourney) => {
    // const res = await axios.post("/journeys", newJourney);
    // return res.data;
  };

  useEffect(() => {
    fetchJourneys();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const normalizeLocation = (from, to, type) => {
    if (type === "bus") {
      if ((from === "College" && (to === "Pap Chowk" || to === "Bus Stand")) ||
          (to === "College" && (from === "Pap Chowk" || from === "Bus Stand"))) {
        return { route: "college-bus", reason: "Pap Chowk ↔ Bus Stand" };
      }
    }
    if (type === "train") {
      if ((from === "College" && (to === "Jalandhar City" || to === "Jalandhar Cantt")) ||
          (to === "College" && (from === "Jalandhar City" || from === "Jalandhar Cantt"))) {
        return { route: "college-train", reason: "Jalandhar City ↔ Cantt" };
      }
    }
    return { route: `${from}-${to}`, reason: null };
  };

  const isSameRoute = (j1, j2) => {
    const sameType = j1.type === j2.type;
    const sameDate = j1.date === j2.date;
    const toMinutes = t => {
      const [h, m] = t.split(":").map(Number);
      return h*60 + m;
    };
    const timeDiff = Math.abs(toMinutes(j1.time) - toMinutes(j2.time));
    const n1 = normalizeLocation(j1.from, j1.to, j1.type);
    const n2 = normalizeLocation(j2.from, j2.to, j2.type);
    return {
      match: sameType && sameDate && timeDiff <= 60 && n1.route === n2.route,
      reason: n1.route === n2.route ? `${n1.reason}, within 1 hour` : null
    };
  };

  const handleFindMatches = async () => {
    const current = { ...formData, type: activeTab };
    await fetchJourneys(); // fetch latest journeys from backend
    const found = journeys.filter(j => isSameRoute(current, j).match);
    setMatches(found);
  };

  const handleCreateJourney = async () => {
    const newJourney = { ...formData, type: activeTab };
    const saved = await createJourneyBackend(newJourney); // save to backend
    if (saved) setJourneys([...journeys, saved]);
    alert("Journey created successfully!");
  };

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
            activeTab === "bus" ? "bg-primary text-white" : "bg-white text-slate-600"
          }`}
        >
          Bus
        </button>
        <button
          onClick={() => setActiveTab("train")}
          className={`px-6 py-2 rounded-xl font-medium shadow-md ${
            activeTab === "train" ? "bg-primary text-white" : "bg-white text-slate-600"
          }`}
        >
          Train
        </button>
      </div>

      {/* Form */}
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-charcoal mb-6 text-center">
          {activeTab === "bus" ? "Bus Journey" : "Train Journey"}
        </h2>

        <form className="space-y-6">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-slate-gray">From</label>
            <select
              name="from"
              value={formData.from}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"
            >
              <option value="">Select starting point</option>
              {locations.filter(loc => loc !== formData.to).map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-slate-gray">To</label>
            <select
              name="to"
              value={formData.to}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"
            >
              <option value="">Select destination</option>
              {locations.filter(loc => loc !== formData.from).map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-gray">Date</label>
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
              <label className="block text-sm font-medium text-slate-gray">Time</label>
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

          {/* People */}
          <div>
            <label className="block text-sm font-medium text-slate-gray">Number of People</label>
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
            <label className="block text-sm font-medium text-slate-gray">Phone</label>
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
            <label className="block text-sm font-medium text-slate-gray">Upload Ticket</label>
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
              type="button"
              onClick={handleFindMatches}
              className="flex-1 py-3 px-4 rounded-md font-medium text-white bg-primary hover:bg-orange-600"
            >
              Find Matches
            </button>
            <button
              type="button"
              onClick={handleCreateJourney}
              className="flex-1 py-3 px-4 rounded-md font-medium text-white bg-primary hover:bg-slate-600"
            >
              Create Journey
            </button>
          </div>
        </form>
      </div>

      {/* Matches */}
      {matches.length > 0 && (
        <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-charcoal">Your Matches</h3>
          <ul className="space-y-4">
            {matches.map((m, idx) => (
              <li key={idx} className="p-4 border rounded-xl shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold">{m.from} → {m.to}</p>
                  <p className="text-sm text-slate-600">{m.date} at {m.time}, {m.people} people</p>
                </div>
                <button
                  onClick={() => setSelectedMatch(m)}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-orange-600"
                >
                  Connect
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Connect Popup */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-charcoal">Connect</h3>
            <p className="mb-2"><span className="font-semibold">From:</span> {selectedMatch.from}</p>
            <p className="mb-2"><span className="font-semibold">To:</span> {selectedMatch.to}</p>
            <p className="mb-2"><span className="font-semibold">Date:</span> {selectedMatch.date}</p>
            <p className="mb-2"><span className="font-semibold">Time:</span> {selectedMatch.time}</p>
            <p className="mb-2"><span className="font-semibold">People:</span> {selectedMatch.people}</p>
            <p className="mb-4"><span className="font-semibold">Phone:</span> {selectedMatch.phone}</p>
            {isSameRoute(selectedMatch, formData).reason && (
              <p className="text-sm text-slate-600 mb-4">Reason: {isSameRoute(selectedMatch, formData).reason}</p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300"
              >
                Close
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-orange-600">
                Chat Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyPage;
