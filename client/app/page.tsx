import { DropZone } from "@/components/image-related/DropZone";

import { BodyText } from "@/components/ui/BodyText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HeaderStyled } from "@/components/ui/HeaderStyled";
import { HeaderText } from "@/components/ui/HeaderText";
import { Tag } from "@/components/ui/Tag";
import {
  faBolt,
  faShieldHalved,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-linear-to-b from-white to-purple-50 font-sans pb-20">
      <div className="flex flex-col gap-10 items-center min-h-screen justify-center px-3">
        <Tag>⚡ Smart compression · powered by the cloud</Tag>
        <HeaderText className="flex flex-col items-center justify-center">
          <p>Shrink images.</p> <HeaderStyled>Keep the quality.</HeaderStyled>
        </HeaderText>
        <BodyText className="max-w-lg text-center">
          A beautifully simple way to compress your images. Drop a file, tune
          the quality, and download — in seconds.
        </BodyText>

        <Button href="#dropzone">Start compressing</Button>
      </div>
      <div className="flex w-full items-center justify-center px-4">

      </div>
      <div id="dropzone" className="flex flex-col items-center justify-center gap-16 mt-10">
        <DropZone />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-6">
          <Card
            title="Lightning fast"
            description="Optimized cloud processing delivers compressed images back to you in seconds."
            icon={faBolt}
          />
          <Card
            title="Zero Storage"
            description="100% private. We never save your images on our servers or databases."
            icon={faShieldHalved}
          />
          <Card
            title="Pixel perfect"
            description="Fine-tune quality with a single slider — you're always in control."
            icon={faSliders}
          />
        </div>


      </div>
    </div>
  );
}
