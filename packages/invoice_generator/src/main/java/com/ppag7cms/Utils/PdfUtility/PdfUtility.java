package com.ppag7cms.Utils.PdfUtility;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import java.awt.image.BufferedImage;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfWriter;
import com.ppag7cms.Helpers.FileHelper;
import com.ppag7cms.Models.Invoice;
import com.ppag7cms.Utils.Callback;

public class PdfUtility {
    
    public PdfUtility() {

    }

    public void generateInvoicePdf(Invoice invoice, String filePath, String fileName, Callback<File> callback) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                String validFilename = fileName.replaceAll("[:|?*<\">+\\[\\]/']", "_");

                File file = FileHelper.createEmptyFile(filePath, validFilename);

                FileOutputStream fos = null;
                try{
                    fos = new FileOutputStream(file);
                }catch(IOException e) {
                    callback.onFailure(e);
                }

                InvoicePdf invoicePdf = new InvoicePdf(invoice, fos);
                try{
                    invoicePdf.generate();
                }catch(Exception e) {
                    callback.onFailure(e);
                }
            }
        });
    }

    private static class InvoicePdf {
        
        private final Invoice invoice;
        private final FileOutputStream fos;

        public InvoicePdf(Invoice invoice, FileOutputStream fos) {
            this.invoice = invoice;
            this.fos = fos;
        }

        public void generate() throws Exception {
            Document document = new Document(PageSize.A7);

            final PdfWriter writer = PdfWriter.getInstance(document, fos);
            writer.setPageEvent(new PdfPageEventListener());

            document.open();

            Rectangle headerRect = new Rectangle(
                1.f,
                document.getPageSize().getHeight() - 121.f,
                document.getPageSize().getWidth() - 1.f,
                document.getPageSize().getWidth() - 1.f
            );
            headerRect.setBorder(Rectangle.BOX);
            headerRect.setBorderWidth(1.f);
            headerRect.setBorderColor(BaseColor.BLACK);
            document.add(headerRect);

            Image logoImg = resourceToImage("logo.png");
            logoImg.setAlignment(0);
            logoImg.scaleAbsoluteHeight(50.f);
            logoImg.scaleAbsoluteWidth(50.f);
            logoImg.scalePercent(10.f);
            logoImg.setAbsolutePosition(0.f, document.getPageSize().getHeight() - 110.f);
            document.add(logoImg);

            BaseFont titleBaseFont = BaseFont.createFont(BaseFont.HELVETICA_BOLD, "Cp1252", false);
            BaseFont contentBaseFont = BaseFont.createFont(BaseFont.HELVETICA, "Cp1252", false);

            PdfContentByte organizationTitle = writer.getDirectContent();
            organizationTitle.saveState();
            organizationTitle.beginText();
            organizationTitle.moveText(0, 0);
            organizationTitle.setFontAndSize(titleBaseFont, 16.f);
            organizationTitle.showText("Organization Title");
            organizationTitle.endText();
            organizationTitle.restoreState();

            PdfContentByte
        }

        private Image resourceToImage(String name) throws Exception {
            byte[] bytes = compress(name, 60.f);

            return Image.getInstance(bytes);
        }

        private byte[] compress(String name, float quality) throws Exception {
            InputStream is = getClass().getResourceAsStream(name);
            if(is == null)
                throw new Exception("Resource not found: " + name );

            BufferedImage bufferedImage = ImageIO.read(is);
            if(bufferedImage == null)
                throw new Exception("Failed to read image: " + name);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            ImageWriter jpgWriter = ImageIO.getImageWritersByFormatName("jpg").next();
            ImageWriteParam jpgWriteParam = jpgWriter.getDefaultWriteParam();
            jpgWriteParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            jpgWriteParam.setCompressionQuality(quality);

            ImageOutputStream ios = ImageIO.createImageOutputStream(baos);
            jpgWriter.setOutput(ios);
            jpgWriter.write(null, new IIOImage(bufferedImage, null, null), jpgWriteParam);

            jpgWriter.dispose();

            return baos.toByteArray();
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
