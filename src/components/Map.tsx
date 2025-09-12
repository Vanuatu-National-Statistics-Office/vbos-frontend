import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import ReactMapGl, {
  type MapRef,
  type MapProps,
  ScaleControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { LngLatBoundsLike } from "maplibre-gl";

type Props = MapProps & {
  bounds?: LngLatBoundsLike;
  boundsPadding?: number;
  zoomDuration?: number;
};

function Map(
  { bounds, boundsPadding = 30, zoomDuration = 0, ...props }: Props,
  ref: Ref<MapRef | undefined>,
) {
  const [map, setMap] = useState<MapRef>();
  const setMapRef = (m: MapRef) => setMap(m);

  useImperativeHandle(ref, () => {
    if (map) {
      return map;
    }
  }, [map]);

  useEffect(() => {
    if (map && bounds) {
      map.fitBounds(bounds, { padding: boundsPadding, duration: zoomDuration });
    }
  }, [map, bounds, boundsPadding, zoomDuration]);

  return (
    <ReactMapGl
      ref={setMapRef}
      initialViewState={{
        longitude: 168.014,
        latitude: -16.741,
        zoom: 7,
      }}
      mapStyle="https://tiles.openfreemap.org/styles/positron"
      touchPitch={false}
      dragRotate={false}
      {...props}
    >
      {props.children}
      <ScaleControl />
    </ReactMapGl>
  );
}

export default forwardRef(Map);
