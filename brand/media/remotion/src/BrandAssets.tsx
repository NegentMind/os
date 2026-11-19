import React from "react";
import { loadFont } from "@remotion/google-fonts/ChakraPetch";
import {
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

export type AssetTheme = {
  bg: string;
  ink: string;
  dot: string;
  line: string;
  grid: string;
  gridOpacity: number;
};

export const DARK: AssetTheme = {
  bg: VOID,
  ink: BONE,
  dot: PULSE,
  line: LINE_DARK,
  grid: FOG,
  gridOpacity: 0.16,
};

export const LIGHT: AssetTheme = {
  bg: LIGHT_BG,
  ink: LIGHT_INK,
  dot: PULSE_DEEP,
  line: LINE_LIGHT,
  grid: LIGHT_INK,
  gridOpacity: 0.12,
};

const LOCKUP = ["N", "E", "G", "E", "N", "T", " ", "M", "I", "N", "D"];

export const Lockup: React.FC<{ theme: AssetTheme; fontSize: number }> = ({
  theme,
  fontSize,
}) => (
  <div style={{ display: "flex", lineHeight: 1, alignItems: "center" }}>
    {LOCKUP.map((ch, i) =>
      ch === " " ? (
        <span
          key={i}
          style={{ width: "0.42em", fontSize, display: "inline-block" }}
        />
      ) : (
        <span
          key={i}
          style={{
            fontSize,
            lineHeight: 1,
            letterSpacing: i === LOCKUP.length - 1 ? 0 : WORDMARK_TRACKING,
            textTransform: "uppercase",
            color: theme.ink,
            display: "inline-block",
            paddingRight: 2,
          }}
        >
          {ch}
        </span>
      )
    )}
    <span
      style={{
        width: "0.22em",
        height: "0.22em",
        marginLeft: "0.18em",
        borderRadius: "50%",
        backgroundColor: theme.dot,
        display: "inline-block",
        fontSize,
      }}
    />
  </div>
);

/** Monograma NM en pastilla a bleed completo. */
export const Mark: React.FC<{ theme: AssetTheme; fontSize: number }> = ({
  theme,
  fontSize,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      backgroundColor: theme.bg,
      borderRadius: "22%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: chakra,
    }}
  >
    <span
      style={{
        color: theme.ink,
        fontSize,
        fontWeight: 700,
        letterSpacing: "0.02em",
        lineHeight: 1,
        transform: "translateY(-2%)",
      }}
    >
      NM
      <span style={{ color: theme.dot }}>.</span>
    </span>
  </div>
);

const bleed =
  (theme: AssetTheme, size: number, fontSize: number): React.FC =>
  () =>
    (
      <div style={{ width: size, height: size, fontFamily: chakra }}>
        <Mark theme={theme} fontSize={fontSize} />
      </div>
    );

export const MarkDark = bleed(DARK, 512, 200);
export const MarkLight = bleed(LIGHT, 512, 200);
export const AvatarDark = bleed(DARK, 500, 196);
export const AvatarLight = bleed(LIGHT, 500, 196);

function Grid({
  theme,
  width,
  height,
}: {
  theme: AssetTheme;
  width: number;
  height: number;
}) {
  const dots: Array<{ x: number; y: number }> = [];
  for (let x = 16; x < width; x += 32) {
    for (let y = 16; y < height; y += 32) {
      dots.push({ x, y });
    }
  }
  return (
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
  );
}

const frame =
  (
    theme: AssetTheme,
    width: number,
    height: number,
    children: React.ReactNode
  ): React.FC =>
  () =>
    (
      <div
        style={{
          width,
          height,
          backgroundColor: theme.bg,
          fontFamily: chakra,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Grid theme={theme} width={width} height={height} />
        <div style={{ position: "relative" }}>{children}</div>
      </div>
    );

export const WordmarkDark = frame(DARK, 1200, 240, <Lockup theme={DARK} fontSize={104} />);
export const WordmarkLight = frame(LIGHT, 1200, 240, <Lockup theme={LIGHT} fontSize={104} />);
export const HeroDark = frame(
  DARK,
  1920,
  640,
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
    <Lockup theme={DARK} fontSize={150} />
    <div style={{ width: 640, height: 1, backgroundColor: DARK.line }} />
    <div
      style={{
        color: DARK.grid,
        fontSize: 30,
        letterSpacing: "0.34em",
        textTransform: "uppercase",
      }}
    >
      Verifiable infrastructure for AI agents
    </div>
  </div>
);
export const HeroLight = frame(
  LIGHT,
  1920,
  640,
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
    <Lockup theme={LIGHT} fontSize={150} />
    <div style={{ width: 640, height: 1, backgroundColor: LIGHT.line }} />
    <div
      style={{
        color: LIGHT.grid,
        fontSize: 30,
        letterSpacing: "0.34em",
        textTransform: "uppercase",
        opacity: 0.75,
      }}
    >
      Verifiable infrastructure for AI agents
    </div>
  </div>
);
