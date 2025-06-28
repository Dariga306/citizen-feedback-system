import React from "react";
import { AiOutlineCopyrightCircle } from "react-icons/ai";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-center py-4 mt-10 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 transition-colors">
      <div className="flex justify-center items-center gap-1 mb-1 text-gray-500 dark:text-gray-400">
        <AiOutlineCopyrightCircle className="text-base" />
        <span>2025 Министерство цифрового развития РК</span>
      </div>
      <div>
        Разработано студентом-практикантом —{" "}
        <span className="font-semibold text-black dark:text-white">
          Дарига Нургалиева, SE-2302
        </span>
      </div>
    </footer>
  );
}
