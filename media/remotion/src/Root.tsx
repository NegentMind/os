import React from "react";
import { Composition, Still } from "remotion";
import { NegentMindBanner, NegentMindBannerLight } from "./NegentMindBanner";
import {
  AvatarDark,
  AvatarLight,
  HeroDark,
  HeroLight,
  MarkDark,
  MarkLight,
  WordmarkDark,
  WordmarkLight,
} from "./BrandAssets";
import { BANNER_DURATION, BANNER_FPS, BANNER_HEIGHT, BANNER_WIDTH } from "./tokens";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NegentMindBanner"
        component={NegentMindBanner}
        durationInFrames={BANNER_DURATION}
        fps={BANNER_FPS}
        width={BANNER_WIDTH}
        height={BANNER_HEIGHT}
      />
      <Composition
        id="NegentMindBannerLight"
        component={NegentMindBannerLight}
        durationInFrames={BANNER_DURATION}
        fps={BANNER_FPS}
        width={BANNER_WIDTH}
        height={BANNER_HEIGHT}
      />
      <Still id="MarkDark" component={MarkDark} width={512} height={512} />
      <Still id="MarkLight" component={MarkLight} width={512} height={512} />
      <Still id="AvatarDark" component={AvatarDark} width={500} height={500} />
      <Still id="AvatarLight" component={AvatarLight} width={500} height={500} />
      <Still id="WordmarkDark" component={WordmarkDark} width={1200} height={240} />
      <Still id="WordmarkLight" component={WordmarkLight} width={1200} height={240} />
      <Still id="HeroDark" component={HeroDark} width={1920} height={640} />
      <Still id="HeroLight" component={HeroLight} width={1920} height={640} />
    </>
  );
};
