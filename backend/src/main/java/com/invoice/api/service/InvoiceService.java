package com.invoice.api.service;

import com.invoice.api.model.Invoice;
import com.invoice.api.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice createInvoice(Invoice invoice) {
        invoice.getItems().forEach(item -> item.setInvoice(invoice));
        return invoiceRepository.save(invoice);
    }

    public Invoice updateInvoiceStatus(String invoiceNumber, String status) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber);
        if (invoice != null) {
            invoice.setStatus(status);
            return invoiceRepository.save(invoice);
        }
        return null;
    }
}