package org.cms.InvoiceManagement.Controllers;

import org.cms.InvoiceManagement.DTOs.InvoiceCreateRequest;
import org.cms.InvoiceManagement.DTOs.InvoiceDto;
import org.cms.InvoiceManagement.Services.InvoiceService;
import org.cms.Utils.BasicResultSet;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@Controller
@RequestMapping("/api/v1/invoice")
@RequiredArgsConstructor
public class InvoiceController {
    
    private final InvoiceService invoiceService;

    @GetMapping("/nextInvoiceNumber")
    public @ResponseBody ResponseEntity<Integer> handleGetInitInfo() {
        return ResponseEntity.ok(invoiceService.getNextInvoiceNumber());
    }
    
    @GetMapping("/page")
    public @ResponseBody ResponseEntity<Page<InvoiceDto>> handleGetPage(@RequestParam int page, @RequestParam int pageSize) {
        return ResponseEntity.ok(invoiceService.getPage(page, pageSize));
    }

    @PostMapping("/create")
    public @ResponseBody ResponseEntity<BasicResultSet> handleCreate(@RequestBody InvoiceCreateRequest request) {
        return ResponseEntity.ok(invoiceService.create(request));
    }
    
    @DeleteMapping("/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> handleDelete(@RequestParam int invoiceId) {
        return ResponseEntity.ok(invoiceService.delete(invoiceId));
    } 
}
