import React from "react";
import MiniHeading from "./MiniHeading";

const List = ({ title, list ,className }: { title: string; list: string[],className?:string }) => {
  return (
    <div className={`${className} py-4 rounded-xl px-8 bg-amber-100`}>
      <MiniHeading className=" mb-2 py-3 pb-5"  title={title} />
      <ul className=" list-disc">
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default List;
