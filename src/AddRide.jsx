import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react';

const AddRide = ({ onBack }) => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: '',
    price: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log('Adding ride:', formData);
    alert('Ride added successfully! (Demo)');
  };

  return (
    <div>
      <button 
        onClick={onBack}
        className="text-white hover:text-neutral-300 mb-6 flex items-center"
      >
        ← Back to Dashboard
      </button>
      
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 max-w-2xl">
        <h2 className="text-3xl font-bold text-white mb-6">Offer a Ride</h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
                placeholder="Starting location"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
                placeholder="Destination"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Available Seats</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
                  placeholder="1-4"
                  min="1"
                  max="4"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Price per Seat (₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
                  placeholder="200"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-neutral-200 transition-all transform hover:scale-[1.02] mt-6"
          >
            Publish Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRide;