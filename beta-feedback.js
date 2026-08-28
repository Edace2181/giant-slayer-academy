(() => {
    "use strict";

    const form = document.getElementById("betaFeedbackForm");
    const status = document.getElementById("feedbackStatus");
    const feedbackFields = [
        "workedWell",
        "confusing",
        "bugDescription",
        "reproductionSteps",
        "suggestions"
    ];

    function valueOf(id) {
        return document.getElementById(id).value.trim();
    }

    function formatField(label, value) {
        return `${label}:\n${value || "Not provided"}`;
    }

    function buildFeedbackEmail() {
        const lines = [
            "Giant Slayer Academy Beta Feedback",
            "==================================",
            "",
            formatField("Name or nickname", valueOf("testerName")),
            "",
            formatField("Email", valueOf("testerEmail")),
            "",
            formatField("Certification", valueOf("certification")),
            "",
            formatField("Device", valueOf("device")),
            "",
            formatField("Browser", valueOf("browser")),
            "",
            formatField("Area tested", valueOf("areaTested")),
            "",
            formatField("What worked well?", valueOf("workedWell")),
            "",
            formatField("What was confusing?", valueOf("confusing")),
            "",
            formatField("Bug description", valueOf("bugDescription")),
            "",
            formatField("Steps to reproduce", valueOf("reproductionSteps")),
            "",
            formatField("Suggestions for improvement", valueOf("suggestions")),
            "",
            "Submitted from the Giant Slayer Academy Beta Feedback Portal."
        ];

        const subject = encodeURIComponent("Giant Slayer Academy Beta Feedback");
        const body = encodeURIComponent(lines.join("\n"));
        return `mailto:?subject=${subject}&body=${body}`;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.reportValidity()) {
            status.textContent = "Please complete the required testing details.";
            return;
        }

        const hasFeedback = feedbackFields.some((id) => valueOf(id));
        if (!hasFeedback) {
            status.textContent = "Please provide at least one feedback response.";
            document.getElementById(feedbackFields[0]).focus();
            return;
        }

        status.textContent = "Opening your email application. Review the draft and press Send.";
        window.location.href = buildFeedbackEmail();
    });

    form.addEventListener("reset", () => {
        status.textContent = "Form cleared.";
    });

    window.GiantSlayerBetaFeedback = Object.freeze({
        buildFeedbackEmail
    });
})();
