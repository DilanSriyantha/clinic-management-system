package com.ppag7cms;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ppag7cms.Models.Invoice;

public class App 
{
    public static void main( String[] args )
    {
        // String json = args[0];

        String json = "{\r\n" + //
                        "    \"id\": 1,\r\n" + //
                        "    \"number\": 2,\r\n" + //
                        "    \"date\": \"2025-04-23\",\r\n" + //
                        "    \"subTotal\": 35.0,\r\n" + //
                        "    \"pharmacistId\": 1,\r\n" + //
                        "    \"pharmacistName\": \"Dilan Sriyantha\",\r\n" + //
                        "    \"createdAt\": \"2025-04-23T15:11:10.329+00:00\",\r\n" + //
                        "    \"updatedAt\": \"2025-04-23T15:11:10.329+00:00\",\r\n" + //
                        "    \"records\": [\r\n" + //
                        "        {\r\n" + //
                        "            \"id\": 2,\r\n" + //
                        "            \"invoiceId\": 2,\r\n" + //
                        "            \"invoiceNumber\": 2,\r\n" + //
                        "            \"itemId\": 1,\r\n" + //
                        "            \"itemCaption\": \"Panadol\",\r\n" + //
                        "            \"itemSellingPrice\": null,\r\n" + //
                        "            \"quantity\": 5,\r\n" + //
                        "            \"total\": 35.0,\r\n" + //
                        "            \"createdAt\": \"2025-04-23T15:11:25.537+00:00\",\r\n" + //
                        "            \"updatedAt\": \"2025-04-23T15:11:25.537+00:00\"\r\n" + //
                        "        },\r\n" + //
                        "        {\r\n" + //
                        "            \"id\": 3,\r\n" + //
                        "            \"invoiceId\": 2,\r\n" + //
                        "            \"invoiceNumber\": 2,\r\n" + //
                        "            \"itemId\": 1,\r\n" + //
                        "            \"itemCaption\": \"Panadol\",\r\n" + //
                        "            \"itemSellingPrice\": null,\r\n" + //
                        "            \"quantity\": 5,\r\n" + //
                        "            \"total\": 35.0,\r\n" + //
                        "            \"createdAt\": \"2025-04-23T15:11:25.537+00:00\",\r\n" + //
                        "            \"updatedAt\": \"2025-04-23T15:11:25.537+00:00\"\r\n" + //
                        "        }\r\n" + //
                        "    ]\r\n" + //
                        "}";

        if(json == null || json.isEmpty())
            System.out.println("Invalid");

        ObjectMapper mapper = new ObjectMapper();
        try {
            Invoice invoice = mapper.readValue(json, Invoice.class);
            System.out.println(invoice.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
