package org.cms.PharmacyStockManagement.Controllers;

import org.cms.PharmacyStockManagement.DTOs.ItemCreateRequest;
import org.cms.PharmacyStockManagement.DTOs.ItemDto;
import org.cms.PharmacyStockManagement.Services.ItemService;
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
public class ItemController {
    
    private final ItemService itemService;

    @GetMapping("/page")
    public @ResponseBody ResponseEntity<Page<ItemDto>> handleGetPage(@RequestParam int page, @RequestParam int pageeSize) {
        return ResponseEntity.ok(itemService.getPage(page, pageeSize));
    }
    
    @PostMapping("/create")
    public @ResponseBody ResponseEntity<BasicResultSet> handleCreateItem(@RequestBody ItemCreateRequest request) {
        return ResponseEntity.ok(itemService.createItem(request));
    }

    @PutMapping("/update")
    public @ResponseBody ResponseEntity<BasicResultSet> handleUpdateItem(@RequestParam int itemId, @RequestBody ItemCreateRequest request) {
        return ResponseEntity.ok(itemService.updateItem(itemId, request));
    }

    @DeleteMapping("/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> handleDelete(@RequestParam int itemId) {
        return ResponseEntity.ok(itemService.deleteItem(itemId));
    }
}
