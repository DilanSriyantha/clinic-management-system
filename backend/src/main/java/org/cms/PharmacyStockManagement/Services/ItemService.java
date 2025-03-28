package org.cms.PharmacyStockManagement.Services;

import java.util.Arrays;

import org.cms.PharmacyStockManagement.DTOs.ItemCreateRequest;
import org.cms.PharmacyStockManagement.DTOs.ItemDto;
import org.cms.PharmacyStockManagement.Models.Item;
import org.cms.PharmacyStockManagement.Repositories.ItemRepository;
import org.cms.Types.BasicResult;
import org.cms.Utils.BasicResultSet;
import org.cms.Utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemService {
    
    private final ItemRepository itemRepository;

    public Page<ItemDto> getPage(int page, int pageSize) {
        var pageable = PageRequest.of(page, pageSize);

        return itemRepository.findAll(pageable).map(Item::toDto);
    }

    public BasicResultSet createItem(ItemCreateRequest request) {
        var item = ModelMapper.getInstance().map(request, Item.class);

        if(item == null)
            throw new InternalError("Error occurred when mapping ItemCreateRequest into Item");

        item.setCurrentQty(item.getInitialQty());

        itemRepository.save(item);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Item created successfully.")
            .build();
    }

    public BasicResultSet updateItem(int itemId, ItemCreateRequest request) {
        var item = itemRepository.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("Item not found"));

        item = ModelMapper.getInstance().map(request, Item.class);

        if(item == null)
            throw new InternalError("Error occurred when mapping ItemCreateRequest into Item");

        itemRepository.save(item);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Item updated successfully.")
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

    @Transactional
    public BasicResult deleteBatch(int[] ids) {
        Iterable<Integer> batch = intsToIterable(ids);

        itemRepository.deleteAllByIdInBatch(batch);

        return BasicResult.builder()
            .status(200)
            .message("Batch deleted successfuly.")
            .build();
    }

    private Iterable<Integer> intsToIterable(int[] arr) {
        return () -> Arrays.stream(arr).iterator();
    }
}
