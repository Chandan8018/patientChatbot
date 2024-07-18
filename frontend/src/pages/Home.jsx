import React from "react";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import homeImg from "../assets/home.jpg";

function Home() {
  return (
    <div className='flex flex-col overflow-hidden'>
      <ContainerScroll
        titleComponent={
          <>
            <h1 className='text-4xl font-semibold text-black dark:text-white'>
              <span className='text-4xl md:text-[6rem] font-bold mt-1 leading-none'>
                Scroll Animations
              </span>
            </h1>
          </>
        }
      >
        <img
          src={homeImg}
          alt='hero'
          height={720}
          width={1400}
          className='mx-auto rounded-2xl object-cover h-full object-left-top'
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export default Home;
