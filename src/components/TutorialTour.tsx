"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Joyride, STATUS } from "react-joyride";
import type { Step, EventData } from "react-joyride";

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
                setRun(true);
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                setSteps(buildSteps());
                setRun(true);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [buildSteps]);

    const handleJoyrideCallback = (data: EventData) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            localStorage.setItem("hasSeenTutorial", "true");
            setRun(false);
        }
    };

    if (steps.length === 0) return null;

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            styles={{
                tooltip: {
                    backgroundColor: "#fff",
                    color: "#333",
                },
                buttonNext: {
                    backgroundColor: "#800000",
                    borderRadius: 8,
                },
                buttonBack: {
                    marginRight: 10,
                },
                buttonSkip: {
                    color: "#800000",
                },
                tooltipContainer: {
                    textAlign: "left",
                },
                tooltipTitle: {
                    fontFamily: "var(--font-serif)",
                },
                tooltipContent: {
                    fontFamily: "var(--font-english)",
                },
                overlay: {
                    zIndex: 1000,
                },
            }}
        />
    );
};