import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { csv } from 'd3-fetch';
import { Card, Elevation, Button, Tab, Tabs } from '@blueprintjs/core';
import Map from '../components/Map';
import AnimalsPlot from '../components/AnimalsPlot';
import ObservationsTable from '../components/ObservationsTable';
import ExplorerFilter from '../components/explorerFilters';

function chooseFile(
  changeFileChoice: (path: string) => void,
  setData: (data: ObservationsData) => void
) {
  // eslint-disable-next-line global-require
  const { dialog } = require('electron').remote;
  dialog
    .showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'CSV', extensions: ['csv'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    .then(result => {
      if (!result.canceled) {
        const file = result.filePaths[0];
        changeFileChoice(file);
        return file;
      }
      return undefined;
    })
    .then(file => {
      if (file !== undefined) {
        return csv(file);
      }
      return undefined;
    })
    .then(data => {
      if (data !== undefined) {
        setData({ observations: (data as unknown) as Observation[] });
        return data;
      }
      return undefined;
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
      // eslint-disable-next-line no-alert
      alert(error);
    });
}

export default function ExplorePage() {
  const { t } = useTranslation();
  const [filePath, setFilePath] = useState<string>();
  const [filters, setFilters] = useState<object>({
    activeAnimals: [],
    activeCameras: [],
    activeStations: [],
    activeChecks: []
  });
  const [data, setData] = useState<undefined | ObservationsData>();
  const handleFilters = val => {
    setFilters({ ...filters, ...val });
  };

  const filterCondition = (needle, haystack) => {
    if (haystack.length === 0) return true;
    return haystack.map(entry => entry.value).includes(needle);
  };

  const getFilteredData = options => {
    let filtered = options.observations;

    if (typeof filters !== 'undefined') {
      filtered = filtered.filter(entry => {
        const validEntry =
          filterCondition(entry.pred_1, filters.activeAnimals) &&
          filterCondition(entry.camera, filters.activeCameras) &&
          filterCondition(entry.station, filters.activeStations) &&
          filterCondition(entry.check, filters.activeChecks);
        return validEntry;
      });
    }
    return { observations: filtered };
  };

  const MainPanel: React.SFC = () => (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          flex: '1',
          width: '55%',
          paddingBottom: '20px',
          marginRight: '10px'
        }}
      >
        <Card style={{ height: '100%' }} interactive elevation={Elevation.TWO}>
          <AnimalsPlot data={getFilteredData(data)} />
        </Card>
      </div>
      <div
        style={{
          flex: '1',
          width: '45%',
          paddingBottom: '20px',
          marginLeft: '10px'
        }}
      >
        <Card style={{ height: '100%' }} interactive elevation={Elevation.TWO}>
          <Map data={getFilteredData(data)} />
        </Card>
      </div>
    </div>
  );
  const TablePanel: React.SFC = () => (
    <ObservationsTable style={{ width: '100%' }} data={getFilteredData(data)} />
  );

  const contents =
    data !== undefined ? (
      <>
        <div>
          <h1>{t('Explore')}</h1>
        </div>
        <ExplorerFilter data={data} onChange={handleFilters} />
        <div style={{ minHeight: '30px' }}>
          <span>
            <span style={{ fontWeight: 600 }}>{t('Number of results')}</span>
            <span style={{ paddingLeft: '5px' }}>
              {getFilteredData(data).observations.length}
            </span>
          </span>
        </div>
        <div>
          <Button
            text={t('Back')}
            icon="arrow-left"
            onClick={() => setData(undefined)}
            style={{
              backgroundColor: '#fff',
              width: '200px'
            }}
          />
        </div>
        <Tabs renderActiveTabPanelOnly>
          <Tab id="main" title={t('Main Information')} panel={<MainPanel />} />
          <Tab
            id="table"
            title={t('Observations Table')}
            panel={<TablePanel />}
          />
          <Tabs.Expander />
        </Tabs>
      </>
    ) : (
      <>
        <h1>{t('Explore')}</h1>
        <div className="bp3-input-group" style={{ width: '60%' }}>
          <input
            type="text"
            className="bp3-input"
            placeholder={t('Choose results file to analyze')}
            value={filePath}
            onChange={e => {
              setFilePath(e.target.value);
            }}
          />
          <button
            aria-label="Search"
            type="submit"
            className="bp3-button bp3-minimal bp3-intent-primary bp3-icon-search"
            onClick={() => {
              chooseFile(setFilePath, setData);
            }}
          />
        </div>
      </>
    );

  return (
    <div
      style={{
        padding: '10px 30px',
        width: '100%',
        overflowY: 'scroll',
        maxHeight: 'calc(100vh - 50px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {contents}
    </div>
  );
}
