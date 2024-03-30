import { Marker, useMapEvents } from "react-leaflet";
import { useMemo, useRef, useState } from "react";
import lineIntersect from "@turf/line-intersect";
import bearing from "@turf/bearing";
import { lineString, point } from "@turf/helpers";
import {
  type Marker as MarkerType,
  type LatLngLiteral,
  DivIcon,
} from "leaflet";
import { type MarkerIndicatorType } from "./types";
import MarkerIndicator from "./MarkerIndicator";
import { MARKER_ICON } from "./constants";

const markerLocation: LatLngLiteral = {
  lat: 51.505,
  lng: -0.09,
};

const ICON_SIZE = 50;
const ICON_SIZE_HALF = ICON_SIZE / 2;

const markerIcon = new DivIcon({
  iconSize: [ICON_SIZE, ICON_SIZE], // size of the icon
  iconAnchor: [ICON_SIZE_HALF, ICON_SIZE_HALF],
  html: `<img src="${MARKER_ICON}" width="${ICON_SIZE}" height="${ICON_SIZE}" />`,
  className: "marker-div",
});

const MapComponent = () => {
  const markerRef = useRef<MarkerType>(null);

  const [position, setPosition] = useState(markerLocation);
  const [markerIndicator, setMarkerIndicator] = useState<MarkerIndicatorType>();

  const eventHandlers = useMemo(
    () => ({
      drag() {
        setMarkerIndicator(undefined);
      },
      movestart() {
        setMarkerIndicator(undefined);
      },
      dragstart() {
        setMarkerIndicator(undefined);
      },
      dragend() {
        if (markerRef) {
          const marker = markerRef.current;
          if (marker) {
            setPosition(marker.getLatLng());
          }
        }
      },
    }),
    [markerRef]
  );

  const map = useMapEvents({
    move() {
      const center = map.getCenter();
      const mapContainerBounds = map.getBounds().pad(-0.065);

      const targetBearing = bearing(
        point([center.lng, center.lat]),
        point([position.lng, position.lat])
      );
      const targetDeg = targetBearing - 90;

      const NE = mapContainerBounds.getNorthEast().clone();
      const NW = mapContainerBounds.getNorthWest().clone();
      const SE = mapContainerBounds.getSouthEast().clone();
      const SW = mapContainerBounds.getSouthWest().clone();

      const targetToCenterLine = lineString([
        [center.lng, center.lat],
        [position.lng, position.lat],
      ]);

      // Check North Line
      const intersectNorthLine = lineIntersect(
        targetToCenterLine,
        lineString([
          [NE.lng, NE.lat],
          [NW.lng, NW.lat],
        ])
      );
      if (intersectNorthLine?.features?.length) {
        const coords = intersectNorthLine.features[0].geometry.coordinates;
        setMarkerIndicator({
          point: map.latLngToContainerPoint([coords[1], coords[0]]),
          deg: targetDeg,
        });
        return;
      }

      // Check East Line
      const intersectEastLine = lineIntersect(
        targetToCenterLine,
        lineString([
          [SW.lng, SW.lat],
          [NW.lng, NW.lat],
        ])
      );
      if (intersectEastLine?.features?.length) {
        const coords = intersectEastLine.features[0].geometry.coordinates;
        setMarkerIndicator({
          point: map.latLngToContainerPoint([coords[1], coords[0]]),
          deg: targetDeg,
        });
        return;
      }

      // Check West Line
      const intersectWestLine = lineIntersect(
        targetToCenterLine,
        lineString([
          [SE.lng, SE.lat],
          [NE.lng, NE.lat],
        ])
      );
      if (intersectWestLine?.features?.length) {
        const coords = intersectWestLine.features[0].geometry.coordinates;
        setMarkerIndicator({
          point: map.latLngToContainerPoint([coords[1], coords[0]]),
          deg: targetDeg,
        });
        return;
      }

      // Check South Line
      const intersectSouthLine = lineIntersect(
        targetToCenterLine,
        lineString([
          [SE.lng, SE.lat],
          [SW.lng, SW.lat],
        ])
      );
      if (intersectSouthLine?.features?.length) {
        const coords = intersectSouthLine.features[0].geometry.coordinates;
        setMarkerIndicator({
          point: map.latLngToContainerPoint([coords[1], coords[0]]),
          deg: targetDeg,
        });
        return;
      }
      setMarkerIndicator(undefined);
    },
  });

  return (
    <>
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
        icon={markerIcon}
      ></Marker>

      <MarkerIndicator
        onClickIndicator={() => {
          map.flyTo(position, map.getZoom());
        }}
        markerIndicator={markerIndicator}
      />
    </>
  );
};

export default MapComponent;
