package org.cms.InvoiceManagement.Services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;

import org.cms.InvoiceManagement.DTOs.InvoiceCreateRequest;
import org.cms.InvoiceManagement.DTOs.InvoiceDto;
import org.cms.InvoiceManagement.Models.Invoice;
import org.cms.InvoiceManagement.Repositories.InvoiceRepository;
import org.cms.InvoiceRecordsManagement.Models.InvoiceRecord;
import org.cms.InvoiceRecordsManagement.Repositories.InvoiceRecordRepository;
import org.cms.PharmacyStockManagement.Repositories.ItemRepository;
import org.cms.Users.Repositories.UserRepository;
import org.cms.Utils.BasicResultSet;
import org.cms.Utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    
    private final InvoiceRepository invoiceRepository;

    private final UserRepository userRepository;

    private final InvoiceRecordRepository invoiceRecordRepository;

    private final ItemRepository itemRepository;

    private final Function<Invoice, InvoiceDto> rowMapper = (invoice) -> {
        var i = ModelMapper.getInstance().map(invoice, InvoiceDto.class);

        i.setPharmacistId(invoice.getPharmacist().getId());
        i.setPharmacistName(invoice.getPharmacist().getName());

        return i;
    };

    public Integer getNextInvoiceNumber() {
        return invoiceRepository.findNextInvoiceNumber();
    }

    public Page<InvoiceDto> getPage(int page, int pageSize) {
        var pageable = PageRequest.of(page, pageSize);

        return invoiceRepository.findAll(pageable).map(rowMapper);
    }

    public Page<InvoiceDto> searchByNumber(int page, int pageSize, String number) {
        var pageable = PageRequest.of(page, pageSize);

        return invoiceRepository.searchByNumber(pageable, number).map(rowMapper);
    }

    public Page<InvoiceDto> searchByDate(int page, int pageSize, String date) {
        var pageable = PageRequest.of(page, pageSize);

        return invoiceRepository.searchByDate(pageable, "%" + date + "%").map(rowMapper);
    }

    public Page<InvoiceDto> searchByCreatorName(int page, int pageSize, String creatorName) {
        var pageable = PageRequest.of(page, pageSize);

        return invoiceRepository.searchByCreatorName(pageable, "%" + creatorName + "%").map(rowMapper);
    }

    public BasicResultSet create(InvoiceCreateRequest request) {
        var invoice = new Invoice();

        var pharmacist = userRepository.findById(request.getPharmacistId())
            .orElseThrow(() -> new EntityNotFoundException("Pharmacist not found"));

        invoice.setDate(request.getDate());
        invoice.setNumber(request.getNumber());
        invoice.setSubTotal(request.getSubTotal());
        invoice.setPharmacist(pharmacist);

        invoiceRepository.save(invoice);

        List<InvoiceRecord> invoiceRecords = new ArrayList<>();
        for(var rec : request.getRecords()) {
            var record = ModelMapper.getInstance().map(rec, InvoiceRecord.class);

            if(record == null)
                throw new InternalError("Error occurred when mapping InvoiceRecordCreateRequest into InvoiceRecord");

            record.setInvoice(invoice);
            
            var item = itemRepository.findById(rec.getItemId())
                .orElseThrow(() -> new EntityNotFoundException("Item not found"));

            record.setItem(item);

            invoiceRecords.add(record);
        }

        invoiceRecordRepository.saveAll(invoiceRecords);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Invoice created successfully.")
            .build();
    }

    public BasicResultSet delete(int invoiceId) {
        var invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));
            
        invoiceRepository.delete(invoice);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Invoice deleted successfully")
            .build();
    }

    public BasicResultSet deleteBatch(int[] selectedIds) {
        var iterator = intsToIterable(selectedIds);

        invoiceRecordRepository.deleteAllByIdInBatch(iterator);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Invoices are deleted successfully")
            .build();
    }

    private Iterable<Integer> intsToIterable(int[] ints) {
        return () -> Arrays.stream(ints).iterator();
    }
}
