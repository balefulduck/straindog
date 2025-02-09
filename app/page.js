"use client";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import PDFCreator from "../components/PDFCreator";

const seedList = [
  {
    id: 1,
    title: "Mylar Magic",
    breeder: "Nine Weeks Harvest",
    description: "This is a description of Mylar Magic",
    thc: "22%",
    cbd: "0.4%",
    terpenes: "β-Caryophyllen",
    effect: "",
    imageUrl: "https://www.tomhemps.com/wp-content/uploads/2024/04/mmstrain.jpg",
  },
  {
    id: 2,
    title: "White Widow",
    description: "This is a description of White Widow",
    thc: "18%",
    cbd: "0.3%",
    terpenes: "β-Caryophyllen",
    effect: "",
    imageUrl: "https://shop.greenhouseseeds.nl/images/thumbnails/346/453/detailed/10/WHITE_WIDOW.jpg"
  },
];

export default function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % seedList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + seedList.length) % seedList.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  return (
    <div {...handlers} className="flex items-center justify-center min-h-screen bg-gray-700 text-white">
      <PDFCreator src={seedList}/>

      <div className="max-w-4xl flex flex-col md:flex-row items-center p-4">
        <div className="md:w-1/2 text-center md:text-left p-4">
          <h1 className="text-2xl font-bold mb-4">{seedList[currentIndex].title}</h1>
          <h1 className="text-lg font-bold mb-4">by: {seedList[currentIndex].breeder}</h1>
          <p className="text-lg">{seedList[currentIndex].description}</p>
          <h1 className="text-lg font-bold mb-4">Terpene</h1>
          <p className="text-lg">{seedList[currentIndex].terpenes}</p>
          <h1 className="text-lg font-bold mb-4">CBD</h1>
          <p className="text-lg">{seedList[currentIndex].cbd}</p>
        </div>
        <div className="md:w-1/2">
          <img
            src={seedList[currentIndex].imageUrl}
            alt={seedList[currentIndex].title}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
