import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Select from 'react-select';

type Props = {
  data: ObservationsData;
  updateFilters: Function;
};

type entry = {
  label: string;
  value: string;
};

const orderByName = (a: entry, b: entry) => {
  const nameA = a.label.toUpperCase();
  const nameB = b.label.toUpperCase();

  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
};

export default function ExplorerFilter(props: Props) {
  const { t } = useTranslation();
  const { data, updateFilters } = props;

  const getUniqueSet = (dataset: string[]) => {
    return Array.from(new Set(dataset)).map((entry: string) => {
      return { value: entry, label: entry.replace(/_/g, ' ') };
    });
  };

  const animals = getUniqueSet(
    data.observations.map(entry => entry.pred_1)
  ).sort(orderByName);
  const cameras = getUniqueSet(
    data.observations.map(entry => entry.camera)
  ).sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
  const stations = getUniqueSet(
    data.observations.map(entry => entry.station)
  ).sort(orderByName);
  const checks = getUniqueSet(data.observations.map(entry => entry.check)).sort(
    (a, b) => parseInt(b.value, 10) - parseInt(a.value, 10)
  );

  const setAnimals = (options: entry[]) => {
    let result: entry[] = [];
    if (Array.isArray(options)) result = options;
    updateFilters({ activeAnimals: result });
  };
  const setStations = (options: entry[]) => {
    let result: entry[] = [];
    if (Array.isArray(options)) result = options;
    updateFilters({ activeStations: result });
  };
  const setCameras = (options: entry[]) => {
    let result: entry[] = [];
    if (Array.isArray(options)) result = options;
    updateFilters({ activeCameras: result });
  };
  const setChecks = (options: entry[]) => {
    let result: entry[] = [];
    if (Array.isArray(options)) result = options;
    updateFilters({ activeChecks: result });
  };

  return (
    <div
      className="filter-wrapper"
      style={{
        width: '100%',
        paddingBottom: '10px',
        display: 'inline-flex'
      }}
    >
      <div style={{ width: '50%', paddingRight: '5px' }}>
        <h4 style={{ marginBottom: '5px' }}>{t('explore.byAnimal')}</h4>
        <Select
          onChange={setAnimals}
          closeMenuOnSelect={false}
          options={animals}
          isMulti
        />
      </div>
      <div style={{ width: '50%', padding: '0 5px' }}>
        <h4 style={{ marginBottom: '5px' }}>{t('explore.byStation')}</h4>
        <Select
          onChange={setStations}
          closeMenuOnSelect={false}
          options={stations}
          isMulti
        />
      </div>
      <div style={{ width: '50%', padding: '0 5px' }}>
        <h4 style={{ marginBottom: '5px' }}>{t('explore.byCamera')}</h4>
        <Select
          onChange={setCameras}
          closeMenuOnSelect={false}
          options={cameras}
          isMulti
        />
      </div>
      <div style={{ width: '50%', paddingLeft: '5px' }}>
        <h4 style={{ marginBottom: '5px' }}>{t('explore.byCheck')}</h4>
        <Select
          onChange={setChecks}
          closeMenuOnSelect={false}
          options={checks}
          isMulti
        />
      </div>
    </div>
  );
}
