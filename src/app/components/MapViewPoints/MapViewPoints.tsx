import React, { useEffect, useState, useRef } from 'react';
import L, { LatLngExpression, PolylineOptions } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './clusterStyles.css';
import styles from './styles.module.css';
import attractionsData from '../../../../public/data/points_of_interest/attractions.json';
import geysersData from '../../../../public/data/points_of_interest/geysers.json';
import hotSpringsData from '../../../../public/data/points_of_interest/hot_springs.json';
import waterfallsData from '../../../../public/data/points_of_interest/waterfalls.json';
import anthropogenicData from '../../../../public/data/park2.json';



interface Territory {
  id: number;
  name: string;
  description: string;
  data: {
    type: string;
    coordinates: number[][][][];
  };
}

interface Track {
  id: number;
  name: string;
  length: number;
  time_passing_track: number;
  type_track: string;
  basic_recreational_capacity: number;
  territory_id: number;
  data: {
    type: string;
    features: {
      type: string;
      properties: {
        name: string;
        time: string;
        coordTimes: string[];
      };
      geometry: {
        type: string;
        coordinates: number[][];
      };
    }[];
  };
  territory: {
    id: number;
    name: string;
    description: string;
  };
}

interface Feature {
  type: string;
  properties: {
    index_value: number;
    date: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

interface FeatureCollection {
  type: string;
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  features: Feature[];
}

const COLORS = ['#00A551', '#F2B600', '#1D6438', '#51BDF6', '#FFEFBF', '#1D6438'];

const getColorForTerritory = (index: number) => COLORS[index % COLORS.length];

const MapView = () => {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [showTracks, setShowTracks] = useState<boolean>(false);
  const mapRef = useRef<L.Map | null>();
  const markerClusterGroupsRef = useRef<Map<string, L.MarkerClusterGroup>>(new Map());
  const [selectedRoute, setSelectedRoute] = useState<Track | null>(null);
  const [showPOIs, setShowPOIs] = useState<boolean>(false);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  const [showGeysers, setShowGeysers] = useState<boolean>(false);
  const [showWaterfalls, setShowWaterfalls] = useState<boolean>(false);
  const [showAttractions, setShowAttractions] = useState<boolean>(false);
  const [showHotSprings, setShowHotSprings] = useState<boolean>(false);
  const [anthropogenicData, setAnthropogenicData] = useState<any[]>([]);

  const getColor = (indexValue: number) => {
    if (indexValue >= 0 && indexValue < 20) {
      return 'darkred';
    } else if (indexValue >= 20 && indexValue < 40) {
      return 'red';
    } else if (indexValue >= 40 && indexValue < 60) {
      return 'orange';
    } else if (indexValue >= 60 && indexValue < 80) {
      return 'yellow';
    } else if (indexValue >= 80 && indexValue <= 100) {
      return 'green';
    } else {
      return 'gray'; 
    }
  };

  useEffect(() => {
    delete L.Icon.Default.prototype.options.iconRetinaUrl;
    delete L.Icon.Default.prototype.options.iconUrl;
    delete L.Icon.Default.prototype.options.shadowUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([56.5, 160.0], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=ru', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    const fetchTerritories = async () => {
      try {
        const response = await fetch('/api/territories');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        setTerritories(data);
      } catch (error) {
        console.error('Failed to fetch territories:', error);
      }
    };

    const fetchTracks = async () => {
      try {
        const response = await fetch('/data/tracks.json');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error('Failed to fetch tracks:', error);
      }
    };

    const fetchAnthropogenicData = async () => {
      try {
        const response = await fetch('/data/park2.json');
        console.log('fetch')
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(data)
        setAnthropogenicData(data);
        console.log('fetch')
      } catch (error) {
        console.error('Failed to fetch anthropogenic data:', error);
      }
    };
  
    fetchAnthropogenicData();
    fetchTerritories();
    fetchTracks();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); 

//Антропогенные данные

  useEffect(() => {
    if (anthropogenicData.length > 0 && mapRef.current) {
      markerClusterGroupRef.current?.clearLayers();
  
      anthropogenicData.forEach((feature: any) => {
        const { geometry, properties } = feature;
        const { coordinates } = geometry;
  
        if (geometry.type === 'MultiPolygon' && coordinates.length > 0) {
          coordinates.forEach((polygonCoords: number[][][]) => {
            const outerCoords = polygonCoords[0];
            const latLngs: L.LatLngExpression[] = outerCoords.map(([lng, lat]: [number, number]) => [lat, lng]);
  
            // Создание полигона
            const polygon = L.polygon(latLngs, {
              color: getColor(properties.index_value),
              fillOpacity: 0.5,
            });
  
            const popupContent = `
              <div>
                <h4>${properties.name}</h4>
                <p>Index Value: ${properties.index_value}</p>
                <p>Date: ${properties.date}</p>
              </div>
            `;
            polygon.bindPopup(popupContent);
            markerClusterGroupRef.current?.addLayer(polygon);
          });
        }
      });
    }
  }, [anthropogenicData]);

  // Территории
  useEffect(() => {
    if (territories.length > 0 && mapRef.current) {
      markerClusterGroupsRef.current.forEach((group) => {
        mapRef.current!.removeLayer(group);
      });
      markerClusterGroupsRef.current.clear();

      territories.forEach((territory, index) => {
        const { name, data } = territory;
        const territoryColor = getColorForTerritory(index);
        let clusterGroup = markerClusterGroupsRef.current.get(name);

        if (!clusterGroup) {
          clusterGroup = L.markerClusterGroup({
            iconCreateFunction: (cluster) => {
              const count = cluster.getChildCount();
              return L.divIcon({
                html: `<div style="background-color: ${territoryColor};"><span>${count}</span></div>`,
                className: `marker-cluster`,
                iconSize: L.point(40, 40, true),
              });
            },
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
          });
          markerClusterGroupsRef.current.set(name, clusterGroup);
          mapRef.current!.addLayer(clusterGroup);

          clusterGroup.on('clustermouseover', (e) => {
            const cluster = e.layer;
            cluster.bindTooltip(`<div>${name}</div>`, {
              permanent: false,
              direction: 'top',
              offset: [0, -20],
              className: styles.tooltip,
            }).openTooltip();
          });

          clusterGroup.on('clustermouseout', (e) => {
            const cluster = e.layer;
            cluster.unbindTooltip();
          });
        }

        const coordinates = data.coordinates;
        coordinates.forEach((polygon: any) => {
          polygon.forEach((ring: any) => {
            if (ring && ring.length > 0) {
              const latlngs: LatLngExpression[] = ring.map((coord: number[]) => {
                if (coord && coord.length === 2) {
                  // Check if coordinates are within expected ranges
                  const [longitude, latitude] = coord;
                  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                    // Swap latitude and longitude if out of range
                    console.warn(`Swapping coordinates: [${longitude}, ${latitude}]`);
                    return [latitude, longitude];
                  } else {
                    return [latitude, longitude];
                  }
                } else {
                  // console.warn(`Invalid coordinates: ${coord}`);
                  return [0, 0];
                }
              });
        

              // Создание полигона и добавление обработчика клика
              const polygonLayer = L.polygon(latlngs, { color: territoryColor });
              polygonLayer.on('click', (event) => {
                const popupContent = `
                  <div>
                    <h3>${territory.name}</h3>
                    <p>${territory.description}</p>
                  </div>
                `;
                L.popup()
                  .setLatLng(event.latlng)
                  .setContent(popupContent)
                  .openOn(mapRef.current!);
              });

              // Добавление полигона в группу кластеров, если территория выбрана
              if (selectedDistricts.includes(name)) {
                clusterGroup!.addLayer(polygonLayer);
              }
            } else {
              console.warn(`Invalid ring: ${ring}`);
            }
          });
        });
      });
    }
  }, [territories, selectedDistricts]); 

  // Маршруты
  useEffect(() => {
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        mapRef.current!.removeLayer(layer);
      }
    });

    tracks.forEach((track) => {
      const { data } = track;
      const { features } = data;

      features.forEach((feature) => {
        const { geometry } = feature;

        if (geometry.type === 'LineString') {
          const latlngs: LatLngExpression[] = geometry.coordinates.map(
            (coord) => [coord[1], coord[0]]
          );

          const polylineOptions: PolylineOptions = {
            color: 'blue',
            weight: 3,
            opacity: 0.7,
          };

          const polyline = L.polyline(latlngs, polylineOptions);

          polyline.on('click', (e) => {
            const popupContent = `
              <div>
                <h3>${track.name}</h3>
                <p>Длина: ${track.length} км</p>
                <p>Продолжительность: ${track.time_passing_track} ч</p>
                <p>Территория: ${track.territory.name}</p>
              </div>
            `;

            const popup = L.popup()
              .setLatLng(e.latlng)
              .setContent(popupContent)
              .openOn(mapRef.current!); 

            setSelectedRoute(track);
          });

          if (showTracks) {
            polyline.addTo(mapRef.current!);
          }
        }
      });
    });
  }, [tracks, showTracks]);

  const handleDistrictChange = (district: string) => {
    const updatedDistricts = selectedDistricts.includes(district)
      ? selectedDistricts.filter((d) => d !== district)
      : [...selectedDistricts, district];
    setSelectedDistricts(updatedDistricts);
  };

  const handleTrackVisibilityChange = () => {
    setShowTracks((prevShowTracks) => !prevShowTracks);
  };
  
