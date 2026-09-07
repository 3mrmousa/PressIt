import { DropZone } from "@/components/image-related/DropZone";
import { BodyText } from "@/components/ui/BodyText";
import { MyLink } from "@/components/ui/MyLink";
import { Card } from "@/components/ui/Card";
import { HeaderStyled } from "@/components/ui/HeaderStyled";
import { HeaderText } from "@/components/ui/HeaderText";
import { Tag } from "@/components/ui/Tag";
import {
  faBolt,
  faShieldHalved,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-linear-to-b from-white to-purple-50 font-sans pb-20">
      <div className="flex flex-col gap-10 items-center min-h-screen justify-center px-3">
        <HeaderText className="flex flex-col items-center justify-center">
          <p>Shrink images.</p> <HeaderStyled>Keep the quality.</HeaderStyled>
        </HeaderText>
        <BodyText className="max-w-lg text-center">
          A beautifully simple way to compress your images. Drop a file, tune
          the quality, and download — in seconds.
        </BodyText>

        <MyLink href="#dropzone">Start compressing</MyLink>
      </div>
      <div className="flex w-full items-center justify-center px-4"></div>
      <div
        id="dropzone"
        className="flex flex-col items-center justify-center gap-16 mt-10"
      >
        <DropZone />

        <div className="bg-purple-50/80 border border-purple-200 text-purple-800 
        px-6 py-4 rounded-xl max-w-2xl text-center text-sm shadow-xs mx-4">
          <strong className="font-semibold text-purple-900">
            Privacy Notice:
          </strong>{" "}
          By default, your compressed images are securely saved to your account
          history. If you prefer zero-storage, you can disable this anytime in
          your{" "}
          <Link
            href="/profile"
            className="underline font-semibold hover:text-purple-950"
          >
            Profile Settings
          </Link>
          . When disabled, your images will not be saved anywhere.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-6">
          <Card
            title="Lightning fast"
            description="Optimized cloud processing delivers compressed images back to you in seconds."
            icon={faBolt}
          />
          <Card
            title="Secure Storage"
            description="Your images are safely stored in your account history, available for you to download anytime."
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
