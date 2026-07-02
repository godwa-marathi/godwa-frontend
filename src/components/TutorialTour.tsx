"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Joyride, STATUS } from "react-joyride";
import type { Step, EventData } from "react-joyride";

export const TutorialTour = () => {
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState<Step[]>([]);

    const buildSteps = useCallback(() => {
        const allSteps: Step[] = [];

        // Step 1: Word Meaning
        const wordEl = document.querySelector(".tour-step-word");
        allSteps.push({
            target: wordEl ? ".tour-step-word" : "body",
            content: "Click on any Marathi word to see its meaning and pronunciation. Try it!",
            placement: wordEl ? "top" : "center",
        });

        // Step 2: Language Script
        allSteps.push({
            target: ".tour-step-lang",
            content: "You can choose to read poems in Devanagari or English (Roman) script here.",
            placement: "bottom",
        });

        // Step 3: Alignment
        allSteps.push({
            target: ".tour-step-align",
            content: "Change the text alignment — left, center, or justified — to suit your reading preference.",
            placement: "bottom",
        });

        // Step 4: English Translation
        const translateEl = document.querySelector(".tour-step-translate");
        allSteps.push({
            target: translateEl ? ".tour-step-translate" : "body",
            content: "Toggle between Poem only, Bilingual, or Meaning only modes to see line-by-line English translations (when available).",
            placement: translateEl ? "bottom" : "center",
        });

        // Step 5: Submit Poems
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

        // Poll until the essential navbar elements are rendered, then start the tour.
        // We wait for .tour-step-lang (always present in navbar) and .tour-step-word (needs poem data).
        let attempts = 0;
        const maxAttempts = 30; // 30 * 500ms = 15 seconds max wait

        const interval = setInterval(() => {
            attempts++;
            const langEl = document.querySelector(".tour-step-lang");
            const alignEl = document.querySelector(".tour-step-align");

            // Start tour once at least the navbar and reader toolbar are rendered
            if (langEl && alignEl) {
                clearInterval(interval);
                setSteps(buildSteps());
                setRun(true);
            } else if (attempts >= maxAttempts) {
                // Fallback: start anyway even if some elements didn't load
                clearInterval(interval);
                setSteps(buildSteps());
                setRun(true);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [buildSteps]);

    const handleJoyrideCallback = (data: EventData) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

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
                options: {
                    arrowColor: "#fff",
                    backgroundColor: "#fff",
                    primaryColor: "#800000",
                    textColor: "#333",
                    zIndex: 1000,
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
                }
            }}
        />
    );
};
