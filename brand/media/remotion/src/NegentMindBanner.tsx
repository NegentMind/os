import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/ChakraPetch";
import {
  BANNER_HEIGHT,
  BANNER_WIDTH,
  BONE,
  FOG,
  LIGHT_BG,
  LIGHT_INK,
  LINE_DARK,
  LINE_LIGHT,
  PULSE,
  PULSE_DEEP,
  VOID,
  WORDMARK_TRACKING,
} from "./tokens";

const { fontFamily: chakra } = loadFont("normal", {
  weights: ["700"],
});

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
// "NEGENT MIND" — el espacio se renderiza como hueco.
const LETTERS = ["N", "E", "G", "E", "N", "T", " ", "M", "I", "N", "D"];

const FONT_SIZE = 88;

type Theme = {
  bg: string;
  ink: string;
  dot: string;
  line: string;
  grid: string;
  gridOpacity: number;
};

const DARK: Theme = {
  bg: VOID,
  ink: BONE,
  dot: PULSE,
  line: LINE_DARK,
  grid: FOG,
  gridOpacity: 0.16,
};

const LIGHT: Theme = {
  bg: LIGHT_BG,
  ink: LIGHT_INK,
  dot: PULSE_DEEP,
  line: LINE_LIGHT,
  grid: LIGHT_INK,
  gridOpacity: 0.12,
};

function useGrid() {
  const dots: Array<{ x: number; y: number }> = [];
  for (let x = 12; x < BANNER_WIDTH; x += 24) {
    for (let y = 12; y < BANNER_HEIGHT; y += 24) {
      dots.push({ x, y });
    }
  }
  return dots;
}

export const NegentMindBanner: React.FC<{ theme?: Theme }> = ({
  theme = DARK,
}) => {
  const frame = useCurrentFrame();
  const dots = useGrid();

  const letter = (i: number) => {
    const start = 4 + i * 2.2;
    const opacity = interpolate(frame, [start, start + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT,
    });
    const translateY = interpolate(
      frame,
      [start, start + 8, start + 12],
      [64, -8, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return { opacity, translateY };
  };

  const dotScale = interpolate(frame, [72, 80, 86], [0, 1.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const dotOpacity = interpolate(frame, [72, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ruleScale = interpolate(frame, [40, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  return (
    <div
      style={{
        width: BANNER_WIDTH,
        height: BANNER_HEIGHT,
        backgroundColor: theme.bg,
        fontFamily: chakra,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        {dots.map((d, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: 2,
              height: 2,
              borderRadius: "50%",
              backgroundColor: theme.grid,
              opacity: theme.gridOpacity,
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          lineHeight: 1,
          alignItems: "center",
          position: "relative",
        }}
      >
        {LETTERS.map((ch, i) => {
          const { opacity, translateY } = letter(i);
          if (ch === " ") {
            return (
              <span
                key={i}
                style={{
                  width: "0.42em",
                  fontSize: FONT_SIZE,
                  display: "inline-block",
                  opacity,
                }}
              />
            );
          }
          return (
            <span
              key={i}
              style={{
                fontSize: FONT_SIZE,
                lineHeight: 1,
                letterSpacing:
                  i === LETTERS.length - 1 ? 0 : WORDMARK_TRACKING,
                textTransform: "uppercase",
                color: theme.ink,
                transform: `translateY(${translateY}px)`,
                opacity,
                display: "inline-block",
                paddingRight: 2,
              }}
            >
              {ch}
            </span>
          );
        })}
        <span
          style={{
            width: "0.22em",
            height: "0.22em",
            marginLeft: "0.18em",
            borderRadius: "50%",
            backgroundColor: theme.dot,
            display: "inline-block",
            opacity: dotOpacity,
            transform: `scale(${dotScale})`,
            fontSize: FONT_SIZE,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 44,
          left: "19%",
          right: "19%",
          height: 1,
          backgroundColor: theme.line,
          transform: `scaleX(${ruleScale})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

export const NegentMindBannerLight: React.FC = () => (
  <NegentMindBanner theme={LIGHT} />
);
