import previewGif from "@/assets/preview-graph-output.gif";
import fallbackPng from "@/assets/ascii-pie-chart-terminal.png";
import Image from "next/image";

export default function LogoImage() {
  return (
    <div className="w-16 h-16 overflow-hidden flex items-center justify-center rounded-md">
      <Image
        src={fallbackPng.src}
        alt="Beautiful Graphs in the blink of an eye"
        width={100}
        height={100}
        className="w-20 h-20 object-contain object-center hover:scale-110 transition-transform duration-300"
      />
    </div>
  );
}
