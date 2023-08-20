import React, { useState } from 'react';

const Stakecoins = () => {
  const [coins, setcoins] = useState('');
  return (
    <section className="flex w-full items-center bg-bgcolor2 md:min-h-screen">
      <div className="w-full">
        <div className="relative flex flex-col items-center justify-center font-urbanist">
          {/* image */}
          <div className="min-h-screen w-full">
            <img
              src="https://res.cloudinary.com/sambitsankalp/image/upload/v1692541444/coinstakebg_wygiem.jpg"
              alt="heroImages"
              className="min-h-screen w-full object-cover md:h-[600px]"
            />

            {/* image darker overlay */}
            <div className="absolute inset-0 z-0 h-full w-full bg-black opacity-30"></div>
          </div>

          {/* text */}
          <div className="absolute z-10 space-y-10 px-10 text-center md:px-24 lg:px-64">
            <h1 className="text-sm font-bold uppercase tracking-widest text-black md:text-base">
              Stake you coins here
            </h1>
            <p className="font-gotu text-2xl text-black lg:text-5xl lg:leading-snug">
              To get 10% APY on your FlipCoins
            </p>
          </div>

          <div className="md:bottom-43 absolute bottom-40 flex items-center justify-center">
            <input
              type="number"
              name="description"
              value={coins}
              onChange={(e) => {
                setcoins(e.target.value);
              }}
              placeholder="Enter Amount"
              className="w-full border-2 border-transparent shadow-lg focus:outline-none md:px-3 md:py-2"
            />
            <button className="btn-primary ml-2">Stake</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stakecoins;
