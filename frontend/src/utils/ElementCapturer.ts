import html2canvas from "html2canvas";

export namespace ElementCapturer {
    export async function captureElementAsImage(elementId: string) {
        const element = document.getElementById(elementId);

        if(!element)
            throw new Error("Element not found.");

        const canvas = await html2canvas(element, {
            useCORS: true,
            backgroundColor: null
        });

        const base64 = canvas.toDataURL("image/png");
        return base64;
    }

    export async function captureElementAsImageA4(elementId: string) {
        const element = document.getElementById(elementId);

        if(!element)
            throw new Error("Element not found");

        const canvas = await html2canvas(element, {
            useCORS: true,
            backgroundColor: "#ffffff"
        });

        const base64 = canvas.toDataURL("image/png");

        return base64;
    }

    export async function exportElementToPdf(elementId: string) {
        const base64 = await captureElementAsImageA4(elementId);

        if(!base64)
            throw new Error("Error occurred while capturing the element.");

        return window.InvoiceGenerator.generateReportPdf(base64);
    }
};  