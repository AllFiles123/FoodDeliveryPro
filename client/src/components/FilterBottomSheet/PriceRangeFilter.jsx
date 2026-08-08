import { useState } from "react";

export default function PriceRangeFilter({ onApply }) {
  const [min, setMin] = useState(20);
  const [max, setMax] = useState(75);

  const heights = [
    20, 35, 45, 25, 60, 75, 40, 90, 55, 30,
    70, 85, 45, 65, 95, 55, 35, 80, 60, 40,
    25, 50, 75, 90, 45, 65, 85, 55, 30, 70,
    95, 60, 40, 80, 50, 35, 75, 90, 65, 45,
    30, 55, 85, 70, 40, 95, 60, 35, 80, 50,
  ];

  const updateMin = (value) => {
    const next = Number(value);

    if (next < max) {
      setMin(next);
    }
  };

  const updateMax = (value) => {
    const next = Number(value);

    if (next > min) {
      setMax(next);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 pb-28">
      <h2 className="mb-5 text-lg font-black">
        Price Range
      </h2>

      {/* PRICE GRAPH */}
      <div className="mb-6 flex h-32 items-end gap-[2px]">
        {heights.map((height, index) => {
          const active =
            index >= Math.floor(min / 2) &&
            index <= Math.floor(max / 2);

          return (
            <div
              key={index}
              className={`
                w-[3px]
                rounded-t
                transition-all
                duration-300
                ${
                  active
                    ? "bg-[var(--color-primary)]"
                    : "bg-border"
                }
              `}
              style={{
                height: `${height}%`,
              }}
            />
          );
        })}
      </div>

      {/* RANGE SLIDER */}
      <div className="relative mb-7 h-8">
        <div className="absolute top-3 h-2 w-full rounded-full bg-border">
          <div
            className="
              absolute
              h-2
              rounded-full
              bg-[var(--color-primary)]
            "
            style={{
              left: `${min}%`,
              right: `${100 - max}%`,
            }}
          />
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={min}
          onChange={(e) =>
            updateMin(e.target.value)
          }
          className="
            absolute
            w-full
            appearance-none
            bg-transparent
            accent-[var(--color-primary)]
          "
        />

        <input
          type="range"
          min="0"
          max="100"
          value={max}
          onChange={(e) =>
            updateMax(e.target.value)
          }
          className="
            absolute
            w-full
            appearance-none
            bg-transparent
            accent-[var(--color-primary)]
          "
        />
      </div>

      {/* MIN / MAX */}
      <div className="flex gap-4">
        <div
          className="
            flex
            h-16
            flex-1
            items-center
            rounded-2xl
            bg-gray-100
            px-4
          "
        >
          <span className="mr-3 text-lg font-black text-gray-700">
            ৳
          </span>

          <div>
            <p className="text-[10px] font-bold text-gray-400">
              Min
            </p>

            <p className="font-black text-gray-800">
              {min}
            </p>
          </div>
        </div>

        <div
          className="
            flex
            h-16
            flex-1
            items-center
            rounded-2xl
            bg-gray-100
            px-4
          "
        >
          <span className="mr-3 text-lg font-black text-gray-700">
            ৳
          </span>

          <div>
            <p className="text-[10px] font-bold text-gray-400">
              Max
            </p>

            <p className="font-black text-gray-800">
              {max}
            </p>
          </div>
        </div>
      </div>

      {/* APPLY */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4">
        <button
          onClick={onApply}
          className="
            w-full
            rounded-full
            bg-[var(--color-primary)]
            py-4
            font-black
            text-white
            shadow-xl
            active:scale-[0.98]
          "
        >
          Show 2,500+ Items
        </button>
      </div>
    </div>
  );
}
