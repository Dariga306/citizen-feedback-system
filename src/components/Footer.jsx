import React from "react";
import { AiOutlineCopyrightCircle } from "react-icons/ai";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 mt-10 py-6 text-center text-sm text-gray-700 dark:text-gray-400 px-4">
      <div className="flex justify-center items-center gap-1 mb-1">
        <AiOutlineCopyrightCircle className="text-base" />
        <span>2025 Министерство цифрового развития РК</span>
      </div>
      <div>
        Разработано студентом-практикантом —{" "}
        <span className="font-medium text-black dark:text-white">
          Даригой Нургалиевой, SE-2302
        </span>
      </div>
    </footer>
  );
}
