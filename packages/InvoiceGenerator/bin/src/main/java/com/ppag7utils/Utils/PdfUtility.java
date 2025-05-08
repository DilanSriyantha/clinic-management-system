package com.ppag7utils.Utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Date;
import java.text.SimpleDateFormat;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageInputStream;
import javax.imageio.stream.ImageOutputStream;

import java.awt.image.BufferedImage;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfWriter;
import com.ppag7utils.Helpers.FileHelper;
import com.ppag7utils.Models.Appointment;
import com.ppag7utils.Models.Invoice;
import com.ppag7utils.Models.Prescription;

public class PdfUtility {

    public PdfUtility() {
    }

    public void generateInvoicePdf(Invoice invoice, String filePath, String fileName, Callback<String> callback) {
        new Thread(() -> {
            String validFilename = fileName.replaceAll("[:|?*<\">+\\[\\]/']", "_");

            File file = FileHelper.createEmptyFile(filePath, validFilename);

            FileOutputStream fos = null;
            try {
                fos = new FileOutputStream(file);
            } catch (IOException e) {
                callback.onFailure(e);
            }

            InvoicePdf invoicePdf = new InvoicePdf(invoice, fos);
            invoicePdf.generate(new Callback<Boolean>() {
                @Override
                public void onSuccess(Boolean data) {
                    callback.onSuccess(file.getAbsolutePath());    
                }

                @Override
                public void onFailure(Exception e) {
                    callback.onFailure(e);
                }
            });
        }).start();
    }

    public void generateReportPdf(String imagePath, String filePath, String fileName, Callback<String> callback) {
        new Thread(() -> {
            File file = FileHelper.createEmptyFile(filePath, fileName);

            FileOutputStream fos = null;
            try{
                fos = new FileOutputStream(file);
            }catch(IOException e) {
                callback.onFailure(e);
            }

            if(fos == null) {
                callback.onFailure(new Exception("Could not create FileOutputStream"));
                return;
            }

            ReportPdf reportPdf = new ReportPdf(imagePath, fos);
            reportPdf.generate(new Callback<Boolean>() {
                @Override
                public void onSuccess(Boolean data) {
                    callback.onSuccess(file.getAbsolutePath());
                }

                @Override
                public void onFailure(Exception e) {
                    callback.onFailure(e);
                }
            });
        }).start();
    }

    public void generatePrescriptionPdf(Prescription prescription, String filePath, String fileName, Callback<String> callback) {
        new Thread(() -> {
            File file = FileHelper.createEmptyFile(filePath, fileName);

            FileOutputStream fos = null;
            try{
                fos = new FileOutputStream(file);
            }catch(IOException e){
                callback.onFailure(e);
            }

            if(fos == null) {
                callback.onFailure(new Exception("Could not create FileOutpuStream"));
                return;
            }

            PrescriptionPdf prescriptionPdf = new PrescriptionPdf(fos, prescription);
            prescriptionPdf.generate(new Callback<Boolean>() {
                @Override
                public void onSuccess(Boolean data) {
                    callback.onSuccess(file.getAbsolutePath());
                }

                @Override
                public void onFailure(Exception e) {
                    callback.onFailure(e);
                }
            });
        }).start();
    }
    
    public void generateAppointmentPdf(Appointment appointment, String filePath, String fileName, Callback<String> callback) {
        new Thread(() -> {
            File file = FileHelper.createEmptyFile(filePath, fileName);
            
            FileOutputStream fos = null;
            try{
                fos = new FileOutputStream(file);
            }catch(Exception e) {
                callback.onFailure(e);
            }

            if(fos == null) {
                callback.onFailure(new Exception("Could not create FileOutputStream"));
                return;
            }

            AppointmentPdf appointmentPdf = new AppointmentPdf(fos, appointment);
            appointmentPdf.generate(new Callback<Boolean>() {
                @Override
                public void onSuccess(Boolean data) {
                    callback.onSuccess(file.getAbsolutePath());
                }

                @Override
                public void onFailure(Exception e) {
                    callback.onFailure(e);
                }
            });
        }).start();
    }

    private static class InvoicePdf {

        private final Invoice invoice;
        private final FileOutputStream fos;

        public InvoicePdf(Invoice invoice, FileOutputStream fos) {
            this.invoice = invoice;
            this.fos = fos;
        }

