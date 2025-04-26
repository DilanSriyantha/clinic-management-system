package org.cms.InvoiceRecordsManagement.Services;

import org.cms.InvoiceManagement.Repositories.InvoiceRepository;
import org.cms.InvoiceRecordsManagement.DTOs.InvoiceRecordCreateRequest;
import org.cms.InvoiceRecordsManagement.DTOs.InvoiceRecordDto;
import org.cms.InvoiceRecordsManagement.Models.InvoiceRecord;
import org.cms.InvoiceRecordsManagement.Repositories.InvoiceRecordRepository;
import org.cms.PharmacyStockManagement.Repositories.ItemRepository;
import org.cms.Utils.BasicResultSet;
import org.cms.Utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceRecordService {
    
    private final InvoiceRecordRepository invoiceRecordRepository;

    private final InvoiceRepository invoiceRepository;

    private final ItemRepository itemRepository;

    public Page<InvoiceRecordDto> getPage(int page, int pageSize, int invoiceId) {
        var pageable = PageRequest.of(page, pageSize);

        return invoiceRecordRepository.findAllByInvoiceId(pageable, invoiceId).map((invoiceRecord) -> {
            var ir = ModelMapper.getInstance().map(invoiceRecord, InvoiceRecordDto.class);
            ir.setInvoiceId(invoiceRecord.getInvoice().getId());
            ir.setInvoiceNumber(invoiceRecord.getInvoice().getNumber());
            ir.setItemId(invoiceRecord.getItem().getId());
            ir.setItemCaption(invoiceRecord.getItem().getCaption());

            return ir;
        });
    }

    public BasicResultSet create(InvoiceRecordCreateRequest request) {
        var invoiceRecord = new InvoiceRecord();

        var invoice = invoiceRepository.findById(request.getInvoiceId())
            .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));

        var item = itemRepository.findById(request.getItemId())
            .orElseThrow(() -> new EntityNotFoundException("Item not found"));

        invoiceRecord.setInvoice(invoice);
        invoiceRecord.setItem(item);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Invoice record created successfully.")
            .build();
    }

    public BasicResultSet delete(int recordId) {
        var record = invoiceRecordRepository.findById(recordId)
            .orElseThrow(() -> new EntityNotFoundException("Record not found"));

        invoiceRecordRepository.delete(record);
        
        return BasicResultSet.builder()
            .resultCode(200)
            .message("Invoice deleted successfully.")
            .build();
    }
}
