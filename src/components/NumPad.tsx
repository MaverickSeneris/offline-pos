import { useEffect, useState } from "react";

type Props = {
  onInput: (value: string) => void;
};

export default function Numpad({ onInput }: Props) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "←", "C"];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    setVisible(media.matches);

    const handler = (e: MediaQueryListEvent) => setVisible(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="grid grid-cols-3 gap-2 mt-4 w-48">
      {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "←", "C"].map((key) => (
        <button
          key={key}
          className="bg-gray-300 p-4 rounded text-lg font-bold hover:bg-gray-400"
          onClick={() => onInput(key)}
        >
          {key}
        </button>
      ))}
    </div>
  );
}  

