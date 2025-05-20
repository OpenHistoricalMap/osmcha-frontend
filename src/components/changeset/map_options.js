// @flow
import React from 'react';
import { connect } from 'react-redux';

import { updateStyle } from '../../store/map_controls_actions';

// helper functions for adding/removing elements from an array when a
// checkbox is toggled
const add = (arr, elem) => {
  let set = new Set(arr);
  set.add(elem);
  return [...set];
};

const remove = (arr, elem) => {
  let set = new Set(arr);
  set.delete(elem);
  return [...set];
};

const toggle = (arr, elem) => {
  return arr.indexOf(elem) === -1 ? add(arr, elem) : remove(arr, elem);
};

class MapOptions extends React.PureComponent {
  layerOptions = [
    { label: 'OpenHistoricalMap', value: 'ohm' },
    { label: 'Bing aerial imagery', value: 'bing' },
    { label: 'OpenStreetMap Carto', value: 'carto' }
  ];

  render() {
    const {
      showElements,
      showActions,
      setShowElements,
      setShowActions,
      handleDateChange
    } = this.props;
    return (
      <div className="px12 py6">
        <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">Map Controls</h2>
        <section className="cmap-filter-action-section cmap-pt3">
          <h6 className="cmap-heading cursor-pointer txt-bold">
            Filter by actions
          </h6>

          <ul className="flex-parent">
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  style={{ accentColor: '#39DBC0' }}
                  checked={showActions.includes('create')}
                  onChange={() => setShowActions(toggle(showActions, 'create'))}
                />
                Added
              </label>
            </li>
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  style={{ accentColor: '#E7BA60' }}
                  checked={showActions.includes('modify')}
                  onChange={() => setShowActions(toggle(showActions, 'modify'))}
                />
                Modified
              </label>
            </li>
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  style={{ accentColor: '#CC2C47' }}
                  checked={showActions.includes('delete')}
                  onChange={() => setShowActions(toggle(showActions, 'delete'))}
                />
                Deleted
              </label>
            </li>
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  style={{ accentColor: '#8B79C4' }}
                  checked={showActions.includes('noop')}
                  onChange={() => setShowActions(toggle(showActions, 'noop'))}
                />
                Unchanged
              </label>
            </li>
          </ul>
        </section>
        <section className="cmap-filter-type-section">
          <h6 className="txt-bold">Filter by type</h6>
          <ul className="flex-parent">
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  checked={showElements.includes('node')}
                  onChange={() => setShowElements(toggle(showElements, 'node'))}
                />
                Nodes{' '}
                <svg className="icon h18 w18 inline-block align-middle color-black">
                  <use xlinkHref="#icon-marker" />
                </svg>
              </label>
            </li>
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  checked={showElements.includes('way')}
                  onChange={() => setShowElements(toggle(showElements, 'way'))}
                />
                Ways{' '}
                <svg className="icon h18 w18 inline-block align-middle color-black">
                  <use xlinkHref="#icon-polyline" />
                </svg>
              </label>
            </li>
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  checked={showElements.includes('relation')}
                  onChange={() =>
                    setShowElements(toggle(showElements, 'relation'))
                  }
                />
                Relations{' '}
                <svg className="icon h18 w18 inline-block align-middle color-black">
                  <use xlinkHref="#icon-viewport" />
                </svg>
              </label>
            </li>
          </ul>
        </section>
        <section className="cmap-map-style-section cmap-pb3">
          <h6 className="cmap-heading cursor-pointer txt-bold">Map style</h6>
          <select
            value={this.props.style}
            onChange={e => this.props.updateStyle(e.target.value)}
          >
            {this.layerOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label} --
              </option>
            ))}
          </select>
        </section>
        <section className="cmap-filter-type-section cmap-pb3 mt3">
          <h6 className="txt-bold">Filter map style by date</h6>

          <input
            type="date"
            className="input input--s mt3"
            placeholder="YYYY-MM-DD"
            defaultValue={new Date().toISOString().split('T')[0]}
            onChange={handleDateChange}
            title="Filter map by date"
          />

          <div className="mt6">
            <label className="block mb3">
              Year:
              <strong id="year-display" className="ml6">
                {new Date().getFullYear()}
              </strong>
            </label>

            <input
              type="range"
              min="0"
              max={new Date().getFullYear()}
              defaultValue={new Date().getFullYear()}
              className="w-full accent-blue-500"
              onChange={e => {
                const year = e.target.value;
                document.getElementById('year-display').textContent = year;

                if (handleDateChange) {
                  handleDateChange({ target: { value: `${year}-01-01` } });
                }
              }}
            />
          </div>
        </section>
      </div>
    );
  }
}

MapOptions = connect(
  (state: RootStateType, props) => ({ style: state.mapControls.get('style') }),
  { updateStyle }
)(MapOptions);

export { MapOptions };