        public void generate(Callback<Boolean> callback) {
            try{
                Document document = new Document(PageSize.A7, 0.f, 0.f, 5.f, 5.f);
    
                final PdfWriter writer = PdfWriter.getInstance(document, fos);
                writer.setPageEvent(new InvoicePdf.PdfPageEventListener());
    
                document.open();
    
                BaseFont titleBaseFont = BaseFont.createFont(BaseFont.HELVETICA_BOLD, "Cp1252", false);
                BaseFont contentBaseFont = BaseFont.createFont(BaseFont.HELVETICA, "Cp1252", false);
    
                Font contentFont = new Font(contentBaseFont, 8.f);
    
                PdfPTable titleTable = new PdfPTable(2);
                titleTable.setWidthPercentage(90.f);
                titleTable.setWidths(new float[] { 30.f, 60.f });
    
                Image logoImg = resourceToImage("logo.png");
                logoImg.setAlignment(0);
                logoImg.scaleAbsoluteHeight(50.f);
                logoImg.scaleAbsoluteWidth(50.f);
                logoImg.scalePercent(10.f);
                logoImg.setAbsolutePosition(0.f, document.getPageSize().getHeight() - 110.f);
    
                Phrase title = new Phrase("Organization ABC");
                title.setFont(new Font(titleBaseFont));
    
                Phrase contactInfo = new Phrase("Telephone: +94 76 488 6903\nAddress: No:1/3, Grove st., LA");
                contactInfo.setFont(contentFont);
    
                PdfPCell logoCell = new PdfPCell(logoImg);
                logoCell.setBorderWidthLeft(0);
                logoCell.setBorderWidthRight(0);
                logoCell.setVerticalAlignment(Element.ALIGN_CENTER);
                logoCell.setHorizontalAlignment(Element.ALIGN_CENTER);
    
                PdfPCell titleCell = new PdfPCell();
                titleCell.setBorderWidthLeft(0);
                titleCell.setBorderWidthRight(0);
                titleCell.addElement(title);
                titleCell.addElement(contactInfo);
                titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                titleCell.setVerticalAlignment(Element.ALIGN_CENTER);
    
                titleTable.addCell(logoCell);
                titleTable.addCell(titleCell);
    
                document.add(titleTable);
    
                PdfPTable invoiceTitleTable = new PdfPTable(1);
                invoiceTitleTable.setWidthPercentage(15.f);
                invoiceTitleTable.setSpacingBefore(5.f);
    
                Phrase invoiceTitle = new Phrase("Invoice", contentFont);
    
                PdfPCell invoiceTitleCell = new PdfPCell(invoiceTitle);
                invoiceTitleCell.setBorderWidthTop(0);
                invoiceTitleCell.setBorderWidthLeft(0);
                invoiceTitleCell.setBorderWidthRight(0);
                invoiceTitleCell.setHorizontalAlignment(1);
    
                invoiceTitleTable.addCell(invoiceTitleCell);
    
                document.add(invoiceTitleTable);
    
                PdfPTable invoiceInfoTable = new PdfPTable(2);
                invoiceInfoTable.setWidthPercentage(90.f);
                invoiceInfoTable.setWidths(new float[] { 30.f, 70.f });
                invoiceInfoTable.setSpacingBefore(5.f);
    
                Phrase infoProperty1 = new Phrase("Invoice No.", contentFont);
                Phrase infoProperty2 = new Phrase("Date/Time", contentFont);
                Phrase infoProperty3 = new Phrase("Patient Name", contentFont);
                Phrase infoProperty4 = new Phrase("Issued User", contentFont);
    
                Phrase infoField1 = new Phrase(String.valueOf(invoice.getNumber()), contentFont);
                Phrase infoField2 = new Phrase(
                        new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(new Date(invoice.getCreatedAt().getTime())),
                        contentFont);
                Phrase infoField3 = new Phrase(invoice.getPatientName(), contentFont);
                Phrase infoField4 = new Phrase(invoice.getPharmacistName(), contentFont);
    
                PdfPCell infoPropertyCell1 = new PdfPCell(infoProperty1);
                infoPropertyCell1.setBorder(0);
                infoPropertyCell1.setHorizontalAlignment(Element.ALIGN_LEFT);
    
                PdfPCell infoPropertyCell2 = new PdfPCell(infoProperty2);
                infoPropertyCell2.setBorder(0);
                infoPropertyCell2.setHorizontalAlignment(Element.ALIGN_LEFT);
    
                PdfPCell infoPropertyCell3 = new PdfPCell(infoProperty3);
                infoPropertyCell3.setBorder(0);
                infoPropertyCell3.setHorizontalAlignment(Element.ALIGN_LEFT);
    
                PdfPCell infoPropertyCell4 = new PdfPCell(infoProperty4);
                infoPropertyCell4.setBorder(0);
                infoPropertyCell4.setHorizontalAlignment(Element.ALIGN_LEFT);
    
                PdfPCell infoCell1 = new PdfPCell(infoField1);
                infoCell1.setBorder(0);
                infoCell1.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                PdfPCell infoCell2 = new PdfPCell(infoField2);
                infoCell2.setBorder(0);
                infoCell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                PdfPCell infoCell3 = new PdfPCell(infoField3);
                infoCell3.setBorder(0);
                infoCell3.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                PdfPCell infoCell4 = new PdfPCell(infoField4);
                infoCell4.setBorder(0);
                infoCell4.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                invoiceInfoTable.addCell(infoPropertyCell1);
                invoiceInfoTable.addCell(infoCell1);
                invoiceInfoTable.addCell(infoPropertyCell2);
                invoiceInfoTable.addCell(infoCell2);
                invoiceInfoTable.addCell(infoPropertyCell3);
                invoiceInfoTable.addCell(infoCell3);
                invoiceInfoTable.addCell(infoPropertyCell4);
                invoiceInfoTable.addCell(infoCell4);
    
                document.add(invoiceInfoTable);
    
                PdfPTable itemsTable = new PdfPTable(5);
                itemsTable.setWidthPercentage(90.f);
                itemsTable.setWidths(new float[] { 10.f, 40.f, 20.f, 20.f, 20.f });
                itemsTable.setSpacingBefore(5.f);
    
                Phrase colHeader1 = new Phrase("#", contentFont);
                Phrase colHeader2 = new Phrase("Drug Item", contentFont);
                Phrase colHeader3 = new Phrase("Qty", contentFont);
                Phrase colHeader4 = new Phrase("Unit", contentFont);
                Phrase colHeader5 = new Phrase("Amount", contentFont);
    
                PdfPCell headerCell1 = new PdfPCell(colHeader1);
                headerCell1.setBorderWidthLeft(0);
                headerCell1.setBorderWidthRight(0);
                headerCell1.setHorizontalAlignment(Element.ALIGN_LEFT);
    
                PdfPCell headerCell2 = new PdfPCell(colHeader2);
                headerCell2.setBorderWidthLeft(0);
                headerCell2.setBorderWidthRight(0);
                headerCell2.setHorizontalAlignment(Element.ALIGN_LEFT);
    
                PdfPCell headerCell3 = new PdfPCell(colHeader3);
                headerCell3.setBorderWidthLeft(0);
                headerCell3.setBorderWidthRight(0);
                headerCell3.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                PdfPCell headerCell4 = new PdfPCell(colHeader4);
                headerCell4.setBorderWidthLeft(0);
                headerCell4.setBorderWidthRight(0);
                headerCell4.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                PdfPCell headerCell5 = new PdfPCell(colHeader5);
                headerCell5.setBorderWidthLeft(0);
                headerCell5.setBorderWidthRight(0);
                headerCell5.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                itemsTable.addCell(headerCell1);
                itemsTable.addCell(headerCell2);
                itemsTable.addCell(headerCell3);
                itemsTable.addCell(headerCell4);
                itemsTable.addCell(headerCell5);
    
                for (int i = 0; i < invoice.getRecords().size(); i++) {
                    Phrase recordNumber = new Phrase(String.valueOf(i + 1), contentFont);
                    Phrase drugItem = new Phrase(invoice.getRecords().get(i).getdescription(), contentFont);
                    Phrase qty = new Phrase(String.valueOf(invoice.getRecords().get(i).getQuantity()), contentFont);
                    Phrase unit = new Phrase(String.valueOf(invoice.getRecords().get(i).getunitPrice()),
                            contentFont);
                    Phrase amount = new Phrase(String.valueOf(invoice.getRecords().get(i).getTotal()), contentFont);
    
                    PdfPCell recordNumberCell = new PdfPCell(recordNumber);
                    recordNumberCell.setBorder(0);
                    recordNumberCell.setHorizontalAlignment(Element.ALIGN_LEFT);
    
                    PdfPCell drugItemCell = new PdfPCell(drugItem);
                    drugItemCell.setBorder(0);
                    drugItemCell.setHorizontalAlignment(Element.ALIGN_LEFT);
    
                    PdfPCell qtyCell = new PdfPCell(qty);
                    qtyCell.setBorder(0);
                    qtyCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                    PdfPCell unitCell = new PdfPCell(unit);
                    unitCell.setBorder(0);
                    unitCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                    PdfPCell amountCell = new PdfPCell(amount);
                    amountCell.setBorder(0);
                    amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                    itemsTable.addCell(recordNumberCell);
                    itemsTable.addCell(drugItemCell);
                    itemsTable.addCell(qtyCell);
                    itemsTable.addCell(unitCell);
                    itemsTable.addCell(amountCell);
                }
    
                document.add(itemsTable);
    
                PdfPTable subTotalTable = new PdfPTable(2);
                subTotalTable.setSpacingBefore(5.f);
                subTotalTable.setWidthPercentage(90.f);
                subTotalTable.setWidths(new float[] { 60.f, 30.f });
    
                Phrase stProperty1 = new Phrase("Sub Total", contentFont);
                Phrase stProperty2 = new Phrase("Paid", contentFont);
                Phrase stProperty3 = new Phrase("Balance", contentFont);
    
                Phrase stValue1 = new Phrase(String.valueOf(invoice.getSubTotal()), contentFont);
                Phrase stValue2 = new Phrase(String.valueOf(invoice.getPaidAmount()), contentFont);
                Phrase stValue3 = new Phrase(String.valueOf(invoice.getPaidAmount() - invoice.getSubTotal()), contentFont);
    
                PdfPCell stPropertyCell1 = new PdfPCell(stProperty1);
                stPropertyCell1.setBorderWidthBottom(0);
                stPropertyCell1.setBorderWidthLeft(0);
                stPropertyCell1.setBorderWidthRight(0);
                stPropertyCell1.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                PdfPCell stPropertyCell2 = new PdfPCell(stProperty2);
                stPropertyCell2.setBorder(0);
                stPropertyCell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                PdfPCell stPropertyCell3 = new PdfPCell(stProperty3);
                stPropertyCell3.setBorderWidthTop(0);
                stPropertyCell3.setBorderWidthLeft(0);
                stPropertyCell3.setBorderWidthRight(0);
                stPropertyCell3.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                PdfPCell stValueCell1 = new PdfPCell(stValue1);
                stValueCell1.setBorderWidthBottom(0);
                stValueCell1.setBorderWidthLeft(0);
                stValueCell1.setBorderWidthRight(0);
                stValueCell1.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                PdfPCell stValueCell2 = new PdfPCell(stValue2);
                stValueCell2.setBorder(0);
                stValueCell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                PdfPCell stValueCell3 = new PdfPCell(stValue3);
                stValueCell3.setBorderWidthTop(0);
                stValueCell3.setBorderWidthLeft(0);
                stValueCell3.setBorderWidthRight(0);
                stValueCell3.setHorizontalAlignment(Element.ALIGN_RIGHT);
    
                subTotalTable.addCell(stPropertyCell1);
                subTotalTable.addCell(stValueCell1);
                subTotalTable.addCell(stPropertyCell2);
                subTotalTable.addCell(stValueCell2);
                subTotalTable.addCell(stPropertyCell3);
                subTotalTable.addCell(stValueCell3);
    
                document.add(subTotalTable);
    
                document.close();
                fos.close();
    
                callback.onSuccess(true);
            }catch(Exception e){
                callback.onFailure(e);
            }
        }

