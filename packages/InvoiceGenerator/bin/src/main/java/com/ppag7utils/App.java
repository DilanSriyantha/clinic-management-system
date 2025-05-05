package com.ppag7utils;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.Scanner;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ppag7utils.Models.Invoice;
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
            String json = input.substring(16, input.length());
            generateInvoice(json);
            return;
        }
    }

    private static void generateInvoice(String json) {
        ObjectMapper mapper = new ObjectMapper();
        Invoice invoice = null;
        try {
            invoice = mapper.readValue(json, Invoice.class);
        } catch (Exception e) {
            e.printStackTrace();
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
}
