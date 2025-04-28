package org.cms.PharmacyStockManagement.Services;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.cms.PharmacyStockManagement.DTOs.ItemCreateRequest;
import org.cms.PharmacyStockManagement.DTOs.ItemDto;
import org.cms.PharmacyStockManagement.DTOs.StockCreateRequest;
import org.cms.PharmacyStockManagement.DTOs.StockDto;
import org.cms.PharmacyStockManagement.Models.Item;
import org.cms.PharmacyStockManagement.Models.Stock;
import org.cms.PharmacyStockManagement.Repositories.ItemRepository;
import org.cms.PharmacyStockManagement.Repositories.StockRepository;
import org.cms.Utils.BasicResultSet;
import org.cms.Utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockService {

    private final ItemRepository itemRepository;
    
    private final StockRepository stockRepository;

    private final Function<Stock, StockDto> stockRowMapper = (stock) -> ModelMapper.getInstance().map(stock, StockDto.class);

    private final Function<Item, ItemDto> itemRowMapper = (item) -> {
        var itemDto = ModelMapper.getInstance().map(item, ItemDto.class);

        itemDto.setStockId(item.getStock().getId());

        return itemDto;
    };

    public Page<ItemDto> getItemsPage(int page, int pageSize) {
        var pageable = PageRequest.of(page, pageSize);

        return itemRepository.findAll(pageable).map(itemRowMapper);
    }

    public Page<ItemDto> getItemsPageByStock(int page, int pageSize, int stockId) {
        var pageable = PageRequest.of(page, pageSize);

        return itemRepository.findAllByStockId(pageable, stockId).map(itemRowMapper);
    }

    public Page<ItemDto> getItemsByCode(int page, int pageSize, String itemCode) {
        var pageable = PageRequest.of(page, pageSize);

        return itemRepository.findAllByItemCode(pageable, itemCode).map(itemRowMapper);
    }

    public Page<ItemDto> searchItemByCaption(int page, int pageSize, String caption) {
        var pageable = PageRequest.of(page, pageSize);

        return itemRepository.searchItemByCaption(pageable, "%" + caption + "%").map(itemRowMapper);
    }

    public Page<ItemDto> searchItemByCategory(int page, int pageSize, String category) {
        var pageable = PageRequest.of(page, pageSize);

        return itemRepository.searchItemByCategory(pageable, "%" + category + "%").map(itemRowMapper);
    }

    public Page<ItemDto> searchItemByForm(int page, int pageSize, String form) {
        var pageable = PageRequest.of(page, pageSize);

        return itemRepository.searchItemByForm(pageable, "%" + form + "%").map(itemRowMapper);
    }

    public Page<ItemDto> searchItemStrength(int page, int pageSize, String strength) {
        var pageable = PageRequest.of(page, pageSize);

        return itemRepository.searchItemByStrength(pageable, "%" + strength + "%").map(itemRowMapper);
    }

    public Page<StockDto> getStocksPage(int page, int pageSize) {
        var pageable = PageRequest.of(page, pageSize);

        return stockRepository.findAll(pageable).map(stockRowMapper);
    }

    public Page<StockDto> searchStockByCaption(int page, int pageSize, String caption) {
        var pageable = PageRequest.of(page, pageSize);

        return stockRepository.searchStockByCaption(pageable, "%" + caption + "%").map(stockRowMapper);
    }

    public Page<StockDto> searchStockByVendor(int page, int pageSize, String vendor) {
        var pageable = PageRequest.of(page, pageSize);

        return stockRepository.searchStockByVendor(pageable, "%" + vendor + "%").map(stockRowMapper);
    }

    public Page<StockDto> searchStockByDate(int page, int pageSize, String date) {
        var pageable = PageRequest.of(page, pageSize);

        return stockRepository.searchStockByDate(pageable, "%" + date + "%").map(stockRowMapper);
    }

    public BasicResultSet createItem(ItemCreateRequest request) {
        var item = ModelMapper.getInstance().map(request, Item.class);
        var stock = stockRepository.findById(request.getStockId())
            .orElseThrow(() -> new EntityNotFoundException("Stock not found"));

        if(item == null)
            throw new InternalError("Error occurred when mapping ItemCreateRequest into Item");

        item.setCurrentQty(item.getInitialQty());
        item.setStock(stock);

        itemRepository.save(item);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Item created successfully.")
            .build();
    }

    public BasicResultSet createStock(StockCreateRequest request) {
        var stock = ModelMapper.getInstance().map(request, Stock.class);

        if(stock == null)
            throw new InternalError("Error occurred when mapping StockCreateRequest into Stock");

        stockRepository.save(stock);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Stock created successfully.")
            .build();
    }

    public BasicResultSet updateItem(int itemId, ItemCreateRequest request) {
        var item = itemRepository.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("Item not found"));

        item = ModelMapper.getInstance().fill(request, item);

        if(item == null)
            throw new InternalError("Error occurred when mapping ItemCreateRequest into Item");

        itemRepository.save(item);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Item updated successfully.")
            .build();
    }

    public BasicResultSet updateStock(int stockId, StockCreateRequest request) {
        var stock = stockRepository.findById(stockId)
            .orElseThrow(() -> new EntityNotFoundException("Stock not found"));

        stock = ModelMapper.getInstance().fill(request, stock);

        if(stock == null)
            throw new InternalError("Error occurred when mapping StockRequest into Stock");

        log.info(stock.toString());
        stockRepository.save(stock);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Stock updated successfully.")
            .build();
    }

    public BasicResultSet deleteItem(int itemId) {
        var item = itemRepository.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("Item not found."));

        itemRepository.delete(item);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Item deleted successfully.")
            .build();
    }

    public BasicResultSet deleteStock(int stockId) {
        var stock = stockRepository.findById(stockId)
            .orElseThrow(() -> new EntityNotFoundException("Stock not found."));

        stockRepository.delete(stock);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Stock deleted successfully.")
            .build();
    }

    @Transactional
    public BasicResultSet deleteItemsBatch(int stockId, int[] ids) {
        Arrays.stream(ids).forEach((i) -> log.info(""+i));
        var stock = stockRepository.findById(stockId)
            .orElseThrow(() -> new EntityNotFoundException("Stock not found."));

        var items = itemRepository.findAllById(intsToIterable(ids));

        Set<Integer> idSet = Arrays.stream(ids).boxed().collect(Collectors.toSet());

        stock.getItems().removeIf((item) -> idSet.contains(item.getId()));
        stockRepository.save(stock);

        itemRepository.deleteAll(items);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Items deleted successfuly.")
            .build();
    }

    @Transactional
    public BasicResultSet deleteStocksBatch(int[] ids) {
        List<Stock> stocks = stockRepository.findAllById(intsToIterable(ids));

        stockRepository.deleteAll(stocks);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Stocks deleted successfully.")
            .build();
    }

    private Iterable<Integer> intsToIterable(int[] arr) {
        return () -> Arrays.stream(arr).iterator();
    }
}
