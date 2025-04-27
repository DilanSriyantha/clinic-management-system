package org.cms.PharmacyStockManagement.Controllers;

import org.cms.PharmacyStockManagement.DTOs.ItemCreateRequest;
import org.cms.PharmacyStockManagement.DTOs.ItemDto;
import org.cms.PharmacyStockManagement.DTOs.StockCreateRequest;
import org.cms.PharmacyStockManagement.DTOs.StockDto;
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
    
    @GetMapping("/stocks/page")
    public @ResponseBody ResponseEntity<Page<StockDto>> handleGetStocksPage(@RequestParam int page, @RequestParam int pageSize) {
        return ResponseEntity.ok(stockService.getStocksPage(page, pageSize));
    }

    @GetMapping("/stocks/searchByCaption")
    public @ResponseBody ResponseEntity<Page<StockDto>> handleSearchByCaption(@RequestParam int page, @RequestParam int pageSize, @RequestParam String caption) {
        return ResponseEntity.ok(stockService.searchByCaption(page, pageSize, "%" + caption + "%"));
    }

    @GetMapping("/stocks/searchByVendor")
    public @ResponseBody ResponseEntity<Page<StockDto>> handleSearchByVendor(@RequestParam int page, @RequestParam int pageSize, @RequestParam String vendor) {
        return ResponseEntity.ok(stockService.searchByVendor(page, pageSize, vendor));
    }

    @GetMapping("/stocks/searchByDate")
    public @ResponseBody ResponseEntity<Page<StockDto>> handleSearchByDate(@RequestParam int page, @RequestParam int pageSize, String date) {
        return ResponseEntity.ok(stockService.searchByDate(page, pageSize, date));
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
}
