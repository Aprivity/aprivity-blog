import Image from "next/image";

export function BackgroundLayer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-[-4%]">
        <Image
          src="/images/bg-main.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="app-background-image app-background-image-dark object-cover object-center scale-105 blur-[6px]"
        />
        <Image
          src="/images/bt-main.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="app-background-image app-background-image-light object-cover object-center scale-[1.02] blur-[2px]"
        />
      </div>

      <div className="app-background-dim absolute inset-0" />
      <div className="app-background-vignette absolute inset-0" />
      <div className="app-background-wash absolute inset-0" />

      <div className="app-background-spot app-background-spot-blue absolute left-[-8%] top-[8%] h-[26rem] w-[26rem] rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="app-background-spot app-background-spot-violet absolute right-[-10%] top-[12%] h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-[130px]" />
      <div className="app-background-spot app-background-spot-cyan absolute bottom-[-6%] left-[26%] h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-[115px]" />
      <div className="app-background-glow absolute inset-0" />
    </div>
  );
}