        private Image resourceToImage(String name) throws Exception {
            byte[] bytes = compress(name, .6f);

            return Image.getInstance(bytes);
        }

        private byte[] compress(String name, float quality) throws Exception {
            InputStream is = getClass().getClassLoader().getResourceAsStream(name);
            if (is == null)
                throw new Exception("Resource not found: " + name);

            BufferedImage bufferedImage = ImageIO.read(is);
            if (bufferedImage == null)
                throw new Exception("Failed to read image: " + name);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            ImageWriter jpgWriter = ImageIO.getImageWritersByFormatName("png").next();
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
            Font font = new Font(Font.FontFamily.UNDEFINED, 5.f, 1);

            public PdfPageEventListener() {
            }

            @Override
            public void onEndPage(PdfWriter writer, Document document) {
                PdfContentByte cb = writer.getDirectContent();
                Phrase footer = new Phrase("POWERED BY PPAG7", font);
                ColumnText.showTextAligned(cb, 1, footer, document.leftMargin() + ((document.right() - document
                        .left()) / 2.f), document.bottom() - 10.f, 0.f);
            }
        }
    }

    private static class ReportPdf {
        private final String imagePath;
        private final FileOutputStream fos;

        public ReportPdf(String imagePath, FileOutputStream fos) {
            this.imagePath = imagePath;
            this.fos = fos;
        }

