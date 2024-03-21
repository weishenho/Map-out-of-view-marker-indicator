import { INDICATOR_ARROW, MARKER_ICON } from "./constants";
import { type MarkerIndicatorType } from "./types";

type Props = {
  markerIndicator?: MarkerIndicatorType;
  onClickIndicator: () => void;
};

const ICON_SIZE = 50;
const ICON_SIZE_HALF = ICON_SIZE / 2;

const MarkerIndicator = ({ markerIndicator, onClickIndicator }: Props) => {
  if (!markerIndicator) return null;

  return (
    <div
      className="marker-indicator-container"
      style={{
        left: -ICON_SIZE_HALF,
        top: -ICON_SIZE_HALF,
        transform: `translate(${markerIndicator.point.x}px, ${markerIndicator.point.y}px)`,
      }}
      onClick={(e) => {
        e.preventDefault();
        if (typeof onClickIndicator === "function") {
          onClickIndicator();
        }
      }}
      role="presentation"
    >
      <img
        alt="marker-indicator-icon"
        key="marker-indicator-icon"
        src={MARKER_ICON}
        width={ICON_SIZE}
        height={ICON_SIZE}
      />

      <div
        className="marker-indicator-arrow-container-dupe"
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          transform: `rotate(${markerIndicator.deg}deg)`,
        }}
      >
        <div
          className="marker-indicator-arrow-container"
          style={{
            left: ICON_SIZE,
          }}
        >
          <img
            alt="marker-indicator-arrow"
            key="marker-indicator-arrow"
            src={INDICATOR_ARROW}
            width={15}
            height={18}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkerIndicator;
