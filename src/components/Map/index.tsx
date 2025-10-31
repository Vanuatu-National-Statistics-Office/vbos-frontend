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
  ViewStateChangeEvent,
  NavigationControl,
  LngLatLike,
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

function Map(props: MapProps, ref: Ref<MapRef | undefined>) {
  const [map, setMap] = useState<MapRef>();
  const setMapRef = (m: MapRef) => setMap(m);
  const { viewState, setViewState } = useMapStore();
  const { ac, acGeoJSON } = useAreaStore();

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
      {...props}
    >
      <NavigationControl position="bottom-left" showZoom />
      <AdminAreaMapLayers fitBounds={map?.fitBounds} />
      <VectorLayers />
      <TabularLayers />
      <Legend />
      {props.children}
    </ReactMapGl>
  );
}

export default forwardRef(Map);
