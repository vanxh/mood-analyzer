"use client";
import { type ChangeEvent, useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { emotionConfig } from "./config";

interface Emotion {
    label: string;
    score: number;
}

interface EmotionConfig {
    [key: string]: {
        colorHex: string;
        emoji: string;
    };
}

export default function Home() {
    const defaultColor = "#cccccc";
    const [rows, setRows] = useState(2);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<Emotion[]>([]);
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState(defaultColor);
    const [tagsVisible, setTagsVisible] = useState(false);
    const [textColor, setTextColor] = useState("#1a1a1a");

    useEffect(() => {
        const runPredictions = async () => {
            if (input) {
                setLoading(true);
                setTagsVisible(false);
                const res = await fetch("/api/emotion", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ input: input }),
                });
                const data = await res.json();
                setOutput(data.filteredResponse);
                setLoading(false);
            }
        };

        const inputTimeout = setTimeout(() => {
            runPredictions();
        }, 1000);

        return () => clearTimeout(inputTimeout);
    }, [input]);

    useEffect(() => {
        if (output.length > 0) {
            const colorKey = output[0].label;
            const colorHex =
                (emotionConfig as EmotionConfig)[colorKey]?.colorHex ??
                defaultColor;
            setColor(colorHex);

            const r = Number.parseInt(colorHex.slice(1, 3), 16);
            const g = Number.parseInt(colorHex.slice(3, 5), 16);
            const b = Number.parseInt(colorHex.slice(5, 7), 16);

            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

            setTextColor(luminance > 0.5 ? "#1a1a1a" : "#ffffff");

            setTagsVisible(true);
        } else {
            setColor(defaultColor);
            setTextColor("#1a1a1a");
        }
    }, [output]);

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
        const newRows = Math.max(1, Math.ceil(event.target.scrollHeight / 20));
        setRows(newRows);
    };

    return (
        <main
            style={{ backgroundColor: `${color}55` }}
            className="transition-all duration-1000 min-h-screen flex items-center justify-center p-8 md:p-24"
        >
            <div className="max-w-4xl w-full flex flex-col items-center justify-center space-y-12">
                <h1
                    style={{ color: textColor }}
                    className="text-5xl md:text-7xl font-bold text-center transition-colors duration-1000"
                >
                    How do you feel? 🤔
                </h1>

                <div className="w-full max-w-2xl mx-auto">
                    <div className="backdrop-blur-sm bg-white/80 shadow-xl rounded-2xl p-8 border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:bg-white/90">
                        <textarea
                            rows={rows}
                            onChange={handleInputChange}
                            placeholder="Share your thoughts and feelings..."
                            style={{ color: textColor }}
                            className="resize-none outline-none block w-full text-xl bg-transparent transition-colors duration-1000 h-[100px]"
                        />
                    </div>
                    {input && (
                        <p
                            style={{ color: `${textColor}CC` }}
                            className="mt-4 text-base italic px-2 text-center transition-colors duration-1000"
                        >
                            {`> ${input}`}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl">
                    {output.map(({ label, score }) => (
                        <EmotionTag
                            key={label}
                            label={label}
                            visible={tagsVisible}
                            emoji={
                                (emotionConfig as EmotionConfig)[label].emoji
                            }
                            textColor={textColor}
                        />
                    ))}
                </div>

                {loading && (
                    <div className="mt-8">
                        <ColorRing
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="color-ring-loading"
                            wrapperStyle={{}}
                            wrapperClass="color-ring-wrapper"
                            colors={[
                                "#6366f1",
                                "#8b5cf6",
                                "#d946ef",
                                "#ec4899",
                                "#f43f5e",
                            ]}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}

const EmotionTag = ({
    label,
    visible,
    emoji,
    textColor,
}: {
    label: string;
    visible: boolean;
    emoji: string;
    textColor: string;
}) => (
    <span
        style={{
            opacity: visible ? 1 : 0,
            color: textColor,
        }}
        className="transition-all duration-500 cursor-pointer hover:scale-105 bg-white/90 backdrop-blur-sm shadow-lg text-xl px-8 py-3 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-xl"
    >
        {emoji} {label}
    </span>
);
