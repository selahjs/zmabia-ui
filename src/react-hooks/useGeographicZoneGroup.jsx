import useGetBuqProgram from './useGetBuqProgram';
import { useState, useEffect } from 'react';
import useServerService from './useServerService';

const useGeographicZoneGroup = () => {
  const [geographicZoneGroups, setGeographicZoneGroups] = useState({});
  const [allGeographicZone, setAllGeographicZone] = useState([]);
  const [geographicZoneParams, setGeographicZoneParams] = useState([]);
  // If geographic zone groups are fetched, it should not be an empty object
  const isGeographicZoneGroupsFetched = Object.keys(geographicZoneGroups).length;

  const buqService = useServerService('buqService');
  const geographicZoneService = useServerService('geographicZoneService');

  const { programBuq } = useGetBuqProgram();

  const fetchGeographicZoneGroups = () => {
    buqService.getGroup(programBuq?.id).then((fetchedGeographicZones) => {
      const geographicZones = { ...fetchedGeographicZones };
      delete geographicZones['$promise'];
      delete geographicZones['$resolved'];

      setGeographicZoneGroups(geographicZones);
    });
  };

  const fetchGeographicZoneParams = () => {
    const result = [];

    Object.keys(geographicZoneGroups).forEach((levelOne) => {
      result.push({ value: levelOne, level: 1 });

      Object.keys(geographicZoneGroups[levelOne]).forEach((levelTwo) => {
        result.push({ value: levelTwo, level: 2 });

        Object.keys(geographicZoneGroups[levelOne][levelTwo]).forEach(
          (levelThree) => {
            result.push({ value: levelThree, level: 3 });
          }
        );
      });
    });

    const newResult = result.map((item) => {
      const region = allGeographicZone?.find((reg) => reg.id === item.value);
      return {
        ...item,
        name: `${region?.name} - ${region?.level.code}` || '',
      };
    });
    setGeographicZoneParams(newResult);
  };

  useEffect(() => {
    fetchGeographicZoneGroups();
    geographicZoneService.getAll().then((fetchedAllGeographicZone) => {
      setAllGeographicZone(fetchedAllGeographicZone.content);
    });
  }, []);

  useEffect(() => {
    fetchGeographicZoneParams();
  }, [geographicZoneGroups, allGeographicZone]);

  return { geographicZoneGroups, geographicZoneParams, isGeographicZoneGroupsFetched };
};

export default useGeographicZoneGroup;
