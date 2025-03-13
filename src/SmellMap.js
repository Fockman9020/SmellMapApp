import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const SmellMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ smellType: "", intensity: "" });
  const [formData, setFormData] = useState({
    area: "",
    smellType: "",
    intensity: 1,
    comment: "",
    lng: null,
    lat: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (mapRef.current) return;

      if (!mapboxgl.accessToken) {
        throw new Error("Mapbox API トークンが設定されていません！");
      }

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [139.6917, 35.6895],
        zoom: 12,
      });

      mapRef.current.on("click", (e) => {
        handleMapClick(e.lngLat);
      });

      const storedMarkers =
        JSON.parse(localStorage.getItem("smellReports")) || [];
      setMarkers(storedMarkers);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleMapClick = (lngLat) => {
    setFormData({ ...formData, lng: lngLat.lng, lat: lngLat.lat });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMarker = { ...formData };
    const updatedMarkers = [...markers, newMarker];
    localStorage.setItem("smellReports", JSON.stringify(updatedMarkers));
    setMarkers(updatedMarkers);
    setShowForm(false);
    setFormData({
      area: "",
      smellType: "",
      intensity: 1,
      comment: "",
      lng: null,
      lat: null,
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center">SmellMap</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div ref={mapContainerRef} className="w-full h-screen border"></div>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white shadow-md rounded-md"
        >
          <h2 className="text-lg font-semibold">異臭投稿フォーム</h2>
          <input
            type="text"
            placeholder="エリア名"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="border p-2 w-full my-2"
          />
          <select
            value={formData.smellType}
            onChange={(e) =>
              setFormData({ ...formData, smellType: e.target.value })
            }
            className="border p-2 w-full my-2"
          >
            <option value="">異臭の種類を選択</option>
            <option value="ごみ">ごみ</option>
            <option value="下水">下水</option>
            <option value="化学薬品">化学薬品</option>
            <option value="腐敗">腐敗</option>
            <option value="煙">煙</option>
            <option value="工場排気">工場排気</option>
            <option value="その他">その他</option>
          </select>
          <input
            type="number"
            min="1"
            max="5"
            value={formData.intensity}
            onChange={(e) =>
              setFormData({ ...formData, intensity: e.target.value })
            }
            className="border p-2 w-full my-2"
          />
          <textarea
            placeholder="コメント"
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            className="border p-2 w-full my-2"
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded w-full"
          >
            投稿
          </button>
        </form>
      )}
    </div>
  );
};

export default SmellMap;
