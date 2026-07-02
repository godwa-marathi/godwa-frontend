"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Joyride } from "react-joyride";
import type { Step } from "react-joyride";

export const TutorialTour = () => {
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState<Step[]>([]);

    const buildSteps = useCallback(() => {
        const allSteps: Step[] = [];

        const wordEl = document.querySelector(".tour-step-word");
        allSteps.push({
            target: wordEl ? ".tour-step-word" : "body",
            content:
                "Click on any Marathi word to see its meaning and pronunciation. Try it!",
            placement: wordEl ? "top" : "center",
        });

        allSteps.push({
            target: ".tour-step-lang",
            content:
                "You can choose to read poems in Devanagari or English (Roman) script here.",
            placement: "bottom",
        });

        allSteps.push({
            target: ".tour-step-align",
            content:
                "Change the text alignment — left, center, or justified — to suit your reading preference.",
            placement: "bottom",
        });

        const translateEl = document.querySelector(".tour-step-translate");
        allSteps.push({
            target: translateEl ? ".tour-step-translate" : "body",
            content:
                "Toggle between Poem only, Bilingual, or Meaning only modes to see line-by-line English translations (when available).",
            placement: translateEl ? "bottom" : "center",
        });

        allSteps.push({
            target: ".tour-step-submit",
            content: "Want to contribute? You can submit your own poems here!",
            placement: "bottom",
        });

        return allSteps;
    }, []);

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
        if (hasSeenTutorial) return;

        let attempts = 0;
        const maxAttempts = 30;

        const interval = setInterval(() => {
            attempts++;

            const langEl = document.querySelector(".tour-step-lang");
            const alignEl = document.querySelector(".tour-step-align");

            if (langEl && alignEl) {
                clearInterval(interval);
                setSteps(buildSteps());
                localStorage.setItem("hasSeenTutorial", "true");
                setRun(true);
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                setSteps(buildSteps());
                localStorage.setItem("hasSeenTutorial", "true");
                setRun(true);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [buildSteps]);

    if (steps.length === 0) return null;

    return <Joyride run={run} steps={steps} />;
};