        public void generate(Callback<Boolean> callback) {
            Image img = null;
            try{
                img = toImage(imagePath);
            }catch(Exception e) {
                e.printStackTrace();
                callback.onFailure(e);
            }

            Document document = new Document(PageSize.A4, 5.f, 5.f, 5.f, 5.f);

            PdfWriter writer = null;
            
            try {
                writer = PdfWriter.getInstance(document, fos);
            } catch (DocumentException e) {
                e.printStackTrace();
                callback.onFailure(e);
            }

            if(writer == null) {
                callback.onFailure(new Exception("Could not create pdfWriter"));
                return;
            }

            writer.setPageEvent(new ReportPdf.PdfPageEventListener());

            document.open();

            if(img == null){
                callback.onFailure(new Exception("Image not found."));
                return;
            }

            img.setAbsolutePosition(0, 0);
            img.scaleAbsoluteWidth(document.getPageSize().getWidth());    
            img.scaleAbsoluteHeight(document.getPageSize().getHeight()); 
            
            try {
                document.add(img);
            } catch (DocumentException e) {
                e.printStackTrace();
                callback.onFailure(e);
            }

            document.close();
            
            try{
                fos.close();
            }catch(IOException e) {
                e.printStackTrace();
                callback.onFailure(e);
            }

            callback.onSuccess(true);
        }

