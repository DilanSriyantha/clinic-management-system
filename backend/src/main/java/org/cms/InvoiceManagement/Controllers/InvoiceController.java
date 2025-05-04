package org.cms.InvoiceManagement.Controllers;

import java.util.List;

import org.cms.InvoiceManagement.DTOs.InvoiceCreateRequest;
import org.cms.InvoiceManagement.DTOs.InvoiceDto;
import org.cms.InvoiceManagement.DTOs.SalesSummary;
import org.cms.InvoiceManagement.DTOs.SalesTrendDto;
import org.cms.InvoiceManagement.DTOs.TopSaleDto;
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

    @GetMapping("/searchByNumber")
    public @ResponseBody ResponseEntity<Page<InvoiceDto>> handleSearchByNumber(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(invoiceService.searchByNumber(page, pageSize, searchKey));
    }

    @GetMapping("/searchByDate")
    public @ResponseBody ResponseEntity<Page<InvoiceDto>> handleSearchByDate(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(invoiceService.searchByDate(page, pageSize, searchKey));
    }

    @GetMapping("/searchByCreatorName")
    public @ResponseBody ResponseEntity<Page<InvoiceDto>> handleSearchByCreatorName(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(invoiceService.searchByCreatorName(page, pageSize, searchKey));
    }

    @PostMapping("/create")
    public @ResponseBody ResponseEntity<BasicResultSet> handleCreate(@RequestBody InvoiceCreateRequest request) {
        return ResponseEntity.ok(invoiceService.create(request));
    }
    
    @DeleteMapping("/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> handleDelete(@RequestParam int invoiceId) {
        return ResponseEntity.ok(invoiceService.delete(invoiceId));
    } 

    @DeleteMapping("/deleteBatch")
    public @ResponseBody ResponseEntity<BasicResultSet> handleDeletebatch(@RequestBody int[] selectedIds) {
        return ResponseEntity.ok(invoiceService.deleteBatch(selectedIds));
    }

    @GetMapping("/getSalesTrend")
    public @ResponseBody ResponseEntity<List<SalesTrendDto>> handleGetSalesTrend(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok(invoiceService.getSalesTrend(startDate, endDate));
    }

    @GetMapping("/getTop5Sales")
    public @ResponseBody ResponseEntity<List<TopSaleDto>> handleGetTop5Sales(@RequestParam String startDate, @RequestParam String endDate){
        return ResponseEntity.ok(invoiceService.getTopSalesUpto5(startDate, endDate));
    }

    @GetMapping("/getSalesSummary")
    public @ResponseBody ResponseEntity<SalesSummary> handleGetSalesSummary(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok(invoiceService.getSalesSummary(startDate, endDate));
    }
}
