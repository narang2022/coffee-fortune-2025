import React, { useEffect, useRef } from 'react';
import { Swiper } from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

import { useLanguage } from '../context/LanguageContext';
import { MENU_ITEMS } from '../constants';

const MenuSlider: React.FC = () => {
  const swiperRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = new Swiper(swiperRef.current, {
        modules: [Autoplay, Pagination],
        loop: true,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        spaceBetween: 20,
      });

      return () => {
        swiper.destroy();
      };
    }
  }, []);

  return (
    <div className="swiper mb-0 pb-0" ref={swiperRef}>
      <div className="swiper-wrapper h-96">
        {MENU_ITEMS.map((item) => (
          <div key={item.id} className="swiper-slide bg-white rounded-xl shadow-md overflow-hidden h-96 flex flex-col justify-between">
            <img className="w-full h-72 object-contain" src={item.image} alt={item.name[language]} />
            <div className="px-4 py-4">
              <h3 className="font-bold text-lg text-[#6B4F4F]">{item.name[language]}</h3>
              <p className="text-sm text-gray-600 mt-0.5">{item.description[language]}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="swiper-pagination mt-8 !relative"></div>
    </div>
  );
};

export default MenuSlider;