package org.cms.InvoiceRecordsManagement.Controllers;

import org.cms.InvoiceRecordsManagement.DTOs.InvoiceRecordCreateRequest;
import org.cms.InvoiceRecordsManagement.DTOs.InvoiceRecordDto;
import org.cms.InvoiceRecordsManagement.Services.InvoiceRecordService;
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
@RequestMapping("/api/v1/invoice-records")
@RequiredArgsConstructor
public class InvoiceRecordController {
    
    private final InvoiceRecordService invoiceRecordService;

    @GetMapping("/page")
    public @ResponseBody ResponseEntity<Page<InvoiceRecordDto>> handleGetPage(@RequestParam int page, @RequestParam int pageSize) {
        return ResponseEntity.ok(invoiceRecordService.getPage(page, pageSize));
    }
    
    @PostMapping("/create")
    public @ResponseBody ResponseEntity<BasicResultSet> handleCreate(@RequestBody InvoiceRecordCreateRequest request) {
        return ResponseEntity.ok(invoiceRecordService.create(request));
    }
    
    @DeleteMapping("/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> handleDelete(@RequestParam int recordId) {
        return ResponseEntity.ok(invoiceRecordService.delete(recordId));
    }
}
