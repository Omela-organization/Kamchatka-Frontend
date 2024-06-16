// components/ExistingMapComponent.tsx
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ExistingMapComponentProps {
  // Пропсы для управления видимостью других элементов
  showTracks: boolean;
  showGeysers: boolean;
  showWaterfalls: boolean;
  showAttractions: boolean;
  showHotSprings: boolean;
  // Другие пропсы, которые могут быть вам нужны
}

const ExistingMapComponent: React.FC<ExistingMapComponentProps> = ({
  showTracks,
  showGeysers,
  showWaterfalls,
  showAttractions,
  showHotSprings
}) => {
    const [data, setData] = useState<any>(null);
    const [tracksData, setTracksData] = useState<any>(null);
    const [geysersData, setGeysersData] = useState<any>(null);
    const [waterfallsData, setWaterfallsData] = useState<any>(null);
    const [attractionsData, setAttractionsData] = useState<any>(null);
    const [hotSpringsData, setHotSpringsData] = useState<any>(null);

    useEffect(() => {
        fetch('/data/park2.json')
          .then((response) => response.json())
          .then((data) => setData(data));
    
        fetch('/api/tracks.json')
          .then((response) => response.json())
          .then((data) => setTracksData(data));
    
        fetch('/data/points_of_intersts/geysers.json')
          .then((response) => response.json())
          .then((data) => setGeysersData(data));
    
        fetch('/data/points_of_intersts/waterfalls.json')
          .then((response) => response.json())
          .then((data) => setWaterfallsData(data));
    
        fetch('/data/points_of_intersts/attractions.json')
          .then((response) => response.json())
          .then((data) => setAttractionsData(data));
    
        fetch('/data/points_of_intersts/hot_springs.json')
          .then((response) => response.json())
          .then((data) => setHotSpringsData(data));
      }, []);

    const getColor = (indexValue: number) => {
        if (indexValue < 20) return '#8B0000'; // темно красный
        if (indexValue < 40) return '#FF0000'; // красный
        if (indexValue < 60) return '#FFA500'; // оранжевый
        if (indexValue < 80) return '#FFFF00'; // желтый
        return '#008000'; // зеленый
    };

    const style = (feature: any) => {
        return {
            fillColor: getColor(feature.properties.index_value),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
        };
    };

    return (
        <MapContainer center={[53.233, 158.688]} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {data && <GeoJSON data={data} style={style} />}
            {/* Включение других слоев в зависимости от состояния пропсов */}
            {showTracks && <GeoJSON data={tracksData}  />} 
            {showGeysers && <GeoJSON data={geysersData}  />} 
            {showWaterfalls && <GeoJSON data={waterfallsData}  />} 
            {showAttractions && <GeoJSON data={attractionsData}  />} 
            {showHotSprings && <GeoJSON data={hotSpringsData}  />} 
        </MapContainer>
    );
};

export default ExistingMapComponent;
