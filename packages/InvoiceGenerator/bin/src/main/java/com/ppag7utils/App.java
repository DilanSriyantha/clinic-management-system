package com.ppag7utils;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.Scanner;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ppag7utils.Models.Appointment;
import com.ppag7utils.Models.Invoice;
import com.ppag7utils.Models.Prescription;
import com.ppag7utils.Utils.Callback;
import com.ppag7utils.Utils.PdfUtility;

public class App {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        while (sc.hasNextLine()) {
            String input = sc.nextLine();
            processInput(input);
        }

        sc.close();
    }

    private static void processInput(String input) {
        if (input.startsWith("generateInvoice")) {
            String json = input.replace("generateInvoice:", "").trim();
            generateInvoice(json);
            return;
        }

        if (input.startsWith("generateReport")) {
            String imagePath = input.replace("generateReport:", "").trim();
            generateReport(imagePath);
            return;
        }

        if(input.startsWith("generatePrescription")) {
            String json = input.replace("generatePrescription:", "").trim();
            generatePrescription(json);
            return;
        }

        if(input.startsWith("generateAppointment")) {
            String json = input.replace("generateAppointment:", "").trim();
            generateAppointment(json);
            return;
        }
    }

    private static void generateInvoice(String json) {
        ObjectMapper mapper = new ObjectMapper();
        Invoice invoice = null;
        try {
            invoice = mapper.readValue(json, Invoice.class);
        } catch (Exception e) {
            System.err.println("Error occurred while generating pdf file." + e.getMessage());
        }

        Path path = Paths.get("").toAbsolutePath();

        PdfUtility pdfUtility = new PdfUtility();
        pdfUtility.generateInvoicePdf(
            invoice, path.toString() + "\\InvoiceFiles",
            "/" + new Date(System.currentTimeMillis()).getTime() + ".pdf", 
            new Callback<String>() {
                @Override
                public void onSuccess(String data) {
                    System.out.println(data);
                }

                @Override
                public void onFailure(Exception e) {
                    System.err.println("Error occurred while generating pdf file." + e.getMessage());
                }
            }
        );
    }

    private static void generateReport(String imagePath) {
        Path path = Paths.get("").toAbsolutePath();

        String filePath = path.toString() + "\\ReportFiles";
        String fileName = "/" + new Date(System.currentTimeMillis()).getTime() + ".pdf";

        PdfUtility pdfUtility = new PdfUtility();
        pdfUtility.generateReportPdf(imagePath, filePath, fileName, new Callback<String>() {
            @Override
            public void onSuccess(String data) {
                System.out.println(data);
            }

            @Override
            public void onFailure(Exception e) {
                System.err.println("Error occurred while generating pdf file. " + e.getMessage());
            }
        });
    }

    private static void generatePrescription(String json) {
        ObjectMapper mapper = new ObjectMapper();
        Prescription prescription = null;
        try{
            prescription = mapper.readValue(json, Prescription.class);
        }catch(Exception e){
            System.err.println("Error occurred while generating pdf file. " + e.getMessage());
        }

        Path path = Paths.get("").toAbsolutePath();

        PdfUtility pdfUtility = new PdfUtility();
        pdfUtility.generatePrescriptionPdf(
            prescription, path.toString() + "\\PrescriptionFiles", "/" + new Date(System.currentTimeMillis()).getTime() + ".pdf", new Callback<String>() {
                @Override
                public void onSuccess(String data) {
                    System.out.println(data);
                }

                @Override
                public void onFailure(Exception e) {
                    System.err.println("Error occurred while generating pdf file. " + e.getMessage());
                }
            }
        );
    }

    private static void generateAppointment(String json) {
        ObjectMapper mapper = new ObjectMapper();
        Appointment appointment = null;
        try{
            appointment = mapper.readValue(json, Appointment.class);
        }catch(Exception e) {
            System.err.println("Error occurred while generating pdf file. " + e.getMessage());
        }

        Path path = Paths.get("").toAbsolutePath();

        PdfUtility pdfUtility = new PdfUtility();
        pdfUtility.generateAppointmentPdf(
            appointment, 
            path.toString() + "\\AppointmentFiles",
            "/" + new Date(System.currentTimeMillis()).getTime() + ".pdf",
            new Callback<String>() {
                @Override
                public void onSuccess(String data) {
                    System.out.println(data);
                }

                @Override
                public void onFailure(Exception e) {
                    System.err.println("Error occurred while generating pdf file. " + e.getMessage());
                }
            }
        );
    }
} 
