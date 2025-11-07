import {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import ReactMapGl, {
  type MapRef,
  type MapProps,
  Popup,
  ViewStateChangeEvent,
  MapLayerMouseEvent,
  NavigationControl,
  LngLatLike,
  PopupProps,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { bbox } from "@turf/bbox";
import { featureCollection } from "@turf/helpers";
import { useMapStore } from "@/store/map-store";
import { useAreaStore } from "@/store/area-store";
import { AdminAreaMapLayers } from "./AdminAreaLayers";
import { VectorLayers } from "./VectorLayers";
import { TabularLayers } from "./TabularLayer";
import { Legend } from "./Legend";
import { DataList } from "@chakra-ui/react";

function Map(props: MapProps, ref: Ref<MapRef | undefined>) {
  const [map, setMap] = useState<MapRef>();
  const setMapRef = (m: MapRef) => setMap(m);
  const { viewState, setViewState } = useMapStore();
  const { ac, acGeoJSON } = useAreaStore();
  const [popupInfo, setPopupInfo] = useState<PopupProps | null>(null);

  useImperativeHandle(ref, () => {
    if (map) {
      return map;
    }
  }, [map]);

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      setViewState(evt.viewState);
    },
    [setViewState],
  );
  const onClick = useCallback((evt: MapLayerMouseEvent) =>{
    if(!map) return;
    try {
      const features = map.queryRenderedFeatures(evt.point);
      const featuresFilter = features.filter((i) => i.source === "stats");
      if (featuresFilter.length > 0) {
        setPopupInfo({
          ...featuresFilter[0],
          longitude: evt.lngLat.lng,
          latitude: evt.lngLat.lat,
        });
      } else {
        setPopupInfo(null);
      }
    } catch (error) {
      setPopupInfo(null);
      console.error(error);
    }
  }, [map]);

  useEffect(() => {
    if (acGeoJSON?.features?.length && map) {
      const acBbox = ac
        ? bbox(
          featureCollection(
            acGeoJSON.features.filter(
              (i) => i.properties.name.toLowerCase() === ac.toLowerCase(),
            ),
          ),
        )
        : bbox(acGeoJSON);
      map.fitBounds(
        [acBbox.slice(0, 2) as LngLatLike, acBbox.slice(2, 4) as LngLatLike],
        {
          padding: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      );
    }
  }, [ac, acGeoJSON, map]);
  
  return (
    <ReactMapGl
      initialViewState={viewState}
      ref={setMapRef}
      onMove={onMove}
      mapStyle="https://tiles.openfreemap.org/styles/positron"
      touchPitch={false}
      dragRotate={false}
      onClick={onClick}
      interactiveLayerIds={["stats"]}
      {...props}
    >
      <NavigationControl position="bottom-left" showZoom />
      <AdminAreaMapLayers fitBounds={map?.fitBounds} />
      <VectorLayers />
      <TabularLayers />
      <Legend />
      {popupInfo && (
        <Popup
          latitude={popupInfo.latitude}
          longitude={popupInfo.longitude}
          offset={[0, -10]}
          closeButton={false}
          // style={{ "& .maplibregl-popup-content": {borderRadius: "6px", boxShadow: "var(--chakra-shadows-md)"} }}
        >
          <DataList.Root orientation="horizontal" divideY="1px" size="sm" maxW="xs" gap={2}>
            {Object.entries(popupInfo.properties).map(([key, value]) => (
              <DataList.Item key={key} _notFirst={{ pt: "2" }}>
                <DataList.ItemLabel minW="4rem">{key}</DataList.ItemLabel>
                <DataList.ItemValue>{value}</DataList.ItemValue>
              </DataList.Item>
            ))}
          </DataList.Root>
        </Popup>
      )}
      {props.children}
    </ReactMapGl>
  );
}

export default forwardRef(Map);
