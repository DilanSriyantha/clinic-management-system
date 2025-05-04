package org.cms.PharmacyStockManagement.Controllers;

import java.util.List;

import org.cms.PharmacyStockManagement.DTOs.ItemCreateRequest;
import org.cms.PharmacyStockManagement.DTOs.ItemDto;
import org.cms.PharmacyStockManagement.DTOs.StockArrivalTrendDto;
import org.cms.PharmacyStockManagement.DTOs.StockCreateRequest;
import org.cms.PharmacyStockManagement.DTOs.StockDto;
import org.cms.PharmacyStockManagement.DTOs.StockSummaryDto;
import org.cms.PharmacyStockManagement.DTOs.VendorWiseStockDistDto;
import org.cms.PharmacyStockManagement.Services.StockService;
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
import org.springframework.web.bind.annotation.PutMapping;

@Controller
@RequestMapping("/api/v1/pharmacy-stock-management")
@RequiredArgsConstructor
public class StockController {
    
    private final StockService stockService;
    
    @GetMapping("/items/page")
    public @ResponseBody ResponseEntity<Page<ItemDto>> handleGetItemsPage(@RequestParam int page, @RequestParam int pageSize) {
        return ResponseEntity.ok(stockService.getItemsPage(page, pageSize));
    }

    @GetMapping("/items/pageByStock")
    public @ResponseBody ResponseEntity<Page<ItemDto>> handleGetItemsPage(@RequestParam int page, @RequestParam int pageSize, @RequestParam int stockId) {
        return ResponseEntity.ok(stockService.getItemsPageByStock(page, pageSize, stockId));
    }

    @GetMapping("/items/getByItemCode")
    public @ResponseBody ResponseEntity<Page<ItemDto>> handleGetItemsByCode(@RequestParam int page, @RequestParam int pageSize, @RequestParam String itemCode) {
        return ResponseEntity.ok(stockService.getItemsByCode(page, pageSize, itemCode));
    }

    @GetMapping("/items/searchByCaption")
    public @ResponseBody ResponseEntity<Page<ItemDto>> handleSearchItemByCaption(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(stockService.searchItemByCaption(page, pageSize, searchKey));
    }
    
    @GetMapping("/items/searchByCategory")
    public @ResponseBody ResponseEntity<Page<ItemDto>> handleSearchItemByCategory(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(stockService.searchItemByCategory(page, pageSize, searchKey));
    }
    
    @GetMapping("/items/searchByForm")
    public @ResponseBody ResponseEntity<Page<ItemDto>> handleSearchItemByForm(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(stockService.searchItemByForm(page, pageSize, searchKey));
    }

    @GetMapping("/items/searchByStrength")
    public @ResponseBody ResponseEntity<Page<ItemDto>> handleSearchItemByStrength(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(stockService.searchItemByStrength(page, pageSize, searchKey));
    }

    @GetMapping("/stocks/page")
    public @ResponseBody ResponseEntity<Page<StockDto>> handleGetStocksPage(@RequestParam int page, @RequestParam int pageSize) {
        return ResponseEntity.ok(stockService.getStocksPage(page, pageSize));
    }

    @GetMapping("/stocks/searchByCaption")
    public @ResponseBody ResponseEntity<Page<StockDto>> handleSearchStockByCaption(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(stockService.searchStockByCaption(page, pageSize, "%" + searchKey + "%"));
    }

    @GetMapping("/stocks/searchByVendor")
    public @ResponseBody ResponseEntity<Page<StockDto>> handleSearchByVendor(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(stockService.searchStockByVendor(page, pageSize, searchKey));
    }

    @GetMapping("/stocks/searchByDate")
    public @ResponseBody ResponseEntity<Page<StockDto>> handleSearchByDate(@RequestParam int page, @RequestParam int pageSize, String searchKey) {
        return ResponseEntity.ok(stockService.searchStockByDate(page, pageSize, searchKey));
    }
    
    @PostMapping("/items/create")
    public @ResponseBody ResponseEntity<BasicResultSet> handleCreateItem(@RequestBody ItemCreateRequest request) {
        return ResponseEntity.ok(stockService.createItem(request));
    }

    @PostMapping("/stocks/create")
    public @ResponseBody ResponseEntity<BasicResultSet> handleCreateStock(@RequestBody StockCreateRequest request) {
        return ResponseEntity.ok(stockService.createStock(request));
    }

    @PutMapping("/items/update")
    public @ResponseBody ResponseEntity<BasicResultSet> handleUpdateItem(@RequestParam int itemId, @RequestBody ItemCreateRequest request) {
        return ResponseEntity.ok(stockService.updateItem(itemId, request));
    }

    @PutMapping("/stocks/update")
    public @ResponseBody ResponseEntity<BasicResultSet> handleUpdateStock(@RequestParam int stockId, @RequestBody StockCreateRequest request) {
        return ResponseEntity.ok(stockService.updateStock(stockId, request));
    }

    @DeleteMapping("/items/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> handleDeleteItem(@RequestParam int itemId) {
        return ResponseEntity.ok(stockService.deleteItem(itemId));
    }

    @DeleteMapping("/stocks/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> handleDeleteStock(@RequestParam int stockId) {
        return ResponseEntity.ok(stockService.deleteStock(stockId));
    }

    @DeleteMapping("/items/deleteBatch")
    public @ResponseBody ResponseEntity<BasicResultSet> handleDeleteItemsBatch(@RequestParam int stockId, @RequestBody int[] ids) {
        return ResponseEntity.ok(stockService.deleteItemsBatch(stockId, ids));
    }

    @DeleteMapping("/stocks/deleteBatch")
    public @ResponseBody ResponseEntity<BasicResultSet> handleDeleteStocksBatch(@RequestBody int[] ids) {
        return ResponseEntity.ok(stockService.deleteStocksBatch(ids));
    }

    @GetMapping("/stocks/getVendorWiseStockDistribution")
    public @ResponseBody ResponseEntity<List<VendorWiseStockDistDto>> handleGetVendorWiseStockDistribution(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok(stockService.getVendorWiseStockDistribution(startDate, endDate));
    }

    @GetMapping("/stocks/getStockArrivalTrend")
    public @ResponseBody ResponseEntity<List<StockArrivalTrendDto>> handleGetStockArrivalTrend(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok(stockService.getStockArrivalTrend(startDate, endDate));
    }

    @GetMapping("/stocks/getStockSummary")
    public @ResponseBody ResponseEntity<StockSummaryDto> handleGetStockSummary(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok(stockService.getStockSummary(startDate, endDate));
    }
}
