
import { useEffect, useState } from "react";
import Test from "./Homepage/Test";

export default function Home() {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => setOffsetY(window.scrollY);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <section className="home flex-col ps-8 text-start h-screen relative overflow-hidden">
        <div
          className="absolute top-1/4 left-10"
          style={{
            // clamp le mouvement max à 2000px
            transform: `translateY(${Math.min(offsetY, 2000) * 0.3}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          <h2 className="text-zinc-50 text-2xl">
            <span className="font-bold">+10 000</span> USERS BY DAYS
          </h2>
          <h1 className="text-zinc-50 w-6xl leading-none">
            LIST YOUR <span>GAMES </span>EASILY!
          </h1>
          <a className="bthome rounded-4xl px-11 py-2" href="">
            ALL GAMES
          </a>
        </div>
      </section>
      <Test />
    </div>
  );
}