        private Image toImage(String imagePath) throws Exception {
            byte[] bytes = compress(imagePath, .6f);

            return Image.getInstance(bytes);
        }

        private byte[] compress(String imagePath, float quality) throws Exception {
            InputStream is = new FileInputStream(imagePath);
            ImageInputStream iis = ImageIO.createImageInputStream(is);

            if(iis == null)
                throw new Exception("Image not found " + imagePath);

            BufferedImage bufferedImage = ImageIO.read(iis);

            if(bufferedImage == null)
                throw new Exception("Failed to read image " + imagePath);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            ImageWriter writer = ImageIO.getImageWritersByFormatName("png").next();
            ImageWriteParam writeParam = writer.getDefaultWriteParam();
            writeParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            writeParam.setCompressionQuality(quality);

            ImageOutputStream ios = ImageIO.createImageOutputStream(baos);
            writer.setOutput(ios);
            writer.write(null, new IIOImage(bufferedImage, null, null), writeParam);

            writer.dispose();

            return baos.toByteArray();
        }

        private static class PdfPageEventListener extends PdfPageEventHelper {
            Font font = new Font(Font.FontFamily.UNDEFINED, 5.f, 1);

            public PdfPageEventListener() {
            }

            @Override
            public void onEndPage(PdfWriter writer, Document document) {
                PdfContentByte cb = writer.getDirectContent();
                Phrase footer = new Phrase("POWERED BY PPAG7", font);
                ColumnText.showTextAligned(cb, 1, footer, document.leftMargin() + ((document.right() - document
                        .left()) / 2.f), document.bottom() - 10.f, 0.f);
            }
        }
    }

    private static class PrescriptionPdf {
        private final FileOutputStream fos;
        private final Prescription prescription;

        public PrescriptionPdf(FileOutputStream fos, Prescription prescription) {
            this.fos = fos;
            this.prescription = prescription;
        }

