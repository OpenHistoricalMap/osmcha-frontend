import { useState } from 'react';

function formatHistoricalDate(days) {
  const date = new Date(days * 86400000);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const isBC = yyyy <= 0;
  const yearFormatted = isBC ? `${Math.abs(yyyy)} BC` : `${yyyy}`;
  return `${mm}/${dd}/${yearFormatted}`;
}

function daysToISO(days) {
  const date = new Date(days * 86400000);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function HistoricalDateSlider({ handleDateChange }) {
  const today = Math.floor(Date.now() / 86400000);
  const [rangeYears, setRangeYears] = useState(2000);
  const [selectedDay, setSelectedDay] = useState(today);

  const minDay = Math.floor(today - rangeYears * 365.25);
  const handleSliderChange = e => {
    const dayVal = parseInt(e.target.value, 10);
    setSelectedDay(dayVal);
    const iso = daysToISO(dayVal);
    if (handleDateChange) {
      handleDateChange({ target: { value: iso } });
    }
  };

  const handleRangeChange = e => {
    const years = parseInt(e.target.value, 10);
    setRangeYears(years);
    const newMin = Math.floor(
      new Date(new Date().getFullYear() - years, 0, 1).getTime() / 86400000
    );
    if (selectedDay < newMin) {
      setSelectedDay(newMin);
      if (handleDateChange) {
        handleDateChange({ target: { value: daysToISO(newMin) } });
      }
    }
  };

  const minDateText = formatHistoricalDate(minDay);
  const maxDateText = formatHistoricalDate(today);

  return (
    <div style={{ marginTop: '1rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '0.5rem'
        }}
      >
        <label style={{ fontWeight: '600' }}>Range:</label>
        <select
          onChange={handleRangeChange}
          value={rangeYears}
          style={{
            padding: '6px 10px',
            fontSize: '0.9rem',
            border: '1px solid #ccc',
            borderRadius: '6px'
          }}
        >
          <option value={50}>50 years</option>
          <option value={100}>100 years</option>
          <option value={500}>500 years</option>
          <option value={1000}>1000 years</option>
          <option value={2000}>2000 years</option>
          <option value={3000}>3000 years</option>
          <option value={5000}>5000 years</option>
        </select>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: '0.9rem',
          marginBottom: '0.5rem',
          color: '#999'
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.8rem' }}>mm/dd/yyyy</div>
          <div>{minDateText}</div>
        </div>

        <div
          style={{
            textAlign: 'center',
            color: '#333',
            fontWeight: '400',
            fontSize: '0.90rem'
          }}
        >
          Date selected:
          <br />
          <strong>{formatHistoricalDate(selectedDay)}</strong>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem' }}>mm/dd/yyyy</div>
          <div>{maxDateText}</div>
        </div>
      </div>

      <input
        type="range"
        min={minDay}
        max={today}
        value={selectedDay}
        onChange={handleSliderChange}
        style={{
          width: '100%',
          appearance: 'none',
          height: '6px',
          background: 'transparent',
          outline: 'none'
        }}
        className="blue-slider"
      />

      <style>{`
        input[type=range].blue-slider::-webkit-slider-runnable-track {
          background: #0066ff;
          height: 6px;
          border-radius: 3px;
        }
        input[type=range].blue-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          background: #333;
          border-radius: 50%;
          margin-top: -7px;
          cursor: pointer;
        }
        input[type=range].blue-slider::-moz-range-track {
          background: #0066ff;
          height: 6px;
          border-radius: 3px;
        }
        input[type=range].blue-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          background: #333;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