//Природные обьекты
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([56.5, 160.0], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    if (!markerClusterGroupRef.current) {
      markerClusterGroupRef.current = L.markerClusterGroup({
        maxClusterRadius: 25, 
        spiderfyOnMaxZoom: false, 
        showCoverageOnHover: false,
        disableClusteringAtZoom: 14 
      });
      mapRef.current.addLayer(markerClusterGroupRef.current);
    }

    const addPOIsToMap = (data: any, icon: L.Icon, shouldShow: boolean) => {
      if (data && data.features) {
        data.features.forEach((feature: any) => {
          const { geometry, properties } = feature;
          const { coordinates } = geometry;

          if (coordinates && coordinates.length === 2) {
            const [longitude, latitude] = coordinates;

            const marker = L.marker([latitude, longitude], { icon });

            const popupContent = `
              <div>
                <h4>${geometry.coordinates}</h4>
              </div>
            `;
            marker.bindPopup(popupContent);

            if (shouldShow) {
              markerClusterGroupRef.current?.addLayer(marker);
            }
          }
        });
      }
    };

    markerClusterGroupRef.current?.clearLayers();

    if (showAttractions) {
      addPOIsToMap(attractionsData, L.icon({
        iconUrl: './location.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }), true);
    }

    if (showGeysers) {
      addPOIsToMap(geysersData, L.icon({
        iconUrl: './geyser.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }), true);
    }

    if (showHotSprings) {
      addPOIsToMap(hotSpringsData, L.icon({
        iconUrl: './hot-spring.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }), true);
    }

    if (showWaterfalls) {
      addPOIsToMap(waterfallsData, L.icon({
        iconUrl: './waterfall.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }), true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerClusterGroupRef.current = null;
    };
  }, [showGeysers, showWaterfalls, showAttractions, showHotSprings]); 


  const handlePOIVisibilityChange = (type: string) => {
    switch (type) {
      case 'geysers':
        setShowGeysers(prevShow => !prevShow);
        break;
      case 'waterfalls':
        setShowWaterfalls(prevShow => !prevShow);
        break;
      case 'attractions':
        setShowAttractions(prevShow => !prevShow);
        break;
      case 'hotSprings':
        setShowHotSprings(prevShow => !prevShow);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters_container}>
        <h3>Фильтры</h3>
        <div className={styles.filterBox}>
          <div className={styles.filterHeading}>Объекты</div>
          {territories.map((territory) => (
            <div key={territory.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedDistricts.includes(territory.name)}
                  onChange={() => handleDistrictChange(territory.name)}
                />
                {territory.name}
              </label>
            </div>
          ))}
        </div>
        <div className={styles.filterBox}>
          <div className={styles.filterHeading}>Маршруты</div>
          <label>

            <input
              type="checkbox"
              checked={showTracks}
              onChange={handleTrackVisibilityChange}
            />
            Отображать маршруты
          </label>
        </div>
        <div className={styles.filterBox}>
          <div className={styles.filterHeading}>Природные обьекты и достопримечательности</div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={showGeysers}
                  onChange={() => handlePOIVisibilityChange('geysers')}
                />
                Гейзеры
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={showWaterfalls}
                  onChange={() => handlePOIVisibilityChange('waterfalls')}
                />
                Водопады
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={showAttractions}
                  onChange={() => handlePOIVisibilityChange('attractions')}
                />
                Достопримечательности
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={showHotSprings}
                  onChange={() => handlePOIVisibilityChange('hotSprings')}
                />
                Горячие источники
              </label>
            </div>
        </div>
      </div>
      <div id="map" className={styles.map}>
      {selectedRoute && (
      <div className={styles.routeInfo}>
        <h3>{selectedRoute.name}</h3>
        <p>Длина: {selectedRoute.length} км</p>
        <p>Продолжительность: {selectedRoute.time_passing_track} ч</p>
        <p>Территория: {selectedRoute.territory.name}</p>
      </div>
    )}
      </div>
    </div>
  );
};

export default MapView;
