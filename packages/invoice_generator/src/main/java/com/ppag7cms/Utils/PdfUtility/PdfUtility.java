package com.ppag7cms.Utils.PdfUtility;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.ppag7cms.Helpers.FileHelper;
import com.ppag7cms.Models.Invoice;

public class PdfUtility {
    
    public PdfUtility() {

    }

    public void generateInvoicePdf(Invoice invoice, String filePath, String fileName, Callback<File> callback) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                
            }
        });
    }

    private static class InvoicePdf {
        
        private final Invoice invoice;
        private final String filePath;
        private final String fileName;

        public InvoicePdf(Invoice invoice, String filePath, String fileName) {
            this.invoice = invoice;
            this.filePath = filePath;
            this.fileName = fileName.replaceAll("[:|?*<\">+\\[\\]/']", "_");
        }

        public void generate() throws FileNotFoundException, IOException {
            File file = FileHelper.createEmptyFile(filePath, fileName);

            FileOutputStream fos = new FileOutputStream(file);

            final PdfWriter writer = new PdfWriter(fileName);

            PdfDocument pdfDocument = new PdfDocument(writer);

            Document document = new Document(pdfDocument);


        }

        private static class PdfPageEventListener extends PdfPageEventHelper {
            Font font = new Font(Font.FontFamily.UNDEFINED, 9.f, 1);

            public PdfPageEventListener() {}

            @Override
            public void onEndPage(com.itextpdf.text.pdf.PdfWriter writer, com.itextpdf.text.Document document) {
                PdfContentByte cb = writer.getDirectContent();
                Phrase footer = new Phrase("POWERED BY DTECH SOLUTIONS LTD. | info.dtechsolutionsltd@gmail.com | +94 76 488 6903", font);
                ColumnText.showTextAligned(cb, 1, footer, document.leftMargin() + ((document.right() - document
                .left()) / 2.f), document.bottom() - 10.f, 0.f);
            }
        }
    }
}