        public void generate(Callback<Boolean> callback) {
            try{
                Document document = new Document(PageSize.A7, 0.f, 0.f, 5.f, 5.f);
    
                final PdfWriter pdfWriter = PdfWriter.getInstance(document, fos);
                
                if(pdfWriter == null){
                    callback.onFailure(new Exception("Could not create PdfWriter"));
                    return;
                }
                
                pdfWriter.setPageEvent(new PrescriptionPdf.PdfPageEventListener());
    
                document.open();
    
                BaseFont titleBaseFont = BaseFont.createFont(BaseFont.HELVETICA_BOLD, "Cp1252", false);
                BaseFont contentBaseFont = BaseFont.createFont(BaseFont.HELVETICA, "Cp1252", false);

                Font contentFont = new Font(contentBaseFont, 8.f);
                Font titleFont = new Font(titleBaseFont);

                PdfPTable titleTable = new PdfPTable(1);
                titleTable.setWidthPercentage(90.f);
                titleTable.setWidths(new float[] { 90.f });

                Phrase titlePhrase = new Phrase("Prescription", titleFont);

                PdfPCell titleCell = new PdfPCell(titlePhrase);
                titleCell.setBorderWidthTop(0);
                titleCell.setBorderWidthLeft(0);
                titleCell.setBorderWidthRight(0);
                titleCell.setHorizontalAlignment(1);

                titleTable.addCell(titleCell);

                document.add(titleTable);

                PdfPTable infoTable = new PdfPTable(2);
                infoTable.setSpacingBefore(10.f);
                infoTable.setWidthPercentage(90.f);
                infoTable.setWidths(new float[]{ 45.f, 45.f });

                Phrase prescriptionNumberKey = new Phrase("Prescription No.", contentFont);
                Phrase patientNameKey = new Phrase("Patient", contentFont);
                Phrase doctorNameKey = new Phrase("Doctor", contentFont);
                Phrase dateTimeKey = new Phrase("Date & Time", contentFont);

                Phrase prescriptionNumberValue = new Phrase(String.valueOf(prescription.getId()), contentFont);
                Phrase patientNameValue = new Phrase(prescription.getPatientName(), contentFont);
                Phrase doctorNameValue = new Phrase(prescription.getDoctorName(), contentFont);
                Phrase dateTimeValue = new Phrase(new SimpleDateFormat("yyyy/MM/dd h:mm a").format(new Date(prescription.getUpdatedAt().getTime())), contentFont);

                PdfPCell prescriptionNumberKeyCell = new PdfPCell(prescriptionNumberKey);
                prescriptionNumberKeyCell.setBorderWidthTop(0);
                prescriptionNumberKeyCell.setBorderWidthLeft(0);
                prescriptionNumberKeyCell.setBorderWidthRight(0);
                prescriptionNumberKeyCell.setBorderWidthBottom(0);
                prescriptionNumberKeyCell.setHorizontalAlignment(Element.ALIGN_LEFT);

                PdfPCell patientNameKeyCell = new PdfPCell(patientNameKey);
                patientNameKeyCell.setBorderWidthTop(0);
                patientNameKeyCell.setBorderWidthLeft(0);
                patientNameKeyCell.setBorderWidthRight(0);
                patientNameKeyCell.setBorderWidthBottom(0);
                patientNameKeyCell.setHorizontalAlignment(Element.ALIGN_LEFT);

                PdfPCell doctorNameKeyCell = new PdfPCell(doctorNameKey);
                doctorNameKeyCell.setBorderWidthTop(0);
                doctorNameKeyCell.setBorderWidthLeft(0);
                doctorNameKeyCell.setBorderWidthRight(0);
                doctorNameKeyCell.setBorderWidthBottom(0);
                doctorNameKeyCell.setHorizontalAlignment(Element.ALIGN_LEFT);

                PdfPCell dateTimeKeyCell = new PdfPCell(dateTimeKey);
                dateTimeKeyCell.setBorderWidthTop(0);
                dateTimeKeyCell.setBorderWidthLeft(0);
                dateTimeKeyCell.setBorderWidthRight(0);
                dateTimeKeyCell.setBorderWidthBottom(0);
                dateTimeKeyCell.setHorizontalAlignment(Element.ALIGN_LEFT);

                PdfPCell prescriptionNumberValueCell = new PdfPCell(prescriptionNumberValue);
                prescriptionNumberValueCell.setBorderWidthTop(0);
                prescriptionNumberValueCell.setBorderWidthLeft(0);
                prescriptionNumberValueCell.setBorderWidthRight(0);
                prescriptionNumberValueCell.setBorderWidthBottom(0);
                prescriptionNumberValueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

                PdfPCell patientNameValueCell = new PdfPCell(patientNameValue);
                patientNameValueCell.setBorderWidthTop(0);
                patientNameValueCell.setBorderWidthLeft(0);
                patientNameValueCell.setBorderWidthRight(0);
                patientNameValueCell.setBorderWidthBottom(0);
                patientNameValueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

                PdfPCell doctorNameValueCell = new PdfPCell(doctorNameValue);
                doctorNameValueCell.setBorderWidthTop(0);
                doctorNameValueCell.setBorderWidthLeft(0);
                doctorNameValueCell.setBorderWidthRight(0);
                doctorNameValueCell.setBorderWidthBottom(0);
                doctorNameValueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

                PdfPCell dateTimeValueCell = new PdfPCell(dateTimeValue);
                dateTimeValueCell.setBorderWidthTop(0);
                dateTimeValueCell.setBorderWidthLeft(0);
                dateTimeValueCell.setBorderWidthRight(0);
                dateTimeValueCell.setBorderWidthBottom(0);
                dateTimeValueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

                infoTable.addCell(prescriptionNumberKeyCell);
                infoTable.addCell(prescriptionNumberValueCell);
                infoTable.addCell(doctorNameKeyCell);
                infoTable.addCell(doctorNameValueCell);
                infoTable.addCell(patientNameKeyCell);
                infoTable.addCell(patientNameValueCell);
                infoTable.addCell(dateTimeKeyCell);
                infoTable.addCell(dateTimeValueCell);

                document.add(infoTable);

                PdfContentByte canvas = pdfWriter.getDirectContent();
                canvas.setLineWidth(.5f);
                canvas.moveTo(document.left() + 10.f, document.top() - 75.f);
                canvas.lineTo(document.right() - 10.f, document.top() - 75.f);
                canvas.stroke();

                PdfPTable prescriptionLinesTable = new PdfPTable(1);
                prescriptionLinesTable.setSpacingBefore(5.f);
                prescriptionLinesTable.setWidthPercentage(90.f);
                prescriptionLinesTable.setWidths(new float[] { 90.f });

                for(int i = 0; i < prescription.getPrescriptionLines().size(); i++) {
                    Phrase linePhrase = new Phrase((i+1) + " " + prescription.getPrescriptionLines().get(i).getDescription(), contentFont);

                    PdfPCell lineCell = new PdfPCell(linePhrase);
                    lineCell.setBorderWidthTop(0);
                    lineCell.setBorderWidthBottom(0);
                    lineCell.setBorderWidthLeft(0);
                    lineCell.setBorderWidthRight(0);
                    lineCell.setHorizontalAlignment(Element.ALIGN_LEFT);

                    prescriptionLinesTable.addCell(lineCell);
                }

                document.add(prescriptionLinesTable);

                document.close();
                fos.close();

                callback.onSuccess(true);
            }catch(Exception e){
                callback.onFailure(e);
            }
        }

        private static class PdfPageEventListener extends PdfPageEventHelper {
            Font font = new Font(Font.FontFamily.UNDEFINED, 5.f, 1);

            public PdfPageEventListener() {
            }

            @Override
            public void onEndPage(PdfWriter writer, Document document) {
                PdfContentByte cb = writer.getDirectContent();
                Phrase footer = new Phrase("POWERED BY PPAG7", font);
                ColumnText.showTextAligned(cb, 1, footer, document.leftMargin() + ((document.right() - document
                        .left()) / 2.f), document.bottom() - 10.f, 0.f);
            }
        }
    }

    private static class AppointmentPdf {
        private final FileOutputStream fos;
        private final Appointment appointment;

        public AppointmentPdf(FileOutputStream fos, Appointment appointment) {
            this.fos = fos;
            this.appointment = appointment;
        }

        public void generate(Callback<Boolean> callback) {
            try{
                Document document = new Document(PageSize.A7, 0.f, 0.f, 5.f, 5.f);

                final PdfWriter pdfWriter = PdfWriter.getInstance(document, fos);
                pdfWriter.setPageEvent(new AppointmentPdf.PdfPageEventListener());
    
                document.open();
    
                BaseFont titleBaseFont = BaseFont.createFont(BaseFont.HELVETICA_BOLD, "Cp1252", false);
                BaseFont contentBaseFont = BaseFont.createFont(BaseFont.HELVETICA, "Cp1252", false);
    
                Font contentFont = new Font(contentBaseFont, 8.f);
    
                PdfPTable titleTable = new PdfPTable(2);
                titleTable.setWidthPercentage(90.f);
                titleTable.setWidths(new float[] { 30.f, 60.f });
    
                Image logoImg = resourceToImage("logo.png");
                logoImg.setAlignment(0);
                logoImg.scaleAbsoluteHeight(50.f);
                logoImg.scaleAbsoluteWidth(50.f);
                logoImg.scalePercent(10.f);
                logoImg.setAbsolutePosition(0.f, document.getPageSize().getHeight() - 110.f);
    
                Phrase title = new Phrase("Organization ABC");
                title.setFont(new Font(titleBaseFont));
    
                Phrase contactInfo = new Phrase("Telephone: +94 76 488 6903\nAddress: No:1/3, Grove st., LA");
                contactInfo.setFont(contentFont);
    
                PdfPCell logoCell = new PdfPCell(logoImg);
                logoCell.setBorderWidthLeft(0);
                logoCell.setBorderWidthRight(0);
                logoCell.setVerticalAlignment(Element.ALIGN_CENTER);
                logoCell.setHorizontalAlignment(Element.ALIGN_CENTER);
    
                PdfPCell titleCell = new PdfPCell();
                titleCell.setBorderWidthLeft(0);
                titleCell.setBorderWidthRight(0);
                titleCell.addElement(title);
                titleCell.addElement(contactInfo);
                titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                titleCell.setVerticalAlignment(Element.ALIGN_CENTER);
    
                titleTable.addCell(logoCell);
                titleTable.addCell(titleCell);
    
                document.add(titleTable);

                PdfPTable infoTable = new PdfPTable(2);
                infoTable.setSpacingBefore(5.f);
                infoTable.setWidthPercentage(90.f);
                infoTable.setWidths(new float[]{ 45.f, 45.f });

                Phrase referenceIdKey = new Phrase("Reference ID", contentFont);
                Phrase patientKey = new Phrase("Patient", contentFont);
                Phrase clinicKey = new Phrase("Clinic", contentFont);
                Phrase doctorKey = new Phrase("Doctor", contentFont);
                Phrase queuePositionKey = new Phrase("Queue Position", contentFont);
                Phrase dateTimeKey = new Phrase("Date & Time", contentFont);

                Phrase referenceIdVal = new Phrase(appointment.getReferenceId(), contentFont);
                Phrase patientVal = new Phrase(appointment.getPatientName(), contentFont);
                Phrase clinicVal = new Phrase(appointment.getClinicName(), contentFont);
                Phrase doctorVal = new Phrase(appointment.getDoctorName(), contentFont);
                Phrase queuePositionVal = new Phrase(String.valueOf(appointment.getQueuePosition()), contentFont);
                Phrase dateTimeVal = new Phrase(new SimpleDateFormat("yyyy/MM/dd h:mm a").format(new Date(appointment.getUpdatedAt().getTime())), contentFont);

                PdfPCell referenceIdKeyCell = new PdfPCell(referenceIdKey);
                referenceIdKeyCell.setBorderWidthTop(0);
                referenceIdKeyCell.setBorderWidthBottom(0);
                referenceIdKeyCell.setBorderWidthLeft(0);
                referenceIdKeyCell.setBorderWidthRight(0);

                PdfPCell referenceIdValCell = new PdfPCell(referenceIdVal);
                referenceIdValCell.setBorderWidthTop(0);
                referenceIdValCell.setBorderWidthBottom(0);
                referenceIdValCell.setBorderWidthLeft(0);
                referenceIdValCell.setBorderWidthRight(0);
                
                PdfPCell patientKeyCell = new PdfPCell(patientKey);
                patientKeyCell.setBorderWidthTop(0);
                patientKeyCell.setBorderWidthBottom(0);
                patientKeyCell.setBorderWidthLeft(0);
                patientKeyCell.setBorderWidthRight(0);

                PdfPCell patientValCell = new PdfPCell(patientVal);
                patientValCell.setBorderWidthTop(0);
                patientValCell.setBorderWidthBottom(0);
                patientValCell.setBorderWidthLeft(0);
                patientValCell.setBorderWidthRight(0);

                PdfPCell doctorKeyCell = new PdfPCell(doctorKey);
                doctorKeyCell.setBorderWidthTop(0);
                doctorKeyCell.setBorderWidthBottom(0);
                doctorKeyCell.setBorderWidthLeft(0);
                doctorKeyCell.setBorderWidthRight(0);

                PdfPCell doctorValCell = new PdfPCell(doctorVal);
                doctorValCell.setBorderWidthTop(0);
                doctorValCell.setBorderWidthBottom(0);
                doctorValCell.setBorderWidthLeft(0);
                doctorValCell.setBorderWidthRight(0);

                PdfPCell clinicKeyCell = new PdfPCell(clinicKey);
                clinicKeyCell.setBorderWidthTop(0);
                clinicKeyCell.setBorderWidthBottom(0);
                clinicKeyCell.setBorderWidthLeft(0);
                clinicKeyCell.setBorderWidthRight(0);

                PdfPCell clinicValCell = new PdfPCell(clinicVal);
                clinicValCell.setBorderWidthTop(0);
                clinicValCell.setBorderWidthBottom(0);
                clinicValCell.setBorderWidthLeft(0);
                clinicValCell.setBorderWidthRight(0);

                PdfPCell queuePositionKeyCell = new PdfPCell(queuePositionKey);
                queuePositionKeyCell.setBorderWidthTop(0);
                queuePositionKeyCell.setBorderWidthBottom(0);
                queuePositionKeyCell.setBorderWidthLeft(0);
                queuePositionKeyCell.setBorderWidthRight(0);

                PdfPCell queuePositionValCell = new PdfPCell(queuePositionVal);
                queuePositionValCell.setBorderWidthTop(0);
                queuePositionValCell.setBorderWidthBottom(0);
                queuePositionValCell.setBorderWidthLeft(0);
                queuePositionValCell.setBorderWidthRight(0);

                PdfPCell dateTimeKeyCell = new PdfPCell(dateTimeKey);
                dateTimeKeyCell.setBorderWidthTop(0);
                dateTimeKeyCell.setBorderWidthBottom(0);
                dateTimeKeyCell.setBorderWidthLeft(0);
                dateTimeKeyCell.setBorderWidthRight(0);

                PdfPCell dateTimeValCell = new PdfPCell(dateTimeVal);
                dateTimeValCell.setBorderWidthTop(0);
                dateTimeValCell.setBorderWidthBottom(0);
                dateTimeValCell.setBorderWidthLeft(0);
                dateTimeValCell.setBorderWidthRight(0);

                infoTable.addCell(referenceIdKeyCell);
                infoTable.addCell(referenceIdValCell);
                infoTable.addCell(patientKeyCell);
                infoTable.addCell(patientValCell);
                infoTable.addCell(doctorKeyCell);
                infoTable.addCell(doctorValCell);
                infoTable.addCell(clinicKeyCell);
                infoTable.addCell(clinicValCell);
                infoTable.addCell(queuePositionKeyCell);
                infoTable.addCell(queuePositionValCell);
                infoTable.addCell(dateTimeKeyCell);
                infoTable.addCell(dateTimeValCell);
                
                document.add(infoTable);

                document.close();
                fos.close();

                callback.onSuccess(true);
            }catch(Exception e) {
                callback.onFailure(e);
            }
        }

        private Image resourceToImage(String name) throws Exception {
            byte[] bytes = compress(name, .6f);

            return Image.getInstance(bytes);
        }

        private byte[] compress(String name, float quality) throws Exception {
            InputStream is = getClass().getClassLoader().getResourceAsStream(name);
            if (is == null)
                throw new Exception("Resource not found: " + name);

            BufferedImage bufferedImage = ImageIO.read(is);
            if (bufferedImage == null)
                throw new Exception("Failed to read image: " + name);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            ImageWriter jpgWriter = ImageIO.getImageWritersByFormatName("png").next();
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
            Font font = new Font(Font.FontFamily.UNDEFINED, 5.f, 1);

            public PdfPageEventListener() {
            }

            @Override
            public void onEndPage(PdfWriter writer, Document document) {
                PdfContentByte cb = writer.getDirectContent();
                Phrase footer = new Phrase("POWERED BY PPAG7", font);
                ColumnText.showTextAligned(cb, 1, footer, document.leftMargin() + ((document.right() - document
                        .left()) / 2.f), document.bottom() - 10.f, 0.f);
            }
        }
    }
}
